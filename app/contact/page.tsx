'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Mail, Phone, Send, CheckCircle2, Heart } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-funky-purple/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[300px] bg-funky-cyan/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="section-badge mb-4 mx-auto w-fit">Contact Us</div>
          <h1 className="font-display font-black text-5xl sm:text-6xl tracking-tight mb-6">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-[#0B071E]/80 text-lg sm:text-xl max-w-xl mx-auto font-semibold">
            Have questions or feedback? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-stretch">
          {/* Info Side */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <motion.div 
              className="glass-card p-8 h-full flex flex-col justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div>
                <h2 className="font-display font-bold text-2xl mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-funky-cyan/10 border border-funky-cyan/20 flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-funky-cyan" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-[#0B071E]">Location</h4>
                      <p className="text-[#0B071E]/75 text-sm font-semibold mt-0.5">Karachi, Pakistan</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0">
                      <Mail size={18} className="text-[#8B5CF6]" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-[#0B071E]">Email</h4>
                      <p className="text-[#0B071E]/75 text-sm font-semibold mt-0.5">hello@tute.pk</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FF4B72]/10 border border-[#FF4B72]/20 flex items-center justify-center flex-shrink-0">
                      <Phone size={18} className="text-[#FF4B72]" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-[#0B071E]">Phone</h4>
                      <p className="text-[#0B071E]/75 text-sm font-semibold mt-0.5">03312030359</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recruitment Promo */}
              <div className="mt-8 pt-6 border-t border-black/5 bg-[#8B5CF6]/5 p-4 rounded-2xl border border-[#8B5CF6]/10">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8B5CF6] block mb-1">We are hiring!</span>
                <h4 className="font-display font-bold text-sm text-[#0B071E] mb-1">Campus Ambassador Positions Open</h4>
                <p className="text-[#0B071E]/70 text-xs font-semibold mb-3">Become the face of Tute at your university and earn stipends.</p>
                <Link href="/careers" className="text-xs font-bold text-[#8B5CF6] hover:underline flex items-center gap-1">
                  Apply for Careers <Heart size={10} className="fill-current text-[#8B5CF6]" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <motion.div 
              className="glass-card p-8 h-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h2 className="font-display font-bold text-2xl mb-6">Send Us a Message</h2>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit} 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Full Name *</label>
                        <input 
                          type="text" 
                          required 
                          value={form.name}
                          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                          className="input-field" 
                          placeholder="e.g. Ahmed Raza" 
                        />
                      </div>
                      <div>
                        <label className="form-label">Email Address *</label>
                        <input 
                          type="email" 
                          required 
                          value={form.email}
                          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                          className="input-field" 
                          placeholder="e.g. ahmed@tute.pk" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Subject</label>
                      <input 
                        type="text" 
                        value={form.subject}
                        onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                        className="input-field" 
                        placeholder="e.g. Partnership inquiry" 
                      />
                    </div>
                    <div>
                      <label className="form-label">Message *</label>
                      <textarea 
                        required
                        value={form.message}
                        onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                        rows={4} 
                        className="input-field resize-none" 
                        placeholder="Tell us what you need help with..." 
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full py-3.5 mt-2">
                      Send Message <Send size={15} />
                    </button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 size={32} className="text-emerald-500" />
                    </div>
                    <h3 className="font-display font-bold text-2xl mb-2 text-[#0B071E]">Message Sent!</h3>
                    <p className="text-[#0B071E]/70 text-sm font-semibold max-w-sm mx-auto mb-6">
                      Thank you for contacting Tute. Our support team will get back to you at {form.email} within 24 hours.
                    </p>
                    <button 
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                      className="btn-ghost w-full py-3"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
