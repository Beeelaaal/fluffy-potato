'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';

const FAQS = [
  {
    q: 'How does the tutor bidding system work?',
    a: 'When you post a help request, our verified tutors view it and submit their bids (along with price and custom notes). You can compare bids, read their profiles, ratings, and reviews, and accept the one that fits your needs.',
  },
  {
    q: 'Is it free to download study resources?',
    a: 'Yes, downloading academic notes, past papers, lab manuals, and timetables shared by fellow students on Tute is completely free. We encourage students to upload their own notes to help the community.',
  },
  {
    q: 'How do I become a verified tutor on Tute?',
    a: 'You can apply to tutor from your profile. We review your academic records, university affiliation, and grade transcripts to ensure you are qualified to assist other students.',
  },
  {
    q: 'Can I upload files for any Pakistani university?',
    a: 'Absolutely! Our resource hub supports filtering across NUST, FAST, LUMS, Punjab University, COMSATS, NED, and many more. If your university is not listed, you can ask an admin to add it.',
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [query, setQuery] = useState('');

  const filtered = FAQS.filter(
    f => f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-funky-purple/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[300px] bg-funky-cyan/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="section-container relative z-10 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="section-badge mb-4 mx-auto w-fit">Support</div>
          <h1 className="font-display font-bold text-5xl sm:text-6xl tracking-tight mb-6">
            Help <span className="gradient-text">Center</span>
          </h1>
          <p className="text-[#0B071E]/80 text-lg sm:text-xl max-w-xl mx-auto font-semibold mb-8">
            Find answers to frequently asked questions about Tute.
          </p>

          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B071E]/30" />
            <input
              type="text"
              placeholder="Search help topics..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>
        </motion.div>

        <div className="space-y-4">
          {filtered.map((faq, idx) => {
            const open = openIndex === idx;
            return (
              <motion.div
                key={idx}
                className="glass-card overflow-hidden"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <button
                  onClick={() => setOpenIndex(open ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-display font-bold text-base sm:text-lg text-[#0B071E] hover:text-[#8B5CF6] transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle size={18} className="text-[#8B5CF6] flex-shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-[#0B071E]/40 transition-transform duration-300 ${open ? 'rotate-180 text-[#8B5CF6]' : ''}`}
                  />
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: open ? 'auto' : 0 }}
                  className="overflow-hidden"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <div className="px-6 pb-6 pt-1 border-t border-black/5 text-[#0B071E]/75 text-sm font-semibold leading-relaxed">
                    {faq.a}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="glass-card p-10 text-center text-[#0B071E]/50 font-semibold">
              No matching questions found. Try searching different keywords.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
