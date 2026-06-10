'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, Clock, User, Plus, Filter, X, Search, ArrowRight, Eye, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import { mapCategory, getCategoryColor, getBlogCoverImage } from '@/lib/blog';
import TiltCard from '@/components/layout/TiltCard';

const STATIC_POSTS = [
  {
    id: 'nust-admission-guide-net-prep-eligibility',
    slug: 'nust-admission-guide-net-prep-eligibility',
    title: 'The Ultimate NUST Admission Guide: NET Prep & Eligibility',
    excerpt: 'Detailed walkthrough on acing the NUST Entry Test, aggregate calculations, and admission requirements.',
    authorName: 'Ali Murtaza',
    date: 'May 28, 2026',
    readTime: '6 min read',
    category: 'Admission Guides',
    color: '#0066FF',
    university: 'NUST',
    views: '4.8k',
  },
  {
    id: 'fast-nu-surviving-guide-dos-donts-freshmen',
    slug: 'fast-nu-surviving-guide-dos-donts-freshmen',
    title: 'FAST-NU Surviving Guide: Do\'s and Don\'ts for Freshmen',
    excerpt: 'How to survive the strict academic environment, maintain a high GPA, and navigate university life at FAST.',
    authorName: 'Zainab Fatima',
    date: 'May 24, 2026',
    readTime: '8 min read',
    category: 'Do\'s & Don\'ts',
    color: '#2EF2FF',
    university: 'FAST',
    views: '6.2k',
  },
  {
    id: 'higher-education-scholarships-pakistan-hec-need-based',
    slug: 'higher-education-scholarships-pakistan-hec-need-based',
    title: 'Higher Education Scholarships in Pakistan: HEC & Need-Based Guides',
    excerpt: 'Learn how to apply for fully funded HEC, USAID, and need-based scholarships at top universities.',
    authorName: 'Hamza Khan',
    date: 'May 19, 2026',
    readTime: '5 min read',
    category: 'Scholarships',
    color: '#FF7A18',
    views: '3.5k',
  },
  {
    id: 'university-application-deadlines-cheat-sheet-fall-2026',
    slug: 'university-application-deadlines-cheat-sheet-fall-2026',
    title: 'University Application Deadlines Cheat Sheet (Fall 2026)',
    excerpt: 'Track key registration timelines, entry test dates, and deadline details for LUMS, FAST, NUST, IBA, and AKU.',
    authorName: 'Dr. Bilal Ahmed',
    date: 'Jun 02, 2026',
    readTime: '4 min read',
    category: 'Deadlines',
    color: '#FF5C7A',
    views: '5.9k',
  },
  {
    id: 'mastering-exam-prep-midterms-finals',
    slug: 'mastering-exam-prep-midterms-finals',
    title: 'Mastering Exam Prep: How to Ace University Midterms & Finals',
    excerpt: 'Proven study methods, note-taking strategies, and past paper prep tips for exam sessions.',
    authorName: 'Ayesha Raza',
    date: 'Jun 05, 2026',
    readTime: '7 min read',
    category: 'Exam Sessions',
    color: '#D8FF3E',
    views: '2.8k',
  },
];

const categories = ['all', 'Admission Guides', 'Deadlines', 'Scholarships', 'Do\'s & Don\'ts', 'Exam Sessions'];

