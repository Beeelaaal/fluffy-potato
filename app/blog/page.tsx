'use client';

import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, User } from 'lucide-react';

const POSTS = [
  {
    id: '1',
    title: 'How to Ace Your University Entry Tests (NET, FAST, & LCAT)',
    excerpt: 'Cracking admission entry tests requires strategy. Here are the top tips from NUST & FAST alumni on how to manage your time and score 140+.',
    author: 'Ali Murtaza',
    date: 'May 18, 2026',
    readTime: '6 min read',
    category: 'Admissions',
    color: '#06b6d4',
  },
  {
    id: '2',
    title: 'The Ultimate Guide to Surviving Data Structures & Algorithms',
    excerpt: 'DSA is notoriously tough for CS juniors. We break down the key topics like graphs, trees, and dynamic programming with top resource links.',
    author: 'Zainab Fatima',
    date: 'May 12, 2026',
    readTime: '8 min read',
    category: 'Academics',
    color: '#7c3aed',
  },
  {
    id: '3',
    title: '5 Side Hustles for Pakistani University Students in 2026',
    excerpt: 'Balancing studies and earning pocket money is possible. Learn how to tutor on Tute, write code, or design graphics to fund your semester expenses.',
    author: 'Hamza Khan',
    date: 'May 05, 2026',
    readTime: '5 min read',
    category: 'Student Life',
    color: '#ec4899',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-funky-purple/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[300px] bg-funky-cyan/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="section-badge mb-4 mx-auto w-fit">Tute Blog</div>
          <h1 className="font-display font-bold text-5xl sm:text-6xl tracking-tight mb-6">
            Insights &amp; <span className="gradient-text">Guides</span>
          </h1>
          <p className="text-[#0B071E]/80 text-lg sm:text-xl max-w-xl mx-auto font-semibold">
            Tips, guides, and stories to help you navigate university life in Pakistan.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {POSTS.map((post, i) => (
            <motion.article
              key={post.id}
              className="glass-card p-6 h-full flex flex-col justify-between"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div>
                <span 
                  className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-4 inline-block"
                  style={{ background: `${post.color}15`, border: `1px solid ${post.color}25`, color: post.color }}
                >
                  {post.category}
                </span>
                <h2 className="font-display font-bold text-xl mb-3 text-[#0B071E] hover:text-[#8B5CF6] transition-colors cursor-pointer">
                  {post.title}
                </h2>
                <p className="text-[#0B071E]/75 text-sm font-semibold mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-black/5 flex items-center justify-between text-xs text-[#0B071E]/55 font-semibold">
                <span className="flex items-center gap-1.5"><User size={13} /> {post.author}</span>
                <span className="flex items-center gap-1.5"><Calendar size={13} /> {post.date}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
