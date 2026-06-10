'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Download, Eye, Star, Filter, FileText, BookOpen,
  Clock, ClipboardList, Presentation, X, ChevronDown, ExternalLink, Coins,
  MessageSquare, User, Check
} from 'lucide-react';
import { degrees, courses, Resource } from '@/data/resources';
import { universities } from '@/data/universities';
import { collection, getDocs, doc, updateDoc, increment, query, where, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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

function ResourcesContent() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile, user } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const searchParams = useSearchParams();
  const showSellParam = searchParams ? searchParams.get('sell') === 'true' : false;
  const [showSellModal, setShowSellModal] = useState(showSellParam);

  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [search, setSearch] = useState('');
  const [downloadingResource, setDownloadingResource] = useState<string | null>(null);

  // New states for interactive detail modal, download limits and reviews
  const [selectedResourceForDetail, setSelectedResourceForDetail] = useState<Resource | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showLoginPromoModal, setShowLoginPromoModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [resourceToReview, setResourceToReview] = useState<Resource | null>(null);
  const [userRating, setUserRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Local storage helpers to track guest downloads
  const getGuestDownloads = (): string[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('guest_downloads') || '[]');
  };

  const addGuestDownload = (id: string) => {
    if (typeof window === 'undefined') return;
    const current = getGuestDownloads();
    if (!current.includes(id)) {
      current.push(id);
      localStorage.setItem('guest_downloads', JSON.stringify(current));
    }
  };

  const handleDownload = (resourceId: string, fileUrl?: string) => {
    if (!fileUrl) {
      alert("No download URL available for this resource.");
      return;
    }
    
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;

    // Check anonymous download limits
    if (!user) {
      const guestDownloads = getGuestDownloads();
      const isAlreadyDownloaded = guestDownloads.includes(resourceId);

      if (!isAlreadyDownloaded && guestDownloads.length >= 5) {
        setShowLimitModal(true);
        return;
      }
    }

    // Set downloading state for feedback toast
    setDownloadingResource(resource.title || 'Resource');

    // Increment downloads in Firestore in the background
    updateDoc(doc(db, 'resources', resourceId), {
      downloads: increment(1)
    }).catch(err => console.error('Error updating download count:', err));

    setResources(prev => prev.map(r => r.id === resourceId ? { ...r, downloads: (r.downloads || 0) + 1 } : r));

    // Update stats
    if (user) {
      updateDoc(doc(db, 'users', user.uid), {
        downloadedResourcesCount: increment(1)
      }).catch(err => console.error('Error updating user download count:', err));
    } else {
      addGuestDownload(resourceId);
    }

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

    // Post-download modals
    setTimeout(() => {
      if (!user) {
        setShowLoginPromoModal(true);
        setResourceToReview(resource);
      } else {
        setResourceToReview(resource);
        setUserRating(5);
        setReviewText('');
        setShowReviewModal(true);
      }
    }, 1500);
  };

  useEffect(() => {
    if (!selectedResourceForDetail) return;
    const resourceId = selectedResourceForDetail.id;

    async function fetchReviews() {
      setReviewsLoading(true);
      try {
        const q = query(
          collection(db, 'resourceReviews'),
          where('resourceId', '==', resourceId)
        );
        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs.map(doc => doc.data());
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setReviews(list);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    }

    fetchReviews();
  }, [selectedResourceForDetail]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceToReview) return;
    setSubmittingReview(true);

    const reviewData = {
      resourceId: resourceToReview.id,
      resourceTitle: resourceToReview.title,
      rating: userRating,
      reviewText: reviewText.trim(),
      userId: user ? user.uid : 'guest',
      userName: profile ? profile.name : 'Anonymous Student',
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'resourceReviews'), reviewData);

      const resRef = doc(db, 'resources', resourceToReview.id);
      const currentRating = resourceToReview.rating || 0;
      const currentCount = resourceToReview.ratingsCount || 5;
      const newCount = currentCount + 1;
      const newRating = parseFloat(((currentRating * currentCount + userRating) / newCount).toFixed(1));

      await updateDoc(resRef, {
        rating: newRating,
        ratingsCount: newCount
      });

      setResources(prev => prev.map(r => r.id === resourceToReview.id ? { ...r, rating: newRating, ratingsCount: newCount } : r));

      if (selectedResourceForDetail && selectedResourceForDetail.id === resourceToReview.id) {
        setSelectedResourceForDetail(prev => prev ? { ...prev, rating: newRating, ratingsCount: newCount } : null);
        setReviews(prev => [reviewData, ...prev]);
      }

      alert('Thank you for rating and reviewing this resource!');
      setShowReviewModal(false);
      setResourceToReview(null);
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
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

  useEffect(() => {
    if (searchParams) {
      const q = searchParams.get('query');
      if (q) {
        setSearch(decodeURIComponent(q));
      }
      if (searchParams.get('search') === 'true') {
        const input = document.getElementById('search-input');
        if (input) {
          input.focus();
        }
      }
    }
  }, [searchParams, loading]);

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
          <div className="section-badge mb-5 mx-auto w-fit border-[#0066FF]/30 text-[#0066FF] bg-[#0066FF]/10 font-bold px-5 py-2">Resource Hub</div>
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
              id="search-input"
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
              className="mt-4 flex items-center gap-1.5 text-xs text-[#0B071E]/60 hover:text-[#0066FF] font-bold transition-colors">
              <X size={12} /> Clear all filters
            </button>
          )}
        </motion.div>

        {/* Result count */}
        {!loading && (
          <p className="text-[#0B071E]/60 text-sm mb-6 font-bold">
            Found <span className="text-[#0066FF] font-extrabold">{filtered.length}</span> resources
          </p>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#0066FF]/20 border-t-[#0066FF] rounded-full animate-spin" />
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
                    onClick={() => setSelectedResourceForDetail(res)}
                    className="glass-card p-6 flex flex-col h-full group transition-all duration-300 cursor-pointer hover:border-[#0066FF]/30 hover:shadow-[0_8px_30px_rgba(0,102,255,0.06)]"
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
                    <h3 className="font-display font-black text-xl leading-snug mb-2 text-[#0B071E] group-hover:text-[#0066FF] transition-colors line-clamp-2">
                      {res.title}
                    </h3>

                    {/* Meta */}
                    <p className="text-[#0B071E]/75 text-xs mb-1 font-bold">{res.university} · {res.degree}</p>
                    <p className="text-[#0B071E]/60 text-xs mb-4 font-semibold">{res.course} · {res.instructor}</p>

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
                        onClick={(e) => { e.stopPropagation(); handleDownload(res.id, res.fileUrl); }}
                        className="btn-primary flex-1 py-2.5 text-sm font-extrabold tracking-wide"
                      >
                        <Download size={14} /> Download
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
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
              className="fixed bottom-6 right-6 z-50 max-w-sm w-[calc(100%-3rem)] sm:w-80 bg-white/95 backdrop-blur-md border border-[#0066FF]/20 shadow-[0_12px_40px_rgba(139,92,246,0.15)] rounded-2xl p-4 flex items-center justify-between gap-4 border-l-4 border-l-[#0066FF]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/20 flex items-center justify-center flex-shrink-0">
                  <Download size={16} className="text-[#0066FF] animate-bounce" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#0066FF] uppercase tracking-wider">Downloading</p>
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

        {/* Monetize Study Materials Modal */}
        <AnimatePresence>
          {showSellModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative w-full max-w-md glass-card p-8 bg-white/95 dark:bg-[#110A20]/95 shadow-2xl rounded-3xl border border-[#0B071E]/10 dark:border-white/10"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
              >
                <button
                  onClick={() => setShowSellModal(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-[#0B071E]/40 dark:text-white/40 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  <X size={16} />
                </button>

                <div className="w-16 h-16 bg-[#0066FF]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#0066FF]/20">
                  <Coins size={28} className="text-[#0066FF] animate-pulse" />
                </div>

                <h2 className="font-display font-black text-2xl mb-1 text-[#0B071E] dark:text-white">
                  Monetize Study Materials
                </h2>
                <div className="mb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-funky-orange/10 text-funky-orange border border-funky-orange/20 inline-block">
                    Coming Soon!
                  </span>
                </div>

                <p className="text-dark/70 dark:text-white/70 text-sm leading-relaxed mb-6 font-semibold">
                  Earn passive income by sharing your lecture notes, past exams, and study guides with your peers. Set your own prices and watch the cash flow directly into your digital wallet.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setShowSellModal(false)}
                    className="btn-primary py-3 text-sm font-bold w-full"
                  >
                    Awesome, I&apos;m ready!
                  </button>
                  <Link
                    href="/marketplace"
                    className="btn-ghost py-3 text-sm font-bold w-full text-center"
                  >
                    Go to Tutor Marketplace
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resource Details Modal */}
        <AnimatePresence>
          {selectedResourceForDetail && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative w-full max-w-2xl glass-card p-8 bg-white/95 dark:bg-[#110A20]/95 shadow-2xl rounded-3xl border border-[#0B071E]/10 dark:border-white/10 overflow-y-auto max-h-[90vh]"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
              >
                <button
                  onClick={() => setSelectedResourceForDetail(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-[#0B071E]/40 dark:text-white/40 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  <X size={16} />
                </button>

                {/* Resource Metadata Header */}
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-[#0d9488]/10 border border-[#0d9488]/20 text-[#0d9488]">
                    {selectedResourceForDetail.type.replace('-', ' ')}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full font-bold bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20">
                    {selectedResourceForDetail.university}
                  </span>
                </div>

                <h2 className="font-display font-black text-2xl sm:text-3xl text-[#0B071E] dark:text-white mb-2 leading-tight">
                  {selectedResourceForDetail.title}
                </h2>
                <p className="text-sm font-semibold text-[#0B071E]/60 dark:text-white/60 mb-6">
                  {selectedResourceForDetail.degree} &bull; {selectedResourceForDetail.course}
                </p>

                {/* Grid stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 mb-6">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-[#0B071E]/40 dark:text-white/40">Instructor</span>
                    <p className="text-sm font-bold text-[#0B071E] dark:text-white">{selectedResourceForDetail.instructor}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-[#0B071E]/40 dark:text-white/40">Semester / Year</span>
                    <p className="text-sm font-bold text-[#0B071E] dark:text-white">Sem {selectedResourceForDetail.semester} / {selectedResourceForDetail.year}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-[#0B071E]/40 dark:text-white/40">File Size / Type</span>
                    <p className="text-sm font-bold text-[#0B071E] dark:text-white uppercase">{selectedResourceForDetail.fileSize} / {selectedResourceForDetail.fileType}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-[#0B071E]/40 dark:text-white/40">Downloads / Views</span>
                    <p className="text-sm font-bold text-[#0B071E] dark:text-white">{selectedResourceForDetail.downloads} / {selectedResourceForDetail.views}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-display font-black text-sm uppercase tracking-wider text-[#0B071E] dark:text-white mb-2">Description</h4>
                  <p className="text-[#0B071E]/80 dark:text-white/80 text-sm leading-relaxed font-semibold">
                    {selectedResourceForDetail.description}
                  </p>
                </div>

                {/* Reviews Section */}
                <div className="border-t border-black/10 dark:border-white/10 pt-6 mb-8">
                  <h4 className="font-display font-black text-lg text-[#0B071E] dark:text-white mb-4 flex items-center gap-2">
                    <MessageSquare size={18} className="text-[#0066FF]" /> Student Reviews
                  </h4>

                  {reviewsLoading ? (
                    <div className="flex justify-center py-6">
                      <div className="w-6 h-6 border-2 border-[#0066FF]/20 border-t-[#0066FF] rounded-full animate-spin" />
                    </div>
                  ) : reviews.length === 0 ? (
                    <p className="text-xs font-bold text-[#0B071E]/50 dark:text-white/50 text-center py-4 bg-black/[0.01] dark:bg-white/[0.01] rounded-xl border border-dashed border-black/10 dark:border-white/10">
                      No reviews yet. Be the first to rate and review after downloading!
                    </p>
                  ) : (
                    <div className="space-y-4 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                      {reviews.map((rev, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-brand-500/10 flex items-center justify-center text-[10px] font-black text-[#0066FF]">
                                {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'A'}
                              </div>
                              <span className="text-xs font-bold text-[#0B071E] dark:text-white">{rev.userName || 'Anonymous'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, sIdx) => (
                                <Star
                                  key={sIdx}
                                  size={10}
                                  className={sIdx < rev.rating ? 'fill-yellow-500 text-yellow-500' : 'text-black/10 dark:text-white/10'}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs font-semibold text-[#0B071E]/80 dark:text-white/80 pl-8 leading-relaxed">
                            {rev.reviewText}
                          </p>
                          <span className="text-[9px] font-bold text-[#0B071E]/40 dark:text-white/40 block text-right mt-1">
                            {new Date(rev.createdAt).toLocaleDateString('en-PK')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setSelectedResourceForDetail(null);
                    }}
                    className="btn-ghost flex-1 py-3 text-sm font-bold"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleDownload(selectedResourceForDetail.id, selectedResourceForDetail.fileUrl);
                    }}
                    className="btn-primary flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <Download size={16} /> Download Resource
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guest Download Limit Reached Modal */}
        <AnimatePresence>
          {showLimitModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative w-full max-w-md glass-card p-8 bg-white/95 dark:bg-[#110A20]/95 shadow-2xl rounded-3xl border border-[#FF5C7A]/20"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
              >
                <button
                  onClick={() => setShowLimitModal(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-[#0B071E]/40 dark:text-white/40 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  <X size={16} />
                </button>

                <div className="w-16 h-16 bg-[#FF5C7A]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#FF5C7A]/20">
                  <Coins size={28} className="text-[#FF5C7A]" />
                </div>

                <h2 className="font-display font-black text-2xl mb-2 text-[#0B071E] dark:text-white">
                  Free Limit Reached!
                </h2>
                <p className="text-dark/70 dark:text-white/70 text-sm leading-relaxed mb-6 font-semibold">
                  You have downloaded your limit of 5 free resources as a guest. Please create a free account or log in to unlock unlimited downloads, track your study history, and rate study materials.
                </p>

                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    className="btn-primary py-3 text-sm font-bold w-full text-center"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-ghost py-3 text-sm font-bold w-full text-center"
                  >
                    Create Free Account
                  </Link>
                  <button
                    onClick={() => setShowLimitModal(false)}
                    className="text-xs text-[#0B071E]/40 dark:text-white/40 hover:text-[#0066FF] font-bold text-center mt-2"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guest Log-in Reminder Modal after download */}
        <AnimatePresence>
          {showLoginPromoModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative w-full max-w-md glass-card p-8 bg-white/95 dark:bg-[#110A20]/95 shadow-2xl rounded-3xl border border-[#0066FF]/20"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
              >
                <button
                  onClick={() => {
                    setShowLoginPromoModal(false);
                    if (resourceToReview) {
                      setUserRating(5);
                      setReviewText('');
                      setShowReviewModal(true);
                    }
                  }}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-[#0B071E]/40 dark:text-white/40 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  <X size={16} />
                </button>

                <div className="w-16 h-16 bg-[#0066FF]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#0066FF]/20">
                  <Check size={28} className="text-[#0066FF]" />
                </div>

                <h2 className="font-display font-black text-2xl mb-2 text-[#0B071E] dark:text-white">
                  Download Started!
                </h2>
                <p className="text-dark/70 dark:text-white/70 text-sm leading-relaxed mb-6 font-semibold">
                  Your resource is downloading. Create a free account or log in to unlock unlimited downloads, bookmark materials, and keep your history.
                </p>

                <div className="flex flex-col gap-3">
                  <Link
                    href="/signup"
                    className="btn-primary py-3 text-sm font-bold w-full text-center"
                  >
                    Sign Up Free
                  </Link>
                  <Link
                    href="/login"
                    className="btn-ghost py-3 text-sm font-bold w-full text-center"
                  >
                    Log In
                  </Link>
                  <button
                    onClick={() => {
                      setShowLoginPromoModal(false);
                      if (resourceToReview) {
                        setUserRating(5);
                        setReviewText('');
                        setShowReviewModal(true);
                      }
                    }}
                    className="btn-ghost py-3 text-sm font-bold w-full text-center border-none text-[#0B071E]/50 dark:text-white/50"
                  >
                    Rate & Review First
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rating and Review Prompt Modal */}
        <AnimatePresence>
          {showReviewModal && resourceToReview && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative w-full max-w-md glass-card p-8 bg-white/95 dark:bg-[#110A20]/95 shadow-2xl rounded-3xl border border-[#0066FF]/20"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
              >
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setResourceToReview(null);
                  }}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-[#0B071E]/40 dark:text-white/40 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  <X size={16} />
                </button>

                <h2 className="font-display font-black text-2xl mb-1 text-[#0B071E] dark:text-white">
                  Rate & Review
                </h2>
                <p className="text-xs font-bold text-[#0066FF] mb-4">
                  {resourceToReview.title}
                </p>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="flex flex-col items-center py-2 bg-black/[0.01] dark:bg-white/[0.01] rounded-2xl border border-black/5 dark:border-white/5">
                    <span className="text-[10px] uppercase font-black tracking-wider text-[#0B071E]/40 dark:text-white/40 mb-2">Select Star Rating</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="focus:outline-none transition-transform active:scale-95"
                        >
                          <Star
                            size={28}
                            className={`transition-colors ${
                              star <= userRating
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-black/10 dark:text-white/10'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Review Comment</label>
                    <textarea
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                      required
                      rows={3}
                      placeholder="Write a brief comment about this resource to help other students..."
                      className="input-field resize-none text-sm"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewModal(false);
                        setResourceToReview(null);
                      }}
                      className="btn-ghost flex-1 py-3 text-sm font-bold"
                    >
                      Skip
                    </button>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="btn-primary flex-1 py-3 text-sm font-bold disabled:opacity-60"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-28 flex items-center justify-center bg-transparent">
        <div className="w-12 h-12 border-4 border-[#0066FF]/20 border-t-[#0066FF] rounded-full animate-spin" />
      </div>
    }>
      <ResourcesContent />
    </Suspense>
  );
}
