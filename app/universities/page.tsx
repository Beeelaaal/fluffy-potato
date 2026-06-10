'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Search, MapPin, GraduationCap, Users, BookOpen, X, Building2, Globe, Calendar, ChevronRight } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { categorizedDegrees } from '@/data/resources';
import { universities as staticUniversities } from '@/data/universities';

interface UniDoc {
  id: string;
  name: string;
  shortName: string;
  city: string;
  type: string;
  programs?: number;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  deadline?: string;
  admissionCriteria?: string;
  degrees?: string[];
  campuses?: any[];
}

function getEntryTestTypes(uni: UniDoc) {
  const staticUni = staticUniversities.find(
    s => s.id.toLowerCase() === uni.id.toLowerCase() || 
         s.shortName.toLowerCase() === uni.shortName.toLowerCase()
  );
  
  const requirements = [
    ...(uni.admissionCriteria ? uni.admissionCriteria.split('\n') : []),
    ...(staticUni?.requirements || []),
    uni.name || '',
    uni.description || ''
  ].map(r => r.toLowerCase());

  const acceptsSat = requirements.some(r => /\bsat\b/.test(r) || r.includes('sat score') || r.includes('sat i') || r.includes('sat ii') || r.includes('lsat'));
  const acceptsNet = requirements.some(r => /\bnet\b/.test(r) || r.includes('nust entry test') || r.includes('nust test'));
  const acceptsOwn = requirements.some(r => 
    r.includes('entry test') || 
    r.includes('admission test') || 
    r.includes('nu-fast') || 
    r.includes('lsat') || 
    r.includes('pu test') || 
    r.includes('aku test') ||
    r.includes('mdcat') ||
    r.includes('ecat')
  ) || (!acceptsSat && !acceptsNet);

  return { acceptsSat, acceptsNet, acceptsOwn };
}

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<UniDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All Cities');
  const [type, setType] = useState('All Types');
  const [selectedDegree, setSelectedDegree] = useState('All Degrees');
  const [entryTest, setEntryTest] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const headerRef = useRef(null);
  const inView = useInView(headerRef, { once: true });

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, 'universities'));
        setUniversities(snap.docs.map(d => ({ id: d.id, ...d.data() } as UniDoc)));
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load universities');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Collect all unique cities where the university has a presence (either main city or campus cities)
  const uniqueCities = new Set<string>();
  universities.forEach(u => {
    if (u.city) uniqueCities.add(u.city);
    if (u.campuses && Array.isArray(u.campuses)) {
      u.campuses.forEach(c => {
        if (c.city) uniqueCities.add(c.city);
      });
    }
  });
  const cities = ['All Cities', ...Array.from(uniqueCities).sort()];
  const types = ['All Types', 'public', 'private'];

  const filtered = universities.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !search || 
      u.name?.toLowerCase().includes(q) || 
      u.shortName?.toLowerCase().includes(q) ||
      u.degrees?.some(d => d.toLowerCase().includes(q));
    
    // Match city if it is main city OR one of its campus cities
    const matchCity = city === 'All Cities' || 
      u.city === city || 
      (u.campuses && Array.isArray(u.campuses) && u.campuses.some(c => c.city === city));
    const matchType = type === 'All Types' || u.type === type;
    const matchDegree = selectedDegree === 'All Degrees' || u.degrees?.includes(selectedDegree);
    
    const testTypes = getEntryTestTypes(u);
    const matchEntryTest = entryTest === 'All' || 
      (entryTest === 'sat' && testTypes.acceptsSat) ||
      (entryTest === 'net' && testTypes.acceptsNet) ||
      (entryTest === 'own' && testTypes.acceptsOwn);
      
    return matchSearch && matchCity && matchType && matchDegree && matchEntryTest;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    }
    if (sortBy === 'programs-desc') {
      return (b.programs || 0) - (a.programs || 0);
    }
    if (sortBy === 'deadline-asc') {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    return 0;
  });

  const clearFilters = () => { 
    setSearch(''); 
    setCity('All Cities'); 
    setType('All Types'); 
    setSelectedDegree('All Degrees');
    setEntryTest('All');
    setSortBy('name-asc');
  };

  const hasFilters = search || city !== 'All Cities' || type !== 'All Types' || selectedDegree !== 'All Degrees' || entryTest !== 'All' || sortBy !== 'name-asc';

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-funky-cyan/[0.06] blur-[120px] rounded-full pointer-events-none" />

      <div className="section-container relative">
        {/* Header */}
        <div className="text-center mb-12" ref={headerRef}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            <div className="section-badge mb-4 mx-auto w-fit">University Hub</div>
            <h1 className="font-display font-black text-5xl tracking-tight mb-4 text-[#0B071E]">
              Explore <span className="gradient-text">Pakistani Universities</span>
            </h1>
            <p className="text-[#0B071E]/80 text-base sm:text-lg max-w-xl mx-auto font-semibold mb-3">
              Detailed university profiles — admissions, programs, and how to apply.
            </p>
            <p className="text-xs font-bold text-funky-orange dark:text-funky-orange/90">
              💡 Looking for admission guides, deadlines, and scholarships? Read <Link href="/blog" className="underline hover:text-[#0066FF] transition-colors">YOUR INSIDER</Link>
            </p>
          </motion.div>
        </div>

        {/* Search + Filters */}
        <motion.div className="flex flex-col gap-3 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B071E]/40" />
              <input type="text" placeholder="Search by name, abbreviation, or degree..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
            </div>
            <div className="flex flex-wrap gap-3">
              <select value={city} onChange={e => setCity(e.target.value)} className="input-field w-full sm:w-44 cursor-pointer font-bold">
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={type} onChange={e => setType(e.target.value)} className="input-field w-full sm:w-36 cursor-pointer capitalize font-bold">
                {types.map(t => <option key={t} value={t}>{t === 'All Types' ? t : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select value={selectedDegree} onChange={e => setSelectedDegree(e.target.value)} className="input-field flex-1 cursor-pointer font-bold">
              <option value="All Degrees">All Offered Degrees</option>
              {Object.entries(categorizedDegrees).map(([category, catDegrees]) => (
                <optgroup key={category} label={category}>
                  {catDegrees.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto">
              <select value={entryTest} onChange={e => setEntryTest(e.target.value)} className="input-field w-full sm:w-48 cursor-pointer font-bold">
                <option value="All">All Entry Tests</option>
                <option value="sat">Accepts SAT</option>
                <option value="net">Accepts NET</option>
                <option value="own">Admission/Own Test</option>
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-field w-full sm:w-48 cursor-pointer font-bold">
                <option value="name-asc">Sort: Name (A-Z)</option>
                <option value="name-desc">Sort: Name (Z-A)</option>
                <option value="programs-desc">Sort: Most Programs</option>
                <option value="deadline-asc">Sort: Nearest Deadline</option>
              </select>
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm text-[#0B071E]/60 hover:text-white transition-all bg-white/80 border border-[#0B071E]/10 hover:bg-[#0B071E] font-bold">
                  <X size={14} /> Clear
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-funky-cyan/20 border-t-funky-cyan" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-16 glass-card p-8 max-w-md mx-auto">
            <Building2 size={40} className="text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-sm mb-2 font-bold">Failed to load universities</p>
            <p className="text-[#0B071E]/50 text-xs font-semibold">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && universities.length === 0 && (
          <div className="text-center py-20 glass-card p-10 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-funky-cyan/[0.08] border border-funky-cyan/[0.15] flex items-center justify-center mx-auto mb-6">
              <Building2 size={28} className="text-funky-cyan" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-3">No Universities Yet</h2>
            <p className="text-[#0B071E]/60 text-sm mb-6 font-semibold">Universities are managed through the admin panel. Contact an admin to add universities.</p>
            <Link href="/admin" className="btn-primary px-6 py-3 text-sm">Go to Admin Panel</Link>
          </div>
        )}

        {/* Count */}
        {!loading && sorted.length > 0 && (
          <p className="text-[#0B071E]/60 text-sm mb-6 font-bold">
            Showing <span className="text-[#0066FF] font-extrabold">{sorted.length}</span> universities
          </p>
        )}

        {/* Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map((uni, i) => (
              <motion.div key={uni.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.45 }}>
                <div className="glass-card overflow-hidden group h-full flex flex-col">
                  {/* Header bar - Clickable */}
                  <Link href={`/universities/${uni.id}`}>
                    <div className="relative h-28 overflow-hidden bg-gradient-to-br from-white to-neutral-50 border-b border-black/5 flex items-center justify-center cursor-pointer">
                      {uni.logoUrl ? (
                        <img src={uni.logoUrl} alt={uni.shortName} className="w-16 h-16 rounded-xl object-cover border border-black/10" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-funky-cyan/[0.1] border border-funky-cyan/[0.2] flex items-center justify-center">
                          <span className="font-display font-black text-funky-cyan text-lg">{uni.shortName?.slice(0, 2)}</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={uni.type === 'public' ? 'tag-lime font-bold' : 'tag-blue font-bold'}>
                          {uni.type?.charAt(0).toUpperCase() + uni.type?.slice(1)}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <Link href={`/universities/${uni.id}`}>
                      <h2 className="font-display font-black text-lg mb-1 text-[#0B071E] group-hover:text-[#0066FF] transition-colors cursor-pointer">{uni.name}</h2>
                    </Link>
                    <span className="text-[#0066FF] text-xs font-bold mb-3">{uni.shortName}</span>

                    {uni.description && (
                      <p className="text-[#0B071E]/70 text-xs leading-relaxed mb-4 line-clamp-2 font-semibold">{uni.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#0B071E]/60 mb-4 mt-auto font-bold">
                      {(() => {
                        const uniqueCampusCities = Array.from(new Set([
                          uni.city,
                          ...(uni.campuses || []).map((c: any) => c.city)
                        ].filter(Boolean)));
                        const displayCities = uniqueCampusCities.join(', ');
                        return displayCities ? (
                          <span className="flex items-center gap-1 max-w-[200px] line-clamp-1" title={displayCities}>
                            <MapPin size={11} className="flex-shrink-0" /> {displayCities}
                          </span>
                        ) : null;
                      })()}
                      {uni.programs ? <span className="flex items-center gap-1"><BookOpen size={11} /> {uni.programs} programs</span> : null}
                      {uni.deadline && <span className="flex items-center gap-1"><Calendar size={11} /> {uni.deadline}</span>}
                    </div>

                    {/* Display offered degrees count or preview tags */}
                    {uni.degrees && uni.degrees.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-1 border-t border-black/5 pt-3">
                        {uni.degrees.slice(0, 3).map((deg) => (
                          <span key={deg} className="px-2 py-0.5 rounded-lg bg-black/[0.03] border border-black/5 text-[10px] text-[#0B071E]/65 font-bold">
                            {deg.split(' (')[0]}
                          </span>
                        ))}
                        {uni.degrees.length > 3 && (
                          <span className="px-2 py-0.5 rounded-lg bg-[#0066FF]/5 border border-[#0066FF]/15 text-[10px] text-[#0066FF] font-bold">
                            +{uni.degrees.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-black/5 flex-wrap gap-2">
                      {uni.websiteUrl ? (
                        <a href={uni.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#0B071E]/60 hover:text-funky-cyan transition-colors font-bold">
                          <Globe size={11} /> Website
                        </a>
                      ) : <span />}
                      <Link href={`/blog?university=${uni.shortName}`} className="flex items-center gap-1.5 text-xs text-funky-orange hover:text-funky-orange/80 transition-colors font-bold">
                        <BookOpen size={11} className="animate-pulse" /> Insider
                      </Link>
                      <Link href={`/universities/${uni.id}`} className="flex items-center gap-1 text-xs text-[#0B071E]/60 hover:text-[#0066FF] transition-colors font-bold">
                        Details <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No results after filtering */}
        {!loading && sorted.length === 0 && universities.length > 0 && (
          <div className="text-center py-20">
            <Building2 size={36} className="text-[#0B071E]/20 mx-auto mb-4" />
            <p className="text-[#0B071E]/60 text-lg font-bold">No universities match your search</p>
            <button onClick={clearFilters} className="btn-ghost mt-4 text-sm font-bold">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
