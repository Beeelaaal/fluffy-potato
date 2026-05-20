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
          className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-black/5 text-black/5'} />
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
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/4 blur-[120px] rounded-full" />
        <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-[#8B5CF6]/5 blur-[100px] rounded-full" />
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
          <p className="text-[#0B071E]/60 text-lg max-w-xl mx-auto font-semibold">
            Hear from the students and tutors who&apos;ve transformed their academic journey with Tute.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {visible.map((t, i) => (
            <motion.div
              key={t.id + current}
              className="glass-card p-7 relative flex flex-col justify-between"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div>
                {/* Quote icon */}
                <Quote size={28} className="text-[#8B5CF6]/20 mb-4" />

                {/* Stars */}
                <StarRating rating={t.rating} />

                {/* Text */}
                <p className="text-[#0B071E]/75 text-sm leading-relaxed mt-4 mb-6 italic font-semibold">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 mt-auto">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full border border-black/10"
                />
                <div>
                  <div className="font-bold text-sm text-[#0B071E]">{t.name}</div>
                  <div className="text-[#0B071E]/40 text-xs font-semibold">{t.year} · {t.university}</div>
                </div>
                <span className={`ml-auto text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider ${
                  t.role === 'tutor'
                    ? 'bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/20'
                    : 'bg-[#0E7490]/10 text-[#0E7490] border border-[#0E7490]/20'
                }`}>
                  {t.role === 'tutor' ? 'Tutor' : 'Student'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={prev}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#0B071E]/55 hover:text-[#0B071E] hover:bg-black/5 transition-all"
            style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(11,7,30,0.08)' }}>
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-[#8B5CF6]' : 'w-1.5 bg-black/10'
                }`} />
            ))}
          </div>

          <button onClick={next}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#0B071E]/55 hover:text-[#0B071E] hover:bg-black/5 transition-all"
            style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(11,7,30,0.08)' }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
