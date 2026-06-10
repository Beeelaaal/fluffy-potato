'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  MapPin, Users, BookOpen, Calendar, Globe, Phone, Mail,
  ArrowLeft, CheckCircle, Clock, DollarSign, Award, ChevronRight,
  Building2, GraduationCap, Sparkles, Star, Plus, Landmark, Home, Compass, Briefcase, Search, ChevronDown, Check, AlertTriangle
} from 'lucide-react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { universities as staticUniversities } from '@/data/universities';
import { categorizedDegrees } from '@/data/resources';

export default function UniversityDetailPage({ params }: { params: { id: string } }) {
  const [uni, setUni] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'admissions' | 'studentLife'>('overview');
  const [expandedPrograms, setExpandedPrograms] = useState<Record<string, boolean>>({});
  const [programSearch, setProgramSearch] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('all');

  const toggleProgram = (name: string) => {
    setExpandedPrograms(prev => ({ ...prev, [name]: !prev[name] }));
  };

  useEffect(() => {
    setSelectedCampus('all');
    async function load() {
      try {
        const decodedId = decodeURIComponent(params.id);
        let docSnap = null;
        const candidates = [
          decodedId,
          decodedId.toUpperCase(),
          decodedId.toLowerCase(),
          decodedId.charAt(0).toUpperCase() + decodedId.slice(1).toLowerCase()
        ];
        
        // Remove duplicates
        const uniqueCandidates = Array.from(new Set(candidates));
        
        for (const candidate of uniqueCandidates) {
          const snap = await getDoc(doc(db, 'universities', candidate));
          if (snap.exists()) {
            docSnap = snap;
            break;
          }
        }
        
        // If not found by direct ID, scan collection
        if (!docSnap) {
          const querySnap = await getDocs(collection(db, 'universities'));
          const found = querySnap.docs.find(d => 
            d.id.toLowerCase() === decodedId.toLowerCase() ||
            (d.data().shortName || '').toLowerCase() === decodedId.toLowerCase()
          );
          if (found) {
            docSnap = found;
          }
        }

        if (docSnap && docSnap.exists()) {
          const data = docSnap.data();
          const staticUni = staticUniversities.find(
            u => u.id.toLowerCase() === docSnap!.id.toLowerCase() || 
                 u.shortName.toLowerCase() === (data.shortName || '').toLowerCase()
          );

          setUni({
            id: docSnap.id,
            name: data.name,
            shortName: data.shortName,
            city: data.city,
            province: data.province || staticUni?.province || 'Pakistan',
            type: data.type || 'public',
            ranking: data.ranking || staticUni?.ranking || 99,
            established: data.established || staticUni?.established || 2000,
            students: data.students || staticUni?.students || 5000,
            programs: data.programs || staticUni?.programs || 10,
            logo: data.logoUrl || staticUni?.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${data.shortName}&backgroundColor=1a1a35&textColor=5b63f5`,
            image: data.coverUrl || data.imageUrl || staticUni?.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60',
            description: data.description || staticUni?.description || 'No description available.',
            website: data.websiteUrl || staticUni?.website || 'https://google.com',
            fee: data.fee || staticUni?.fee || { min: 100000, max: 300000 },
            tags: data.tags || staticUni?.tags || ['Higher Education', data.city, data.type],
            admissionOpen: data.deadline ? new Date(data.deadline) > new Date() : true,
            deadline: data.deadline || staticUni?.deadline || 'Open',
            programs_list: data.programs_list || staticUni?.programs_list || [],
            requirements: data.admissionCriteria 
              ? data.admissionCriteria.split('\n').filter(Boolean)
              : (staticUni?.requirements || ['FSc/A-Levels or equivalent qualification', 'Valid entry test score', 'CNIC/B-Form']),
            howToApply: data.howToApply || staticUni?.howToApply || [],
            contacts: data.contacts || staticUni?.contacts || {},
            degrees: data.degrees || (staticUni as any)?.degrees || [],
            campuses: data.campuses || staticUni?.campuses || [],
            reviews: data.reviews || staticUni?.reviews || [],
            generalPerception: data.generalPerception || staticUni?.generalPerception || '',
            pros: data.pros || staticUni?.pros || [],
            cons: data.cons || staticUni?.cons || [],
            ratings: data.ratings || staticUni?.ratings || null,
          });
        } else {
          // If not in Firestore, check if we have it in static data
          const staticUni = staticUniversities.find(u => u.id.toLowerCase() === decodedId.toLowerCase() || u.shortName.toLowerCase() === decodedId.toLowerCase());
          if (staticUni) {
            setUni({
              ...staticUni,
              degrees: (staticUni as any).degrees || [],
              campuses: staticUni.campuses || [],
              reviews: staticUni.reviews || []
            });
          } else {
            setUni(null);
          }
        }
      } catch (err) {
        console.error('Error fetching university details:', err);
        const decodedId = decodeURIComponent(params.id);
        const staticUni = staticUniversities.find(u => u.id.toLowerCase() === decodedId.toLowerCase() || u.shortName.toLowerCase() === decodedId.toLowerCase());
        setUni(staticUni ? { ...staticUni, degrees: (staticUni as any).degrees || [], campuses: staticUni.campuses || [], reviews: staticUni.reviews || [] } : null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-funky-cyan/20 border-t-funky-cyan" />
      </div>
    );
  }

  if (!uni) {
    notFound();
  }

  const activeCampus = selectedCampus === 'all'
    ? null
    : uni.campuses?.find((c: any) => c.name === selectedCampus);

  const displayDescription = activeCampus?.description || uni.description || 'No description available.';
  const displayPros = activeCampus?.pros && activeCampus.pros.length > 0 ? activeCampus.pros : (uni.pros || []);
  const displayCons = activeCampus?.cons && activeCampus.cons.length > 0 ? activeCampus.cons : (uni.cons || []);
  const displayRatings = activeCampus?.ratings || uni.ratings || null;
  const displayPhone = activeCampus?.phone || uni.contacts?.phone;
  const displayEmail = activeCampus?.email || uni.contacts?.email;
  const displayAddress = activeCampus?.address || uni.contacts?.address;

  const uniDegrees = uni.degrees || [];
  const groupedDegrees = Object.entries(categorizedDegrees).reduce((acc, [category, degreesList]) => {
    const matching = degreesList.filter(d => uniDegrees.includes(d));
    if (matching.length > 0) {
      acc[category] = matching;
    }
    return acc;
  }, {} as Record<string, string[]>);

  const hasDegrees = Object.keys(groupedDegrees).length > 0;

  // Filter programs within academics tab (and optionally filter by selected campus)
  const campusDegrees = activeCampus?.degrees || [];
  const filteredPrograms = (uni.programs_list || []).filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(programSearch.toLowerCase()) || 
                          p.degree.toLowerCase().includes(programSearch.toLowerCase());
    if (selectedCampus === 'all') return matchesSearch;
    
    if (!campusDegrees || campusDegrees.length === 0) return matchesSearch;
    
    const progFull = `${p.degree} ${p.name}`.toLowerCase();
    const progNameLower = p.name.toLowerCase();
    
    const isOffered = campusDegrees.some((d: string) => {
      const dLower = d.toLowerCase();
      return dLower === progFull || 
             dLower.includes(progNameLower) || 
             progNameLower.includes(dLower);
    });
    
    return matchesSearch && isOffered;
  }) || [];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="section-container">
        {/* Back link */}
        <Link href="/universities"
          className="inline-flex items-center gap-2 text-[#0B071E]/60 hover:text-[#0066FF] text-sm mb-8 transition-colors font-bold">
          <ArrowLeft size={15} /> Back to Universities
        </Link>

        {/* Hero image background behind logo */}
        <motion.div
          className="relative min-h-[280px] sm:h-80 rounded-3xl overflow-hidden mb-8 flex flex-col justify-end p-6 sm:p-8 shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img src={uni.image} alt={uni.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Badges inside image overlay */}
          <div className="relative flex flex-col sm:flex-row sm:items-end gap-4 z-10 w-full">
            <img 
              src={uni.logo} 
              alt={uni.shortName}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-white/20 bg-white object-contain p-1 shadow-lg flex-shrink-0" 
            />
            <div className="min-w-0">
              <h1 className="font-display font-black text-xl sm:text-3xl text-white leading-tight drop-shadow-md break-words">{uni.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-white/90 text-xs sm:text-sm font-bold">
                <span className="flex items-center gap-1 drop-shadow-sm"><MapPin size={13} /> {uni.city}, {uni.province}</span>
                <span className="drop-shadow-sm">Est. {uni.established}</span>
                {uni.ratings?.overall ? (
                  <span className="flex items-center gap-1 drop-shadow-sm bg-amber-500 text-white text-xs px-2 py-0.5 rounded font-black shadow-sm">
                    ★ {uni.ratings.overall.toFixed(1)} Overall
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4 flex flex-wrap gap-2 z-10 max-w-[calc(100%-2rem)] justify-end">
            <span className={`text-[10px] sm:text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full font-bold backdrop-blur-md shadow-md ${
              uni.type === 'public'
                ? 'bg-emerald-500/80 text-white border border-emerald-400/20'
                : 'bg-blue-500/80 text-white border border-blue-400/20'
            }`}>
              {uni.type.charAt(0).toUpperCase() + uni.type.slice(1)} University
            </span>
            {uni.admissionOpen && (
              <span className="text-[10px] sm:text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full font-bold backdrop-blur-md bg-funky-cyan/95 text-white border border-funky-cyan/20 shadow-md animate-pulse">
                🟢 Admissions Open
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content (Left column, grid-span-2) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Campus Selector */}
            {uni.campuses && uni.campuses.length > 1 && (
              <div className="glass-card p-4 bg-gradient-to-br from-white/95 to-neutral-50/50 border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF]">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#0B071E]">Active Campus View</h4>
                    <p className="text-[10px] text-[#0B071E]/55 font-bold">Showing details for selected campus</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedCampus('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                      selectedCampus === 'all'
                        ? 'bg-[#0066FF] text-white shadow-sm'
                        : 'bg-white/60 border border-black/5 text-[#0B071E]/60 hover:text-[#0B071E] hover:bg-white'
                    }`}
                  >
                    All (Collective)
                  </button>
                  {uni.campuses.map((c: any) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedCampus(c.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                        selectedCampus === c.name
                          ? 'bg-[#0066FF] text-white shadow-sm'
                          : 'bg-white/60 border border-black/5 text-[#0B071E]/60 hover:text-[#0B071E] hover:bg-white'
                      }`}
                    >
                      {c.name.replace(' Campus', '').replace(' (Main)', '').replace(' (Main Campus)', '')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Horizontal Tabs Selector */}
            <div className="flex border-b border-black/5 mb-6 overflow-x-auto no-scrollbar gap-1">
              {[
                { id: 'overview', label: 'Overview & Ratings', icon: Sparkles },
                { id: 'academics', label: 'Programs & Faculty', icon: BookOpen },
                { id: 'admissions', label: 'Admissions & Campuses', icon: Landmark },
                { id: 'studentLife', label: 'Campus Life & Careers', icon: Compass },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-black whitespace-nowrap transition-all border-b-2 relative ${
                      isActive 
                        ? 'text-[#0066FF] border-[#0066FF]' 
                        : 'text-[#0B071E]/50 border-transparent hover:text-[#0B071E] hover:border-black/10'
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                    {isActive && (
                      <motion.div 
                        layoutId="activeTabUnderline" 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066FF]" 
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* 1. Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* General Perception */}
                    <div className="glass-card p-6 bg-gradient-to-br from-white/95 to-neutral-50/50 border-black/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-36 h-36 bg-funky-cyan/[0.04] rounded-full blur-3xl pointer-events-none" />
                      <h2 className="font-display font-black text-lg mb-3 text-[#0B071E] flex items-center gap-2">
                        <Sparkles className="text-funky-cyan animate-pulse" size={18} /> General Perception & Reputation
                      </h2>
                      <p className="text-[#0B071E]/80 text-sm leading-relaxed font-semibold">
                        {uni.generalPerception || "This institution is widely recognized for its academic standards, student culture, and contribution to national higher learning."}
                      </p>
                      
                      <div className="border-t border-black/5 mt-5 pt-5">
                        <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#0B071E]/50 mb-2">Introduction</h3>
                        <p className="text-[#0B071E]/75 leading-relaxed text-xs font-semibold">{displayDescription}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-5">
                        {uni.tags?.map((tag: string) => (
                          <span key={tag} className="tag-pill text-[10px] font-extrabold bg-white/80 border border-black/10 text-[#0B071E]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pros and Cons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Pros */}
                      <div className="p-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.02] shadow-sm">
                        <h3 className="font-display font-black text-emerald-700 text-sm mb-4 flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                            <Check size={11} className="text-emerald-600 font-black" />
                          </div>
                          What Students Love (Pros)
                        </h3>
                        <ul className="space-y-2.5">
                          {displayPros && displayPros.length > 0 ? (
                            displayPros.map((pro: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-[#0B071E]/85 font-semibold">
                                <span className="text-emerald-500 font-extrabold mt-0.5">•</span>
                                <span>{pro}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-xs text-neutral-400 font-semibold">No verified pros available.</li>
                          )}
                        </ul>
                      </div>
 
                      {/* Cons */}
                      <div className="p-6 rounded-2xl border border-red-500/10 bg-red-500/[0.02] shadow-sm">
                        <h3 className="font-display font-black text-red-700 text-sm mb-4 flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle size={11} className="text-red-600" />
                          </div>
                          Areas of Improvement (Cons)
                        </h3>
                        <ul className="space-y-2.5">
                          {displayCons && displayCons.length > 0 ? (
                            displayCons.map((con: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-[#0B071E]/85 font-semibold">
                                <span className="text-red-400 font-extrabold mt-0.5">•</span>
                                <span>{con}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-xs text-neutral-400 font-semibold">No verified cons available.</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Ratings Dashboard */}
                    <div className="glass-card p-6 bg-gradient-to-br from-white/95 to-neutral-50/50 border-black/5">
                      <h2 className="font-display font-black text-lg mb-6 text-[#0B071E] flex items-center gap-2">
                        <Award className="text-[#0066FF]" size={18} /> Ratings Dashboard
                      </h2>
                      
                      {displayRatings ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                          {[
                            { label: 'Academic Rigor', score: displayRatings.academicRigor, color: 'bg-[#0066FF]' },
                            { label: 'Job Placement Strength', score: displayRatings.jobPlacement, color: 'bg-emerald-500' },
                            { label: 'Practical Skills Focus', score: displayRatings.practicalSkills, color: 'bg-indigo-500' },
                            { label: 'Sports & Campus Life', score: displayRatings.sportsLife || displayRatings.campusLife, color: 'bg-pink-500' },
                            { label: 'Faculty Quality', score: displayRatings.facultyQuality, color: 'bg-amber-500' },
                            { label: 'Value for Money', score: displayRatings.valueForMoney, color: 'bg-violet-500' },
                            { label: 'Research Opportunities', score: displayRatings.researchOpportunities, color: 'bg-teal-500' },
                            { label: 'Hostel & Accommodations', score: displayRatings.hostelFacilities, color: 'bg-cyan-500' },
                          ].map((item) => (
                            <div key={item.label} className="space-y-1.5">
                              <div className="flex justify-between items-center text-xs font-black text-[#0B071E]">
                                <span>{item.label}</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-amber-500">★</span>
                                  <span>{item.score?.toFixed(1) || 'N/A'}/5.0</span>
                                </div>
                              </div>
                              <div className="h-2 w-full bg-black/[0.04] rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${((item.score || 0) / 5) * 100}%` }}
                                  transition={{ duration: 0.8, ease: "easeOut" }}
                                  className={`h-full ${item.color} rounded-full`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-400 font-semibold">No detailed ratings available for this institution.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Academics & Programs Tab */}
                {activeTab === 'academics' && (
                  <div className="space-y-6">
                    {/* Faculty Summary */}
                    <div className="glass-card p-6 bg-white/80 space-y-4">
                      <h3 className="font-display font-black text-[#0B071E] text-base flex items-center gap-2">
                        <GraduationCap className="text-[#0066FF]" size={18} /> Academics & Faculty Quality
                      </h3>
                      <p className="text-sm font-semibold text-[#0B071E]/75 leading-relaxed">
                        Academics at {uni.shortName} are characterized by an academic rigor score of {uni.ratings?.academicRigor || 'N/A'}/5.0 and faculty quality of {uni.ratings?.facultyQuality || 'N/A'}/5.0.
                        {uni.ratings?.academicRigor >= 4.5 
                          ? " The curriculum is highly intensive, demanding consistent hard work, projects, and high exam performance. Faculty members are predominantly PhD-holders from renowned international universities." 
                          : " The academic workload is balanced and aligns with modern curriculum standards. Most faculty members have industry background and research contributions."}
                        Research opportunities are rated at {uni.ratings?.researchOpportunities || 'N/A'}/5.0, reflecting {uni.ratings?.researchOpportunities >= 4 ? "a highly active publication culture and research grants" : "a developing research base with student publication encouragement"}.
                      </p>
                    </div>

                    {/* Offered Degrees Grouped */}
                    {hasDegrees && (
                      <div className="glass-card p-6 bg-white/80">
                        <h3 className="font-display font-black text-[#0B071E] text-base mb-6 flex items-center gap-2">
                          <Building2 size={18} className="text-funky-cyan" /> Offered Degree Categories
                        </h3>
                        <div className="space-y-6">
                          {Object.entries(groupedDegrees).map(([category, catDegrees]) => (
                            <div key={category} className="space-y-3">
                              <h4 className="text-xs font-black uppercase tracking-wider text-[#0B071E]/50 flex items-center gap-1.5">
                                <Building2 size={12} className="text-funky-cyan" /> {category}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {catDegrees.map((degree) => (
                                  <span
                                    key={degree}
                                    className="px-3 py-1.5 text-xs font-extrabold rounded-xl bg-white/40 border border-black/5 text-[#0B071E] backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-[#0066FF]/30 hover:bg-[#0066FF]/5"
                                  >
                                    {degree}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Course list */}
                    <div className="glass-card p-6 bg-white/80 space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h3 className="font-display font-black text-[#0B071E] text-base flex items-center gap-2">
                          <BookOpen size={18} className="text-[#0066FF]" /> Detailed Course Directory
                        </h3>
                        <div className="relative w-full sm:w-64">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input 
                            type="text" 
                            placeholder="Search programs..." 
                            value={programSearch} 
                            onChange={(e) => setProgramSearch(e.target.value)} 
                            className="w-full text-xs pl-9 pr-4 py-2 border border-black/10 rounded-xl bg-white/85 focus:outline-none focus:border-[#0066FF]/50 font-semibold"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        {filteredPrograms.length > 0 ? (
                          filteredPrograms.map((prog: any) => {
                            const isExpanded = !!expandedPrograms[prog.name];
                            return (
                              <div key={prog.name} className="border border-black/5 rounded-xl overflow-hidden bg-white/60 transition-all duration-300">
                                <button 
                                  onClick={() => toggleProgram(prog.name)}
                                  className="w-full text-left p-4 flex items-center justify-between hover:bg-neutral-50/50 transition-colors"
                                >
                                  <div className="flex-1 pr-4">
                                    <div className="font-extrabold text-sm text-[#0B071E] flex items-center gap-2 flex-wrap">
                                      {prog.name}
                                      <span className="px-2 py-0.5 rounded bg-[#0066FF]/5 text-[10px] text-[#0066FF] font-extrabold border border-[#0066FF]/10">
                                        {prog.degree}
                                      </span>
                                    </div>
                                    <div className="text-[#0B071E]/60 text-xs font-semibold mt-1">
                                      Duration: {prog.duration || '4 years'} · Seats: {prog.seats || 'N/A'}
                                    </div>
                                  </div>
                                  <div className="text-right flex items-center gap-4">
                                    <div>
                                      <div className="text-sm font-black text-[#0066FF]">
                                        PKR {prog.fee ? `${(prog.fee / 1000).toFixed(0)}K` : 'N/A'}/yr
                                      </div>
                                      <div className="text-[#0B071E]/60 text-[10px] font-bold mt-0.5">Merit: {prog.merit || 'N/A'}%+</div>
                                    </div>
                                    <ChevronRight 
                                      size={16} 
                                      className={`text-[#0B071E]/40 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} 
                                    />
                                  </div>
                                </button>

                                {isExpanded && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    transition={{ duration: 0.25 }}
                                    className="border-t border-black/5 bg-white/45 p-4 space-y-4"
                                  >
                                    {prog.description && (
                                      <div>
                                        <h4 className="text-[9px] font-black uppercase tracking-wider text-[#0B071E]/50 mb-1">Description</h4>
                                        <p className="text-xs font-semibold text-[#0B071E]/80 leading-relaxed">{prog.description}</p>
                                      </div>
                                    )}
                                    {prog.scope && (
                                      <div>
                                        <h4 className="text-[9px] font-black uppercase tracking-wider text-[#0B071E]/50 mb-1">Scope & Future Outlook</h4>
                                        <p className="text-xs font-semibold text-[#0B071E]/80 leading-relaxed">{prog.scope}</p>
                                      </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {prog.difficultyLevel && (
                                        <div>
                                          <h4 className="text-[9px] font-black uppercase tracking-wider text-[#0B071E]/50 mb-1">Difficulty Level</h4>
                                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                            prog.difficultyLevel.toLowerCase().includes('very high') || prog.difficultyLevel.toLowerCase().includes('extreme')
                                              ? 'bg-red-500/10 text-red-700'
                                              : prog.difficultyLevel.toLowerCase().includes('high')
                                              ? 'bg-amber-500/10 text-amber-700'
                                              : 'bg-emerald-500/10 text-emerald-700'
                                          }`}>
                                            {prog.difficultyLevel}
                                          </span>
                                        </div>
                                      )}
                                      {prog.practicalExposure && (
                                        <div>
                                          <h4 className="text-[9px] font-black uppercase tracking-wider text-[#0B071E]/50 mb-1">Practical Exposure</h4>
                                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0066FF]/5 text-[#0066FF]">
                                            {prog.practicalExposure}
                                          </span>
                                        </div>
                                      )}
                                      {prog.industryDemand && (
                                        <div>
                                          <h4 className="text-[9px] font-black uppercase tracking-wider text-[#0B071E]/50 mb-1">Local Industry Demand</h4>
                                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-700">
                                            {prog.industryDemand}
                                          </span>
                                        </div>
                                      )}
                                      {prog.higherStudyOptions && (
                                        <div>
                                          <h4 className="text-[9px] font-black uppercase tracking-wider text-[#0B071E]/50 mb-1">Higher Study Options</h4>
                                          <p className="text-xs font-bold text-[#0B071E]/75">{prog.higherStudyOptions}</p>
                                        </div>
                                      )}
                                    </div>
                                    {prog.careerPaths && prog.careerPaths.length > 0 && (
                                      <div>
                                        <h4 className="text-[9px] font-black uppercase tracking-wider text-[#0B071E]/50 mb-2">Career Opportunities</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                          {prog.careerPaths.map((path: string) => (
                                            <span key={path} className="px-2.5 py-1 rounded-lg bg-black/[0.03] border border-black/5 text-[10px] font-extrabold text-[#0B071E]/75">
                                              {path}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-8 text-neutral-400 font-semibold text-xs">
                            No matching programs found.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Admissions & Campuses Tab */}
                {activeTab === 'admissions' && (
                  <div className="space-y-6">
                    {/* Requirements */}
                    <div className="glass-card p-7">
                      <h2 className="font-display font-black text-xl mb-5 flex items-center gap-2 text-[#0B071E]">
                        <CheckCircle size={18} className="text-emerald-500" /> Admission Requirements & Criteria
                      </h2>
                      <ul className="space-y-3">
                        {uni.requirements?.map((req: string, i: number) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-[#0B071E]/80 font-semibold">
                            <CheckCircle size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* How to Apply */}
                    <div className="glass-card p-7">
                      <h2 className="font-display font-black text-xl mb-5 flex items-center gap-2 text-[#0B071E]">
                        <Clock size={18} className="text-[#0066FF]" /> Step-by-Step Application Process
                      </h2>
                      <div className="space-y-4">
                        {uni.howToApply?.map((step: string, i: number) => (
                          <div key={i} className="flex items-start gap-4">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5 bg-[#0066FF]/10 border border-[#0066FF]/20 text-[#0066FF]">
                              {i + 1}
                            </div>
                            <p className="text-[#0B071E]/80 text-sm leading-relaxed font-semibold">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Campuses & Locations */}
                    {uni.campuses && uni.campuses.length > 0 && (
                      <div className="glass-card p-7">
                        <h2 className="font-display font-black text-xl mb-5 flex items-center gap-2 text-[#0B071E]">
                          <Building2 size={18} className="text-[#0066FF]" /> Regional Campuses & Constituent Colleges
                        </h2>
                        <div className="space-y-4">
                          {uni.campuses.map((campus: any) => {
                            const isPNEC = campus.name.toLowerCase().includes('pnec');
                            const isSelected = selectedCampus === campus.name;
                            return (
                              <div key={campus.name} className={`p-5 rounded-2xl border transition-all duration-300 ${
                                isSelected
                                  ? 'ring-2 ring-[#0066FF] bg-[#0066FF]/5 border-transparent shadow-md'
                                  : isPNEC 
                                    ? 'bg-gradient-to-br from-blue-500/10 to-teal-500/5 border-blue-200 shadow-sm' 
                                    : 'bg-white/60 border-black/5'
                              }`}>
                                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                  <div>
                                    <h3 className="font-extrabold text-base text-[#0B071E] flex flex-wrap items-center gap-2">
                                      {campus.name}
                                      {isPNEC && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500 text-white font-black animate-pulse">
                                          ⚓ NUST Constituent Naval College
                                        </span>
                                      )}
                                    </h3>
                                    <p className="text-xs text-[#0B071E]/60 font-semibold mt-1 flex items-center gap-1">
                                      <MapPin size={12} className="text-funky-cyan flex-shrink-0" /> {campus.address}
                                    </p>
                                  </div>
                                  {campus.city && (
                                    <span className="tag-pill text-xs font-bold bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20">
                                      {campus.city}
                                    </span>
                                  )}
                                </div>
                                
                                {campus.degrees && campus.degrees.length > 0 && (
                                  <div className="mt-3 border-t border-black/5 pt-3">
                                    <h4 className="text-[11px] font-black text-[#0B071E]/50 uppercase tracking-wider mb-2">Offered Degrees:</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                      {campus.degrees.map((deg: string) => (
                                        <span key={deg} className={`px-2 py-1 rounded-lg text-xs font-bold ${
                                          deg.toLowerCase().includes('naval') || deg.toLowerCase().includes('maritime')
                                            ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/25'
                                            : 'bg-black/[0.03] border border-black/5 text-[#0B071E]/75'
                                        }`}>
                                          {deg}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Campus Life & Career Tab */}
                {activeTab === 'studentLife' && (
                  <div className="space-y-6">
                    {/* Placements */}
                    <div className="glass-card p-6 bg-white/80 space-y-4">
                      <h3 className="font-display font-black text-[#0B071E] text-base flex items-center gap-2">
                        <Briefcase className="text-funky-orange animate-pulse" size={18} /> Placements & Career Support
                      </h3>
                      <p className="text-sm font-semibold text-[#0B071E]/75 leading-relaxed">
                        Job placement is one of the highest priorities for students. {uni.shortName} has a placement rating of {uni.ratings?.jobPlacement || 'N/A'}/5.0 and practical skills rating of {uni.ratings?.practicalSkills || 'N/A'}/5.0.
                        {uni.ratings?.jobPlacement >= 4.5 
                          ? " Boasts a highly elite network of employers, with top tech, engineering, and banking firms hiring directly from annual campus recruitment drives. Internship opportunities are extremely strong." 
                          : uni.ratings?.jobPlacement >= 4 
                          ? " Has a dedicated career placement office coordinating annual job fairs, industry guest lectures, and student internships with local industrial partners." 
                          : " A solid reputation in the local market, with most graduates finding employment within 6-12 months of graduation through general applications and networking."}
                      </p>
                    </div>

                    {/* Campus Life & Sports */}
                    <div className="glass-card p-6 bg-white/80 space-y-4">
                      <h3 className="font-display font-black text-[#0B071E] text-base flex items-center gap-2">
                        <Landmark className="text-[#0066FF]" size={18} /> Campus Life & Sports Facilities
                      </h3>
                      <p className="text-sm font-semibold text-[#0B071E]/75 leading-relaxed">
                        {uni.shortName} offers a vibrant campus life with an active student body. It supports multiple clubs, cultural societies, and annual sports festivals. 
                        Academic ratings show {uni.ratings?.campusLife >= 4 ? "an exceptional and lively student environment with modern facilities." : "a solid and balanced campus experience with various extracurricular facilities."}
                        Sports facilities score a {uni.ratings?.sportsLife || uni.ratings?.campusLife || 'N/A'} out of 5.0, offering athletic grounds, gymnasiums, and student recreation centers.
                      </p>
                    </div>

                    {/* Hostels */}
                    <div className="glass-card p-6 bg-white/80 space-y-4">
                      <h3 className="font-display font-black text-[#0B071E] text-base flex items-center gap-2">
                        <Home className="text-funky-cyan" size={18} /> Hostel & Accommodation Facilities
                      </h3>
                      <p className="text-sm font-semibold text-[#0B071E]/75 leading-relaxed">
                        For out-of-city students, {uni.shortName} offers accommodation with a rating of {uni.ratings?.hostelFacilities || 'N/A'}/5.0. 
                        {uni.ratings?.hostelFacilities >= 4 
                          ? "The hostels are well-maintained with high-speed internet, secure boundary walls, dining halls, and student transport routes." 
                          : uni.ratings?.hostelFacilities >= 3 
                          ? "Hostels are basic but secure, with dining facilities and utility support. Standard transport services run across the city for commuters." 
                          : "Hostels are highly competitive with limited seat capacity. Off-campus private options are widely used by students. Transport vans are provided for key routes."}
                      </p>
                    </div>

                    {/* Student Reviews */}
                    {uni.reviews && uni.reviews.length > 0 && (
                      <div className="glass-card p-7">
                        <h2 className="font-display font-black text-base mb-5 flex items-center gap-2 text-[#0B071E]">
                          <Users size={18} className="text-[#0066FF]" /> Student & Alumni Reviews
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {uni.reviews.map((rev: any, index: number) => (
                            <div key={index} className="p-5 rounded-2xl bg-white/60 border border-black/5 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-black text-[#0066FF] bg-[#0066FF]/10 px-2 py-1 rounded-lg">
                                    {rev.source || 'Online Review'}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <span key={i} className={`text-sm ${i < Math.floor(rev.rating) ? 'text-amber-400' : 'text-neutral-300'}`}>
                                        ★
                                      </span>
                                    ))}
                                    <span className="text-xs font-black text-[#0B071E]/70 ml-1">{(rev.rating || 5).toFixed(1)}</span>
                                  </div>
                                </div>
                                <p className="text-xs font-semibold text-[#0B071E]/85 leading-relaxed italic">
                                  "{rev.text}"
                                </p>
                              </div>
                              {rev.author && (
                                <div className="text-[10px] font-black text-[#0B071E]/50 mt-4 text-right">
                                  — {rev.author}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick stats */}
            <motion.div
              className="glass-card p-6 space-y-4"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            >
              <h3 className="font-display font-black text-sm text-[#0B071E] uppercase tracking-wider">Quick Info</h3>
              {[
                { icon: Users, label: 'Students', value: uni.students?.toLocaleString() },
                { icon: BookOpen, label: 'Programs', value: uni.programs + '+' },
                { icon: Award, label: 'Ranking', value: `#${uni.ranking} in Pakistan` },
                { icon: DollarSign, label: 'Fee Range', value: `PKR ${(uni.fee?.min / 1000).toFixed(0)}K–${(uni.fee?.max / 1000).toFixed(0)}K` },
                { icon: Calendar, label: 'Deadline', value: uni.admissionOpen ? new Date(uni.deadline).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Closed' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-black/5 last:border-0">
                  <span className="flex items-center gap-2 text-[#0B071E]/60 text-sm font-bold">
                    <Icon size={14} className="text-[#0066FF]" /> {label}
                  </span>
                  <span className="text-[#0B071E]/90 text-sm font-extrabold">{value}</span>
                </div>
              ))}
            </motion.div>

            {/* Contact */}
            <motion.div
              className="glass-card p-6 space-y-3"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            >
              <h3 className="font-display font-black text-sm text-[#0B071E] uppercase tracking-wider mb-4">Contact</h3>
              <a href={`tel:${displayPhone}`}
                className="flex items-center gap-3 text-sm text-[#0B071E]/80 hover:text-[#0066FF] transition-colors font-semibold">
                <Phone size={14} className="text-funky-cyan" /> {displayPhone}
              </a>
              <a href={`mailto:${displayEmail}`}
                className="flex items-center gap-3 text-sm text-[#0B071E]/80 hover:text-[#0066FF] transition-colors font-semibold">
                <Mail size={14} className="text-funky-cyan" /> {displayEmail}
              </a>
              <div className="flex items-start gap-3 text-sm text-[#0B071E]/80 font-semibold">
                <MapPin size={14} className="text-funky-cyan mt-0.5 flex-shrink-0" /> {displayAddress}
              </div>
              <a href={uni.website} target="_blank" rel="noopener noreferrer"
                className="btn-ghost w-full text-sm py-2.5 mt-2 flex items-center justify-center gap-2 font-bold border border-black/10">
                <Globe size={14} /> Official Website
                <ChevronRight size={13} />
              </a>
            </motion.div>

            {/* YOUR INSIDER CTA */}
            <motion.div
              className="p-6 rounded-2xl text-center bg-gradient-to-br from-funky-orange/15 to-[#FF4B72]/5 border border-funky-orange/20 shadow-sm"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
            >
              <div className="w-10 h-10 rounded-full bg-funky-orange/10 border border-funky-orange/20 flex items-center justify-center mx-auto mb-3">
                <BookOpen size={16} className="text-funky-orange animate-pulse" />
              </div>
              <h3 className="font-display font-black text-sm mb-2 text-[#0B071E] dark:text-white">YOUR INSIDER Guide</h3>
              <p className="text-[#0B071E]/60 dark:text-white/60 text-xs mb-4 font-semibold">Admission guides, deadlines, scholarships, do&apos;s & don&apos;ts for {uni.shortName}</p>
              <Link href={`/blog?university=${uni.shortName}`} className="btn-primary w-full text-sm py-2.5 font-bold" style={{ background: 'linear-gradient(135deg, #FF7A18, #FF4B72)', border: 'none' }}>
                Read Insider Guide
              </Link>
            </motion.div>

            {/* Find Tutor CTA */}
            <motion.div
              className="p-6 rounded-2xl text-center bg-gradient-to-br from-[#0066FF]/10 to-teal-500/5 border border-[#0066FF]/20"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            >
              <div className="w-10 h-10 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/20 flex items-center justify-center mx-auto mb-3">
                <Users size={16} className="text-[#0066FF]" />
              </div>
              <h3 className="font-display font-black text-sm mb-2 text-[#0B071E]">Need a tutor from {uni.shortName}?</h3>
              <p className="text-[#0B071E]/60 text-xs mb-4 font-semibold">Find verified tutors who&apos;ve been through the same courses</p>
              <Link href="/marketplace" className="btn-primary w-full text-sm py-2.5 font-bold">
                Find Tutors
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
