'use client';

import { motion } from 'framer-motion';
import { Target, Users, Landmark, Heart } from 'lucide-react';

export default function AboutPage() {
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
          <div className="section-badge mb-4 mx-auto w-fit">About Tute</div>
          <h1 className="font-display font-black text-5xl sm:text-6xl tracking-tight mb-6">
            Empowering Pakistani <span className="gradient-text">Students</span>
          </h1>
          <p className="text-[#0B071E]/80 text-lg sm:text-xl max-w-2xl mx-auto font-semibold leading-relaxed">
            We are building the ultimate academic peer network to simplify university discovery, course resources, and expert tutoring.
          </p>
        </motion.div>

        <div className="space-y-12">
          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div 
              className="glass-card p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-12 h-12 rounded-2xl bg-funky-cyan/10 border border-funky-cyan/20 flex items-center justify-center mb-5">
                <Target size={22} className="text-funky-cyan" />
              </div>
              <h2 className="font-display font-bold text-2xl mb-3">Our Mission</h2>
              <p className="text-[#0B071E]/75 text-sm leading-relaxed font-semibold">
                To democratize higher education support in Pakistan by enabling students to share knowledge, access organized academic resources, and match with peer tutors who understand their curriculum.
              </p>
            </motion.div>

            <motion.div 
              className="glass-card p-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center mb-5">
                <Users size={22} className="text-[#8B5CF6]" />
              </div>
              <h2 className="font-display font-bold text-2xl mb-3">Our Vision</h2>
              <p className="text-[#0B071E]/75 text-sm leading-relaxed font-semibold">
                To bridge the educational accessibility gap in Pakistan, providing a space where every student has the tools and personalized guidance to excel at their dream university.
              </p>
            </motion.div>
          </div>

          {/* Story Card */}
          <motion.div 
            className="glass-card p-8 md:p-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-display font-bold text-3xl mb-5">The Tute Story</h2>
            <div className="space-y-4 text-[#0B071E]/85 text-sm font-semibold leading-relaxed">
              <p>
                As university students in Pakistan, we noticed a recurring struggle: finding structured course notes, past exams, or relevant academic help was incredibly difficult. Every university has its own unique curriculum and exam patterns, making generic global platforms ineffective.
              </p>
              <p>
                Tute was born out of this challenge. We built a platform designed specifically for local university structures (NUST, FAST, LUMS, PU, COMSATS, and more). We enable seniors to help juniors by sharing past papers, and qualified peer tutors to bid on requests posted by students needing assistance.
              </p>
              <p>
                Today, Tute is Pakistan&apos;s fastest growing student network, powered by trust, transparency, and a passion for mutual student success.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
