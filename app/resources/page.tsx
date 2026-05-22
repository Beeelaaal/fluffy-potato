'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Download, Eye, Star, Filter, FileText, BookOpen,
  Clock, ClipboardList, Presentation, X, ChevronDown, ExternalLink
} from 'lucide-react';
import { degrees, courses, Resource } from '@/data/resources';
import { universities } from '@/data/universities';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const typeIcons: Record<string, typeof FileText> = {
  notes: BookOpen,
  'past-paper': FileText,
  assignment: ClipboardList,
  timetable: Clock,
  slide: Presentation,
  book: BookOpen,
};

const typeColors: Record<string, string> = {
  notes: '#0d9488',       // brand-primary
  'past-paper': '#f0a500', // amber accent
  assignment: '#2dd4bf',   // aqua highlight
  timetable: '#10b981',    // emerald
  slide: '#f59e0b',        // amber
  book: '#0f766e',         // brand-secondary
};

const resourceTypes = ['all', 'notes', 'past-paper', 'assignment', 'timetable', 'slide'];

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [search, setSearch] = useState('');
  const [downloadingResource, setDownloadingResource] = useState<string | null>(null);

  const handleDownload = (resourceId: string, fileUrl?: string) => {
    if (!fileUrl) {
      alert("No download URL available for this resource.");
      return;
    }
    
    // Set downloading state for feedback toast
    const resource = resources.find(r => r.id === resourceId);
    setDownloadingResource(resource?.title || 'Resource');

    // Increment downloads in Firestore in the background (non-blocking) so window.open is not blocked as a popup
    updateDoc(doc(db, 'resources', resourceId), {
      downloads: increment(1)
    }).catch(err => console.error('Error updating download count:', err));

    setResources(prev => prev.map(r => r.id === resourceId ? { ...r, downloads: (r.downloads || 0) + 1 } : r));

    let downloadUrl = fileUrl;
    
    // 1. Check for standard Google Drive files
    const driveRegex = /(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/open\?id=)([^/?#&]+)/i;
    const driveMatch = fileUrl.match(driveRegex);
    if (driveMatch && driveMatch[1]) {
      const fileId = driveMatch[1];
      downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    } else {
      // 2. Check for Google Docs, Sheets, and Slides exportable formats
      const docsRegex = /(?:docs\.google\.com\/(document|spreadsheets|presentation)\/d\/)([^/?#&]+)/i;
      const docsMatch = fileUrl.match(docsRegex);
      if (docsMatch && docsMatch[2]) {
        const type = docsMatch[1].toLowerCase();
        const fileId = docsMatch[2];
        if (type === 'document') {
          downloadUrl = `https://docs.google.com/document/d/${fileId}/export?format=pdf`;
        } else if (type === 'spreadsheets') {
          downloadUrl = `https://docs.google.com/spreadsheets/d/${fileId}/export?format=pdf`;
        } else if (type === 'presentation') {
          downloadUrl = `https://docs.google.com/presentation/d/${fileId}/export?format=pdf`;
        }
      }
    }
    
    window.open(downloadUrl, '_blank');
  };

  useEffect(() => {
    async function fetchResources() {
      try {
        const querySnapshot = await getDocs(collection(db, 'resources'));
        const resList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
        setResources(resList);
      } catch (err) {
        console.error('Error fetching resources:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, []);

  useEffect(() => {
    if (downloadingResource) {
      const timer = setTimeout(() => {
        setDownloadingResource(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [downloadingResource]);

  const availableCourses = selectedDegree ? (courses[selectedDegree] || []) : [];

  const filtered = resources.filter(r => {
    if (selectedUniversity && r.university !== selectedUniversity) return false;
    if (selectedDegree && r.degree !== selectedDegree) return false;
    if (selectedCourse && r.course !== selectedCourse) return false;
    if (selectedType !== 'all' && r.type !== selectedType) return false;
    if (search && 
      !(r.title || '').toLowerCase().includes(search.toLowerCase()) &&
      !(r.course || '').toLowerCase().includes(search.toLowerCase()) &&
      !(r.instructor || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const clearAll = () => {
    setSelectedUniversity(''); setSelectedDegree('');
    setSelectedCourse(''); setSelectedType('all'); setSearch('');
  };

  const hasFilters = selectedUniversity || selectedDegree || selectedCourse || selectedType !== 'all' || search;

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-brand-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-[500px] h-[300px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="section-badge mb-5 mx-auto w-fit border-[#8B5CF6]/30 text-[#8B5CF6] bg-[#8B5CF6]/10 font-bold px-5 py-2">Resource Hub</div>
          <h1 className="font-display font-black text-5xl sm:text-6xl tracking-tighter mb-5">
            Academic <span className="gradient-text">Resources</span>
          </h1>
          <p className="text-[#0B071E]/80 text-lg sm:text-xl max-w-2xl mx-auto font-semibold">
            Notes, past papers, timetables, and assignments filtered exactly for your course.
          </p>
        </motion.div>

        {/* Type filter pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-8"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          {resourceTypes.map(type => {
            const Icon = type !== 'all' ? typeIcons[type] : Filter;
            const color = type !== 'all' ? typeColors[type] : '#0d9488';
            return (
              <button key={type} onClick={() => setSelectedType(type)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border-2 border-dark/10"
                style={{
                  background: selectedType === type ? `${color}20` : 'rgba(255,255,255,0.7)',
                  borderColor: selectedType === type ? color : 'rgba(11,7,30,0.1)',
                  color: selectedType === type ? color : 'rgba(11,7,30,0.6)',
                  boxShadow: selectedType === type ? `3px 3px 0px ${color}` : 'none'
                }}>
                <Icon size={14} />
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
              </button>
            );
          })}
        </motion.div>

        {/* Search + cascade filters */}
        <motion.div
          className="glass-card p-6 mb-8"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          {/* Search bar */}
          <div className="relative mb-5">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B071E]/40" />
            <input
              type="text"
              placeholder="Search by title, course, or instructor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-12 py-3.5"
            />
          </div>

          {/* Cascade selects */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <select
                value={selectedUniversity}
                onChange={e => { setSelectedUniversity(e.target.value); setSelectedDegree(''); setSelectedCourse(''); }}
                className="input-field appearance-none cursor-pointer pr-8"
              >
                <option value="">All Universities</option>
                {universities.map(u => <option key={u.id} value={u.shortName}>{u.shortName}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0B071E]/40 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedDegree}
                onChange={e => { setSelectedDegree(e.target.value); setSelectedCourse(''); }}
                className="input-field appearance-none cursor-pointer pr-8"
                disabled={!selectedUniversity}
              >
                <option value="">All Degrees</option>
                {degrees.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0B071E]/40 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                className="input-field appearance-none cursor-pointer pr-8"
                disabled={!selectedDegree}
              >
                <option value="">All Courses</option>
                {availableCourses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0B071E]/40 pointer-events-none" />
            </div>
          </div>

          {hasFilters && (
            <button onClick={clearAll}
              className="mt-4 flex items-center gap-1.5 text-xs text-[#0B071E]/60 hover:text-[#8B5CF6] font-bold transition-colors">
              <X size={12} /> Clear all filters
            </button>
          )}
        </motion.div>

        {/* Result count */}
        {!loading && (
          <p className="text-[#0B071E]/60 text-sm mb-6 font-bold">
            Found <span className="text-[#8B5CF6] font-extrabold">{filtered.length}</span> resources
          </p>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#8B5CF6]/20 border-t-[#8B5CF6] rounded-full animate-spin" />
          </div>
        )}

        {/* Resource grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((res, i) => {
                const Icon = typeIcons[res.type] || FileText;
                const color = typeColors[res.type] || '#0d9488';

                return (
                  <motion.div
                    key={res.id}
                    className="glass-card p-6 flex flex-col h-full group transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: Math.min(i * 0.05, 0.3) }}
                    layout
                  >
                    {/* Type icon + badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                        <Icon size={20} style={{ color }} />
                      </div>
                      <span className="text-xs px-3 py-1.5 rounded-full font-extrabold capitalize tracking-wide border"
                        style={{ background: `${color}10`, borderColor: `${color}25`, color }}>
                        {(res.type || 'notes').replace('-', ' ')}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-black text-xl leading-snug mb-2 text-[#0B071E] group-hover:text-[#8B5CF6] transition-colors line-clamp-2">
                      {res.title}
                    </h3>

                    {/* Meta */}
                    <p className="text-[#0B071E]/75 text-xs mb-1 font-bold">{res.university} · {res.degree}</p>
                    <p className="text-[#0B071E]/55 text-xs mb-4 font-semibold">{res.course} · {res.instructor}</p>

                    {/* Description */}
                    <p className="text-[#0B071E]/75 text-sm leading-relaxed mb-6 line-clamp-2 flex-grow font-semibold">{res.description}</p>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 text-xs text-[#0B071E]/60 mb-6 font-bold">
                      <span className="flex items-center gap-1.5"><Download size={13} /> {res.downloads?.toLocaleString() || 0}</span>
                      <span className="flex items-center gap-1.5"><Eye size={13} /> {res.views?.toLocaleString() || 0}</span>
                      <span className="flex items-center gap-1.5">
                        <Star size={13} className="fill-yellow-500 text-yellow-500" />
                        {res.rating || 'N/A'}
                      </span>
                      <span className="ml-auto flex items-center gap-1.5">
                        <span className="uppercase text-[10px] bg-[#0B071E]/10 px-1.5 py-0.5 rounded font-black text-[#0B071E]/70">{res.fileType || 'FILE'}</span>
                        {res.fileSize || 'Unknown'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-auto">
                      <button 
                        onClick={() => handleDownload(res.id, res.fileUrl)}
                        className="btn-primary flex-1 py-2.5 text-sm font-extrabold tracking-wide"
                      >
                        <Download size={14} /> Download
                      </button>
                      <button 
                        onClick={() => {
                          if (res.fileUrl) {
                            window.open(res.fileUrl, '_blank');
                          } else {
                            alert('No document link available.');
                          }
                        }}
                        className="btn-ghost py-2.5 px-4 text-sm"
                        title="Open Resource Link"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="glass-card p-16 text-center mt-10 border-funky-cyan/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-funky-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="w-24 h-24 bg-funky-cyan/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-funky-cyan/30 transition-all group-hover:scale-110">
              <BookOpen size={40} className="text-funky-cyan" />
            </div>
            <h3 className="font-display font-black text-3xl mb-3 tracking-tight">No resources found</h3>
            <p className="text-[#0B071E]/75 mb-8 max-w-md mx-auto text-lg font-semibold">We couldn&apos;t find any resources matching your criteria. Be the first to upload one or adjust your filters.</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={clearAll} className="btn-ghost text-sm py-3.5 px-6 font-bold">Clear all filters</button>
              {isAdmin && (
                <Link href="/admin" className="btn-primary text-sm py-3.5 px-6 font-bold">
                  Seed Database in Admin
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Toast Notification */}
        <AnimatePresence>
          {downloadingResource && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-6 right-6 z-50 max-w-sm w-[calc(100%-3rem)] sm:w-80 bg-white/95 backdrop-blur-md border border-[#8B5CF6]/20 shadow-[0_12px_40px_rgba(139,92,246,0.15)] rounded-2xl p-4 flex items-center justify-between gap-4 border-l-4 border-l-[#8B5CF6]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0">
                  <Download size={16} className="text-[#8B5CF6] animate-bounce" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider">Downloading</p>
                  <p className="text-sm font-extrabold text-[#0B071E] truncate" title={downloadingResource}>
                    {downloadingResource}
                  </p>
                  <p className="text-[10px] text-[#0B071E]/60 font-semibold mt-0.5">Please wait, starting download...</p>
                </div>
              </div>
              <button 
                onClick={() => setDownloadingResource(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors text-[#0B071E]/40 hover:text-[#0B071E] flex-shrink-0"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
