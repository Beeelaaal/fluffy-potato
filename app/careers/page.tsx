'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Send, CheckCircle2, GraduationCap, Star, ShieldCheck } from 'lucide-react';

export default function CareersPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', university: '', whyApply: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.university) return;
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
          <div className="section-badge mb-4 mx-auto w-fit">Careers</div>
          <h1 className="font-display font-black text-5xl sm:text-6xl tracking-tight mb-6">
            Join the <span className="gradient-text">Tute Team</span>
          </h1>
          <p className="text-[#0B071E]/80 text-lg sm:text-xl max-w-xl mx-auto font-semibold">
            Help us build the future of student collaboration in Pakistan.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-start">
          {/* Left info column */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              className="glass-card p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-funky-cyan bg-funky-cyan/10 border border-funky-cyan/20 px-3.5 py-1.5 rounded-full mb-6">
                <Briefcase size={13} /> Active Opening
              </div>
              <h2 className="font-display font-bold text-3xl mb-4 text-[#0B071E]">Campus Ambassador Program</h2>
              <p className="text-[#0B071E]/75 text-sm font-semibold mb-6 leading-relaxed">
                We are actively looking for passionate student leaders at top universities across Pakistan (NUST, FAST, LUMS, PU, COMSATS, NED, KU, GIKI, and others) to represent Tute on their campuses.
              </p>
              
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg text-[#0B071E]">What You Will Do:</h3>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5 text-[#0B071E]/75 text-sm font-semibold">
                    <GraduationCap size={16} className="text-[#8B5CF6] mt-0.5 flex-shrink-0" />
                    <span>Promote Tute on campus and academic student groups.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[#0B071E]/75 text-sm font-semibold">
                    <Star size={16} className="text-[#8B5CF6] mt-0.5 flex-shrink-0" />
                    <span>Help onboard campus seniors to share study resources.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[#0B071E]/75 text-sm font-semibold">
                    <ShieldCheck size={16} className="text-[#8B5CF6] mt-0.5 flex-shrink-0" />
                    <span>Provide feedback directly to the product team to improve student experience.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4 mt-6 pt-6 border-t border-black/5">
                <h3 className="font-display font-bold text-lg text-[#0B071E]">Perks &amp; Benefits:</h3>
                <div className="grid grid-cols-2 gap-4 text-xs font-bold text-[#0B071E]/70">
                  <div className="p-3 bg-[#8B5CF6]/5 rounded-xl border border-[#8B5CF6]/10">💵 Monthly Stipend</div>
                  <div className="p-3 bg-[#8B5CF6]/5 rounded-xl border border-[#8B5CF6]/10">📜 Certificate of Ambassadorship</div>
                  <div className="p-3 bg-[#8B5CF6]/5 rounded-xl border border-[#8B5CF6]/10">📈 Internship Opportunities</div>
                  <div className="p-3 bg-[#8B5CF6]/5 rounded-xl border border-[#8B5CF6]/10">🌟 Network with top student leaders</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right apply column */}
          <div className="lg:col-span-5">
            <motion.div 
              className="glass-card p-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h2 className="font-display font-bold text-2xl mb-6">Apply Now</h2>
              
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
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        className="input-field" 
                        placeholder="e.g. Ahmed Ali" 
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
                        placeholder="e.g. ahmed@gmail.com" 
                      />
                    </div>
                    <div>
                      <label className="form-label">Phone Number (WhatsApp) *</label>
                      <input 
                        type="tel" 
                        required 
                        value={form.phone}
                        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                        className="input-field" 
                        placeholder="e.g. 03312030359" 
                      />
                    </div>
                    <div>
                      <label className="form-label">Your University *</label>
                      <input 
                        type="text" 
                        required 
                        value={form.university}
                        onChange={e => setForm(p => ({ ...p, university: e.target.value }))}
                        className="input-field" 
                        placeholder="e.g. FAST Karachi" 
                      />
                    </div>
                    <div>
                      <label className="form-label">Why do you want to join? *</label>
                      <textarea 
                        required
                        value={form.whyApply}
                        onChange={e => setForm(p => ({ ...p, whyApply: e.target.value }))}
                        rows={3} 
                        className="input-field resize-none" 
                        placeholder="Tell us about yourself and why you're a good fit..." 
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full py-3.5 mt-2">
                      Submit Application <Send size={15} />
                    </button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    className="text-center py-10"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 size={32} className="text-emerald-500" />
                    </div>
                    <h3 className="font-display font-bold text-2xl mb-2 text-[#0B071E]">Application Received!</h3>
                    <p className="text-[#0B071E]/70 text-sm font-semibold max-w-sm mx-auto mb-6">
                      Thank you for applying to the Campus Ambassador program! The Tute team will review your application and contact you on WhatsApp soon.
                    </p>
                    <button 
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', university: '', whyApply: '' }); }}
                      className="btn-ghost w-full py-3"
                    >
                      Apply Again
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
