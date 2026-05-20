'use client';

import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-funky-purple/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="section-container relative z-10 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="section-badge mb-4 mx-auto w-fit">Legal</div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-4">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-[#0B071E]/40 text-xs font-semibold">Last Updated: May 21, 2026</p>
        </motion.div>

        <motion.div 
          className="glass-card p-8 md:p-10 space-y-6 text-[#0B071E]/80 text-sm font-semibold leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-display font-bold text-2xl text-[#0B071E]">1. Information We Collect</h2>
          <p>
            We collect personal information such as your name, email address, phone number, university, and profile details to match you with tutors, list resources, and manage communication on Tute.
          </p>

          <h2 className="font-display font-bold text-2xl text-[#0B071E]">2. How We Use Your Information</h2>
          <p>
            Your information is used to facilitate tutor bids, university application processes, document sharing, and notifications. We will never sell your information to third-party marketing companies.
          </p>

          <h2 className="font-display font-bold text-2xl text-[#0B071E]">3. Data Security</h2>
          <p>
            All user data is stored securely using industry-standard Firebase Security rules. However, please note that no method of transmission over the internet is 100% secure.
          </p>

          <h2 className="font-display font-bold text-2xl text-[#0B071E]">4. Cookies</h2>
          <p>
            We use essential cookies and local storage tokens to keep you logged in and preserve your custom preferences across the site.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
