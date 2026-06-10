'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  ArrowRight, GraduationCap, Zap, BookOpen,
  Sparkles, Download, CheckCircle, Star, Search, Building2, Users, FileText, Clock, ShieldAlert, X
} from 'lucide-react';
import { stats } from '@/data/testimonials';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTheme } from '@/context/ThemeContext';
import { resources } from '@/data/resources';
import { universities } from '@/data/universities';
import { tutorProfiles } from '@/data/marketplace';

const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), { ssr: false, loading: () => null });

const ctr = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
const itm = { 
  hidden: { opacity: 0, y: 22 }, 
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } 
};

// System logs mock activity representing actual student activity in the ecosystem
const baseSystemLogs = [
  { type: 'Resource', text: 'Ahmed Raza downloaded NUST CS100 DSA Solved Midterm', color: 'text-funky-blue dark:text-[#4D90FF]' },
  { type: 'Tutor Match', text: 'Omar Farooq bid PKR 1,800 on a Java OOP tutoring request', color: 'text-funky-orange dark:text-[#FF7A18]' },
  { type: 'Admission', text: 'FAST-NU admission deadline set for July 15', color: 'text-[#15803D] dark:text-[#D8FF3E]' },
  { type: 'Earnings', text: 'Sana Malik (LUMS) received note upload royalty payout', color: 'text-[#FF4B72] dark:text-[#FF5C7A]' },
  { type: 'Resource', text: 'Hassan Ali downloaded FAST MT201 Calculus II Cheat Sheet', color: 'text-funky-blue dark:text-[#4D90FF]' },
  { type: 'Tutor Match', text: 'Zainab Sheikh matched with a 1-on-1 Accounting student', color: 'text-funky-orange dark:text-[#FF7A18]' },
  { type: 'Admission', text: 'NUST registration status: NET-3 schedule announced', color: 'text-[#15803D] dark:text-[#D8FF3E]' }
];

