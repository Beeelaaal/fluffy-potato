'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, GraduationCap, Download, Star, 
  ArrowRight, FileText, Sparkles, Clock, ShieldAlert
} from 'lucide-react';

export default function FeaturesSection() {
  const [hoveredOrbit, setHoveredOrbit] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // University comparison guidelines for the 5 universities
  const uniDetails = {
    NUST: { 
      name: 'NUST Islamabad', 
      fee: 'PKR 185,000/sem', 
      deadline: 'Aug 31', 
      merit: '78.5%', 
      logo: '/logos/nust.png', 
      color: '#FFB800', 
      bg: 'rgba(255, 184, 0, 0.08)',
      border: 'rgba(255, 184, 0, 0.25)',
      hoverBorder: '#FFB800',
      badgeBg: 'bg-[#FEF3C7] text-[#D97706] dark:bg-[#D97706]/10 dark:text-[#FFB800]'
    },
    FAST: { 
      name: 'FAST-NUCES', 
      fee: 'PKR 162,000/sem', 
      deadline: 'July 15', 
      merit: '72.0%', 
      logo: '/logos/fast.png', 
      color: '#2EF2FF', 
      bg: 'rgba(46, 242, 255, 0.08)',
      border: 'rgba(46, 242, 255, 0.25)',
      hoverBorder: '#2EF2FF',
      badgeBg: 'bg-[#E0F2FE] text-[#0369A1] dark:bg-[#0066FF]/10 dark:text-[#2EF2FF]'
    },
    LUMS: { 
      name: 'LUMS Lahore', 
      fee: 'PKR 480,000/sem', 
      deadline: 'June 30', 
      merit: '85.0%', 
      logo: '/logos/lums.svg', 
      color: '#D8FF3E', 
      bg: 'rgba(216, 255, 62, 0.08)',
      border: 'rgba(216, 255, 62, 0.25)',
      hoverBorder: '#D8FF3E',
      badgeBg: 'bg-[#DCFCE7] text-[#15803D] dark:bg-[#15803D]/10 dark:text-[#D8FF3E]'
    },
    IBA: { 
      name: 'IBA Karachi', 
      fee: 'PKR 350,000/sem', 
      deadline: 'July 5', 
      merit: '76.0%', 
      logo: '/logos/iba.png', 
      color: '#FF7A18', 
      bg: 'rgba(255, 122, 24, 0.08)',
      border: 'rgba(255, 122, 24, 0.25)',
      hoverBorder: '#FF7A18',
      badgeBg: 'bg-[#FFEDD5] text-[#C2410C] dark:bg-[#FF7A18]/10 dark:text-[#FF7A18]'
    },
    AKU: { 
      name: 'Aga Khan University', 
      fee: 'PKR 620,000/sem', 
      deadline: 'May 15', 
      merit: '88.0%', 
      logo: '/logos/aku.png', 
      color: '#FF5C7A', 
      bg: 'rgba(255, 92, 122, 0.08)',
      border: 'rgba(255, 92, 122, 0.25)',
      hoverBorder: '#FF5C7A',
      badgeBg: 'bg-[#FCE7F3] text-[#BE185D] dark:bg-[#FF5C7A]/10 dark:text-[#FF5C7A]'
    },
  };

  return (
    <section className="py-28 relative overflow-hidden bg-[#FDFBF7] dark:bg-[#070310] transition-colors duration-500" id="features">
      
      {/* Custom Keyframe Animations for Orbits & Glowing Laser Beacons */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes orbit-rotate-inner {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-counter-inner {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes orbit-rotate-outer {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes orbit-counter-outer {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes laser-flow {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -36; }
        }
        @keyframes micro-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-orbit-inner {
          animation: orbit-rotate-inner 40s linear infinite;
        }
        .animate-counter-inner {
          animation: orbit-counter-inner 40s linear infinite;
        }
        .animate-orbit-outer {
          animation: orbit-rotate-outer 55s linear infinite;
        }
        .animate-counter-outer {
          animation: orbit-counter-outer 55s linear infinite;
        }
        .animate-laser-flow {
          animation: laser-flow 1.2s linear infinite;
        }
        .animate-micro-spin {
          animation: micro-spin 10s linear infinite;
        }
        .pause-orbit {
          animation-play-state: paused !important;
        }
      `}} />

      {/* Cosmic background glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#0066FF]/5 dark:bg-[#0066FF]/3 blur-[130px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#FF7A18]/4 dark:bg-[#FF7A18]/2 blur-[110px] rounded-full" />
      </div>

      <div className="section-container relative z-10">
        
        {/* Gen Z Prefeered Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dark/10 bg-white/60 dark:border-white/10 dark:bg-white/5 text-xs font-black uppercase tracking-[0.15em] text-[#0066FF] dark:text-[#2EF2FF] mb-5 shadow-sm">
            <Sparkles size={14} className="text-funky-orange dark:text-funky-cyan animate-pulse" />
            <span>⚡ Aura Core // The Campus Synapse</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl tracking-tight mb-5 text-[#0B071E] dark:text-white leading-[1.05]">
            All your academic vibes, <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-funky-orange to-[#FF4B72] dark:from-[#2EF2FF] dark:to-[#0066FF]">connected.</span>
          </h2>
          <p className="text-[#0B071E]/75 dark:text-white/75 text-base sm:text-lg font-semibold leading-relaxed">
            teleport directly to university guides and verified resources. hover to trace the neon energy pathways.
          </p>
        </div>

        {/* ─── THE AURA CORE CONSTELLATION ─── */}
        <div className="relative w-full h-[650px] flex items-center justify-center overflow-visible scale-[0.6] xs:scale-[0.72] sm:scale-[0.85] md:scale-100 origin-center my-6">
          
          {/* Orbital path guides */}
          <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-funky-blue/20 dark:border-[#2EF2FF]/10 pointer-events-none z-10" />
          <div className="absolute w-[560px] h-[560px] rounded-full border border-dashed border-[#15803D]/25 dark:border-[#D8FF3E]/10 pointer-events-none z-10" />

          {/* ─────────────────────────────────────────────────────────────
              CENTRAL GRAVITY STUDENT CORE (AURA CORE)
              ───────────────────────────────────────────────────────────── */}
          <div className="relative z-30 flex items-center justify-center w-44 h-44">
            {/* Outer rotating scanner ring with ticks */}
            <svg 
              className="absolute w-44 h-44 animate-orbit-outer pointer-events-none" 
              style={{ animationDuration: '30s' }} 
              viewBox="0 0 100 100"
            >
              <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" className="text-funky-blue/20 dark:text-[#2EF2FF]/20" strokeWidth="0.8" strokeDasharray="2 4" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-funky-blue/15 dark:text-[#2EF2FF]/15" strokeWidth="1" strokeDasharray="15 3" />
            </svg>
            
            {/* Pulsing halo */}
            <div className="absolute inset-0 rounded-full bg-funky-blue/5 border border-funky-blue/10 dark:bg-[#2EF2FF]/5 dark:border-[#2EF2FF]/10 animate-ping pointer-events-none" style={{ animationDuration: '4s' }} />

            {/* Core sphere card */}
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-white/95 to-white/80 dark:from-[#110A20]/95 dark:to-[#1a1230]/80 border-2 border-dark/15 dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_rgba(46,242,255,0.08)] flex flex-col items-center justify-center text-center p-3 cursor-default select-none backdrop-blur-xl relative">
              <div className="absolute inset-0 rounded-full bg-funky-blue/10 dark:bg-[#2EF2FF]/5 blur-md animate-pulse" />
              <Sparkles size={28} className="text-funky-blue dark:text-[#2EF2FF] animate-pulse mb-1 relative z-10" />
              <div className="font-display text-sm font-black uppercase text-[#0B071E] dark:text-white tracking-[0.2em] leading-none relative z-10">
                Aura
              </div>
              <div className="font-display text-[10px] font-black uppercase text-[#0B071E] dark:text-white tracking-[0.2em] mt-0.5 leading-none relative z-10">
                Core
              </div>
              <div className="text-[8px] font-black text-funky-blue dark:text-[#2EF2FF] uppercase tracking-[0.25em] mt-3.5 leading-none relative z-10">
                nexus hub
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              ORBIT 1 (INNER): ACADEMIC RESOURCES (CYAN)
              ───────────────────────────────────────────────────────────── */}
          <div 
            onMouseEnter={() => setHoveredOrbit(1)}
            onMouseLeave={() => setHoveredOrbit(null)}
            className={`absolute w-[360px] h-[360px] rounded-full flex items-center justify-center pointer-events-none z-20 animate-orbit-inner ${
              hoveredOrbit === 1 ? 'pause-orbit' : ''
            }`}
          >
            {/* SVG Glowing Beacons connecting resources to Aura Core */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 360 360">
              <defs>
                <filter id="laser-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Base guide paths */}
              <line x1="180" y1="180" x2="180" y2="0" stroke="currentColor" strokeWidth="1" className="text-[#0B071E]/5 dark:text-white/5" />
              <line x1="180" y1="180" x2="335.9" y2="270" stroke="currentColor" strokeWidth="1" className="text-[#0B071E]/5 dark:text-white/5" />
              <line x1="180" y1="180" x2="24.1" y2="270" stroke="currentColor" strokeWidth="1" className="text-[#0B071E]/5 dark:text-white/5" />

              {/* Active neon glow laser flow lines */}
              {hoveredNode === 'res-nust' && (
                <>
                  <line x1="180" y1="180" x2="180" y2="0" stroke="#2EF2FF" strokeWidth="5" strokeLinecap="round" className="opacity-30" filter="url(#laser-glow)" />
                  <line x1="180" y1="180" x2="180" y2="0" stroke="#2EF2FF" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 10" className="animate-laser-flow" />
                </>
              )}
              {hoveredNode === 'res-fast' && (
                <>
                  <line x1="180" y1="180" x2="335.9" y2="270" stroke="#2EF2FF" strokeWidth="5" strokeLinecap="round" className="opacity-30" filter="url(#laser-glow)" />
                  <line x1="180" y1="180" x2="335.9" y2="270" stroke="#2EF2FF" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 10" className="animate-laser-flow" />
                </>
              )}
              {hoveredNode === 'res-lums' && (
                <>
                  <line x1="180" y1="180" x2="24.1" y2="270" stroke="#2EF2FF" strokeWidth="5" strokeLinecap="round" className="opacity-30" filter="url(#laser-glow)" />
                  <line x1="180" y1="180" x2="24.1" y2="270" stroke="#2EF2FF" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 10" className="animate-laser-flow" />
                </>
              )}
            </svg>

            {/* Node 1: NUST Resources (Top, 0deg) */}
            <div 
              style={{ transform: 'translateY(-180px)' }}
              onMouseEnter={() => setHoveredNode('res-nust')}
              onMouseLeave={() => setHoveredNode(null)}
              className="absolute pointer-events-auto group/node"
            >
              <div className={`animate-counter-inner ${hoveredOrbit === 1 ? 'pause-orbit' : ''}`}>
                <Link href="/resources?uni=NUST" className="block relative">
                  
                  {/* Frosted HUD preview */}
                  <AnimatePresence>
                    {hoveredNode === 'res-nust' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: -5 }}
                        className="absolute bottom-14 left-1/2 -translate-x-1/2 w-52 bg-white/90 dark:bg-[#0A0514]/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-3 shadow-[0_20px_50px_rgba(46,242,255,0.15)] pointer-events-none"
                      >
                        <div className="text-[10px] font-black text-funky-cyan dark:text-[#2EF2FF] uppercase tracking-wider mb-1">
                          NUST Academic Folder
                        </div>
                        <div className="space-y-1 pb-1">
                          <div className="text-[10px] font-bold text-dark dark:text-white flex items-center gap-1.5 truncate">
                            <FileText size={10} className="text-funky-cyan" /> CS100_DSA_Midterm.pdf
                          </div>
                          <div className="text-[10px] font-bold text-dark dark:text-white flex items-center gap-1.5 truncate">
                            <FileText size={10} className="text-funky-cyan" /> EE111_Circuit_Notes.docx
                          </div>
                        </div>
                        <div className="text-[9px] text-[#0B071E]/45 dark:text-white/40 mt-1.5 flex items-center gap-0.5 justify-end font-bold border-t border-dark/5 dark:border-white/5 pt-1.5">
                          <span>Browse vault</span> <ArrowRight size={9} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Circular Node Icon (Folder style) */}
                  <div className="w-12 h-12 rounded-xl bg-white/95 dark:bg-[#110A20]/95 border border-dark/10 dark:border-[#2EF2FF]/25 shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_20px_rgba(46,242,255,0.04)] flex items-center justify-center text-funky-blue dark:text-[#2EF2FF] hover:scale-110 hover:border-funky-blue hover:shadow-cyan dark:hover:border-[#2EF2FF] transition-all duration-300 relative">
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                      <defs>
                        <linearGradient id="folder-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1E3A8A" />
                          <stop offset="100%" stopColor="#0B071E" />
                        </linearGradient>
                        <linearGradient id="folder-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2EF2FF" />
                          <stop offset="100%" stopColor="#0066FF" />
                        </linearGradient>
                      </defs>
                      <rect x="6" y="3" width="12" height="15" rx="1.5" fill="none" stroke="currentColor" className="text-funky-blue/20 dark:text-[#2EF2FF]/20" strokeWidth="1" />
                      <rect x="4" y="5" width="13" height="15" rx="2" fill="url(#folder-grad)" stroke="url(#folder-glow)" strokeWidth="1.5" />
                      <line x1="7" y1="9" x2="14" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round" className="opacity-80" />
                      <line x1="7" y1="12" x2="14" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" className="opacity-80" />
                      <line x1="7" y1="15" x2="11" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" className="opacity-80" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>

            {/* Node 2: FAST Resources (Bottom Right, 120deg) */}
            <div 
              style={{ transform: 'rotate(120deg) translateY(-180px) rotate(-120deg)' }}
              onMouseEnter={() => setHoveredNode('res-fast')}
              onMouseLeave={() => setHoveredNode(null)}
              className="absolute pointer-events-auto group/node"
            >
              <div className={`animate-counter-inner ${hoveredOrbit === 1 ? 'pause-orbit' : ''}`}>
                <Link href="/resources?uni=FAST" className="block relative">
                  
                  {/* Frosted HUD preview */}
                  <AnimatePresence>
                    {hoveredNode === 'res-fast' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 5 }}
                        className="absolute top-14 left-1/2 -translate-x-1/2 w-52 bg-white/90 dark:bg-[#0A0514]/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-3 shadow-[0_20px_50px_rgba(46,242,255,0.15)] pointer-events-none"
                      >
                        <div className="text-[10px] font-black text-funky-cyan dark:text-[#2EF2FF] uppercase tracking-wider mb-1">
                          FAST Academic Folder
                        </div>
                        <div className="space-y-1 pb-1">
                          <div className="text-[10px] font-bold text-dark dark:text-white flex items-center gap-1.5 truncate">
                            <FileText size={10} className="text-funky-cyan" /> MT201_Calculus_II.pdf
                          </div>
                          <div className="text-[10px] font-bold text-dark dark:text-white flex items-center gap-1.5 truncate">
                            <FileText size={10} className="text-funky-cyan" /> CS201_OOP_Solved.zip
                          </div>
                        </div>
                        <div className="text-[9px] text-[#0B071E]/45 dark:text-white/40 mt-1.5 flex items-center gap-0.5 justify-end font-bold border-t border-dark/5 dark:border-white/5 pt-1.5">
                          <span>Browse vault</span> <ArrowRight size={9} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Circular Node Icon (Folder style) */}
                  <div className="w-12 h-12 rounded-xl bg-white/95 dark:bg-[#110A20]/95 border border-dark/10 dark:border-[#2EF2FF]/25 shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_20px_rgba(46,242,255,0.04)] flex items-center justify-center text-funky-blue dark:text-[#2EF2FF] hover:scale-110 hover:border-funky-blue hover:shadow-cyan dark:hover:border-[#2EF2FF] transition-all duration-300 relative">
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                      <rect x="6" y="3" width="12" height="15" rx="1.5" fill="none" stroke="currentColor" className="text-funky-blue/20 dark:text-[#2EF2FF]/20" strokeWidth="1" />
                      <rect x="4" y="5" width="13" height="15" rx="2" fill="url(#folder-grad)" stroke="url(#folder-glow)" strokeWidth="1.5" />
                      <line x1="7" y1="9" x2="14" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round" className="opacity-80" />
                      <line x1="7" y1="12" x2="14" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" className="opacity-80" />
                      <line x1="7" y1="15" x2="11" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" className="opacity-80" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>

            {/* Node 3: LUMS Resources (Bottom Left, 240deg) */}
            <div 
              style={{ transform: 'rotate(240deg) translateY(-180px) rotate(-240deg)' }}
              onMouseEnter={() => setHoveredNode('res-lums')}
              onMouseLeave={() => setHoveredNode(null)}
              className="absolute pointer-events-auto group/node"
            >
              <div className={`animate-counter-inner ${hoveredOrbit === 1 ? 'pause-orbit' : ''}`}>
                <Link href="/resources?uni=LUMS" className="block relative">
                  
                  {/* Frosted HUD preview */}
                  <AnimatePresence>
                    {hoveredNode === 'res-lums' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 5 }}
                        className="absolute top-14 left-1/2 -translate-x-1/2 w-52 bg-white/90 dark:bg-[#0A0514]/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-3 shadow-[0_20px_50px_rgba(46,242,255,0.15)] pointer-events-none"
                      >
                        <div className="text-[10px] font-black text-funky-cyan dark:text-[#2EF2FF] uppercase tracking-wider mb-1">
                          LUMS Academic Folder
                        </div>
                        <div className="space-y-1 pb-1">
                          <div className="text-[10px] font-bold text-dark dark:text-white flex items-center gap-1.5 truncate">
                            <FileText size={10} className="text-funky-cyan" /> ECON101_Micro_Notes.pdf
                          </div>
                          <div className="text-[10px] font-bold text-dark dark:text-white flex items-center gap-1.5 truncate">
                            <FileText size={10} className="text-funky-cyan" /> MKT201_Principles.pptx
                          </div>
                        </div>
                        <div className="text-[9px] text-[#0B071E]/45 dark:text-white/40 mt-1.5 flex items-center gap-0.5 justify-end font-bold border-t border-dark/5 dark:border-white/5 pt-1.5">
                          <span>Browse vault</span> <ArrowRight size={9} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Circular Node Icon (Folder style) */}
                  <div className="w-12 h-12 rounded-xl bg-white/95 dark:bg-[#110A20]/95 border border-dark/10 dark:border-[#2EF2FF]/25 shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_20px_rgba(46,242,255,0.04)] flex items-center justify-center text-funky-blue dark:text-[#2EF2FF] hover:scale-110 hover:border-funky-blue hover:shadow-cyan dark:hover:border-[#2EF2FF] transition-all duration-300 relative">
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                      <rect x="6" y="3" width="12" height="15" rx="1.5" fill="none" stroke="currentColor" className="text-funky-blue/20 dark:text-[#2EF2FF]/20" strokeWidth="1" />
                      <rect x="4" y="5" width="13" height="15" rx="2" fill="url(#folder-grad)" stroke="url(#folder-glow)" strokeWidth="1.5" />
                      <line x1="7" y1="9" x2="14" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round" className="opacity-80" />
                      <line x1="7" y1="12" x2="14" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" className="opacity-80" />
                      <line x1="7" y1="15" x2="11" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" className="opacity-80" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>

          </div>

          {/* ─────────────────────────────────────────────────────────────
              ORBIT 2 (OUTER): CAMPUS EXPLORER (5 UNIVERSITIES)
              ───────────────────────────────────────────────────────────── */}
          <div 
            onMouseEnter={() => setHoveredOrbit(2)}
            onMouseLeave={() => setHoveredOrbit(null)}
            className={`absolute w-[560px] h-[560px] rounded-full flex items-center justify-center pointer-events-none z-20 animate-orbit-outer ${
              hoveredOrbit === 2 ? 'pause-orbit' : ''
            }`}
          >
            {/* SVG Glowing Beacons connecting 5 universities to Aura Core */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 560 560">
              {/* Base guide lines */}
              <line x1="280" y1="280" x2="280" y2="0" stroke="currentColor" strokeWidth="1" className="text-[#0B071E]/5 dark:text-white/5" />
              <line x1="280" y1="280" x2="546.3" y2="193.5" stroke="currentColor" strokeWidth="1" className="text-[#0B071E]/5 dark:text-white/5" />
              <line x1="280" y1="280" x2="444.6" y2="506.5" stroke="currentColor" strokeWidth="1" className="text-[#0B071E]/5 dark:text-white/5" />
              <line x1="280" y1="280" x2="115.4" y2="506.5" stroke="currentColor" strokeWidth="1" className="text-[#0B071E]/5 dark:text-white/5" />
              <line x1="280" y1="280" x2="13.7" y2="193.5" stroke="currentColor" strokeWidth="1" className="text-[#0B071E]/5 dark:text-white/5" />

              {/* Glowing active laser overlay lines */}
              {hoveredNode === 'uni-nust' && (
                <>
                  <line x1="280" y1="280" x2="280" y2="0" stroke={uniDetails.NUST.color} strokeWidth="5" strokeLinecap="round" className="opacity-25" filter="url(#laser-glow)" />
                  <line x1="280" y1="280" x2="280" y2="0" stroke={uniDetails.NUST.color} strokeWidth="2" strokeLinecap="round" strokeDasharray="8 12" className="animate-laser-flow" />
                </>
              )}
              {hoveredNode === 'uni-fast' && (
                <>
                  <line x1="280" y1="280" x2="546.3" y2="193.5" stroke={uniDetails.FAST.color} strokeWidth="5" strokeLinecap="round" className="opacity-25" filter="url(#laser-glow)" />
                  <line x1="280" y1="280" x2="546.3" y2="193.5" stroke={uniDetails.FAST.color} strokeWidth="2" strokeLinecap="round" strokeDasharray="8 12" className="animate-laser-flow" />
                </>
              )}
              {hoveredNode === 'uni-lums' && (
                <>
                  <line x1="280" y1="280" x2="444.6" y2="506.5" stroke={uniDetails.LUMS.color} strokeWidth="5" strokeLinecap="round" className="opacity-25" filter="url(#laser-glow)" />
                  <line x1="280" y1="280" x2="444.6" y2="506.5" stroke={uniDetails.LUMS.color} strokeWidth="2" strokeLinecap="round" strokeDasharray="8 12" className="animate-laser-flow" />
                </>
              )}
              {hoveredNode === 'uni-iba' && (
                <>
                  <line x1="280" y1="280" x2="115.4" y2="506.5" stroke={uniDetails.IBA.color} strokeWidth="5" strokeLinecap="round" className="opacity-25" filter="url(#laser-glow)" />
                  <line x1="280" y1="280" x2="115.4" y2="506.5" stroke={uniDetails.IBA.color} strokeWidth="2" strokeLinecap="round" strokeDasharray="8 12" className="animate-laser-flow" />
                </>
              )}
              {hoveredNode === 'uni-aku' && (
                <>
                  <line x1="280" y1="280" x2="13.7" y2="193.5" stroke={uniDetails.AKU.color} strokeWidth="5" strokeLinecap="round" className="opacity-25" filter="url(#laser-glow)" />
                  <line x1="280" y1="280" x2="13.7" y2="193.5" stroke={uniDetails.AKU.color} strokeWidth="2" strokeLinecap="round" strokeDasharray="8 12" className="animate-laser-flow" />
                </>
              )}
            </svg>

            {/* Node 1: NUST (Angle 0deg - top) */}
            <div 
              style={{ transform: 'rotate(0deg) translateY(-280px) rotate(0deg)' }}
              onMouseEnter={() => setHoveredNode('uni-nust')}
              onMouseLeave={() => setHoveredNode(null)}
              className="absolute pointer-events-auto group/node"
            >
              <div className={`animate-counter-outer ${hoveredOrbit === 2 ? 'pause-orbit' : ''}`}>
                <Link href="/universities/NUST" className="block relative">
                  
                  {/* Frosted HUD preview */}
                  <AnimatePresence>
                    {hoveredNode === 'uni-nust' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: -5 }}
                        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-60 bg-white/90 dark:bg-[#0A0514]/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(255,184,0,0.12)] pointer-events-none"
                      >
                        <div className="text-[11px] font-black text-yellow-600 dark:text-[#FFB800] uppercase tracking-wider mb-1.5 pb-1 border-b border-dark/5 dark:border-white/5 flex items-center gap-1.5">
                          <GraduationCap size={13} /> {uniDetails.NUST.name}
                        </div>
                        <div className="grid grid-cols-2 gap-2.5 text-[11px] text-[#0B071E]/85 dark:text-white/85 font-semibold leading-snug">
                          <div>
                            <span className="block text-[8px] uppercase text-[#0B071E]/40 dark:text-white/40 tracking-wider font-bold mb-0.5">Est. Semester Fee</span>
                            {uniDetails.NUST.fee.split('/')[0]}
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase text-[#0B071E]/40 dark:text-white/40 tracking-wider font-bold mb-0.5">Admissions Close</span>
                            {uniDetails.NUST.deadline}
                          </div>
                        </div>
                        <div className="text-[9px] text-[#0B071E]/45 dark:text-white/40 mt-3 flex items-center justify-between font-bold pt-2 border-t border-dark/5 dark:border-white/5">
                          <span>Avg Merit: {uniDetails.NUST.merit}</span>
                          <span className="flex items-center gap-0.5 text-yellow-600 dark:text-[#FFB800]">Explore portal <ArrowRight size={9} /></span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Circular Node Icon (Branded logo shield with rotating micro-satellite) */}
                  <div className="relative w-15 h-15 rounded-full bg-white/95 dark:bg-[#110A20]/95 border-2 border-dark/10 dark:border-white/15 p-2 shadow-lg flex items-center justify-center hover:scale-115 transition-transform duration-300" style={{ boxShadow: `0 0 15px rgba(255, 184, 0, 0.15)` }}>
                    <div className="absolute inset-0 -m-1.5 rounded-full border border-dashed border-dark/10 dark:border-white/10 pointer-events-none animate-micro-spin" />
                    <img src={uniDetails.NUST.logo} alt="" className="w-10 h-10 object-contain filter dark:brightness-110" />
                  </div>
                  
                  {/* Text label capsule */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full border border-dark/5 bg-white/90 dark:border-white/5 dark:bg-[#110A20]/90 text-[8.5px] font-black uppercase text-dark dark:text-white tracking-widest whitespace-nowrap shadow-sm">
                    NUST
                  </div>
                </Link>
              </div>
            </div>

            {/* Node 2: FAST-NU (Angle 72deg - top right) */}
            <div 
              style={{ transform: 'rotate(72deg) translateY(-280px) rotate(-72deg)' }}
              onMouseEnter={() => setHoveredNode('uni-fast')}
              onMouseLeave={() => setHoveredNode(null)}
              className="absolute pointer-events-auto group/node"
            >
              <div className={`animate-counter-outer ${hoveredOrbit === 2 ? 'pause-orbit' : ''}`}>
                <Link href="/universities/FAST" className="block relative">
                  
                  {/* Frosted HUD preview */}
                  <AnimatePresence>
                    {hoveredNode === 'uni-fast' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: -5 }}
                        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-60 bg-white/90 dark:bg-[#0A0514]/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(46,242,255,0.12)] pointer-events-none"
                      >
                        <div className="text-[11px] font-black text-funky-blue dark:text-[#2EF2FF] uppercase tracking-wider mb-1.5 pb-1 border-b border-dark/5 dark:border-white/5 flex items-center gap-1.5">
                          <GraduationCap size={13} /> {uniDetails.FAST.name}
                        </div>
                        <div className="grid grid-cols-2 gap-2.5 text-[11px] text-[#0B071E]/85 dark:text-white/85 font-semibold leading-snug">
                          <div>
                            <span className="block text-[8px] uppercase text-[#0B071E]/40 dark:text-white/40 tracking-wider font-bold mb-0.5">Est. Semester Fee</span>
                            {uniDetails.FAST.fee.split('/')[0]}
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase text-[#0B071E]/40 dark:text-white/40 tracking-wider font-bold mb-0.5">Admissions Close</span>
                            <span className="text-red-500 font-extrabold">{uniDetails.FAST.deadline}</span>
                          </div>
                        </div>
                        <div className="text-[9px] text-[#0B071E]/45 dark:text-white/40 mt-3 flex items-center justify-between font-bold pt-2 border-t border-dark/5 dark:border-white/5">
                          <span>Avg Merit: {uniDetails.FAST.merit}</span>
                          <span className="flex items-center gap-0.5 text-funky-blue dark:text-[#2EF2FF]">Explore portal <ArrowRight size={9} /></span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Circular Node Icon (Branded logo shield with rotating micro-satellite) */}
                  <div className="relative w-15 h-15 rounded-full bg-white/95 dark:bg-[#110A20]/95 border-2 border-dark/10 dark:border-white/15 p-2 shadow-lg flex items-center justify-center hover:scale-115 transition-transform duration-300" style={{ boxShadow: `0 0 15px rgba(46, 242, 255, 0.15)` }}>
                    <div className="absolute inset-0 -m-1.5 rounded-full border border-dashed border-dark/10 dark:border-white/10 pointer-events-none animate-micro-spin" />
                    <img src={uniDetails.FAST.logo} alt="" className="w-10 h-10 object-contain filter dark:brightness-110" />
                  </div>
                  
                  {/* Text label capsule */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full border border-dark/5 bg-white/90 dark:border-white/5 dark:bg-[#110A20]/90 text-[8.5px] font-black uppercase text-dark dark:text-white tracking-widest whitespace-nowrap shadow-sm">
                    FAST
                  </div>
                </Link>
              </div>
            </div>

            {/* Node 3: LUMS (Angle 144deg - bottom right) */}
            <div 
              style={{ transform: 'rotate(144deg) translateY(-280px) rotate(-144deg)' }}
              onMouseEnter={() => setHoveredNode('uni-lums')}
              onMouseLeave={() => setHoveredNode(null)}
              className="absolute pointer-events-auto group/node"
            >
              <div className={`animate-counter-outer ${hoveredOrbit === 2 ? 'pause-orbit' : ''}`}>
                <Link href="/universities/LUMS" className="block relative">
                  
                  {/* Frosted HUD preview */}
                  <AnimatePresence>
                    {hoveredNode === 'uni-lums' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 5 }}
                        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-60 bg-white/90 dark:bg-[#0A0514]/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(216,255,62,0.12)] pointer-events-none"
                      >
                        <div className="text-[11px] font-black text-green-700 dark:text-[#D8FF3E] uppercase tracking-wider mb-1.5 pb-1 border-b border-dark/5 dark:border-white/5 flex items-center gap-1.5">
                          <GraduationCap size={13} /> {uniDetails.LUMS.name}
                        </div>
                        <div className="grid grid-cols-2 gap-2.5 text-[11px] text-[#0B071E]/85 dark:text-white/85 font-semibold leading-snug">
                          <div>
                            <span className="block text-[8px] uppercase text-[#0B071E]/40 dark:text-white/40 tracking-wider font-bold mb-0.5">Est. Semester Fee</span>
                            {uniDetails.LUMS.fee.split('/')[0]}
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase text-[#0B071E]/40 dark:text-white/40 tracking-wider font-bold mb-0.5">Admissions Close</span>
                            {uniDetails.LUMS.deadline}
                          </div>
                        </div>
                        <div className="text-[9px] text-[#0B071E]/45 dark:text-white/40 mt-3 flex items-center justify-between font-bold pt-2 border-t border-dark/5 dark:border-white/5">
                          <span>Avg Merit: {uniDetails.LUMS.merit}</span>
                          <span className="flex items-center gap-0.5 text-green-700 dark:text-[#D8FF3E]">Explore portal <ArrowRight size={9} /></span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Circular Node Icon (Branded logo shield with rotating micro-satellite) */}
                  <div className="relative w-15 h-15 rounded-full bg-white/95 dark:bg-[#110A20]/95 border-2 border-dark/10 dark:border-white/15 p-2 shadow-lg flex items-center justify-center hover:scale-115 transition-transform duration-300" style={{ boxShadow: `0 0 15px rgba(216, 255, 62, 0.15)` }}>
                    <div className="absolute inset-0 -m-1.5 rounded-full border border-dashed border-dark/10 dark:border-white/10 pointer-events-none animate-micro-spin" />
                    <img src={uniDetails.LUMS.logo} alt="" className="w-10 h-10 object-contain filter dark:brightness-110" />
                  </div>
                  
                  {/* Text label capsule */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full border border-dark/5 bg-white/90 dark:border-white/5 dark:bg-[#110A20]/90 text-[8.5px] font-black uppercase text-dark dark:text-white tracking-widest whitespace-nowrap shadow-sm">
                    LUMS
                  </div>
                </Link>
              </div>
            </div>

            {/* Node 4: IBA (Angle 216deg - bottom left) */}
            <div 
              style={{ transform: 'rotate(216deg) translateY(-280px) rotate(-216deg)' }}
              onMouseEnter={() => setHoveredNode('uni-iba')}
              onMouseLeave={() => setHoveredNode(null)}
              className="absolute pointer-events-auto group/node"
            >
              <div className={`animate-counter-outer ${hoveredOrbit === 2 ? 'pause-orbit' : ''}`}>
                <Link href="/universities/IBA" className="block relative">
                  
                  {/* Frosted HUD preview */}
                  <AnimatePresence>
                    {hoveredNode === 'uni-iba' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 5 }}
                        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-60 bg-white/90 dark:bg-[#0A0514]/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(255,122,24,0.12)] pointer-events-none"
                      >
                        <div className="text-[11px] font-black text-funky-orange dark:text-[#FF7A18] uppercase tracking-wider mb-1.5 pb-1 border-b border-dark/5 dark:border-white/5 flex items-center gap-1.5">
                          <GraduationCap size={13} /> {uniDetails.IBA.name}
                        </div>
                        <div className="grid grid-cols-2 gap-2.5 text-[11px] text-[#0B071E]/85 dark:text-white/85 font-semibold leading-snug">
                          <div>
                            <span className="block text-[8px] uppercase text-[#0B071E]/40 dark:text-white/40 tracking-wider font-bold mb-0.5">Est. Semester Fee</span>
                            {uniDetails.IBA.fee.split('/')[0]}
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase text-[#0B071E]/40 dark:text-white/40 tracking-wider font-bold mb-0.5">Admissions Close</span>
                            {uniDetails.IBA.deadline}
                          </div>
                        </div>
                        <div className="text-[9px] text-[#0B071E]/45 dark:text-white/40 mt-3 flex items-center justify-between font-bold pt-2 border-t border-dark/5 dark:border-white/5">
                          <span>Avg Merit: {uniDetails.IBA.merit}</span>
                          <span className="flex items-center gap-0.5 text-funky-orange dark:text-[#FF7A18]">Explore portal <ArrowRight size={9} /></span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Circular Node Icon (Branded logo shield with rotating micro-satellite) */}
                  <div className="relative w-15 h-15 rounded-full bg-white/95 dark:bg-[#110A20]/95 border-2 border-dark/10 dark:border-white/15 p-2 shadow-lg flex items-center justify-center hover:scale-115 transition-transform duration-300" style={{ boxShadow: `0 0 15px rgba(255, 122, 24, 0.15)` }}>
                    <div className="absolute inset-0 -m-1.5 rounded-full border border-dashed border-dark/10 dark:border-white/10 pointer-events-none animate-micro-spin" />
                    <img src={uniDetails.IBA.logo} alt="" className="w-10 h-10 object-contain filter dark:brightness-110" />
                  </div>
                  
                  {/* Text label capsule */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full border border-dark/5 bg-white/90 dark:border-white/5 dark:bg-[#110A20]/90 text-[8.5px] font-black uppercase text-dark dark:text-white tracking-widest whitespace-nowrap shadow-sm">
                    IBA
                  </div>
                </Link>
              </div>
            </div>

            {/* Node 5: Aga Khan University (Angle 288deg - top left) */}
            <div 
              style={{ transform: 'rotate(288deg) translateY(-280px) rotate(-288deg)' }}
              onMouseEnter={() => setHoveredNode('uni-aku')}
              onMouseLeave={() => setHoveredNode(null)}
              className="absolute pointer-events-auto group/node"
            >
              <div className={`animate-counter-outer ${hoveredOrbit === 2 ? 'pause-orbit' : ''}`}>
                <Link href="/universities/AKU" className="block relative">
                  
                  {/* Frosted HUD preview */}
                  <AnimatePresence>
                    {hoveredNode === 'uni-aku' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: -5 }}
                        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-60 bg-white/90 dark:bg-[#0A0514]/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(255,92,122,0.12)] pointer-events-none"
                      >
                        <div className="text-[11px] font-black text-funky-coral dark:text-[#FF5C7A] uppercase tracking-wider mb-1.5 pb-1 border-b border-dark/5 dark:border-white/5 flex items-center gap-1.5">
                          <GraduationCap size={13} /> {uniDetails.AKU.name}
                        </div>
                        <div className="grid grid-cols-2 gap-2.5 text-[11px] text-[#0B071E]/85 dark:text-white/85 font-semibold leading-snug">
                          <div>
                            <span className="block text-[8px] uppercase text-[#0B071E]/40 dark:text-white/40 tracking-wider font-bold mb-0.5">Est. Semester Fee</span>
                            {uniDetails.AKU.fee.split('/')[0]}
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase text-[#0B071E]/40 dark:text-white/40 tracking-wider font-bold mb-0.5">Admissions Close</span>
                            {uniDetails.AKU.deadline}
                          </div>
                        </div>
                        <div className="text-[9px] text-[#0B071E]/45 dark:text-white/40 mt-3 flex items-center justify-between font-bold pt-2 border-t border-dark/5 dark:border-white/5">
                          <span>Avg Merit: {uniDetails.AKU.merit}</span>
                          <span className="flex items-center gap-0.5 text-funky-coral dark:text-[#FF5C7A]">Explore portal <ArrowRight size={9} /></span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Circular Node Icon (Branded logo shield with rotating micro-satellite) */}
                  <div className="relative w-15 h-15 rounded-full bg-white/95 dark:bg-[#110A20]/95 border-2 border-dark/10 dark:border-white/15 p-2 shadow-lg flex items-center justify-center hover:scale-115 transition-transform duration-300" style={{ boxShadow: `0 0 15px rgba(255, 92, 122, 0.15)` }}>
                    <div className="absolute inset-0 -m-1.5 rounded-full border border-dashed border-dark/10 dark:border-white/10 pointer-events-none animate-micro-spin" />
                    <img src={uniDetails.AKU.logo} alt="" className="w-10 h-10 object-contain filter dark:brightness-110" />
                  </div>
                  
                  {/* Text label capsule */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full border border-dark/5 bg-white/90 dark:border-white/5 dark:bg-[#110A20]/90 text-[8.5px] font-black uppercase text-dark dark:text-white tracking-widest whitespace-nowrap shadow-sm">
                    AKU
                  </div>
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* Floating Help HUD */}
        <div className="text-center mt-20 max-w-lg mx-auto bg-white/40 dark:bg-[#110A20]/30 border border-dark/5 dark:border-white/5 p-4 rounded-2xl backdrop-blur-md">
          <div className="text-xs font-black uppercase text-[#0B071E] dark:text-white tracking-widest flex items-center gap-2 justify-center mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-funky-cyan animate-pulse" />
            <span>Interactive Constellation Navigation</span>
          </div>
          <p className="text-xs text-[#0B071E]/60 dark:text-white/60 font-semibold leading-relaxed">
            Hover over elements to trace active connection beams. Click the <span className="text-funky-blue dark:text-funky-cyan font-bold">Inner Folders</span> to open solved resource papers, or click the <span className="text-funky-orange dark:text-[#FF7A18] font-bold">University Shields</span> to navigate to admissions guides.
          </p>
        </div>

      </div>
    </section>
  );
}
