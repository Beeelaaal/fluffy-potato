'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  BookOpen, Users, Building, Sparkles, ArrowRight, 
  Search, Download, CheckCircle, Star, GraduationCap, Wifi, MapPin
} from 'lucide-react';

export default function ProductsServicesSection() {
  // Widget 1: Resource Search states
  const [selectedTag, setSelectedTag] = useState<'NUST' | 'FAST' | 'LUMS'>('NUST');
  const [dlTrigger, setDlTrigger] = useState<string | null>(null);

  // Widget 2: Marketplace Bid animation state
  const [activeBidIdx, setActiveBidIdx] = useState(0);
  const mockBids = [
    { name: 'Omar Farooq (NUST)', amount: '1,800', rating: 4.9, sessions: 120, time: '3 mins ago' },
    { name: 'Sana Malik (LUMS)', amount: '2,000', rating: 4.8, sessions: 85, time: '1 min ago' },
    { name: 'Usman Tariq (FAST)', amount: '1,750', rating: 4.7, sessions: 64, time: 'Just now' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBidIdx((prev) => (prev + 1) % mockBids.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDownloadDemo = (title: string) => {
    setDlTrigger(title);
    setTimeout(() => setDlTrigger(null), 3000);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-white/40 border-t border-b border-black/5" id="services">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-10 w-[400px] h-[400px] bg-[#0066FF]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#FF4B72]/5 blur-[120px] rounded-full" />
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="section-badge mb-4 mx-auto w-fit">
            <Sparkles size={12} className="text-[#0066FF]" />
            Product & Services
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl tracking-tight mb-4 text-[#0B071E]">
            Everything you need for <span className="gradient-text">Academic Success</span>
          </h2>
          <p className="text-[#0B071E]/60 text-base sm:text-lg max-w-2xl mx-auto font-semibold">
            Interactive, peer-driven platforms tailored to simplify your entire university journey.
          </p>
        </div>

        {/* Services Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Card 1: Academic Resource Hub */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 flex flex-col justify-between relative overflow-hidden border-[#0066FF] ring-2 ring-[#0066FF]/20 bg-white/90 shadow-[8px_8px_0px_rgba(139,92,246,1)]"
          >
            <div className="absolute top-0 right-0 bg-[#0066FF] text-white font-display text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-bl-xl flex items-center gap-1 shadow-sm">
              <Sparkles size={10} />
              Most Popular
            </div>

            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-5 bg-[#0066FF]/15 text-[#0066FF]">
                Core Feature
              </span>

              {/* Title */}
              <h3 className="font-display font-black text-2xl text-[#0B071E] mb-3">
                Academic Resource Hub
              </h3>
              
              <p className="text-[#0B071E]/70 text-sm leading-relaxed mb-6 font-semibold">
                Get instant access to notes, lecture slides, lab manuals, and solved mid/final past papers uploaded by senior students in your exact course.
              </p>

              {/* Interactive Widget 1: Mini Resource Explorer */}
              <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-4 mb-6 border border-black/5 dark:border-white/5 space-y-3.5">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B071E]/40" />
                  <div className="w-full bg-white dark:bg-[#110A20] border border-black/10 dark:border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-[#0B071E]/60 select-none">
                    Search course codes, instructors...
                  </div>
                </div>

                {/* Filter tags demo */}
                <div className="flex gap-2">
                  {(['NUST', 'FAST', 'LUMS'] as const).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                        selectedTag === tag
                          ? 'bg-[#0066FF] border-[#0066FF] text-white'
                          : 'bg-white dark:bg-white/5 border-black/10 dark:border-white/10 text-[#0B071E]/60 dark:text-white/60 hover:bg-black/5'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                {/* Simulated Documents */}
                <div className="space-y-2">
                  {[
                    { title: 'CS100 DSA Midterm Solved', univ: 'NUST', dl: '12.4k' },
                    { title: 'MT201 Calculus II Cheat Sheet', univ: 'FAST', dl: '8.2k' },
                  ]
                    .filter((doc) => selectedTag === 'NUST' || doc.univ === selectedTag)
                    .map((item, i) => (
                      <div
                        key={i}
                        onClick={() => handleDownloadDemo(item.title)}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#110A20] border border-black/5 dark:border-white/5 hover:border-[#0066FF]/30 hover:shadow-sm transition-all cursor-pointer group"
                      >
                        <span className="text-[11px] font-bold text-[#0B071E] truncate max-w-[150px] flex items-center gap-1.5">
                          <BookOpen size={12} className="text-[#0066FF]" />
                          {item.title}
                        </span>
                        <button className="text-[9px] font-extrabold text-[#0066FF] bg-[#0066FF]/10 px-2 py-1 rounded-md flex items-center gap-1 group-hover:bg-[#0066FF] group-hover:text-white transition-all">
                          <Download size={10} />
                          {item.dl}
                        </button>
                      </div>
                    ))}
                  {selectedTag === 'LUMS' && (
                    <div className="text-center py-4 text-[10px] text-[#0B071E]/40 font-bold">
                      No documents found for #LUMS. Be the first to add one!
                    </div>
                  )}
                </div>
              </div>

              {/* Toast notifier demo */}
              <AnimatePresence>
                {dlTrigger && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-20 left-6 right-6 p-3 rounded-xl bg-[#0066FF] text-white text-xs font-bold text-center shadow-lg z-20 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={14} /> File "{dlTrigger}" is downloading!
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Features List */}
              <ul className="space-y-2 mb-8">
                {['150,000+ Solved Documents', 'Tailored by University & Instructor', 'Direct PDF & Document Downloads'].map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-xs font-bold text-[#0B071E]/80">
                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/resources"
              className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 border-2 transition-all duration-200 bg-gradient-to-br from-[#0066FF] to-[#0052CC] text-white border-[#0066FF] hover:shadow-[4px_4px_0px_#0B071E]"
            >
              Browse Resource Hub
              <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* Card 2: Peer Tutor Marketplace */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-8 flex flex-col justify-between relative overflow-hidden border-black/10 bg-white/60"
          >
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-5 bg-black/5 text-[#0B071E]/50">
                On-Demand Help
              </span>

              {/* Title */}
              <h3 className="font-display font-black text-2xl text-[#0B071E] mb-3">
                Peer Tutor Marketplace
              </h3>
              
              <p className="text-[#0B071E]/70 text-sm leading-relaxed mb-6 font-semibold">
                Struggling with a concept? Post a request, receive competitive bids from verified peer tutors who aced your course, and learn at a budget you set.
              </p>

              {/* Interactive Widget 2: Live Bid Feed Simulator */}
              <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-4 mb-6 border border-black/5 dark:border-white/5 space-y-3.5">
                <div className="p-3 rounded-xl bg-white dark:bg-[#110A20] border border-black/5 dark:border-white/5 relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black text-[#FF4B72] uppercase tracking-wider">Active Help Request</span>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">Budget: PKR 2,000</span>
                  </div>
                  <h4 className="text-[11px] font-bold text-[#0B071E] mb-1">Struggling with OOP polymorphism</h4>
                  <p className="text-[9px] text-[#0B071E]/60 font-medium">Need java code explanation for midterms prep.</p>
                </div>

                {/* Animated Bid Incoming */}
                <div className="relative h-[65px] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeBidIdx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-x-0 p-2.5 rounded-xl bg-gradient-to-r from-[#FF4B72]/5 to-[#0066FF]/5 border border-dashed border-[#FF4B72]/30 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF4B72] to-[#0066FF] flex items-center justify-center text-white font-extrabold text-[10px]">
                          {mockBids[activeBidIdx].name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-[10px] font-black text-[#0B071E]">{mockBids[activeBidIdx].name}</div>
                          <div className="flex items-center gap-1 text-[8px] text-[#0B071E]/40 font-bold">
                            <Star size={8} className="fill-yellow-400 text-yellow-400" />
                            {mockBids[activeBidIdx].rating} · {mockBids[activeBidIdx].sessions} sessions
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] font-black text-[#FF4B72]">PKR {mockBids[activeBidIdx].amount}</div>
                        <div className="text-[7px] text-[#0B071E]/30 font-bold">{mockBids[activeBidIdx].time}</div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-2 mb-8">
                {['Real-time Bid Pricing', 'Verified Class-Aced Peer Tutors', '1-on-1 Personalized Chat'].map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-xs font-bold text-[#0B071E]/80">
                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/marketplace"
              className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 border-2 transition-all duration-200 bg-white border-dark text-dark shadow-[4px_4px_0px_#0B071E] hover:shadow-[6px_6px_0px_#0B071E] hover:-translate-y-0.5"
            >
              Open Marketplace
              <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* Card 3: University Explorer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-8 flex flex-col justify-between relative overflow-hidden border-black/10 bg-white/60"
          >
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-5 bg-black/5 text-[#0B071E]/50">
                Admissions & Fees
              </span>

              {/* Title */}
              <h3 className="font-display font-black text-2xl text-[#0B071E] mb-3">
                University Explorer
              </h3>
              
              <p className="text-[#0B071E]/70 text-sm leading-relaxed mb-6 font-semibold">
                Compare fee structures, degree checklists, and entry test admission criteria across 120+ Pakistani universities to choose your dream destination.
              </p>

              {/* Interactive Widget 3: Mini comparison cards */}
              <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-4 mb-6 border border-black/5 dark:border-white/5 space-y-2">
                {[
                  { name: 'NUST', fee: '140k/sem', test: 'NET / SAT', deadline: 'Aug 31' },
                  { name: 'FAST-NU', fee: '160k/sem', test: 'Admission Test', deadline: 'July 15' },
                ].map((uni, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#110A20] border border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-semibold"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#0b071e]/5 dark:bg-white/5 flex items-center justify-center text-[10px] font-black text-[#06b6d4]">
                        {uni.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-[#0B071E]">{uni.name}</div>
                        <div className="text-[8px] text-[#0B071E]/40 font-bold">{uni.test}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-[#0B071E]">PKR {uni.fee}</div>
                      <div className="text-[8px] text-red-500 font-bold">Due: {uni.deadline}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Features List */}
              <ul className="space-y-2 mb-8">
                {['Verified Semester Fees', 'Entry Test Eligibility Filters', 'Programs & Intake Deadlines'].map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-xs font-bold text-[#0B071E]/80">
                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/universities"
              className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 border-2 transition-all duration-200 bg-white border-dark text-dark shadow-[4px_4px_0px_#0B071E] hover:shadow-[6px_6px_0px_#0B071E] hover:-translate-y-0.5"
            >
              Explore Universities
              <ArrowRight size={14} />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
