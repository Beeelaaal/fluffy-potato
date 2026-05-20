'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, CheckCircle2, MessageSquareHeart } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function TestimonialPrompt() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'prompt' | 'form' | 'success'>('prompt');
  const [triggerReason, setTriggerReason] = useState('');
  
  // Form State
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [degree, setDegree] = useState('');
  const [year, setYear] = useState('1st Year');
  const [role, setRole] = useState<'student' | 'tutor'>('student');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 1. Track Surfing Time on Universities Page (5 mins = 300 seconds)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already submitted or dismissed
    const status = localStorage.getItem('tute-testimonial-status');
    if (status === 'submitted' || status === 'dismissed') return;

    let timer: NodeJS.Timeout;
    
    // Every second, check if we are on a university route
    timer = setInterval(() => {
      const isUniPage = pathname.startsWith('/universities');
      if (isUniPage) {
        const currentSeconds = parseInt(sessionStorage.getItem('uni-surf-seconds') || '0', 10);
        const nextSeconds = currentSeconds + 1;
        sessionStorage.setItem('uni-surf-seconds', nextSeconds.toString());

        if (nextSeconds >= 300) { // 5 minutes
          clearInterval(timer);
          triggerPrompt('surfing university pages');
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [pathname]);

  // 2. Listen to custom event triggers (downloads, matches)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleDownload = () => {
      triggerPrompt('downloading a resource');
    };

    const handleMatch = () => {
      triggerPrompt('matching on the marketplace');
    };

    window.addEventListener('tute-download-resource', handleDownload);
    window.addEventListener('tute-match-tutor', handleMatch);

    return () => {
      window.removeEventListener('tute-download-resource', handleDownload);
      window.removeEventListener('tute-match-tutor', handleMatch);
    };
  }, []);

  const triggerPrompt = (reason: string) => {
    // Check if already submitted or dismissed
    const status = localStorage.getItem('tute-testimonial-status');
    if (status === 'submitted' || status === 'dismissed') return;
    
    setTriggerReason(reason);
    setStep('prompt');
    setIsOpen(true);
  };

  const handleDismiss = () => {
    localStorage.setItem('tute-testimonial-status', 'dismissed');
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text || !university) return;
    setSubmitting(true);

    try {
      // Add to Firestore testimonials collection
      await addDoc(collection(db, 'testimonials'), {
        name,
        university,
        degree,
        year,
        role,
        rating,
        text,
        createdAt: serverTimestamp(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=1a1a35`,
      });

      localStorage.setItem('tute-testimonial-status', 'submitted');
      setStep('success');
    } catch (err) {
      console.error('Error submitting testimonial:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 w-full max-w-md px-4 sm:px-0"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="glass-card p-6 shadow-2xl border-funky-purple/20 bg-white/95 backdrop-blur-md relative overflow-hidden">
            {/* Top decorative stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-funky-cyan via-funky-purple to-funky-coral" />
            
            {/* Close Button */}
            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#0B071E]/40 hover:text-[#0B071E] hover:bg-black/5 transition-all"
            >
              <X size={15} />
            </button>

            {step === 'prompt' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-funky-purple/10 border border-funky-purple/20 flex items-center justify-center">
                    <MessageSquareHeart size={20} className="text-funky-purple animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-[#0B071E]">Share Your Experience!</h3>
                    <p className="text-[#0B071E]/50 text-[10px] font-bold uppercase tracking-wider">Since you were just {triggerReason}</p>
                  </div>
                </div>
                <p className="text-[#0B071E]/80 text-sm font-semibold leading-relaxed">
                  We noticed you exploring Tute! Would you mind taking 30 seconds to share your feedback and help other Pakistani students?
                </p>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep('form')} className="btn-primary flex-1 py-2.5 text-xs">
                    Yes, absolutely! 🌟
                  </button>
                  <button onClick={handleDismiss} className="btn-ghost py-2.5 px-4 text-xs">
                    Maybe later
                  </button>
                </div>
              </div>
            )}

            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="text-center pb-2 border-b border-black/5">
                  <h3 className="font-display font-black text-lg text-[#0B071E] mb-1">Write a Review</h3>
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="transition-transform active:scale-95"
                      >
                        <Star
                          size={24}
                          className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-black/5 text-black/5'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label text-[10px]">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="input-field py-2 px-3 text-xs"
                      placeholder="e.g. Asad Ali"
                    />
                  </div>
                  <div>
                    <label className="form-label text-[10px]">University *</label>
                    <input
                      type="text"
                      required
                      value={university}
                      onChange={e => setUniversity(e.target.value)}
                      className="input-field py-2 px-3 text-xs"
                      placeholder="e.g. NUST"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label text-[10px]">Degree / Major</label>
                    <input
                      type="text"
                      value={degree}
                      onChange={e => setDegree(e.target.value)}
                      className="input-field py-2 px-3 text-xs"
                      placeholder="e.g. BS CS"
                    />
                  </div>
                  <div>
                    <label className="form-label text-[10px]">Your Role</label>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value as any)}
                      className="input-field py-2 px-3 text-xs cursor-pointer"
                    >
                      <option value="student">Student</option>
                      <option value="tutor">Tutor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label text-[10px]">Testimonial Text *</label>
                  <textarea
                    required
                    value={text}
                    onChange={e => setText(e.target.value)}
                    rows={2}
                    className="input-field py-2 px-3 text-xs resize-none"
                    placeholder="Tute saved my grades! Highly recommended..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full py-2.5 text-xs font-bold mt-2"
                >
                  {submitting ? 'Submitting...' : 'Publish Testimonial 🚀'}
                </button>
              </form>
            )}

            {step === 'success' && (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={24} className="text-emerald-500 animate-bounce" />
                </div>
                <h3 className="font-display font-bold text-xl mb-1 text-[#0B071E]">Thank You!</h3>
                <p className="text-[#0B071E]/70 text-xs font-semibold max-w-xs mx-auto mb-4">
                  Your review has been successfully published and added directly to our testimonials showcase!
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn-ghost py-2 w-full text-xs font-bold"
                >
                  Close Panel
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
