'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, GraduationCap, Zap } from 'lucide-react';
import { stats } from '@/data/testimonials';

const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), { ssr: false, loading: () => null });

const ctr = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
const itm = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } };

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
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

          {/* Badge */}
          <motion.div variants={itm} className="flex justify-center mb-7">
            <div className="live-badge">Pakistan&apos;s #1 EdTech Platform</div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itm}
            className="font-display font-bold tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.2rem, 5.5vw + 0.5rem, 5rem)', lineHeight: 1.05 }}
          >
            Your University Life,{' '}
            <span className="relative inline-block">
              <span className="gradient-text">Simplified</span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                style={{ background: 'linear-gradient(90deg, #FF4B72, #8B5CF6, transparent)' }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.0, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
              />
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p variants={itm} className="text-[#0B071E]/60 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10 font-semibold">
            Discover universities, access course resources, and connect with expert tutors —
            built exclusively for Pakistani students.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itm} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link href="/universities" className="btn-primary px-8 py-4 text-base group">
              <GraduationCap size={18} />
              Explore Universities
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/signup" className="btn-ghost px-8 py-4 text-base">
              <Zap size={16} className="text-[#8B5CF6]" />
              Get Started Free
            </Link>
          </motion.div>

          {/* Stats — now using Lucide icons */}
          <motion.div variants={itm} className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map(({ label, value, Icon }) => (
              <motion.div
                key={label}
                className="glass-card p-5 text-center cursor-default"
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-center mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center">
                    <Icon size={16} className="text-[#8B5CF6]" />
                  </div>
                </div>
                <div className="font-display text-xl font-bold gradient-text">{value}</div>
                <div className="text-[#0B071E]/40 text-xs mt-0.5 font-semibold">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[#0B071E]/25 text-xs font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <span className="tracking-widest uppercase text-[10px]">Scroll</span>
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-[#8B5CF6]/40 to-transparent"
            animate={{ scaleY: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
          />
        </motion.div>
      </div>
    </section>
  );
}