function BlogContent() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const searchParams = useSearchParams();
  const universityParam = searchParams ? searchParams.get('university') : null;

  useEffect(() => {
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => {
        const data = doc.data();
        const mappedCat = mapCategory(data.category, data.title, doc.id);
        return {
          id: doc.id,
          ...data,
          category: mappedCat,
          slug: data.slug || doc.id,
        };
      });
      setBlogs(items);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching blogs from Firestore:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const allBlogs = [
    ...blogs,
    ...STATIC_POSTS.map(s => {
      const mappedCat = mapCategory(s.category, s.title, s.slug);
      return { ...s, category: mappedCat };
    }).filter(s => !blogs.some(b => b.slug === s.slug))
  ];

  // Filter blogs based on category, university parameter, and local search term
  const filtered = allBlogs.filter(post => {
    if (selectedCategory !== 'all' && post.category !== selectedCategory) return false;
    if (universityParam && post.university && post.university.toLowerCase() !== universityParam.toLowerCase()) return false;
    
    if (searchTerm) {
      const queryStr = searchTerm.toLowerCase();
      const matchTitle = (post.title || '').toLowerCase().includes(queryStr);
      const matchExcerpt = (post.excerpt || '').toLowerCase().includes(queryStr);
      const matchCategory = (post.category || '').toLowerCase().includes(queryStr);
      const matchUni = (post.university || '').toLowerCase().includes(queryStr);
      if (!matchTitle && !matchExcerpt && !matchCategory && !matchUni) return false;
    }
    return true;
  });

  const featuredPost = filtered[0];
  const remainingPosts = filtered.slice(1);

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-[#FDFBF7] dark:bg-[#070310] transition-colors duration-500">
      {/* Enhanced Dynamic Background Mesh Glows */}
      <div className="absolute top-0 right-1/10 w-[800px] h-[500px] bg-funky-blue/10 dark:bg-funky-blue/[0.08] blur-[180px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-10 left-1/4 w-[750px] h-[550px] bg-funky-cyan/8 dark:bg-funky-cyan/[0.06] blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[550px] h-[450px] bg-[#FF5C7A]/8 dark:bg-[#FF5C7A]/[0.05] blur-[160px] rounded-full pointer-events-none" />

      {/* Decorative 3D-like floating elements */}
      <motion.div
        animate={{
          y: [0, -25, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-10 w-16 h-16 bg-gradient-to-tr from-funky-blue to-funky-cyan opacity-25 blur-[1px] rounded-2xl pointer-events-none hidden md:block"
        style={{ transform: 'translateZ(100px)' }}
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          rotate: [360, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/4 right-10 w-24 h-24 bg-gradient-to-tr from-funky-orange to-funky-coral opacity-20 blur-[1px] rounded-full pointer-events-none hidden md:block"
        style={{ transform: 'translateZ(150px)' }}
      />

      {/* Grid Pattern overlay matching Hero */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 102, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 102, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent)',
        }}
      />

      <div className="section-container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12"
        >
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dark/10 bg-white/60 dark:border-white/10 dark:bg-white/5 text-xs font-black uppercase tracking-[0.15em] text-[#0066FF] dark:text-[#2EF2FF] mb-4 w-fit select-none shadow-sm">
              <Sparkles size={12} className="text-funky-orange animate-pulse" />
              <span>Campus Intel Feed</span>
            </div>
            <h1 className="font-display font-black text-5xl sm:text-6xl tracking-tight text-[#0B071E] dark:text-white leading-[1.05] mb-4">
              YOUR <span className="gradient-text">INSIDER</span>
            </h1>
            <p className="text-[#0B071E]/75 dark:text-white/70 text-base sm:text-lg max-w-xl font-semibold leading-relaxed">
              Timely admission details, HEC scholarship opportunities, midterm survival guides, and essential academic checklists.
            </p>

            {universityParam && (
              <div className="mt-5 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl bg-funky-orange/10 text-funky-orange border border-funky-orange/20 shadow-sm">
                  Filter: {universityParam.toUpperCase()}
                </span>
                <Link href="/blog" className="text-xs text-[#0B071E]/60 dark:text-white/60 hover:text-funky-coral font-bold underline flex items-center gap-0.5 transition-colors">
                  <X size={12} /> Reset Filter
                </Link>
              </div>
            )}
          </div>

          {/* Search bar & post button wrapper */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Local Search Input */}
            <div className="relative w-full sm:w-[280px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark/40 dark:text-white/40" />
              <input
                type="text"
                placeholder="Search insider guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/60 dark:bg-[#110A20]/60 border border-dark/10 dark:border-white/10 rounded-2xl pl-10 pr-4 py-3.5 text-xs font-bold text-[#0B071E] dark:text-white outline-none focus:border-funky-blue dark:focus:border-funky-cyan placeholder-dark/30 dark:placeholder-white/30 transition-all shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark/40 dark:text-white/40 hover:text-dark dark:hover:text-white transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {user && (
              <Link
                href="/blog/write"
                className="btn-primary px-8 py-4 text-sm font-black flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus size={16} /> Write Guide
              </Link>
            )}
          </div>
        </motion.div>

        {/* Category Pills Selectors */}
        <motion.div
          className="flex flex-wrap gap-3 mb-12 border-b border-dark/5 dark:border-white/5 pb-8 select-none"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            const color = getCategoryColor(cat === 'all' ? 'Admission Guides' : cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border-2 ${
                  isSelected
                    ? 'bg-[#0B071E] text-white dark:bg-white/10 dark:text-white'
                    : 'bg-white/60 dark:bg-transparent border-dark/10 dark:border-white/10 text-dark/60 dark:text-white/60 hover:bg-[#0066FF]/5 dark:hover:bg-funky-cyan/5 hover:text-[#0066FF] dark:hover:text-funky-cyan hover:border-[#0066FF]/20 dark:hover:border-funky-cyan/20 shadow-sm'
                }`}
                style={{
                  boxShadow: isSelected ? `4px 4px 0px ${color}` : 'none',
                  borderColor: isSelected ? color : undefined,
                }}
              >
                {cat === 'all' ? 'All Intel' : cat}
              </button>
            );
          })}
        </motion.div>

        {/* Dynamic content rendering */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <div className="w-10 h-10 border-4 border-funky-blue/20 border-t-funky-blue rounded-full animate-spin" />
            <div className="font-mono text-xs font-black uppercase tracking-widest text-[#0B071E]/55 dark:text-white/45">Loading Intel Pipeline...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 glass-card p-10 max-w-lg mx-auto bg-white/40 dark:bg-[#110A20]/40 border border-dark/10 dark:border-white/10 rounded-3xl animate-pulse">
            <div className="w-16 h-16 rounded-2xl bg-funky-coral/10 border border-funky-coral/20 flex items-center justify-center mx-auto mb-6 shadow-sm">
              <BookOpen size={28} className="text-funky-coral" />
            </div>
            <h2 className="font-display text-2xl font-black mb-2 text-[#0B071E] dark:text-white">No Intel Matches</h2>
            <p className="text-[#0B071E]/60 dark:text-white/60 text-sm mb-6 font-semibold leading-relaxed">
              We couldn&apos;t find any guides matching your criteria. Try adjusting the search query or category filters.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}
              className="btn-ghost px-6 py-3 text-xs font-black border border-dark/10 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 text-dark dark:text-white rounded-xl shadow-sm"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <div className="w-full">
            
            {/* Spotlight Banner: Render Featured Article at the top */}
            {featuredPost && (
              <div className="mb-12">
                <Link href={`/blog/${featuredPost.slug}`} className="block group">
                  <TiltCard
                    maxTilt={3}
                    hoverShadowColor={getCategoryColor(featuredPost.category)}
                    className="glass-card p-6 md:p-8 rounded-3xl bg-white/50 dark:bg-[#110A20]/40 border border-dark/10 dark:border-white/10 relative overflow-hidden shadow-md group-hover:border-funky-cyan/30 transition-all duration-300 select-none"
                  >
                    {/* Glowing decoration circles inside spotlight card */}
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-funky-cyan/5 to-funky-blue/5 dark:from-funky-cyan/10 dark:to-funky-blue/10 blur-[60px] rounded-full pointer-events-none -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-500" />
                    
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      <div className="lg:col-span-7 space-y-4 text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border"
                            style={{
                              background: `${getCategoryColor(featuredPost.category)}12`,
                              borderColor: `${getCategoryColor(featuredPost.category)}25`,
                              color: getCategoryColor(featuredPost.category),
                            }}
                          >
                            {featuredPost.category}
                          </span>
                          {featuredPost.university && (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-dark/5 dark:bg-white/5 border border-dark/10 dark:border-white/10 text-[#0B071E] dark:text-white">
                              #{featuredPost.university}
                            </span>
                          )}
                          <span className="text-[10px] font-mono font-black text-funky-orange uppercase tracking-wider animate-pulse flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-funky-orange" /> Featured Spotlight
                          </span>
                        </div>

                        <h2 className="font-display font-black text-3xl md:text-4xl text-[#0B071E] dark:text-white leading-[1.15] group-hover:text-[#0066FF] dark:group-hover:text-funky-cyan transition-colors pt-2">
                          {featuredPost.title}
                        </h2>

                        <p className="text-[#0B071E]/75 dark:text-white/70 text-sm md:text-base font-semibold leading-relaxed max-w-xl pr-4">
                          {featuredPost.excerpt}
                        </p>

                        {/* Metadata Footer */}
                        <div className="pt-6 flex flex-wrap items-center gap-5 text-xs text-[#0B071E]/60 dark:text-white/50 font-bold">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-funky-blue to-funky-cyan flex items-center justify-center text-white font-extrabold text-[9px] shadow-sm select-none">
                              {featuredPost.authorName.charAt(0)}
                            </div>
                            <span>{featuredPost.authorName}</span>
                          </div>
                          <div className="flex items-center gap-1.5"><Clock size={13} className="text-funky-blue dark:text-funky-cyan" /> {featuredPost.readTime}</div>
                          <div className="flex items-center gap-1.5"><Eye size={13} className="text-funky-orange" /> {featuredPost.views || '1.2k'} reads</div>
                        </div>

                        {/* Spotlight CTA */}
                        <div className="pt-4">
                          <div
                            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-dark text-white border border-dark dark:bg-white/10 dark:border-white/20 dark:text-white group-hover:bg-[#0066FF] dark:group-hover:bg-[#2EF2FF] dark:group-hover:text-black hover:border-transparent transition-all shadow-md font-display font-black text-xs uppercase tracking-wider"
                          >
                            <span>Read Full Guide</span>
                            <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>

                      {/* Right side: Dynamic Cover Image */}
                      <div className="lg:col-span-5 relative w-full h-[220px] sm:h-[285px] overflow-hidden rounded-2xl border border-dark/10 dark:border-white/10 shadow-md">
                        <img
                          src={getBlogCoverImage(featuredPost.category, featuredPost.title, featuredPost.slug)}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              </div>
            )}

            {/* Remaining Guides Grid Layout */}
            {remainingPosts.length > 0 && (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
              >
                <AnimatePresence mode="popLayout">
                  {remainingPosts.map((post, i) => {
                    const cardColor = getCategoryColor(post.category);
                    return (
                      <motion.div
                        key={post.id || post.slug}
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="block h-full"
                      >
                        <Link href={`/blog/${post.slug}`} className="block h-full group">
                          <TiltCard
                            maxTilt={8}
                            hoverShadowColor={cardColor}
                            className="glass-card bg-white/70 dark:bg-[#110A20]/80 border border-dark/10 dark:border-white/10 rounded-3xl flex flex-col justify-between h-full transition-all duration-300 relative group-hover:border-funky-cyan/30 overflow-hidden"
                          >
                            {/* Card Image Header */}
                            <div className="relative w-full h-[170px] overflow-hidden border-b border-dark/5 dark:border-white/5">
                              <img
                                src={getBlogCoverImage(post.category, post.title, post.slug)}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#110A20]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
                              <div className="space-y-3">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span
                                    className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border"
                                    style={{
                                      background: `${cardColor}12`,
                                      borderColor: `${cardColor}25`,
                                      color: cardColor,
                                    }}
                                  >
                                    {post.category}
                                  </span>
                                  {post.university && (
                                    <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-dark/5 dark:bg-white/5 border border-dark/10 dark:border-white/10 text-dark/80 dark:text-white/80">
                                      #{post.university}
                                    </span>
                                  )}
                                </div>

                                <h2 className="font-display font-black text-lg text-[#0B071E] dark:text-white leading-snug group-hover:text-[#0066FF] dark:group-hover:text-funky-cyan transition-colors line-clamp-2">
                                  {post.title}
                                </h2>

                                <p className="text-[#0B071E]/75 dark:text-white/70 text-xs font-semibold leading-relaxed line-clamp-2">
                                  {post.excerpt}
                                </p>
                              </div>

                              <div className="pt-4 border-t border-dark/5 dark:border-white/5 flex items-center justify-between text-[11px] text-[#0B071E]/55 dark:text-white/45 font-bold">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-funky-blue to-funky-cyan flex items-center justify-center text-white font-extrabold text-[8.5px] shadow-sm select-none">
                                    {post.authorName.charAt(0)}
                                  </div>
                                  <span className="group-hover:text-[#0B071E] dark:group-hover:text-white transition-colors">{post.authorName}</span>
                                </div>
                                <div className="flex items-center gap-1.5"><Clock size={12} className="text-funky-blue dark:text-funky-cyan" /> {post.readTime}</div>
                              </div>
                            </div>
                          </TiltCard>
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 flex items-center justify-center bg-transparent">
        <div className="w-12 h-12 border-4 border-funky-blue/20 border-t-funky-blue rounded-full animate-spin" />
      </div>
    }>
      <BlogContent />
    </Suspense>
  );
}
