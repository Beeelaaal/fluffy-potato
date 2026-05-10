'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { UserPlus, Search, FileText, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Your Profile',
    description: 'Sign up as a student or tutor. Add your university, degree, and subjects to personalize your experience.',
    color: '#5b63f5',
  },
  {
    number: '02',
    icon: Search,
    title: 'Find What You Need',
    description: 'Browse universities, filter resources by course and instructor, or post a help request in the marketplace.',
    color: '#7c3aed',
  },
  {
    number: '03',
    icon: FileText,
    title: 'Access or Bid',
    description: 'Download resources instantly, or receive competitive bids from qualified tutors for your learning request.',
    color: '#06b6d4',
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'Learn & Grow',
    description: 'Learn at your own pace, track your progress, rate your tutor, and contribute resources back to the community.',
    color: '#10b981',
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-28 relative" id="how-it-works">
      <div className="section-container" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="section-badge mb-5 mx-auto w-fit">How It Works</div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-5">
            Get started in{' '}
            <span className="gradient-text">4 simple steps</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            From signup to your first session, TutorTap makes the journey seamless and fast.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px"
            style={{ background: 'linear-gradient(90deg, rgba(91,99,245,0.1), rgba(91,99,245,0.5), rgba(6,182,212,0.5), rgba(16,185,129,0.1))' }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  className="relative text-center"
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Step circle */}
                  <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl"
                    style={{
                      background: `${step.color}15`,
                      border: `2px solid ${step.color}40`,
                    }}>
                    <Icon size={28} style={{ color: step.color }} />

                    {/* Step number badge */}
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white"
                      style={{ background: step.color, fontSize: '10px' }}>
                      {step.number}
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-lg mb-3">{step.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed px-2">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
