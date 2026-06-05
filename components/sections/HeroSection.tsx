'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  ArrowRight, GraduationCap, Zap, BookOpen,
  Sparkles, Download, CheckCircle, Star, MapPin, Users, Search
} from 'lucide-react';
import { stats } from '@/data/testimonials';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), { ssr: false, loading: () => null });

const ctr = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
const itm = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } };

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

  // Widget 1: Resource Search states (from Products & Services)
  const [selectedTag, setSelectedTag] = useState<'NUST' | 'FAST' | 'LUMS'>('NUST');
  const [dlTrigger, setDlTrigger] = useState<string | null>(null);

  // Widget 2: Marketplace Bid animation state (from Products & Services)
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
    <section className="relative flex flex-col items-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 75% 55% at 50% -5%, rgba(255,75,114,0.06) 0%, transparent 65%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 45% at 85% 85%, rgba(139,92,246,0.06) 0%, transparent 60%)' }} />
      </div>

      <HeroScene />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(11, 7, 30, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(11, 7, 30, 0.08) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 section-container text-center pt-32 pb-24">
        <motion.div variants={ctr} initial="hidden" animate="show" className="max-w-4xl mx-auto">

          {/* Resources Badge */}
          <motion.div 
            variants={itm} 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-dark/10 bg-white/70 text-xs font-black uppercase tracking-[0.18em] text-[#0066FF] mb-4 cursor-default select-none"
          >
            <BookOpen size={14} className="text-[#0066FF]" />
            <span>Pakistan's Largest Peer-to-Peer Academic Resource Hub</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itm}
            className="font-display font-bold tracking-tight mb-6 mt-4"
            style={{ fontSize: 'clamp(2.2rem, 5.5vw + 0.5rem, 5rem)', lineHeight: 1.05 }}
          >
            Your University Life,{' '}
            <span className="relative inline-block">
              <span className="gradient-text">Simplified</span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                style={{ background: 'linear-gradient(90deg, #FF4B72, #0066FF, transparent)' }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.0, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
              />
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p variants={itm} className="text-[#0B071E]/60 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10 font-semibold">
            Access a massive repository of solved past papers, hand-written notes, and lecture slides uploaded by top students. Prepare for your exams with course resources tailored to your university, or connect with expert peer tutors.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itm} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link href="/signup" className="btn-primary px-8 py-4 text-base group">
              <Zap size={16} />
              Get Started Free
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#services" className="btn-ghost px-8 py-4 text-base">
              <GraduationCap size={18} className="text-[#0066FF]" />
              Explore Core Services
            </Link>
          </motion.div>

          {/* Stats — now using Lucide icons */}
          <motion.div variants={itm} className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {dynamicStats.map(({ label, value, Icon }) => (
              <motion.div
                key={label}
                className="glass-card p-5 text-center cursor-default"
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-center mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/20 flex items-center justify-center">
                    <Icon size={16} className="text-[#0066FF]" />
                  </div>
                </div>
                <div className="font-display text-xl font-bold gradient-text">{value}</div>
                <div className="text-[#0B071E]/40 text-xs mt-0.5 font-semibold">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ─── MERGED PRODUCTS & SERVICES SECTION ─── */}
        <div className="text-center mt-24 mb-16 w-full max-w-7xl mx-auto">
          <div className="section-badge mb-4 mx-auto w-fit">
            <Sparkles size={12} className="text-[#0066FF]" />
            Product & Services
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl tracking-tight mb-4 text-[#0B071E] dark:text-white">
            Everything you need for <span className="gradient-text">Academic Success</span>
          </h2>
          <p className="text-[#0B071E]/60 dark:text-white/60 text-base sm:text-lg max-w-2xl mx-auto font-semibold">
            Interactive, peer-driven platforms tailored to simplify your entire university journey.
          </p>
        </div>

        {/* Services Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch text-left w-full max-w-7xl mx-auto mb-8">
          
          {/* Card 1: Academic Resource Hub */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 flex flex-col justify-between relative overflow-hidden border-[#0066FF] ring-2 ring-[#0066FF]/20 bg-white/90 dark:bg-dark-800/90 shadow-[8px_8px_0px_#0B071E] dark:shadow-[8px_8px_0px_#0066FF]"
          >
            <div className="absolute top-0 right-0 bg-[#0066FF] text-white font-display text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-bl-xl flex items-center gap-1 shadow-sm">
              <Sparkles size={10} />
              Most Popular
            </div>

            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-5 bg-[#0066FF]/15 text-[#0066FF]">
                Core Feature
              </span>

              {/* Title */}
              <h3 className="font-display font-black text-2xl text-[#0B071E] dark:text-white mb-3">
                Academic Resource Hub
              </h3>
              
              <p className="text-[#0B071E]/70 dark:text-white/70 text-sm leading-relaxed mb-6 font-semibold">
                Get instant access to notes, lecture slides, lab manuals, and solved mid/final past papers uploaded by senior students in your exact course.
              </p>

              {/* Interactive Widget 1: Mini Resource Explorer */}
              <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-4 mb-6 border border-black/5 dark:border-white/5 space-y-3.5">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B071E]/40 dark:text-white/40" />
                  <div className="w-full bg-white dark:bg-[#110A20] border border-black/10 dark:border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-[#0B071E]/60 dark:text-white/60 select-none">
                    Search course codes, instructors...
                  </div>
                </div>

                {/* Filter tags demo */}
                <div className="flex gap-2">
                  {(['NUST', 'FAST', 'LUMS'] as const).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                        selectedTag === tag
                          ? 'bg-[#0066FF] border-[#0066FF] text-white'
                          : 'bg-white dark:bg-white/5 border-black/10 dark:border-white/10 text-[#0B071E]/60 dark:text-white/60 hover:bg-black/5'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                {/* Simulated Documents */}
                <div className="space-y-2">
                  {[
                    { title: 'CS100 DSA Midterm Solved', univ: 'NUST', dl: '12.4k' },
                    { title: 'MT201 Calculus II Cheat Sheet', univ: 'FAST', dl: '8.2k' },
                  ]
                    .filter((doc) => selectedTag === 'NUST' || doc.univ === selectedTag)
                    .map((item, i) => (
                      <div
                        key={i}
                        onClick={() => handleDownloadDemo(item.title)}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#110A20] border border-black/5 dark:border-white/5 hover:border-[#0066FF]/30 hover:shadow-sm transition-all cursor-pointer group"
                      >
                        <span className="text-[11px] font-bold text-[#0B071E] dark:text-white truncate max-w-[150px] flex items-center gap-1.5">
                          <BookOpen size={12} className="text-[#0066FF]" />
                          {item.title}
                        </span>
                        <button className="text-[9px] font-extrabold text-[#0066FF] bg-[#0066FF]/10 px-2 py-1 rounded-md flex items-center gap-1 group-hover:bg-[#0066FF] group-hover:text-white transition-all">
                          <Download size={10} />
                          {item.dl}
                        </button>
                      </div>
                    ))}
                  {selectedTag === 'LUMS' && (
                    <div className="text-center py-4 text-[10px] text-[#0B071E]/40 dark:text-white/40 font-bold">
                      No documents found for #LUMS. Be the first to add one!
                    </div>
                  )}
                </div>
              </div>

              {/* Toast notifier demo */}
              <AnimatePresence>
                {dlTrigger && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-20 left-6 right-6 p-3 rounded-xl bg-[#0066FF] text-white text-xs font-bold text-center shadow-lg z-20 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={14} /> File "{dlTrigger}" is downloading!
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Features List */}
              <ul className="space-y-2 mb-8">
                {['150,000+ Solved Documents', 'Tailored by University & Instructor', 'Direct PDF & Document Downloads'].map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-xs font-bold text-[#0B071E]/80 dark:text-white/80">
                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/resources"
              className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 border-2 transition-all duration-200 bg-gradient-to-br from-[#0066FF] to-[#0052CC] text-white border-[#0066FF] hover:shadow-[4px_4px_0px_#0B071E] dark:hover:shadow-[4px_4px_0px_#ffffff]"
            >
              Browse Resource Hub
              <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* Card 2: Peer Tutor Marketplace */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-8 flex flex-col justify-between relative overflow-hidden border-black/10 bg-white/60 dark:bg-dark-800/60 dark:border-white/10"
          >
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-5 bg-black/5 dark:bg-white/5 text-[#0B071E]/50 dark:text-white/50">
                On-Demand Help
              </span>

              {/* Title */}
              <h3 className="font-display font-black text-2xl text-[#0B071E] dark:text-white mb-3">
                Peer Tutor Marketplace
              </h3>
              
              <p className="text-[#0B071E]/70 dark:text-white/70 text-sm leading-relaxed mb-6 font-semibold">
                Struggling with a concept? Post a request, receive competitive bids from verified peer tutors who aced your course, and learn at a budget you set.
              </p>

              {/* Interactive Widget 2: Live Bid Feed Simulator */}
              <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-4 mb-6 border border-black/5 dark:border-white/5 space-y-3.5">
                <div className="p-3 rounded-xl bg-white dark:bg-[#110A20] border border-black/5 dark:border-white/5 relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black text-[#FF4B72] uppercase tracking-wider">Active Help Request</span>
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Budget: PKR 2,000</span>
                  </div>
                  <h4 className="text-[11px] font-bold text-[#0B071E] dark:text-white mb-1">Struggling with OOP polymorphism</h4>
                  <p className="text-[9px] text-[#0B071E]/60 dark:text-white/60 font-medium">Need java code explanation for midterms prep.</p>
                </div>

                {/* Animated Bid Incoming */}
                <div className="relative h-[65px] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeBidIdx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-x-0 p-2.5 rounded-xl bg-gradient-to-r from-[#FF4B72]/5 to-[#0066FF]/5 border border-dashed border-[#FF4B72]/30 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF4B72] to-[#0066FF] flex items-center justify-center text-white font-extrabold text-[10px]">
                          {mockBids[activeBidIdx].name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-[10px] font-black text-[#0B071E] dark:text-white">{mockBids[activeBidIdx].name}</div>
                          <div className="flex items-center gap-1 text-[8px] text-[#0B071E]/40 dark:text-white/40 font-bold">
                            <Star size={8} className="fill-yellow-400 text-yellow-400" />
                            {mockBids[activeBidIdx].rating} · {mockBids[activeBidIdx].sessions} sessions
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] font-black text-[#FF4B72]">PKR {mockBids[activeBidIdx].amount}</div>
                        <div className="text-[7px] text-[#0B071E]/30 dark:text-white/30 font-bold">{mockBids[activeBidIdx].time}</div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-2 mb-8">
                {['Real-time Bid Pricing', 'Verified Class-Aced Peer Tutors', '1-on-1 Personalized Chat'].map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-xs font-bold text-[#0B071E]/80 dark:text-white/80">
                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/marketplace"
              className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 border-2 transition-all duration-200 bg-white dark:bg-[#110A20] border-dark dark:border-white text-dark dark:text-white shadow-[4px_4px_0px_#0B071E] dark:shadow-[4px_4px_0px_#ffffff] hover:shadow-[6px_6px_0px_#0B071E] dark:hover:shadow-[6px_6px_0px_#ffffff] hover:-translate-y-0.5"
            >
              Open Marketplace
              <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* Card 3: University Explorer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-8 flex flex-col justify-between relative overflow-hidden border-black/10 bg-white/60 dark:bg-dark-800/60 dark:border-white/10"
          >
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-5 bg-black/5 dark:bg-white/5 text-[#0B071E]/50 dark:text-white/50">
                Admissions & Fees
              </span>

              {/* Title */}
              <h3 className="font-display font-black text-2xl text-[#0B071E] dark:text-white mb-3">
                University Explorer
              </h3>
              
              <p className="text-[#0B071E]/70 dark:text-white/70 text-sm leading-relaxed mb-6 font-semibold">
                Compare fee structures, degree checklists, and entry test admission criteria across 120+ Pakistani universities to choose your dream destination.
              </p>

              {/* Interactive Widget 3: Mini comparison cards */}
              <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-4 mb-6 border border-black/5 dark:border-white/5 space-y-2">
                {[
                  { name: 'NUST', fee: '140k/sem', test: 'NET / SAT', deadline: 'Aug 31' },
                  { name: 'FAST-NU', fee: '160k/sem', test: 'Admission Test', deadline: 'July 15' },
                ].map((uni, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#110A20] border border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-semibold"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#0b071e]/5 dark:bg-white/5 flex items-center justify-center text-[10px] font-black text-[#06b6d4]">
                        {uni.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-[#0B071E] dark:text-white">{uni.name}</div>
                        <div className="text-[8px] text-[#0B071E]/40 dark:text-white/40 font-bold">{uni.test}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-[#0B071E] dark:text-white">PKR {uni.fee}</div>
                      <div className="text-[8px] text-red-500 font-bold">Due: {uni.deadline}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Features List */}
              <ul className="space-y-2 mb-8">
                {['Verified Semester Fees', 'Entry Test Eligibility Filters', 'Programs & Intake Deadlines'].map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-xs font-bold text-[#0B071E]/80 dark:text-white/80">
                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/universities"
              className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 border-2 transition-all duration-200 bg-white dark:bg-[#110A20] border-dark dark:border-white text-dark dark:text-white shadow-[4px_4px_0px_#0B071E] dark:shadow-[4px_4px_0px_#ffffff] hover:shadow-[6px_6px_0px_#0B071E] dark:hover:shadow-[6px_6px_0px_#ffffff] hover:-translate-y-0.5"
            >
              Explore Universities
              <ArrowRight size={14} />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
