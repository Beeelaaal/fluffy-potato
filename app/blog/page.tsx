'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, User, Plus, Filter, X } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';

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
  },
];

const categories = ['all', 'Admission Guides', 'Deadlines', 'Scholarships', 'Do\'s & Don\'ts', 'Exam Sessions'];

function BlogContent() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const searchParams = useSearchParams();
  const universityParam = searchParams ? searchParams.get('university') : null;

  useEffect(() => {
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
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
    ...STATIC_POSTS.filter(s => !blogs.some(b => b.slug === s.slug))
  ];

  // Filter blogs based on category and university
  const filtered = allBlogs.filter(post => {
    if (selectedCategory !== 'all' && post.category !== selectedCategory) return false;
    if (universityParam && post.university && post.university.toLowerCase() !== universityParam.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-funky-blue/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[300px] bg-funky-cyan/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12"
        >
          <div className="text-center sm:text-left">
            <div className="section-badge mb-4 mx-auto sm:mx-0 w-fit">YOUR INSIDER</div>
            <h1 className="font-display font-bold text-5xl sm:text-6xl tracking-tight mb-6">
              Admissions, Guides &amp; <span className="gradient-text">Deadlines</span>
            </h1>
            <p className="text-[#0B071E]/80 dark:text-white/80 text-lg sm:text-xl max-w-xl mx-auto sm:mx-0 font-semibold">
              Deadlines, admission guides, scholarships, do&apos;s &amp; don&apos;ts, and exam sessions.
            </p>
            {universityParam && (
              <div className="mt-4 flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs px-3 py-1.5 rounded-xl bg-funky-orange/10 text-funky-orange border border-funky-orange/20 font-bold uppercase tracking-wider">
                  Filtering by: {universityParam.toUpperCase()}
                </span>
                <Link href="/blog" className="text-xs text-[#0B071E]/60 dark:text-white/60 hover:text-red-500 font-bold underline flex items-center gap-0.5">
                  <X size={12} /> Clear Filter
                </Link>
              </div>
            )}
          </div>

          {user && (
            <Link
              href="/blog/write"
              className="btn-primary px-8 py-4 text-base font-bold whitespace-nowrap"
            >
              <Plus size={18} /> Write a Post
            </Link>
          )}
        </motion.div>

        {/* Category filter pills */}
        <motion.div
          className="flex flex-wrap justify-center sm:justify-start gap-3 mb-10 border-b border-black/5 dark:border-white/5 pb-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            const colors: Record<string, string> = {
              all: '#0066FF',
              'Admission Guides': '#0066FF',
              'Deadlines': '#FF5C7A',
              'Scholarships': '#FF7A18',
              'Do\'s & Don\'ts': '#2EF2FF',
              'Exam Sessions': '#D8FF3E',
            };
            const color = colors[cat] || '#0066FF';
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border-2 border-dark/10"
                style={{
                  background: isSelected ? `${color}20` : 'rgba(255,255,255,0.7)',
                  borderColor: isSelected ? color : 'rgba(11,7,30,0.1)',
                  color: isSelected ? color : 'rgba(11,7,30,0.6)',
                  boxShadow: isSelected ? `3px 3px 0px ${color}` : 'none'
                }}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            );
          })}
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <div className="font-display font-black text-xl animate-pulse text-[#0B071E]">Loading articles...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 glass-card p-10 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-funky-cyan/[0.08] border border-funky-cyan/[0.15] flex items-center justify-center mx-auto mb-6">
              <BookOpen size={28} className="text-funky-cyan animate-pulse" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-3 text-[#0B071E] dark:text-white">No Guides Found</h2>
            <p className="text-[#0B071E]/60 dark:text-white/60 text-sm mb-6 font-semibold">We couldn&apos;t find any articles matching this filter. Try adjusting your selections.</p>
            <button onClick={() => { setSelectedCategory('all'); }} className="btn-ghost text-sm font-bold border border-black/10">Show All Guides</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filtered.map((post, i) => (
              <motion.article
                key={post.id || post.slug}
                className="glass-card p-6 h-full flex flex-col justify-between hover:border-funky-cyan/40 transition-all hover:scale-[1.01]"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div>
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-4 inline-block"
                    style={{
                      background: `${post.color || '#0066FF'}15`,
                      border: `1px solid ${post.color || '#0066FF'}25`,
                      color: post.color || '#0066FF',
                    }}
                  >
                    {post.category}
                  </span>
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="font-display font-bold text-xl mb-3 text-[#0B071E] hover:text-[#0066FF] transition-colors cursor-pointer">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-[#0B071E]/75 text-sm font-semibold mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/5 flex items-center justify-between text-xs text-[#0B071E]/55 font-semibold">
                  <span className="flex items-center gap-1.5"><User size={13} /> {post.authorName}</span>
                  <span className="flex items-center gap-1.5"><Clock size={13} /> {post.readTime}</span>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-funky-blue/20 border-t-funky-blue rounded-full animate-spin" />
      </div>
    }>
      <BlogContent />
    </Suspense>
  );
}
