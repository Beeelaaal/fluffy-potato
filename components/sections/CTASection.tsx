'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-28 relative overflow-hidden" id="cta">
      <div className="section-container" ref={ref}>
        <motion.div
          className="relative rounded-3xl overflow-hidden text-center px-8 py-20"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{
            background: 'linear-gradient(135deg, rgba(91,99,245,0.15) 0%, rgba(124,58,237,0.15) 50%, rgba(6,182,212,0.08) 100%)',
            border: '1px solid rgba(91,99,245,0.2)',
          }}
        >
          {/* Glowing orbs inside card */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-brand-600/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[300px] h-[250px] bg-purple-600/15 blur-[80px] rounded-full pointer-events-none" />

          {/* Decorative background grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="section-badge mb-6 mx-auto w-fit">
              <Sparkles size={12} />
              Limited Early Access
            </div>

            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6">
              Ready to ace your{' '}
              <span className="gradient-text">university journey?</span>
            </h2>

            <p className="text-white/55 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Join 50,000+ Pakistani students who are already using TutorTap 
              to access better resources, connect with tutors, and navigate 
              their academic life with confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="btn-primary group px-10 py-4 text-base rounded-2xl">
                Start for Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/marketplace" className="btn-ghost px-10 py-4 text-base rounded-2xl">
                Browse Tutors
              </Link>
            </div>

            <p className="text-white/30 text-sm mt-6">
              No credit card required · Free forever for students · Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
