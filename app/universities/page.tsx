'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Search, MapPin, GraduationCap, Users, BookOpen, X, Building2, Globe, Calendar, ChevronRight } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
}

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<UniDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All Cities');
  const [type, setType] = useState('All Types');
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

  const cities = ['All Cities', ...Array.from(new Set(universities.map(u => u.city).filter(Boolean)))];
  const types = ['All Types', 'public', 'private'];

  const filtered = universities.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !search || u.name?.toLowerCase().includes(q) || u.shortName?.toLowerCase().includes(q);
    const matchCity = city === 'All Cities' || u.city === city;
    const matchType = type === 'All Types' || u.type === type;
    return matchSearch && matchCity && matchType;
  });

  const clearFilters = () => { setSearch(''); setCity('All Cities'); setType('All Types'); };

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
            <p className="text-[#0B071E]/80 text-base sm:text-lg max-w-xl mx-auto font-semibold">
              Detailed university profiles — admissions, programs, and how to apply.
            </p>
          </motion.div>
        </div>

        {/* Search + Filters */}
        <motion.div className="flex flex-col sm:flex-row gap-3 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B071E]/40" />
            <input type="text" placeholder="Search universities..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <select value={city} onChange={e => setCity(e.target.value)} className="input-field sm:w-44 cursor-pointer font-bold">
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={type} onChange={e => setType(e.target.value)} className="input-field sm:w-36 cursor-pointer capitalize font-bold">
            {types.map(t => <option key={t} value={t}>{t === 'All Types' ? t : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
          {(search || city !== 'All Cities' || type !== 'All Types') && (
            <button onClick={clearFilters} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-[#0B071E]/60 hover:text-white transition-all bg-white/80 border border-[#0B071E]/10 hover:bg-[#0B071E]">
              <X size={14} /> Clear
            </button>
          )}
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
        {!loading && filtered.length > 0 && (
          <p className="text-[#0B071E]/60 text-sm mb-6 font-bold">
            Showing <span className="text-[#8B5CF6] font-extrabold">{filtered.length}</span> universities
          </p>
        )}

        {/* Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((uni, i) => (
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
                        <span className={uni.type === 'public' ? 'tag-lime font-bold' : 'tag-purple font-bold'}>
                          {uni.type?.charAt(0).toUpperCase() + uni.type?.slice(1)}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <Link href={`/universities/${uni.id}`}>
                      <h2 className="font-display font-black text-lg mb-1 text-[#0B071E] group-hover:text-funky-cyan transition-colors cursor-pointer">{uni.name}</h2>
                    </Link>
                    <span className="text-[#8B5CF6] text-xs font-bold mb-3">{uni.shortName}</span>

                    {uni.description && (
                      <p className="text-[#0B071E]/70 text-xs leading-relaxed mb-4 line-clamp-2 font-semibold">{uni.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#0B071E]/60 mb-4 mt-auto font-bold">
                      {uni.city && <span className="flex items-center gap-1"><MapPin size={11} /> {uni.city}</span>}
                      {uni.programs ? <span className="flex items-center gap-1"><BookOpen size={11} /> {uni.programs} programs</span> : null}
                      {uni.deadline && <span className="flex items-center gap-1"><Calendar size={11} /> {uni.deadline}</span>}
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-black/5">
                      {uni.websiteUrl ? (
                        <a href={uni.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-funky-cyan hover:text-funky-cyan/80 transition-colors font-bold">
                          <Globe size={11} /> Visit Website
                        </a>
                      ) : <span />}
                      <Link href={`/universities/${uni.id}`} className="flex items-center gap-1 text-xs text-[#0B071E]/60 hover:text-[#8B5CF6] transition-colors font-bold">
                        View Details <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No results after filtering */}
        {!loading && filtered.length === 0 && universities.length > 0 && (
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
