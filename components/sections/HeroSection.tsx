'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  ArrowRight, GraduationCap, Zap, BookOpen,
  Sparkles, Download, CheckCircle, Star, Search, Building2
} from 'lucide-react';
import { stats } from '@/data/testimonials';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), { ssr: false, loading: () => null });

const ctr = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
const itm = { 
  hidden: { opacity: 0, y: 22 }, 
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } 
};

export default function HeroSection() {
  const [uniCount, setUniCount] = useState(12);

  useEffect(() => {
    async function loadCount() {
      try {
        const snap = await getDocs(collection(db, 'universities'));
        if (!snap.empty) {
          setUniCount(snap.size);
        }
      } catch (e) {
        console.error('Error loading universities count:', e);
      }
    }
    loadCount();
  }, []);

  const dynamicStats = stats.map(s => {
    if (s.label === 'Universities Listed') {
      return { ...s, value: `${uniCount}` };
    }
    return s;
  });

  // Widget 1: Resource Search states
  const [selectedTag, setSelectedTag] = useState<'NUST' | 'FAST' | 'LUMS'>('NUST');
  const [dlTrigger, setDlTrigger] = useState<string | null>(null);

  // Widget 2: Marketplace Bid animation state
  const [activeBidIdx, setActiveBidIdx] = useState(0);
  const mockBids = [
    { name: 'Omar Farooq (NUST)', amount: '1,800', rating: 4.9, sessions: 120, time: '3 mins ago' },
    { name: 'Sana Malik (LUMS)', amount: '2,000', rating: 4.8, sessions: 85, time: '1 min ago' },
    { name: 'Usman Tariq (FAST)', amount: '1,750', rating: 4.7, sessions: 64, time: 'Just now' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBidIdx((prev) => (prev + 1) % mockBids.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDownloadDemo = (title: string) => {
    setDlTrigger(title);
    setTimeout(() => setDlTrigger(null), 3000);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-[#0B071E]">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 75% 55% at 50% -5%, rgba(0,102,255,0.08) 0%, transparent 65%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 45% at 85% 85%, rgba(255,75,114,0.06) 0%, transparent 60%)' }} />
      </div>

      <HeroScene />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 102, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 102, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      <div className="relative z-10 section-container w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Copy & Call to Action */}
          <motion.div 
            variants={ctr} 
            initial="hidden" 
            animate="show" 
            className="lg:col-span-5 flex flex-col justify-center text-left"
          >
            {/* Launch Badge */}
            <motion.div 
              variants={itm} 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0066FF]/20 bg-[#0066FF]/5 text-xs font-black uppercase tracking-[0.15em] text-[#0066FF] mb-6 w-fit cursor-default select-none"
            >
              <Sparkles size={14} className="text-[#0066FF]" />
              <span>Version 2.0 Live</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itm}
              className="font-display font-black tracking-tight mb-6 mt-2 text-[#0B071E] dark:text-white"
              style={{ fontSize: 'clamp(2rem, 3.8vw + 0.8rem, 3.75rem)', lineHeight: 1.08 }}
            >
              Your Entire{' '}
              <span className="relative inline-block">
                <span className="gradient-text">University Journey</span>
              </span>{' '}
              In One Platform
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              variants={itm} 
              className="text-[#0B071E]/60 dark:text-white/60 text-base sm:text-lg leading-relaxed mb-8 font-semibold"
            >
              Access notes, past papers and study resources, connect with verified peer tutors, and explore universities across Pakistan — all from a single platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itm} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href="/signup" className="btn-primary px-8 py-4 text-base group w-full sm:w-auto text-center flex justify-center">
                <Zap size={16} />
                Get Started Free
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/resources" className="btn-ghost px-8 py-4 text-base w-full sm:w-auto text-center flex justify-center">
                <BookOpen size={18} className="text-[#0066FF]" />
                Explore Resources
              </Link>
            </motion.div>

            {/* Compact Floating Metrics Cards */}
            <motion.div variants={itm} className="grid grid-cols-2 gap-4 mt-10 w-full">
              {dynamicStats.map(({ label, value, Icon }) => (
                <div 
                  key={label} 
                  className="glass-card p-4 flex items-center gap-3 bg-white/70 dark:bg-[#110A20]/70 border border-black/5 dark:border-white/5 shadow-sm hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/20 flex items-center justify-center text-[#0066FF] shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="font-display text-lg font-bold text-[#0B071E] dark:text-white leading-tight">{value}</div>
                    <div className="text-[#0B071E]/50 dark:text-white/50 text-[10px] font-bold uppercase tracking-wider">{label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN: Overlapping layered visual ecosystem */}
          <div className="lg:col-span-7 relative flex justify-center items-center h-[520px] sm:h-[600px] w-full mt-12 lg:mt-0 overflow-visible">
            {/* Visual ecosystem container */}
            <div className="relative w-full max-w-[500px] h-full flex items-center justify-center select-none scale-[0.85] sm:scale-90 md:scale-95 lg:scale-100 origin-center">
              
              {/* Decorative abstract glow orbits */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0066FF]/5 to-[#FF4B72]/5 rounded-full blur-3xl -z-10 animate-pulse duration-[8s]" />

              {/* CARD 1: Academic Resource Hub (Main Base Layer) */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: -2 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ scale: 1.02, rotate: -1, zIndex: 40 }}
                className="absolute w-[330px] sm:w-[350px] glass-card p-6 border-[#0066FF] ring-1 ring-[#0066FF]/20 bg-white/95 dark:bg-[#110A20]/95 shadow-[12px_12px_0px_#0B071E] dark:shadow-[12px_12px_0px_#0066FF] -translate-x-12 sm:-translate-x-16 -translate-y-8 cursor-pointer z-10"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#0066FF]/15 text-[#0066FF]">
                    Core Feature
                  </span>
                  <div className="text-[#0B071E]/30 dark:text-white/30 text-[8px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={8} className="text-[#0066FF]" /> Popular
                  </div>
                </div>

                <h3 className="font-display font-black text-lg text-[#0B071E] dark:text-white mb-1">
                  Academic Resource Hub
                </h3>
                <p className="text-[#0B071E]/60 dark:text-white/60 text-[10px] font-semibold mb-4 leading-relaxed">
                  Direct access to lab manuals, solved past papers, and slides.
                </p>

                {/* Simulated search bar */}
                <div className="bg-black/5 dark:bg-white/5 rounded-xl p-3 space-y-2.5 border border-black/5 dark:border-white/5">
                  <div className="relative">
                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#0B071E]/40 dark:text-white/40" />
                    <div className="w-full bg-white dark:bg-[#0B071E] border border-black/5 dark:border-white/5 rounded-lg pl-8 pr-2 py-1.5 text-[9px] font-semibold text-[#0B071E]/40 dark:text-white/40">
                      Search course codes, instructors...
                    </div>
                  </div>

                  {/* Filter tags demo */}
                  <div className="flex gap-1.5">
                    {(['NUST', 'FAST', 'LUMS'] as const).map((tag) => (
                      <button
                        key={tag}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTag(tag);
                        }}
                        className={`text-[8px] font-bold px-2 py-0.5 rounded border transition-all ${
                          selectedTag === tag
                            ? 'bg-[#0066FF] border-[#0066FF] text-white'
                            : 'bg-white dark:bg-white/5 border-black/10 dark:border-white/10 text-[#0B071E]/50 dark:text-white/50 hover:bg-black/5'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>

                  {/* Simulated Documents */}
                  <div className="space-y-1.5">
                    {[
                      { title: 'CS100 DSA Midterm Solved', univ: 'NUST', dl: '12.4k' },
                      { title: 'MT201 Calculus II Cheat Sheet', univ: 'FAST', dl: '8.2k' },
                    ]
                      .filter((doc) => selectedTag === 'NUST' || doc.univ === selectedTag)
                      .map((item, i) => (
                        <div
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadDemo(item.title);
                          }}
                          className="flex items-center justify-between p-2 rounded bg-white dark:bg-[#0B071E] border border-black/5 dark:border-white/5 hover:border-[#0066FF]/30 transition-all cursor-pointer group"
                        >
                          <span className="text-[9px] font-bold text-[#0B071E] dark:text-white truncate max-w-[140px] flex items-center gap-1.5">
                            <BookOpen size={10} className="text-[#0066FF]" />
                            {item.title}
                          </span>
                          <span className="text-[8px] font-extrabold text-[#0066FF] bg-[#0066FF]/10 px-1.5 py-0.5 rounded flex items-center gap-0.5 group-hover:bg-[#0066FF] group-hover:text-white transition-all">
                            <Download size={8} />
                            {item.dl}
                          </span>
                        </div>
                      ))}
                    {selectedTag === 'LUMS' && (
                      <div className="text-center py-2 text-[8px] text-[#0B071E]/40 dark:text-white/40 font-bold">
                        No docs found. Add LUMS resources!
                      </div>
                    )}
                  </div>
                </div>

                {/* Local download notifications */}
                <AnimatePresence>
                  {dlTrigger && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      className="absolute inset-x-4 bottom-4 p-2 rounded-lg bg-[#0066FF] text-white text-[9px] font-black text-center shadow-lg z-20 flex items-center justify-center gap-1"
                    >
                      <CheckCircle size={10} /> File starting download!
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* CARD 2: Peer Tutor Marketplace (Floating Right-Top Overlap) */}
              <motion.div
                initial={{ opacity: 0, y: -20, rotate: 2 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -8, 0],
                  rotate: 2 
                }}
                transition={{
                  y: {
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  opacity: { duration: 0.8, delay: 0.4 }
                }}
                whileHover={{ scale: 1.03, rotate: 0, zIndex: 40 }}
                className="absolute w-[240px] sm:w-[260px] glass-card p-5 border-black/5 bg-white/90 dark:bg-[#110A20]/90 dark:border-white/5 shadow-lg translate-x-20 sm:translate-x-28 -translate-y-24 sm:-translate-y-28 cursor-pointer z-20"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-[#FF4B72]/15 text-[#FF4B72]">
                    On-Demand Help
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                </div>

                <h3 className="font-display font-black text-base text-[#0B071E] dark:text-white mb-0.5">
                  Tutor Marketplace
                </h3>
                <p className="text-[#0B071E]/60 dark:text-white/60 text-[9px] font-semibold mb-3">
                  Post requests, get bids, learn.
                </p>

                {/* Mini active request panel */}
                <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black text-[#FF4B72] uppercase tracking-wider">Help Request</span>
                    <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1 rounded">PKR 2,000</span>
                  </div>
                  <h4 className="text-[9px] font-extrabold text-[#0B071E] dark:text-white truncate">Struggling with OOP</h4>
                  
                  {/* Dynamic scrolling bid simulation */}
                  <div className="relative h-[36px] overflow-hidden bg-white dark:bg-[#0B071E] rounded-lg border border-black/5 dark:border-white/5 px-2 py-1 flex items-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeBidIdx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                        className="w-full flex items-center justify-between"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#FF4B72] to-[#0066FF] flex items-center justify-center text-white font-extrabold text-[8px] shrink-0">
                            {mockBids[activeBidIdx].name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[8px] font-black text-[#0B071E] dark:text-white truncate">{mockBids[activeBidIdx].name.split(' ')[0]}</div>
                            <div className="flex items-center gap-0.5 text-[6px] text-[#0B071E]/40 dark:text-white/40 font-bold">
                              <Star size={6} className="fill-yellow-400 text-yellow-400" />
                              {mockBids[activeBidIdx].rating}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[9px] font-black text-[#FF4B72]">PKR {mockBids[activeBidIdx].amount}</div>
                          <div className="text-[5px] text-[#0B071E]/30 dark:text-white/30 font-bold">{mockBids[activeBidIdx].time}</div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              {/* CARD 3: University Explorer (Floating Right-Bottom Overlap) */}
              <motion.div
                initial={{ opacity: 0, y: 20, rotate: -3 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, 8, 0],
                  rotate: -3 
                }}
                transition={{
                  y: {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  },
                  opacity: { duration: 0.8, delay: 0.6 }
                }}
                whileHover={{ scale: 1.03, rotate: 0, zIndex: 40 }}
                className="absolute w-[220px] sm:w-[240px] glass-card p-4.5 border-black/5 bg-white/90 dark:bg-[#110A20]/90 dark:border-white/5 shadow-xl translate-x-16 sm:translate-x-24 translate-y-28 sm:translate-y-32 cursor-pointer z-30"
              >
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-[#0066FF]/10 text-[#0066FF] mb-2">
                  Admissions & Fees
                </span>

                <h3 className="font-display font-black text-sm text-[#0B071E] dark:text-white mb-0.5">
                  University Explorer
                </h3>
                <p className="text-[#0B071E]/60 dark:text-white/60 text-[9px] font-semibold mb-3">
                  Compare checklists, deadlines & fees.
                </p>

                {/* Universities List widget */}
                <div className="space-y-1.5">
                  {[
                    { name: 'NUST', fee: '140k/sem', deadline: 'Aug 31' },
                    { name: 'FAST-NU', fee: '160k/sem', deadline: 'July 15' },
                  ].map((uni, idx) => (
                    <div
                      key={idx}
                      className="p-1.5 rounded-lg bg-white dark:bg-[#0B071E] border border-black/5 dark:border-white/5 flex items-center justify-between text-[8px]"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-4 h-4 rounded bg-[#0b071e]/5 dark:bg-white/5 flex items-center justify-center text-[8px] font-black text-[#0066FF] shrink-0">
                          {uni.name.charAt(0)}
                        </div>
                        <div className="text-[8px] font-black text-[#0B071E] dark:text-white truncate">{uni.name}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-extrabold text-[#0B071E] dark:text-white">PKR {uni.fee}</div>
                        <div className="text-[6px] text-red-500 font-bold">Due: {uni.deadline}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* FLOATING EXTRA DECORATIONS */}
              {/* Floating verified badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-16 -left-12 glass-card px-2.5 py-1.5 rounded-lg border-black/5 dark:border-white/5 flex items-center gap-1 shadow-sm text-[8px] font-black text-[#0B071E] dark:text-white z-40 bg-white/95 dark:bg-[#110A20]/95"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[7px] font-bold">✓</div>
                <span>Verified Tutors</span>
              </motion.div>

              {/* Floating download counter */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="absolute bottom-28 -left-20 glass-card px-2.5 py-1.5 rounded-lg border-black/5 dark:border-white/5 flex items-center gap-1.5 shadow-sm text-[8px] font-black text-[#0B071E] dark:text-white z-40 bg-white/95 dark:bg-[#110A20]/95"
              >
                <div className="w-4 h-4 rounded bg-[#0066FF]/10 text-[#0066FF] flex items-center justify-center">
                  <Download size={10} />
                </div>
                <div>
                  <div className="font-black">150,000+</div>
                  <div className="text-[5px] text-[#0B071E]/40 dark:text-white/40 uppercase">Downloads</div>
                </div>
              </motion.div>
              
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
