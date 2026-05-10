'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, BookOpen, GraduationCap, Users, Zap } from 'lucide-react';
import { stats } from '@/data/testimonials';

const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), { ssr: false, loading: () => null });

const ctr = { hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.25 } } };
const itm = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } } };

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient bg */}
      <div className="absolute inset-0 bg-dark-900" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 75% 55% at 50% -5%, rgba(46,242,255,0.14) 0%, transparent 65%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 45% at 85% 85%, rgba(255,122,24,0.10) 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 45% 35% at 10% 80%, rgba(216,255,62,0.07) 0%, transparent 55%)' }} />
      </div>

      {/* Animated canvas + floating shapes */}
      <HeroScene />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
      }} />

      {/* Content */}
      <div className="relative z-10 section-container text-center pt-32 pb-24">
        <motion.div variants={ctr} initial="hidden" animate="show" className="max-w-5xl mx-auto">

          {/* Live badge */}
          <motion.div variants={itm} className="flex justify-center mb-7">
            <div className="live-badge">Pakistan&apos;s #1 EdTech Platform</div>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itm} className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[82px] leading-[1.04] tracking-tight mb-6">
            Your University Life,{' '}
            <span className="relative inline-block">
              <span className="gradient-text">Simplified</span>
              <motion.span
                className="absolute -bottom-1.5 left-0 right-0 h-[3px] rounded-full"
                style={{ background: 'linear-gradient(90deg, #2EF2FF, #D8FF3E, transparent)' }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
              />
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p variants={itm} className="text-white/55 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
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
              <Zap size={16} className="text-funky-lime" />
              Get Started Free
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itm} className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map(({ label, value, icon }) => (
              <motion.div
                key={label}
                className="glass-card p-5 text-center cursor-default"
                whileHover={{ scale: 1.04, y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl mb-1.5">{icon}</div>
                <div className="font-display text-xl gradient-text font-bold">{value}</div>
                <div className="text-white/40 text-xs mt-0.5">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/25 text-xs"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
        >
          <span className="tracking-widest uppercase text-[10px]">Scroll</span>
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-funky-cyan/50 to-transparent"
            animate={{ scaleY: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
          />
        </motion.div>
      </div>
    </section>
  );
}
