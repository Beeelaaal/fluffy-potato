'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Search, MapPin, GraduationCap, Users, BookOpen, SlidersHorizontal, X, TrendingUp } from 'lucide-react';
import { universities } from '@/data/universities';

const cities = ['All Cities', 'Islamabad', 'Lahore', 'Karachi', 'Rawalpindi', 'Gilgit'];
const types = ['All Types', 'public', 'private'];

export default function UniversitiesPage() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All Cities');
  const [type, setType] = useState('All Types');
  const headerRef = useRef(null);
  const inView = useInView(headerRef, { once: true });

  const filtered = universities.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.shortName.toLowerCase().includes(search.toLowerCase()) ||
      u.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCity = city === 'All Cities' || u.city === city;
    const matchType = type === 'All Types' || u.type === type;
    return matchSearch && matchCity && matchType;
  });

  const clearFilters = () => { setSearch(''); setCity('All Cities'); setType('All Types'); };

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-funky-cyan/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="section-container relative">
        {/* Header */}
        <div className="text-center mb-12" ref={headerRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="section-badge mb-4 mx-auto w-fit">University Hub</div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-4">
              Explore <span className="gradient-text">Pakistani Universities</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Detailed university profiles — admissions, programs, fees, and how to apply.
            </p>
          </motion.div>
        </div>

        {/* Search + Filters */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search universities, programs, tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select value={city} onChange={e => setCity(e.target.value)}
            className="input-field sm:w-44 cursor-pointer">
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={type} onChange={e => setType(e.target.value)}
            className="input-field sm:w-36 cursor-pointer capitalize">
            {types.map(t => <option key={t} value={t} className="capitalize">{t === 'All Types' ? t : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
          {(search || city !== 'All Cities' || type !== 'All Types') && (
            <button onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <X size={14} /> Clear
            </button>
          )}
        </motion.div>

        {/* Count */}
        <p className="text-white/40 text-sm mb-6">
          Showing <span className="text-white/70 font-medium">{filtered.length}</span> universities
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((uni, i) => (
            <motion.div
              key={uni.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.5 }}
            >
              <Link href={`/universities/${uni.id}`}>
                <div className="glass-card overflow-hidden group h-full">
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img src={uni.image} alt={uni.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={uni.type==='public'?'tag-lime':'tag-purple'}>
                        {uni.type.charAt(0).toUpperCase()+uni.type.slice(1)}
                      </span>
                      {uni.admissionOpen && (
                        <span className="live-badge">Open</span>
                      )}
                    </div>

                    {/* Ranking */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-yellow-300 font-bold">
                      <TrendingUp size={11} />
                      #{uni.ranking}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <img src={uni.logo} alt={uni.shortName}
                        className="w-10 h-10 rounded-xl flex-shrink-0 border border-white/10" />
                      <div>
                        <h2 className="font-semibold text-sm leading-tight group-hover:text-funky-cyan transition-colors">
                          {uni.name}
                        </h2>
                        <span className="text-white/40 text-xs">{uni.shortName}</span>
                      </div>
                    </div>

                    <p className="text-white/50 text-xs leading-relaxed mb-4 line-clamp-2">{uni.description}</p>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 text-xs text-white/45 mb-4">
                      <span className="flex items-center gap-1"><MapPin size={11} /> {uni.city}</span>
                      <span className="flex items-center gap-1"><Users size={11} /> {(uni.students / 1000).toFixed(0)}K students</span>
                      <span className="flex items-center gap-1"><BookOpen size={11} /> {uni.programs} programs</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {uni.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="tag-pill text-xs">{tag}</span>
                      ))}
                    </div>

                    {/* Fee range */}
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-xs">Fee / year</span>
                      <span className="text-white/80 text-xs font-semibold">
                        PKR {(uni.fee.min / 1000).toFixed(0)}K – {(uni.fee.max / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏛️</div>
            <p className="text-white/50 text-lg">No universities match your search</p>
            <button onClick={clearFilters} className="btn-ghost mt-4 text-sm">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
