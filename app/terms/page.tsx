'use client';

import { motion } from 'framer-motion';

export default function TermsPage() {
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
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="text-[#0B071E]/40 text-xs font-semibold">Last Updated: May 21, 2026</p>
        </motion.div>

        <motion.div 
          className="glass-card p-8 md:p-10 space-y-6 text-[#0B071E]/80 text-sm font-semibold leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-display font-bold text-2xl text-[#0B071E]">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Tute, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not access or use the platform.
          </p>

          <h2 className="font-display font-bold text-2xl text-[#0B071E]">2. Platform Description</h2>
          <p>
            Tute is an EdTech peer network linking university students in Pakistan to help share academic resources, explore university information, and conduct tutor matching via a decentralized bidding system.
          </p>

          <h2 className="font-display font-bold text-2xl text-[#0B071E]">3. User Obligations & Conduct</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>You must provide accurate credentials and maintain the security of your account.</li>
            <li>Uploaded resources must not violate copyright, intellectual property rights, or university plagiarism guidelines.</li>
            <li>Harassment, abusive communication, or fraudulent bidding on the tutor marketplace will result in immediate termination of account access.</li>
          </ul>

          <h2 className="font-display font-bold text-2xl text-[#0B071E]">4. Tutor Agreement & Fees</h2>
          <p>
            Tutors act as independent service providers. Tute provides matching software and does not take responsibility for the teaching transactions, schedules, or pricing negotiations conducted outside the website.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
