'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, User, Plus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const STATIC_POSTS = [
  {
    id: 'how-to-ace-your-university-entry-tests',
    slug: 'how-to-ace-your-university-entry-tests',
    title: 'How to Ace Your University Entry Tests (NET, FAST, & LCAT)',
    excerpt: 'Cracking admission entry tests requires strategy. Here are the top tips from NUST & FAST alumni on how to manage your time and score 140+.',
    authorName: 'Ali Murtaza',
    date: 'May 18, 2026',
    readTime: '6 min read',
    category: 'Admissions',
    color: '#06b6d4',
  },
  {
    id: 'the-ultimate-guide-to-surviving-data-structures-algorithms',
    slug: 'the-ultimate-guide-to-surviving-data-structures-algorithms',
    title: 'The Ultimate Guide to Surviving Data Structures & Algorithms',
    excerpt: 'DSA is notoriously tough for CS juniors. We break down the key topics like graphs, trees, and dynamic programming with top resource links.',
    authorName: 'Zainab Fatima',
    date: 'May 12, 2026',
    readTime: '8 min read',
    category: 'Academics',
    color: '#0052CC',
  },
  {
    id: '5-side-hustles-for-pakistani-university-students-in-2026',
    slug: '5-side-hustles-for-pakistani-university-students-in-2026',
    title: '5 Side Hustles for Pakistani University Students in 2026',
    excerpt: 'Balancing studies and earning pocket money is possible. Learn how to tutor on Tute, write code, or design graphics to fund your semester expenses.',
    authorName: 'Hamza Khan',
    date: 'May 05, 2026',
    readTime: '5 min read',
    category: 'Student Life',
    color: '#ec4899',
  },
];

export default function BlogPage() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-funky-blue/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[300px] bg-funky-cyan/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-16"
        >
          <div className="text-center sm:text-left">
            <div className="section-badge mb-4 mx-auto sm:mx-0 w-fit">Tute Blog</div>
            <h1 className="font-display font-bold text-5xl sm:text-6xl tracking-tight mb-6">
              Insights &amp; <span className="gradient-text">Guides</span>
            </h1>
            <p className="text-[#0B071E]/80 text-lg sm:text-xl max-w-xl mx-auto sm:mx-0 font-semibold">
              Tips, guides, and stories to help you navigate university life in Pakistan.
            </p>
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

        {loading ? (
          <div className="text-center py-20">
            <div className="font-display font-black text-xl animate-pulse text-[#0B071E]">Loading articles...</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {allBlogs.map((post, i) => (
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