export default function HeroSection() {
  const [uniCount, setUniCount] = useState(12); // Dynamic fallback
  const [resCount, setResCount] = useState(1);  // Dynamic fallback
  const { theme } = useTheme();
  const [activeMobileTab, setActiveMobileTab] = useState<'search' | 'resources' | 'tutors' | 'unis' | 'pulse'>('search');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    async function loadCounts() {
      try {
        const uniSnap = await getDocs(collection(db, 'universities'));
        if (!uniSnap.empty) {
          setUniCount(uniSnap.size);
        }
        const resSnap = await getDocs(collection(db, 'resources'));
        // Load the exact resources count
        setResCount(resSnap.empty ? 0 : resSnap.size);
      } catch (e) {
        console.error('Error loading database counts:', e);
      }
    }
    loadCounts();
  }, []);

  // Map theme custom styling colors to stats dynamically based on database sizes
  const dynamicStats = stats.map(s => {
    let statColor = 'text-funky-blue dark:text-[#4D90FF]';
    let statBg = 'bg-funky-blue/10 border-funky-blue/20 dark:bg-[#4D90FF]/10 dark:border-[#4D90FF]/20';
    let value = s.value;
    let label = s.label;

    if (s.label === 'Universities Listed') {
      value = `${uniCount}`;
      statColor = 'text-[#15803D] dark:text-[#D8FF3E]';
      statBg = 'bg-[#DCFCE7] border-[#DCFCE7]/30 dark:bg-[#D8FF3E]/10 dark:border-[#D8FF3E]/20';
    } else if (s.label === 'Students Enrolled') {
      // Realistic student inflation relative to dynamic counts
      value = `${(uniCount * 120 + resCount * 5).toLocaleString()}+`;
      statColor = 'text-funky-blue dark:text-[#4D90FF]';
      statBg = 'bg-[#DBEAFE] border-[#DBEAFE]/30 dark:bg-[#4D90FF]/10 dark:border-[#4D90FF]/20';
    } else if (s.label === 'Tutors Available') {
      // Realistic tutor inflation relative to dynamic counts
      value = `${(uniCount * 8 + resCount * 2).toLocaleString()}+`;
      statColor = 'text-funky-orange dark:text-[#FF7A18]';
      statBg = 'bg-[#FFEDD5] border-[#FFEDD5]/30 dark:bg-[#FF7A18]/10 dark:border-[#FF7A18]/20';
    } else if (s.label === 'Resources Downloaded') {
      // Exact number of resources list
      label = 'Academic Resources';
      value = `${resCount}`;
      statColor = 'text-[#BE185D] dark:text-[#FF5C7A]';
      statBg = 'bg-[#FCE7F3] border-[#FCE7F3]/30 dark:bg-[#FF5C7A]/10 dark:border-[#FF5C7A]/20';
    }

    return { ...s, label, value, statColor, statBg };
  });

  // Interactive Panel A: Resource Vault states
  const [selectedTag, setSelectedTag] = useState<'NUST' | 'FAST' | 'LUMS'>('NUST');
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Folder Mock Data
  const mockDocs = {
    NUST: [
      { name: 'CS100_DSA_Midterm_Solved.pdf', size: '1.4 MB', dl: '12.4k' },
      { name: 'EE111_Circuit_Analysis_Notes.docx', size: '2.1 MB', dl: '9.1k' },
    ],
    FAST: [
      { name: 'MT201_Calculus_II_CheatSheet.pdf', size: '1.1 MB', dl: '8.2k' },
      { name: 'CS201_OOP_Solved_PastPapers.zip', size: '4.8 MB', dl: '10.5k' },
    ],
    LUMS: [
      { name: 'ECON101_Microeconomics_Notes.pdf', size: '1.9 MB', dl: '6.8k' },
      { name: 'MKT201_Principles_Marketing.pptx', size: '3.2 MB', dl: '4.2k' }
    ]
  };

  const handleDownloadDemo = (fileName: string) => {
    if (downloadingFile) return;
    setDownloadingFile(fileName);
    setDownloadProgress(0);
    setDownloadSuccessToast(null);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadingFile(null);
          setDownloadSuccessToast(fileName);
          // Insert a new log into our scrolling logs
          setTerminalLogs((oldLogs) => [
            ...oldLogs.slice(1),
            { type: 'Resource', text: `Demo Student downloaded ${fileName}`, color: 'text-funky-blue dark:text-[#4D90FF]' }
          ]);
          setTimeout(() => setDownloadSuccessToast(null), 3000);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  // Interactive Panel B: Search Input typing animation state
  const searchPlaceholders = [
    'Search NUST DSA papers...',
    'Find Calculus peer tutors...',
    'Explore FAST merit lists...',
    'Download CS101 lecture slides...',
  ];
  const [placeholderText, setPlaceholderText] = useState('');
  const [phIdx, setPhIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = searchPlaceholders[phIdx];
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      timer = setTimeout(() => {
        setPlaceholderText(currentFullText.substring(0, charIdx - 1));
        setCharIdx((prev) => prev - 1);
      }, 35);
    } else {
      timer = setTimeout(() => {
        setPlaceholderText(currentFullText.substring(0, charIdx + 1));
        setCharIdx((prev) => prev + 1);
      }, 65);
    }

    if (!isDeleting && charIdx === currentFullText.length) {
      timer = setTimeout(() => setIsDeleting(true), 2500); // Wait before backspacing
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setPhIdx((prev) => (prev + 1) % searchPlaceholders.length);
    }

    return () => clearTimeout(timer);
  }, [charIdx, isDeleting, phIdx]);

  // Interactive Panel C: Marketplace Bid animation state
  const [activeBidIdx, setActiveBidIdx] = useState(0);
  const mockBids = [
    { name: 'Omar Farooq (NUST)', amount: '1,800', rating: 4.9, sessions: 120, time: '3 mins ago' },
    { name: 'Sana Malik (LUMS)', amount: '2,000', rating: 4.8, sessions: 85, time: '1 min ago' },
    { name: 'Usman Tariq (FAST)', amount: '1,500', rating: 4.7, sessions: 64, time: 'Just now' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBidIdx((prev) => (prev + 1) % mockBids.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const [hiredBidId, setHiredBidId] = useState<string | null>(null);

  const handleHireTutor = (bidderName: string, id: string) => {
    setHiredBidId(id);
    setTerminalLogs((oldLogs) => [
      ...oldLogs.slice(1),
      { type: 'Tutor Match', text: `Hired verified peer tutor: ${bidderName}`, color: 'text-funky-orange dark:text-[#FF7A18]' }
    ]);
    setTimeout(() => {
      setHiredBidId(null);
    }, 4000);
  };

  // Terminal logging logic
  const [terminalLogs, setTerminalLogs] = useState<typeof baseSystemLogs>([]);
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    setTerminalLogs(baseSystemLogs.slice(0, 3));
    setLogIndex(3);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTerminalLogs((prev) => {
        const nextLog = baseSystemLogs[logIndex];
        const updated = [...prev.slice(1), nextLog];
        return updated;
      });
      setLogIndex((prev) => (prev + 1) % baseSystemLogs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [logIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FDFBF7] dark:bg-[#070310] transition-colors duration-500">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 75% 55% at 50% -5%, rgba(0,102,255,0.06) 0%, transparent 65%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 45% at 85% 85%, rgba(255,75,114,0.05) 0%, transparent 60%)' }} />
      </div>

      <HeroScene />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 102, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 102, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(circle at center, black, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 85%)'
        }}
      />

      <div className="relative z-10 section-container w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Hero Copy & Actions */}
          <motion.div 
            variants={ctr} 
            initial="hidden" 
            animate="show" 
            className="lg:col-span-5 flex flex-col justify-center text-left"
          >
            {/* Pulsing Ecosystem Badge */}
            <motion.div 
              variants={itm} 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dark/10 bg-white/60 dark:border-white/10 dark:bg-white/5 text-xs font-black uppercase tracking-[0.15em] text-[#0066FF] dark:text-[#2EF2FF] mb-6 w-fit cursor-default select-none shadow-sm"
            >
              <Sparkles size={14} className="text-funky-orange dark:text-funky-cyan animate-pulse" />
              <span>Pakistan&apos;s Premier University Network</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itm}
              className="font-display font-black tracking-tight mb-6 mt-2 text-[#0B071E] dark:text-white leading-[1.05]"
              style={{ fontSize: 'clamp(2.2rem, 4.2vw + 0.5rem, 3.8rem)' }}
            >
              Everything You Need For{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-funky-orange to-[#FF4B72] dark:from-[#2EF2FF] dark:to-[#0066FF] filter drop-shadow-[0_2px_10px_rgba(255,122,24,0.15)] dark:drop-shadow-none">
                University Success
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              variants={itm} 
              className="text-[#0B071E]/75 dark:text-white/75 text-base sm:text-lg leading-relaxed mb-8 font-semibold"
            >
              Access notes, past papers and study resources, connect with verified peer tutors, and explore universities across Pakistan — all from a single platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itm} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link 
                href="/signup" 
                className="btn-primary relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-display font-black text-sm text-dark transition-all duration-200 cursor-pointer overflow-hidden group w-full sm:w-auto text-center shadow-lg"
              >
                <Zap size={16} />
                Get Started Free
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/resources" className="btn-ghost px-8 py-4 text-sm w-full sm:w-auto text-center flex justify-center items-center gap-2 border border-dark/10 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 dark:text-white">
                <BookOpen size={16} className="text-[#0066FF] dark:text-funky-cyan" />
                Explore Resources
              </Link>
            </motion.div>

            {/* Compact Floating Metrics Cards */}
            <motion.div variants={itm} className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 sm:gap-4 mt-10 w-full">
              {dynamicStats.map(({ label, value, Icon, statColor, statBg }) => (
                <div 
                  key={label} 
                  className="glass-card p-3 sm:p-4 flex items-center gap-2 sm:gap-3 bg-white/70 dark:bg-[#110A20]/80 border border-dark/5 dark:border-white/5 shadow-sm hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${statColor} ${statBg}`}>
                    <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-base sm:text-lg font-bold text-[#0B071E] dark:text-white leading-tight truncate">{value}</div>
                    <div className="text-[#0B071E]/50 dark:text-white/50 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider truncate">{label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN: Connected Command Center Infographic Dashboard */}
          <div className="lg:col-span-7 w-full mt-6 lg:mt-0 relative overflow-visible flex flex-col items-center">
            
            {/* DESKTOP VIEW: Absolute SVG Command Center */}
            <div className="hidden lg:flex relative w-full h-[580px] items-center justify-center overflow-visible">
              <div className="relative w-full max-w-[560px] h-[520px] scale-[0.80] xs:scale-[0.85] sm:scale-90 md:scale-95 lg:scale-100 origin-center flex items-center justify-center overflow-visible">
              
              {/* SVG Glowing Flow Network Connectors */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 560 520" fill="none">
                <defs>
                  <linearGradient id="glow-cyan-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2EF2FF" />
                    <stop offset="100%" stopColor="#0066FF" />
                  </linearGradient>
                  <linearGradient id="glow-orange-coral" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF7A18" />
                    <stop offset="100%" stopColor="#FF5C7A" />
                  </linearGradient>
                  <linearGradient id="glow-lime-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D8FF3E" />
                    <stop offset="100%" stopColor="#2EF2FF" />
                  </linearGradient>
                  <linearGradient id="glow-orange-lime" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF7A18" />
                    <stop offset="100%" stopColor="#D8FF3E" />
                  </linearGradient>
                  <linearGradient id="glow-cyan-orange" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2EF2FF" />
                    <stop offset="100%" stopColor="#FF7A18" />
                  </linearGradient>
                </defs>

                {/* Base Connection Paths */}
                <path d="M 210 45 Q 140 60 125 110" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-[#0B071E]/8 dark:text-white/8" />
                <path d="M 350 45 Q 420 60 440 150" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-[#0B071E]/8 dark:text-white/8" />
                <path d="M 125 310 Q 130 380 180 420" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-[#0B071E]/8 dark:text-white/8" />
                <path d="M 440 340 Q 435 380 380 420" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-[#0B071E]/8 dark:text-white/8" />
                <path d="M 250 210 Q 285 227.5 320 245" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[#0B071E]/8 dark:text-white/8" />

                {/* Glowing Animated Dash Overlay Paths */}
                <motion.path
                  d="M 210 45 Q 140 60 125 110"
                  stroke="url(#glow-cyan-blue)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="10 25"
                  animate={{ strokeDashoffset: [0, -35] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                />
                <motion.path
                  d="M 350 45 Q 420 60 440 150"
                  stroke="url(#glow-orange-coral)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="10 25"
                  animate={{ strokeDashoffset: [0, -35] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                />
                <motion.path
                  d="M 125 310 Q 130 380 180 420"
                  stroke="url(#glow-lime-cyan)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="10 25"
                  animate={{ strokeDashoffset: [0, -35] }}
                  transition={{ repeat: Infinity, duration: 2.8, ease: "linear" }}
                />
                <motion.path
                  d="M 440 340 Q 435 380 380 420"
                  stroke="url(#glow-orange-lime)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="10 25"
                  animate={{ strokeDashoffset: [0, -35] }}
                  transition={{ repeat: Infinity, duration: 2.8, ease: "linear" }}
                />
                <motion.path
                  d="M 250 210 Q 285 227.5 320 245"
                  stroke="url(#glow-cyan-orange)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="8 20"
                  animate={{ strokeDashoffset: [0, -28] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />
              </svg>

              {/* ─────────────────────────────────────────────────────────────
                  PANE 1: Search Console (Top-Center)
                  ───────────────────────────────────────────────────────────── */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="absolute -top-4 left-1/2 -translate-x-1/2 w-[340px] z-30 pointer-events-auto block transition-all hover:scale-[1.03] select-none text-left"
                type="button"
              >
                <div className="glass-card p-3 rounded-2xl bg-white/80 dark:bg-[#110A20]/85 border border-dark/10 dark:border-white/10 shadow-lg hover:border-funky-blue/30 dark:hover:border-funky-cyan/30">
                  {/* Console Header */}
                  <div className="flex items-center justify-between border-b border-dark/5 dark:border-white/5 pb-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-funky-coral/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-funky-orange/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-funky-cyan/80" />
                    </div>
                    <span className="font-mono text-[10px] text-[#0B071E]/50 dark:text-[#2EF2FF] tracking-wider font-extrabold uppercase">
                      Campus Search
                    </span>
                    <div className="flex items-center gap-1 font-mono text-[8.5px] text-emerald-500 font-extrabold">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                      <span>LIVE</span>
                    </div>
                  </div>

                  {/* Simulated Search Input */}
                  <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-funky-blue dark:text-funky-cyan" />
                    <div className="w-full bg-white dark:bg-dark-900 border border-dark/10 dark:border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs font-bold text-[#0B071E] dark:text-white h-[32px] flex items-center shadow-inner">
                      <span className="truncate">{placeholderText}</span>
                      <span className="w-[1.5px] h-3 bg-funky-cyan dark:bg-[#2EF2FF] ml-0.5 animate-pulse shrink-0" />
                    </div>
                  </div>
                </div>
              </button>

              {/* ─────────────────────────────────────────────────────────────
                  PANE 2: Resource Vault Panel (Middle-Left)
                  ───────────────────────────────────────────────────────────── */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[110px] -left-4 w-[250px] z-20 pointer-events-auto"
              >
                {/* Floating dynamic resources badge */}
                <div className="absolute -top-3.5 -left-3.5 bg-funky-blue text-white dark:bg-[#0066FF] border border-dark/10 dark:border-white/10 px-2 py-0.5 rounded-lg text-[9.5px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md z-40 animate-pulse">
                  <Download size={8.5} /> {resCount} Solved File{resCount === 1 ? '' : 's'}
                </div>

                <div className="glass-card p-3 rounded-2xl bg-white/80 dark:bg-[#110A20]/85 border border-dark/10 dark:border-white/10 shadow-lg flex flex-col justify-between min-h-[190px]">
                  <div>
                    {/* Header */}
                    <Link 
                      href="/resources" 
                      className="flex items-center justify-between mb-2 pb-1 border-b border-dark/5 dark:border-white/5 group/hdr"
                    >
                      <span className="text-[10.5px] font-black text-funky-blue dark:text-[#2EF2FF] uppercase tracking-wider flex items-center gap-1 group-hover/hdr:underline">
                        <FileText size={11} className="transition-transform group-hover/hdr:scale-110" /> Resource Hub
                      </span>
                      <span className="text-[9px] text-[#0B071E]/40 dark:text-white/40 font-mono flex items-center gap-0.5 group-hover/hdr:text-funky-blue dark:group-hover/hdr:text-funky-cyan transition-colors">
                        Explore <ArrowRight size={10} />
                      </span>
                    </Link>

                    {/* Uni Tags Switches */}
                    <div className="flex gap-1.5 mb-2.5">
                      {(['NUST', 'FAST', 'LUMS'] as const).map((tag) => (
                        <button
                          key={tag}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTag(tag);
                          }}
                          className={`text-[10px] font-black px-2 py-0.5 rounded-lg border transition-all ${
                            selectedTag === tag
                              ? 'bg-funky-blue border-dark text-white shadow-md dark:border-white'
                              : 'bg-white dark:bg-[#1A0F30] border-dark/10 dark:border-white/10 text-[#0B071E]/60 dark:text-white/60 hover:border-dark/30 dark:hover:border-white/30'
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>

                    {/* Folder Files List */}
                    <div className="space-y-1.5">
                      {mockDocs[selectedTag].map((item, i) => {
                        const isDownloading = downloadingFile === item.name;
                        const isSuccess = downloadSuccessToast === item.name;

                        return (
                          <div
                            key={i}
                            onClick={() => handleDownloadDemo(item.name)}
                            className="flex items-center justify-between p-1.5 rounded-xl bg-white/90 dark:bg-[#0B071E]/55 border border-dark/5 dark:border-white/5 hover:border-funky-cyan/50 dark:hover:border-funky-cyan/40 transition-all cursor-pointer group"
                          >
                            <span className="text-xs font-bold text-[#0B071E] dark:text-white truncate max-w-[130px] flex items-center gap-1.5">
                              <FileText size={10} className="text-funky-blue dark:text-[#2EF2FF] shrink-0" />
                              {item.name}
                            </span>
                            
                            <button
                              disabled={!!downloadingFile}
                              className="text-[9px] font-extrabold text-funky-blue bg-funky-blue/10 dark:text-[#2EF2FF] dark:bg-[#2EF2FF]/10 border border-funky-blue/15 dark:border-[#2EF2FF]/15 px-1.5 py-0.5 rounded-lg flex items-center gap-0.5 transition-all group-hover:bg-[#0066FF] group-hover:text-white"
                            >
                              {isSuccess ? (
                                <CheckCircle size={8.5} className="text-emerald-500 fill-emerald-500/20" />
                              ) : isDownloading ? (
                                <span className="w-2.5 h-2.5 rounded-full border border-funky-blue border-t-transparent animate-spin" />
                              ) : (
                                <Download size={8.5} />
                              )}
                              <span>{isSuccess ? 'Saved' : item.dl}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Download Progress Bar */}
                  <div className="mt-2.5 h-[16px] shrink-0 relative">
                    <AnimatePresence mode="wait">
                      {downloadingFile ? (
                        <motion.div
                          key="progress"
                          initial={{ opacity: 0, y: 3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -3 }}
                          className="w-full flex flex-col gap-0.5"
                        >
                          <div className="flex items-center justify-between text-[8.5px] font-black text-funky-blue dark:text-[#2EF2FF] font-mono">
                            <span>Downloading...</span>
                            <span>{downloadProgress}%</span>
                          </div>
                          <div className="w-full h-1 bg-dark/5 dark:bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-funky-blue to-funky-cyan"
                              style={{ width: `${downloadProgress}%` }}
                            />
                          </div>
                        </motion.div>
                      ) : downloadSuccessToast ? (
                        <motion.div
                          key="toast"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="p-1 rounded bg-emerald-500 text-white text-xs font-black text-center shadow-lg flex items-center justify-center gap-1"
                        >
                          <CheckCircle size={9} /> File saved successfully!
                        </motion.div>
                      ) : (
                        <span className="text-[9px] text-[#0B071E]/40 dark:text-white/40 font-mono italic">
                          * Click file to test download demo
                        </span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              {/* ─────────────────────────────────────────────────────────────
                  PANE 3: Tutor Marketplace Panel (Middle-Right)
                  ───────────────────────────────────────────────────────────── */}
              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                className="absolute top-[140px] -right-4 w-[240px] z-20 pointer-events-auto"
              >
                {/* Floating dynamic verified tutors badge */}
                <div className="absolute -top-3.5 -right-3.5 bg-funky-orange text-white dark:bg-[#FF7A18] border border-dark/10 dark:border-white/10 px-2 py-0.5 rounded-lg text-[9.5px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md z-40 animate-pulse">
                  <Star size={8.5} className="fill-white" /> {(uniCount * 8 + resCount * 2).toLocaleString()}+ Tutors
                </div>

                <div className="glass-card p-3 rounded-2xl bg-white/80 dark:bg-[#110A20]/85 border border-dark/10 dark:border-white/10 shadow-lg flex flex-col justify-between min-h-[190px]">
                  <div>
                    {/* Header */}
                    <Link 
                      href="/marketplace" 
                      className="flex items-center justify-between mb-1.5 pb-1 border-b border-dark/5 dark:border-white/5 group/hdr"
                    >
                      <span className="text-[10.5px] font-black text-funky-orange dark:text-[#FF7A18] uppercase tracking-wider flex items-center gap-1 group-hover/hdr:underline">
                        <Users size={10} className="transition-transform group-hover/hdr:scale-110" /> Tutor Marketplace
                      </span>
                      <span className="text-[9px] text-[#0B071E]/40 dark:text-white/40 font-mono flex items-center gap-0.5 group-hover/hdr:text-funky-orange transition-colors">
                        Market <ArrowRight size={10} />
                      </span>
                    </Link>

                    {/* Active study request description */}
                    <div className="bg-dark/4 dark:bg-white/5 p-1.5 rounded-xl border border-dark/5 dark:border-white/5 mb-2">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[8.5px] font-black text-funky-orange font-mono">Live Study Request</span>
                        <span className="text-[8.5px] font-bold text-[#0B071E]/40 dark:text-white/40 flex items-center gap-0.5">
                          <Clock size={9} /> active
                        </span>
                      </div>
                      <p className="text-[10px] font-extrabold text-[#0B071E] dark:text-white leading-relaxed">
                        &quot;Need 1-on-1 prep for FAST Calculus II exam. Help!&quot;
                      </p>
                    </div>

                    {/* Live Bids Swapping Console */}
                    <div className="bg-white dark:bg-dark-900 border border-dark/5 dark:border-white/5 rounded-xl p-1.5 flex flex-col justify-center min-h-[46px]">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeBidIdx}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.3 }}
                          className="w-full flex items-center justify-between"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-tr from-funky-orange to-[#0066FF] flex items-center justify-center text-white font-extrabold text-[9px] shrink-0">
                              {mockBids[activeBidIdx].name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-black text-[#0B071E] dark:text-white truncate">
                                {mockBids[activeBidIdx].name.split(' ')[0]}
                              </div>
                              <div className="flex items-center gap-0.5 text-[8.5px] text-yellow-600 dark:text-yellow-400 font-bold">
                                <Star size={8} className="fill-current" />
                                {mockBids[activeBidIdx].rating} • {mockBids[activeBidIdx].sessions} sessions
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-black text-funky-orange dark:text-[#FF7A18]">
                              PKR {mockBids[activeBidIdx].amount}
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Hire Button */}
                  <div className="mt-2 shrink-0">
                    <button
                      onClick={() => handleHireTutor(mockBids[activeBidIdx].name, activeBidIdx.toString())}
                      className={`w-full py-1.5 rounded-lg text-xs font-black border transition-all flex items-center justify-center gap-1 ${
                        hiredBidId === activeBidIdx.toString()
                          ? 'bg-emerald-500 text-white border-emerald-600 pointer-events-none'
                          : 'bg-[#FF7A18] hover:bg-orange-500 border-dark dark:border-white text-white shadow-md active:translate-y-0.5'
                      }`}
                    >
                      {hiredBidId === activeBidIdx.toString() ? (
                        <>
                          <CheckCircle size={10} /> Tutor Hired!
                        </>
                      ) : (
                        <>
                          <Zap size={10} /> Hire Tutor (PKR {mockBids[activeBidIdx].amount})
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* ─────────────────────────────────────────────────────────────
                  PANE 4: University Explorer Panel (Bottom-Center)
                  ───────────────────────────────────────────────────────────── */}
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[310px] z-30 pointer-events-auto"
              >
                {/* Floating deadline alert badge */}
                <div className="absolute -top-3.5 -right-2 bg-funky-orange text-white dark:bg-[#FF7A18] border border-dark/10 dark:border-white/10 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5 shadow-md z-40 animate-pulse">
                  <ShieldAlert size={8.5} /> FAST Admissions Open
                </div>

                <div className="glass-card p-3 rounded-2xl bg-white/80 dark:bg-[#110A20]/85 border border-dark/10 dark:border-white/10 shadow-lg flex flex-col justify-between min-h-[125px]">
                  <div>
                    {/* Header */}
                    <Link 
                      href="/universities" 
                      className="flex items-center justify-between mb-1.5 pb-1 border-b border-dark/5 dark:border-white/5 group/hdr"
                    >
                      <span className="text-[10.5px] font-black text-[#15803D] dark:text-[#D8FF3E] uppercase tracking-wider flex items-center gap-1 group-hover/hdr:underline">
                        <GraduationCap size={10} className="transition-transform group-hover/hdr:scale-110" /> University Explorer
                      </span>
                      <span className="text-[9px] text-[#0B071E]/40 dark:text-white/40 font-mono flex items-center gap-0.5 group-hover/hdr:text-[#15803D] dark:group-hover/hdr:text-[#D8FF3E] transition-colors">
                        Browse <ArrowRight size={10} />
                      </span>
                    </Link>

                    {/* Side by side Admissions comparison list */}
                    <div className="space-y-1">
                      {[
                        { name: 'NUST', fee: '185k/sem', deadline: 'Aug 31', status: 'Open' },
                        { name: 'FAST-NU', fee: '162k/sem', deadline: 'July 15', status: 'Closing' },
                      ].map((uni, idx) => (
                        <div
                          key={idx}
                          className="p-1.5 rounded-xl bg-white/90 dark:bg-[#0B071E]/55 border border-dark/5 dark:border-white/5 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-5.5 h-5.5 rounded-lg bg-[#DCFCE7] dark:bg-[#D8FF3E]/10 flex items-center justify-center text-[9.5px] font-black text-[#15803D] dark:text-[#D8FF3E] shrink-0">
                              {uni.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="text-[11px] font-black text-[#0B071E] dark:text-white truncate">
                                {uni.name}
                              </div>
                              <div className="text-[9px] text-text-muted dark:text-white/45 font-semibold">
                                Deadline: {uni.deadline}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right shrink-0 flex flex-col items-end">
                            <div className="font-extrabold text-[#0B071E] dark:text-white text-[11px]">PKR {uni.fee}</div>
                            <span className={`text-[8.5px] font-black uppercase px-1 rounded-sm ${
                              uni.status === 'Closing' 
                                ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 animate-pulse' 
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                            }`}>
                              {uni.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ─────────────────────────────────────────────────────────────
                  Live Campus Pulse Terminal Footer (Unified Ecosystem Monitor)
                  ───────────────────────────────────────────────────────────── */}
              <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[340px] z-30 pointer-events-auto">
                <div className="bg-[#0B071E]/90 dark:bg-dark-900 border border-dark/15 dark:border-white/10 rounded-2xl p-2.5 font-mono text-[10px] leading-normal h-[85px] flex flex-col justify-between overflow-hidden shadow-2xl">
                  {/* Title Bar */}
                  <div className="text-funky-cyan dark:text-[#2EF2FF] font-extrabold uppercase mb-1 flex items-center gap-1.5 tracking-wider shrink-0 border-b border-white/5 pb-1 text-[10.5px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2EF2FF] shrink-0 animate-pulse" />
                    <span>Live Campus Pulse</span>
                  </div>

                  {/* Log stream items */}
                  <div className="space-y-1.5 overflow-hidden flex-1 flex flex-col justify-end">
                    {terminalLogs.map((log, idx) => (
                      <motion.div
                        key={idx + '-' + log.text}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-1.5 min-w-0 shrink-0 text-[10px]"
                      >
                        <span className={`${log.color} font-black uppercase shrink-0`}>
                          [{log.type}]
                        </span>
                        <span className="text-white/80 truncate font-medium leading-tight">
                          {log.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              </div>
            </div>

            {/* MOBILE VIEW: Interactive Tabbed Console */}
            <div className="lg:hidden w-full max-w-[460px] mx-auto relative z-20 mt-6 px-2">
              <div className="glass-card p-5 rounded-3xl bg-white/95 dark:bg-[#110A20]/95 border border-dark/10 dark:border-white/10 shadow-xl flex flex-col min-h-[350px] justify-between">
                
                {/* Tabs selector */}
                <div className="flex gap-2 overflow-x-auto pb-3 border-b border-dark/5 dark:border-white/5 scrollbar-none select-none">
                  {[
                    { id: 'search', label: 'Search', icon: Search, color: 'text-funky-blue dark:text-[#2EF2FF]' },
                    { id: 'resources', label: 'Vault', icon: FileText, color: 'text-funky-blue dark:text-[#2EF2FF]' },
                    { id: 'tutors', label: 'Tutors', icon: Users, color: 'text-funky-orange dark:text-[#FF7A18]' },
                    { id: 'unis', label: 'Unis', icon: GraduationCap, color: 'text-[#15803D] dark:text-[#D8FF3E]' },
                    { id: 'pulse', label: 'Pulse', icon: Clock, color: 'text-funky-coral dark:text-[#FF5C7A]' }
                  ].map((tab) => {
                    const TabIcon = tab.icon;
                    const isTabActive = activeMobileTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveMobileTab(tab.id as any)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 border ${
                          isTabActive
                            ? 'bg-dark text-white border-dark dark:bg-white/10 dark:border-white/20'
                            : 'bg-white/50 border-dark/5 dark:border-white/5 text-dark/60 dark:text-white/60 hover:bg-white dark:hover:bg-white/5'
                        }`}
                        type="button"
                      >
                        <TabIcon size={12} className={tab.color} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tab content */}
                <div className="py-4 flex-1 flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {activeMobileTab === 'search' && (
                      <motion.div
                        key="tab-search"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-funky-blue dark:text-[#2EF2FF] font-black uppercase tracking-wider">Campus Search</span>
                          <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> LIVE INDEX
                          </span>
                        </div>
                        <button 
                          onClick={() => setIsSearchOpen(true)}
                          className="block relative w-full text-left"
                          type="button"
                        >
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-funky-blue dark:text-[#2EF2FF]" />
                          <div className="w-full bg-white dark:bg-dark-900 border border-dark/10 dark:border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-[#0B071E] dark:text-white h-[36px] flex items-center shadow-inner">
                            <span className="truncate">{placeholderText}</span>
                            <span className="w-[1.5px] h-3.5 bg-funky-cyan dark:bg-[#2EF2FF] ml-0.5 animate-pulse" />
                          </div>
                        </button>
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {['#NUST', '#FAST', '#DSA', '#Calculus'].map(chip => (
                            <button
                              key={chip}
                              onClick={() => {
                                setTerminalLogs((oldLogs) => [
                                  ...oldLogs.slice(1),
                                  { type: 'Resource', text: `Demo Student searched for ${chip}`, color: 'text-funky-blue dark:text-[#4D90FF]' }
                                ]);
                              }}
                              className="text-[10px] font-bold px-2 py-1 rounded-lg bg-dark/5 dark:bg-white/5 border border-dark/5 dark:border-white/5 text-dark/70 dark:text-white/70 hover:border-funky-blue/30"
                              type="button"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeMobileTab === 'resources' && (
                      <motion.div
                        key="tab-resources"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3"
                      >
                        <Link href="/resources" className="flex items-center justify-between group/hdr">
                          <span className="text-xs font-black text-funky-blue dark:text-[#2EF2FF] uppercase tracking-wider flex items-center gap-1.5 group-hover/hdr:underline">
                            <FileText size={12} className="transition-transform group-hover/hdr:scale-110" /> Resource Hub
                          </span>
                          <span className="text-[9px] bg-funky-blue text-white px-2 py-0.5 rounded font-black uppercase flex items-center gap-0.5 group-hover/hdr:bg-funky-blue/80 transition-colors">
                            Explore <ArrowRight size={8} />
                          </span>
                        </Link>
                        
                        <div className="flex gap-1.5">
                          {(['NUST', 'FAST', 'LUMS'] as const).map((tag) => (
                            <button
                              key={tag}
                              onClick={() => setSelectedTag(tag)}
                              className={`text-[10px] font-black px-2.5 py-1 rounded-lg border transition-all ${
                                selectedTag === tag
                                  ? 'bg-funky-blue border-dark text-white dark:border-white'
                                  : 'bg-white dark:bg-[#1A0F30] border-dark/10 dark:border-white/10 text-[#0B071E]/60 dark:text-white/60'
                              }`}
                              type="button"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>

                        <div className="space-y-1.5">
                          {mockDocs[selectedTag].map((item, i) => {
                            const isDownloading = downloadingFile === item.name;
                            const isSuccess = downloadSuccessToast === item.name;

                            return (
                              <div
                                key={i}
                                onClick={() => handleDownloadDemo(item.name)}
                                className="flex items-center justify-between p-2 rounded-xl bg-white/90 dark:bg-[#0B071E]/55 border border-dark/5 dark:border-white/5 hover:border-funky-cyan/50 transition-all cursor-pointer"
                              >
                                <span className="text-xs font-bold text-[#0B071E] dark:text-white truncate max-w-[170px] flex items-center gap-1.5">
                                  <FileText size={11} className="text-funky-blue dark:text-[#2EF2FF]" />
                                  {item.name}
                                </span>
                                <button
                                  disabled={!!downloadingFile}
                                  className="text-[9px] font-extrabold text-funky-blue bg-funky-blue/10 dark:text-[#2EF2FF] dark:bg-[#2EF2FF]/10 px-2 py-0.5 rounded-lg flex items-center gap-0.5"
                                  type="button"
                                >
                                  {isSuccess ? <CheckCircle size={8.5} className="text-emerald-500" /> : <Download size={8.5} />}
                                  <span>{isSuccess ? 'Saved' : item.dl}</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        <div className="h-[16px] relative mt-1">
                          {downloadingFile ? (
                            <div className="w-full flex flex-col gap-0.5">
                              <div className="flex items-center justify-between text-[8.5px] font-black text-funky-blue dark:text-[#2EF2FF] font-mono">
                                <span>Downloading...</span>
                                <span>{downloadProgress}%</span>
                              </div>
                              <div className="w-full h-1 bg-dark/5 dark:bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-funky-blue to-funky-cyan" style={{ width: `${downloadProgress}%` }} />
                              </div>
                            </div>
                          ) : downloadSuccessToast ? (
                            <div className="p-1 rounded bg-emerald-500 text-white text-[10px] font-black text-center shadow-md flex items-center justify-center gap-1">
                              <CheckCircle size={9} /> File saved successfully!
                            </div>
                          ) : (
                            <span className="text-[9px] text-[#0B071E]/40 dark:text-white/40 font-mono italic">
                              * Tap a file to test download demo
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {activeMobileTab === 'tutors' && (
                      <motion.div
                        key="tab-tutors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3"
                      >
                        <Link href="/marketplace" className="flex items-center justify-between group/hdr">
                          <span className="text-xs font-black text-funky-orange dark:text-[#FF7A18] uppercase tracking-wider flex items-center gap-1.5 group-hover/hdr:underline">
                            <Users size={12} className="transition-transform group-hover/hdr:scale-110" /> Tutor Marketplace
                          </span>
                          <span className="text-[9px] bg-funky-orange text-white px-2 py-0.5 rounded font-black uppercase flex items-center gap-0.5 group-hover/hdr:bg-funky-orange/80 transition-colors">
                            Market <ArrowRight size={8} />
                          </span>
                        </Link>

                        <div className="bg-dark/4 dark:bg-white/5 p-2 rounded-xl border border-dark/5 dark:border-white/5">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[8.5px] font-black text-funky-orange font-mono">Study Help Needed</span>
                            <span className="text-[8px] font-bold text-emerald-500 flex items-center gap-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> active
                            </span>
                          </div>
                          <p className="text-xs font-extrabold text-[#0B071E] dark:text-white">
                            &quot;Need 1-on-1 prep for FAST Calculus II exam. Help!&quot;
                          </p>
                        </div>

                        <div className="bg-white dark:bg-dark-900 border border-dark/5 dark:border-white/5 rounded-xl p-2 flex items-center justify-between min-h-[46px]">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-funky-orange to-[#0066FF] flex items-center justify-center text-white font-extrabold text-[10px] shrink-0">
                              {mockBids[activeBidIdx].name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-black text-[#0B071E] dark:text-white truncate">
                                {mockBids[activeBidIdx].name}
                              </div>
                              <div className="flex items-center gap-0.5 text-[8.5px] text-yellow-600 dark:text-yellow-400 font-bold">
                                <Star size={8} className="fill-current" />
                                {mockBids[activeBidIdx].rating} • {mockBids[activeBidIdx].sessions} sessions
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-black text-funky-orange dark:text-[#FF7A18]">
                              PKR {mockBids[activeBidIdx].amount}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleHireTutor(mockBids[activeBidIdx].name, activeBidIdx.toString())}
                          className={`w-full py-2 rounded-xl text-xs font-black border transition-all flex items-center justify-center gap-1 ${
                            hiredBidId === activeBidIdx.toString()
                              ? 'bg-emerald-500 text-white border-emerald-600 pointer-events-none'
                              : 'bg-[#FF7A18] hover:bg-orange-500 border-dark dark:border-white text-white shadow-md active:translate-y-0.5'
                          }`}
                          type="button"
                        >
                          {hiredBidId === activeBidIdx.toString() ? (
                            <>
                              <CheckCircle size={10} /> Tutor Hired!
                            </>
                          ) : (
                            <>
                              <Zap size={10} /> Hire Tutor (PKR {mockBids[activeBidIdx].amount})
                            </>
                          )}
                        </button>
                      </motion.div>
                    )}

                    {activeMobileTab === 'unis' && (
                      <motion.div
                        key="tab-unis"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3"
                      >
                        <Link href="/universities" className="flex items-center justify-between group/hdr">
                          <span className="text-xs font-black text-[#15803D] dark:text-[#D8FF3E] uppercase tracking-wider flex items-center gap-1.5 group-hover/hdr:underline">
                            <GraduationCap size={12} className="transition-transform group-hover/hdr:scale-110" /> University Explorer
                          </span>
                          <span className="text-[9px] text-[#15803D] dark:text-[#D8FF3E] font-mono flex items-center gap-0.5 group-hover/hdr:text-[#15803D]/80 transition-colors">
                            Browse <ArrowRight size={8} />
                          </span>
                        </Link>

                        <div className="space-y-1.5">
                          {[
                            { name: 'NUST', fee: '185k/sem', deadline: 'Aug 31', status: 'Open' },
                            { name: 'FAST-NU', fee: '162k/sem', deadline: 'July 15', status: 'Closing' },
                          ].map((uni, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded-xl bg-white/90 dark:bg-[#0B071E]/55 border border-dark/5 dark:border-white/5 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-6 h-6 rounded-lg bg-[#DCFCE7] dark:bg-[#D8FF3E]/10 flex items-center justify-center text-[10px] font-black text-[#15803D] dark:text-[#D8FF3E] shrink-0">
                                  {uni.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-black text-[#0B071E] dark:text-white">
                                    {uni.name}
                                  </div>
                                  <div className="text-[9px] text-text-muted dark:text-white/45 font-semibold">
                                    Deadline: {uni.deadline}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right shrink-0 flex flex-col items-end">
                                <div className="font-extrabold text-[#0B071E] dark:text-white text-xs">PKR {uni.fee}</div>
                                <span className={`text-[8px] font-black uppercase px-1 rounded-sm ${
                                  uni.status === 'Closing' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {uni.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeMobileTab === 'pulse' && (
                      <motion.div
                        key="tab-pulse"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-2.5"
                      >
                        <div className="flex items-center justify-between pb-1 border-b border-dark/5 dark:border-white/5">
                          <span className="text-xs font-black text-funky-coral dark:text-[#FF5C7A] uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-funky-coral shrink-0 animate-pulse" /> Live Campus Pulse
                          </span>
                          <span className="text-[9px] text-[#0B071E]/40 dark:text-white/40 font-mono">Ecosystem logs</span>
                        </div>

                        <div className="bg-[#0B071E]/95 dark:bg-dark-900 border border-dark/15 dark:border-white/10 rounded-xl p-3 font-mono text-[9.5px] leading-relaxed h-[110px] flex flex-col justify-end overflow-hidden shadow-inner">
                          <div className="space-y-1.5">
                            {terminalLogs.map((log, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 min-w-0 shrink-0">
                                <span className={`${log.color} font-black uppercase shrink-0`}>
                                  [{log.type}]
                                </span>
                                <span className="text-white/80 truncate font-medium">
                                  {log.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile console status info */}
                <div className="pt-2.5 border-t border-dark/5 dark:border-white/5 flex justify-between items-center text-[9px] font-bold text-[#0B071E]/40 dark:text-white/40 uppercase tracking-widest font-mono select-none">
                  <span>System: Online</span>
                  <span>Vibe check: 100%</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <GlobalSearchModal onClose={() => setIsSearchOpen(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function GlobalSearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'resources' | 'unis' | 'tutors' | 'guides'>('all');

  // Autofocus input and manage backdrop scroll lock
  useEffect(() => {
    const input = document.getElementById('global-search-input');
    if (input) {
      input.focus();
    }
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const getFilteredResults = () => {
    if (!query.trim()) return [];
    const term = query.toLowerCase();

    const results: Array<{
      type: 'resource' | 'university' | 'tutor' | 'guide';
      id: string;
      title: string;
      subtitle: string;
      url: string;
      tags?: string[];
      meta?: string;
    }> = [];

    // 1. Resources
    resources.forEach((res) => {
      if (
        res.title.toLowerCase().includes(term) ||
        res.course.toLowerCase().includes(term) ||
        res.instructor.toLowerCase().includes(term) ||
        res.university.toLowerCase().includes(term) ||
        res.degree.toLowerCase().includes(term) ||
        res.tags.some((t) => t.toLowerCase().includes(term))
      ) {
        results.push({
          type: 'resource',
          id: res.id,
          title: res.title,
          subtitle: `${res.university} • ${res.course} • ${res.type}`,
          url: `/resources?search=true&query=${encodeURIComponent(res.title)}`,
          tags: res.tags,
          meta: res.fileSize,
        });
      }
    });

    // 2. Universities
    universities.forEach((uni) => {
      if (
        uni.name.toLowerCase().includes(term) ||
        uni.shortName.toLowerCase().includes(term) ||
        uni.city.toLowerCase().includes(term) ||
        uni.tags.some((t) => t.toLowerCase().includes(term))
      ) {
        results.push({
          type: 'university',
          id: uni.id,
          title: uni.name,
          subtitle: `${uni.shortName} • ${uni.city} • Rank #${uni.ranking}`,
          url: `/universities/${uni.id}`,
          tags: uni.tags,
          meta: uni.admissionOpen ? 'Admissions Open' : 'Closed',
        });
      }
    });

    // 3. Tutors
    tutorProfiles.forEach((tutor) => {
      if (
        tutor.name.toLowerCase().includes(term) ||
        tutor.expertise.some((e) => e.toLowerCase().includes(term)) ||
        tutor.university.toLowerCase().includes(term) ||
        tutor.degree.toLowerCase().includes(term)
      ) {
        results.push({
          type: 'tutor',
          id: tutor.id,
          title: tutor.name,
          subtitle: `${tutor.university} • ${tutor.degree} • ${tutor.expertise.join(', ')}`,
          url: `/marketplace?query=${encodeURIComponent(tutor.name)}`,
          tags: tutor.expertise,
          meta: `PKR ${tutor.hourlyRate}/hr`,
        });
      }
    });

    // 4. Insider Guides
    const STATIC_GUIDES = [
      { id: 'nust-admission-guide-net-prep-eligibility', title: 'The Ultimate NUST Admission Guide: NET Prep & Eligibility', category: 'Admission Guides', excerpt: 'Detailed walkthrough on acing the NUST Entry Test, aggregate calculations, and admission requirements.' },
      { id: 'fast-nu-surviving-guide-dos-donts-freshmen', title: 'FAST-NU Surviving Guide: Do\'s and Don\'ts for Freshmen', category: 'Do\'s & Don\'ts', excerpt: 'How to survive the strict academic environment, maintain a high GPA, and navigate university life at FAST.' },
      { id: 'higher-education-scholarships-pakistan-hec-need-based', title: 'Higher Education Scholarships in Pakistan: HEC & Need-Based Guides', category: 'Scholarships', excerpt: 'Learn how to apply for fully funded HEC, USAID, and need-based scholarships at top universities.' },
      { id: 'university-application-deadlines-cheat-sheet-fall-2026', title: 'University Application Deadlines Cheat Sheet (Fall 2026)', category: 'Deadlines', excerpt: 'Track key registration timelines, entry test dates, and deadline details for LUMS, FAST, NUST, IBA, and AKU.' },
      { id: 'mastering-exam-prep-midterms-finals', title: 'Mastering Exam Prep: How to Ace University Midterms & Finals', category: 'Exam Sessions', excerpt: 'Proven study methods, note-taking strategies, and past paper prep tips for exam sessions.' }
    ];

    STATIC_GUIDES.forEach((guide) => {
      if (
        guide.title.toLowerCase().includes(term) ||
        guide.category.toLowerCase().includes(term) ||
        guide.excerpt.toLowerCase().includes(term)
      ) {
        results.push({
          type: 'guide',
          id: guide.id,
          title: guide.title,
          subtitle: `YOUR INSIDER Guide • ${guide.category}`,
          url: `/blog/${guide.id}`,
          meta: 'Guide',
        });
      }
    });

    // Filter by tab
    if (activeTab === 'all') return results;
    if (activeTab === 'resources') return results.filter((r) => r.type === 'resource');
    if (activeTab === 'unis') return results.filter((r) => r.type === 'university');
    if (activeTab === 'tutors') return results.filter((r) => r.type === 'tutor');
    if (activeTab === 'guides') return results.filter((r) => r.type === 'guide');

    return results;
  };

  const results = getFilteredResults();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      onClick={handleBackdropClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto pt-[10vh] md:pt-[12vh]"
    >
      <motion.div
        initial={{ scale: 0.95, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: -20 }}
        className="w-full max-w-2xl bg-white/95 dark:bg-[#110A20]/95 border border-dark/10 dark:border-white/10 shadow-2xl rounded-3xl p-5 md:p-6 overflow-hidden flex flex-col max-h-[75vh]"
      >
        {/* Search Input Area */}
        <div className="relative flex items-center border-b border-dark/10 dark:border-white/10 pb-4 shrink-0">
          <Search size={20} className="absolute left-1 text-funky-blue dark:text-[#2EF2FF]" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search resources, tutors, universities, insider guides..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent pl-9 pr-8 text-base font-bold text-[#0B071E] dark:text-white border-0 focus:ring-0 placeholder-dark/30 dark:placeholder-white/30 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-10 p-1 text-[#0B071E]/40 dark:text-white/40 hover:bg-dark/5 dark:hover:bg-white/5 rounded-full transition-colors"
            >
              <X size={14} />
            </button>
          )}
          <button
            onClick={onClose}
            className="absolute right-0 p-1.5 text-xs font-mono font-bold bg-dark/5 dark:bg-white/5 border border-dark/10 dark:border-white/10 hover:bg-dark/10 dark:hover:bg-white/10 rounded-lg text-dark/70 dark:text-white/70 transition-colors uppercase shrink-0"
          >
            Esc
          </button>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex gap-2 overflow-x-auto py-3 border-b border-dark/5 dark:border-white/5 scrollbar-none select-none shrink-0">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'resources', label: 'Resources' },
            { id: 'unis', label: 'Universities' },
            { id: 'tutors', label: 'Tutors' },
            { id: 'guides', label: 'Insider Guides' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-dark border-dark text-white dark:bg-white/10 dark:border-white/20'
                  : 'bg-white/50 dark:bg-transparent border-dark/5 dark:border-white/5 text-dark/60 dark:text-white/60 hover:bg-dark/5 dark:hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto py-3 pr-1 scrollbar-thin scrollbar-thumb-dark/10 dark:scrollbar-thumb-white/10">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-[#0B071E]/50 dark:text-white/50">
              <Search size={32} className="mx-auto mb-3 text-dark/20 dark:text-white/20" />
              <p className="text-sm font-bold">Type to search the entire campus synapse...</p>
              <p className="text-xs mt-1">Try searching for &apos;NUST&apos;, &apos;Calculus&apos;, &apos;FAST&apos;, or &apos;DSA&apos;</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-[#0B071E]/50 dark:text-white/50">
              <p className="text-sm font-black">No matches found for &quot;{query}&quot;</p>
              <p className="text-xs mt-1">Check spelling or try a different search query</p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((res) => {
                let badgeColor = 'bg-funky-blue/10 text-funky-blue border-funky-blue/20';
                let icon = <FileText size={16} />;
                if (res.type === 'university') {
                  badgeColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
                  icon = <GraduationCap size={16} />;
                } else if (res.type === 'tutor') {
                  badgeColor = 'bg-funky-orange/10 text-funky-orange border-funky-orange/20';
                  icon = <Users size={16} />;
                } else if (res.type === 'guide') {
                  badgeColor = 'bg-[#FF5C7A]/10 text-[#FF5C7A] border-[#FF5C7A]/20';
                  icon = <BookOpen size={16} />;
                }

                return (
                  <Link
                    key={`${res.type}-${res.id}`}
                    href={res.url}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-2xl bg-dark/4 hover:bg-dark/8 dark:bg-white/5 dark:hover:bg-white/10 border border-dark/5 dark:border-white/5 transition-all group/item"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${badgeColor}`}>
                        {icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-black text-[#0B071E] dark:text-white truncate group-hover/item:text-[#0066FF] dark:group-hover/item:text-[#2EF2FF] transition-colors">
                          {res.title}
                        </div>
                        <div className="text-xs text-[#0B071E]/50 dark:text-white/40 font-semibold truncate">
                          {res.subtitle}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {res.meta && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-dark/5 dark:bg-white/5 text-dark/60 dark:text-white/60 uppercase">
                          {res.meta}
                        </span>
                      )}
                      <ArrowRight size={14} className="text-dark/20 dark:text-white/20 group-hover/item:text-dark dark:group-hover/item:text-white transition-all transform group-hover/item:translate-x-0.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
