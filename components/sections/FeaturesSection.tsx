'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Database, Users, GraduationCap, Zap, Shield, Search } from 'lucide-react';

const features = [
  {
    icon: GraduationCap,
    title: 'University Hub',
    description: 'Detailed profiles of 120+ Pakistani universities — admissions, programs, fees, deadlines, and how to apply. Everything you need in one place.',
    color: '#5b63f5',
    gradient: 'from-brand-600/20 to-brand-800/5',
    tags: ['Admissions', 'Programs', 'Deadlines'],
  },
  {
    icon: Database,
    title: 'Smart Resource Hub',
    description: 'Access notes, past papers, timetables, and assignments filtered by your exact university, degree, course, and instructor.',
    color: '#7c3aed',
    gradient: 'from-purple-600/20 to-purple-900/5',
    tags: ['Notes', 'Past Papers', 'Timetables'],
  },
  {
    icon: Users,
    title: 'Tutor Marketplace',
    description: 'Post help requests, receive competitive bids from verified tutors, negotiate prices, and pick the perfect match for your needs.',
    color: '#06b6d4',
    gradient: 'from-cyan-600/20 to-cyan-900/5',
    tags: ['Bidding', 'Verified Tutors', 'Real-time'],
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find exactly what you need with intelligent filtering. Search across universities, resources, and tutors seamlessly.',
    color: '#ec4899',
    gradient: 'from-pink-600/20 to-pink-900/5',
    tags: ['AI-Powered', 'Filters', 'Instant Results'],
  },
  {
    icon: Shield,
    title: 'Verified Profiles',
    description: 'All tutors go through a verification process. Ratings, reviews, and session history ensure you always pick the right expert.',
    color: '#f59e0b',
    gradient: 'from-amber-600/20 to-amber-900/5',
    tags: ['Trust', 'Reviews', 'Ratings'],
  },
  {
    icon: Zap,
    title: 'Instant Matching',
    description: 'Our algorithm matches your request with the best-suited tutors based on expertise, university, and availability.',
    color: '#10b981',
    gradient: 'from-emerald-600/20 to-emerald-900/5',
    tags: ['Smart Match', 'Fast', 'Relevant'],
  },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-28 relative" id="features">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#8B5CF6]/5 blur-[120px] rounded-full" />
      </div>

      <div className="section-container relative" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="section-badge mb-5 mx-auto w-fit">Platform Features</div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-5">
            Everything a student needs,{' '}
            <span className="gradient-text">in one place</span>
          </h2>
          <p className="text-[#0B071E]/60 text-lg max-w-2xl mx-auto font-semibold">
            Tute combines university discovery, academic resources, and expert tutoring 
            into a seamless, premium experience.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="glass-card p-7 group cursor-pointer funky-border"
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const }}
                whileHover={{ y: -4, scale: 1.01 }}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${feature.color}12`, border: `1px solid ${feature.color}25` }}>
                  <Icon size={22} style={{ color: feature.color }} />
                </div>

                {/* Content */}
                <h3 className="font-display font-black text-lg text-[#0B071E] mb-3">{feature.title}</h3>
                <p className="text-[#0B071E]/60 text-sm font-semibold leading-relaxed mb-5">{feature.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {feature.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
                      style={{
                        background: `${feature.color}12`,
                        border: `1px solid ${feature.color}25`,
                        color: feature.color,
                      }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Hover glow line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)` }} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
