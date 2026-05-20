'use client';

import { motion } from 'framer-motion';
import { Newspaper, ArrowDownToLine, Radio } from 'lucide-react';

export default function PressPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-funky-purple/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[300px] bg-funky-cyan/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="section-container relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="section-badge mb-4 mx-auto w-fit">Press Room</div>
          <h1 className="font-display font-black text-5xl sm:text-6xl tracking-tight mb-6">
            Tute in the <span className="gradient-text">News</span>
          </h1>
          <p className="text-[#0B071E]/80 text-lg sm:text-xl max-w-xl mx-auto font-semibold">
            Press releases, brand assets, and news about Tute EdTech updates.
          </p>
        </motion.div>

        <div className="space-y-6">
          <motion.div className="glass-card p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            initial={{ opacity: 0, y: 15 }}>
            <div>
              <span className="text-[#8B5CF6] text-xs font-black uppercase tracking-widest block mb-1">Official Resource</span>
              <h2 className="font-display font-bold text-2xl text-[#0B071E] mb-2">Tute Media Kit (2026)</h2>
              <p className="text-[#0B071E]/75 text-sm font-semibold">Download official logos, screenshots, and team photos for publication.</p>
            </div>
            <button className="btn-primary py-3 px-6 text-xs whitespace-nowrap">
              Download Kit <ArrowDownToLine size={14} />
            </button>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div className="glass-card p-6" initial={{ opacity: 0, x: -15 }} transition={{ delay: 0.1 }}>
              <div className="w-10 h-10 rounded-xl bg-funky-cyan/10 border border-funky-cyan/20 flex items-center justify-center mb-4">
                <Newspaper size={18} className="text-funky-cyan" />
              </div>
              <span className="text-[#0B071E]/40 text-xs font-bold block mb-1">TechJuice · March 2026</span>
              <h3 className="font-display font-bold text-lg mb-2 text-[#0B071E]">Tute Crosses 50,000 Enrolled Students in Pakistan</h3>
              <p className="text-[#0B071E]/75 text-xs font-semibold leading-relaxed">
                Tute has announced massive engagement metrics for its peer-to-peer university search engine and tutor marketplace models in Pakistan.
              </p>
            </motion.div>

            <motion.div className="glass-card p-6" initial={{ opacity: 0, x: 15 }} transition={{ delay: 0.2 }}>
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center mb-4">
                <Radio size={18} className="text-[#8B5CF6]" />
              </div>
              <span className="text-[#0B071E]/40 text-xs font-bold block mb-1">ProPakistani · Feb 2026</span>
              <h3 className="font-display font-bold text-lg mb-2 text-[#0B071E]">Bridging the Academic Resources Gap</h3>
              <p className="text-[#0B071E]/75 text-xs font-semibold leading-relaxed">
                How Tute is organizing past papers and verified peer tutoring specifically customized for local Pakistani engineering and business syllabi.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
