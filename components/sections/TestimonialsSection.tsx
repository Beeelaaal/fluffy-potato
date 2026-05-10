'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '@/data/testimonials';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={13}
          className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-white/10 text-white/10'} />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const visible = [
    testimonials[current],
    testimonials[(current + 1) % testimonials.length],
    testimonials[(current + 2) % testimonials.length],
  ];

  return (
    <section className="py-28 relative overflow-hidden" id="testimonials">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/8 blur-[120px] rounded-full" />
        <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-brand-600/8 blur-[100px] rounded-full" />
      </div>

      <div className="section-container relative" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="section-badge mb-5 mx-auto w-fit">Student Stories</div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-5">
            Loved by students{' '}
            <span className="gradient-text">across Pakistan</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Hear from the students and tutors who&apos;ve transformed their academic journey with TutorTap.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {visible.map((t, i) => (
            <motion.div
              key={t.id + current}
              className="glass-card p-7 relative"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {/* Quote icon */}
              <Quote size={28} className="text-brand-500/30 mb-4" />

              {/* Stars */}
              <StarRating rating={t.rating} />

              {/* Text */}
              <p className="text-white/65 text-sm leading-relaxed mt-4 mb-6 italic">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-auto">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full border border-white/10"
                />
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-white/40 text-xs">{t.year} · {t.university}</div>
                </div>
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${
                  t.role === 'tutor'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    : 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                }`}>
                  {t.role === 'tutor' ? '👨‍🏫 Tutor' : '🎓 Student'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={prev}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-brand-500' : 'w-1.5 bg-white/20'
                }`} />
            ))}
          </div>

          <button onClick={next}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
