'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { GraduationCap, BookOpen, Users, Coins, ArrowRight, Zap } from 'lucide-react';

const scenarios = [
  {
    id: 'vault-get',
    title: 'The 11th Hour Exam Rescue',
    badge: 'Get Study Notes',
    icon: BookOpen,
    color: '#0066FF', // electric blue
    description: 'Stuck preparing for a midterm? Query the Vault for study guides, past exams, and notes uploaded by students who aced the exact same course.',
    flowText: 'Search ➜ Pay a tiny fee ➜ Download instantly.',
    nodes: ['you', 'vault'],
  },
  {
    id: 'tutor-hire',
    title: 'The Tough Assignment Block',
    badge: 'Hire a Tutor',
    icon: Users,
    color: '#FF4B72', // coral
    description: 'Stuck on a complex programming lab or math proof? Post a help request. Tutors bid their rates, you pick the best match, and get live help.',
    flowText: 'Post Request ➜ Receive Bids ➜ Hire & Learn.',
    nodes: ['you', 'marketplace'],
  },
  {
    id: 'vault-sell',
    title: 'Monetize Your Study Materials',
    badge: 'Sell Notes',
    icon: Coins,
    color: '#2EF2FF', // cyan
    description: 'Have pristine lecture notes or lab files? Upload them to the Vault. Set your own price and earn passive income every time peers download them.',
    flowText: 'Upload Notes ➜ Peers Download ➜ Cash Out Earnings.',
    nodes: ['you', 'vault', 'wallet'],
  },
  {
    id: 'tutor-earn',
    title: 'Earn as a Student Tutor',
    badge: 'Become a Tutor',
    icon: Zap,
    color: '#FFD214', // yellow
    description: 'Aced your sophomore physics or intro to coding? Become a peer tutor. Browse marketplace requests, place a bid, and teach online.',
    flowText: 'Place Bid ➜ Teach 1-on-1 ➜ Receive Payments.',
    nodes: ['marketplace', 'you', 'wallet'],
  },
];

export default function HowItWorksSection() {
  const [activeScenario, setActiveScenario] = useState('vault-get');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const current = scenarios.find((s) => s.id === activeScenario) || scenarios[0];

  return (
    <section className="py-28 relative overflow-hidden" id="how-it-works">
      {/* Decorative background mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-funky-blue/5 blur-[120px] pointer-events-none" />

      <div className="section-container" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="section-badge mb-5 mx-auto w-fit">Ecosystem Flow</div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-5">
            How value flows through <span className="gradient-text">Tute</span>
          </h2>
          <p className="text-dark/60 dark:text-white/60 text-lg max-w-xl mx-auto font-semibold">
            Interactive Node Web: Click a scenario to witness how students, tutors, and learning resources connect.
          </p>
        </motion.div>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Scenarios list */}
          <div className="lg:col-span-7 space-y-4 order-last lg:order-none">
            {scenarios.map((scenario, i) => {
              const Icon = scenario.icon;
              const isActive = scenario.id === activeScenario;
              return (
                <motion.button
                  key={scenario.id}
                  onClick={() => setActiveScenario(scenario.id)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all relative flex flex-col sm:flex-row gap-4 items-start ${
                    isActive
                      ? 'bg-white dark:bg-dark-800 border-dark dark:border-white/20 shadow-[6px_6px_0px_#0B071E] dark:shadow-[6px_6px_0px_rgba(255,255,255,0.15)] scale-[1.01]'
                      : 'bg-white/40 dark:bg-dark-800/20 border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 hover:bg-white/70 dark:hover:bg-dark-800/40'
                  }`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  type="button"
                >
                  {/* Icon */}
                  <div
                    className="p-3 rounded-xl border border-black/5 dark:border-white/5 flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${scenario.color}15`,
                      color: scenario.color,
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-dark/60 dark:text-white/60">
                        {scenario.badge}
                      </span>
                      <h3 className="font-display font-black text-base md:text-lg text-dark dark:text-white">
                        {scenario.title}
                      </h3>
                    </div>
                    <p className="text-dark/60 dark:text-white/60 text-xs md:text-sm font-semibold leading-relaxed">
                      {scenario.description}
                    </p>

                    {/* Flow breadcrumbs */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[11px] font-bold mt-2 py-1 px-3 rounded-lg border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 inline-flex items-center gap-1"
                        style={{ color: scenario.color }}
                      >
                        <span className="text-dark/40 dark:text-white/40 mr-1">Flow:</span>
                        {scenario.flowText}
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Right: SVG Network Web */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              className="relative aspect-[420/360] w-full max-w-[420px] p-4 rounded-3xl border-2 border-black/5 dark:border-white/5 bg-white/20 dark:bg-dark-800/10 backdrop-blur-sm shadow-[0_12px_40px_rgba(0,0,0,0.02)]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6 }}
            >
              {/* SVG Connector Web */}
              <svg viewBox="0 0 420 360" className="absolute inset-0 w-full h-full">
                {/* Static grid connections */}
                <line x1="75" y1="130" x2="345" y2="70" className="stroke-dark/5 dark:stroke-white/5" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="75" y1="130" x2="345" y2="220" className="stroke-dark/5 dark:stroke-white/5" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="345" y1="70" x2="210" y2="310" className="stroke-dark/5 dark:stroke-white/5" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="345" y1="220" x2="210" y2="310" className="stroke-dark/5 dark:stroke-white/5" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="75" y1="130" x2="210" y2="310" className="stroke-dark/5 dark:stroke-white/5" strokeWidth="2" strokeDasharray="4 4" />

                {/* Animated active paths */}
                {activeScenario === 'vault-get' && (
                  <motion.line
                    x1="75" y1="130" x2="345" y2="70"
                    stroke="#0066FF"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    animate={{ strokeDashoffset: [0, -20] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  />
                )}
                {activeScenario === 'tutor-hire' && (
                  <motion.line
                    x1="75" y1="130" x2="345" y2="220"
                    stroke="#FF4B72"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    animate={{ strokeDashoffset: [0, -20] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  />
                )}
                {activeScenario === 'vault-sell' && (
                  <>
                    <motion.line
                      x1="75" y1="130" x2="345" y2="70"
                      stroke="#2EF2FF"
                      strokeWidth="3"
                      strokeDasharray="6 4"
                      animate={{ strokeDashoffset: [0, -20] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    />
                    <motion.line
                      x1="345" y1="70" x2="210" y2="310"
                      stroke="#FFD214"
                      strokeWidth="3"
                      strokeDasharray="6 4"
                      animate={{ strokeDashoffset: [0, -20] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    />
                  </>
                )}
                {activeScenario === 'tutor-earn' && (
                  <>
                    <motion.line
                      x1="345" y1="220" x2="75" y2="130"
                      stroke="#FF4B72"
                      strokeWidth="3"
                      strokeDasharray="6 4"
                      animate={{ strokeDashoffset: [0, 20] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    />
                    <motion.line
                      x1="75" y1="130" x2="210" y2="310"
                      stroke="#FFD214"
                      strokeWidth="3"
                      strokeDasharray="6 4"
                      animate={{ strokeDashoffset: [0, -20] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    />
                  </>
                )}

                {/* Animating flow particles */}
                <AnimatePresence mode="wait">
                  {activeScenario === 'vault-get' && (
                    <>
                      {/* You -> Vault */}
                      <motion.circle
                        key="vault-get-p1"
                        r="6"
                        fill="#0066FF"
                        filter="drop-shadow(0 0 6px #0066FF)"
                        animate={{
                          cx: [75, 345],
                          cy: [130, 70],
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                      {/* Vault -> You */}
                      <motion.circle
                        key="vault-get-p2"
                        r="6"
                        fill="#2EF2FF"
                        filter="drop-shadow(0 0 6px #2EF2FF)"
                        animate={{
                          cx: [345, 75],
                          cy: [70, 130],
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 0.9,
                        }}
                      />
                    </>
                  )}
                  {activeScenario === 'tutor-hire' && (
                    <>
                      {/* You -> Marketplace */}
                      <motion.circle
                        key="tutor-hire-p1"
                        r="6"
                        fill="#FF4B72"
                        filter="drop-shadow(0 0 6px #FF4B72)"
                        animate={{
                          cx: [75, 345],
                          cy: [130, 220],
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                      {/* Marketplace -> You */}
                      <motion.circle
                        key="tutor-hire-p2"
                        r="6"
                        fill="#FFD214"
                        filter="drop-shadow(0 0 6px #FFD214)"
                        animate={{
                          cx: [345, 75],
                          cy: [220, 130],
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 0.9,
                        }}
                      />
                    </>
                  )}
                  {activeScenario === 'vault-sell' && (
                    <>
                      {/* You -> Vault */}
                      <motion.circle
                        key="vault-sell-p1"
                        r="6"
                        fill="#2EF2FF"
                        filter="drop-shadow(0 0 6px #2EF2FF)"
                        animate={{
                          cx: [75, 345],
                          cy: [130, 70],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                      {/* Vault -> Wallet */}
                      <motion.circle
                        key="vault-sell-p2"
                        r="6"
                        fill="#FFD214"
                        filter="drop-shadow(0 0 6px #FFD214)"
                        animate={{
                          cx: [345, 210],
                          cy: [70, 310],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 0.75,
                        }}
                      />
                    </>
                  )}
                  {activeScenario === 'tutor-earn' && (
                    <>
                      {/* Marketplace -> You */}
                      <motion.circle
                        key="tutor-earn-p1"
                        r="6"
                        fill="#FF4B72"
                        filter="drop-shadow(0 0 6px #FF4B72)"
                        animate={{
                          cx: [345, 75],
                          cy: [220, 130],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                      {/* You -> Wallet */}
                      <motion.circle
                        key="tutor-earn-p2"
                        r="6"
                        fill="#FFD214"
                        filter="drop-shadow(0 0 6px #FFD214)"
                        animate={{
                          cx: [75, 210],
                          cy: [130, 310],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 0.75,
                        }}
                      />
                    </>
                  )}
                </AnimatePresence>
              </svg>

              {/* HTML Absolute Nodes overlays */}
              {/* You Node */}
              <div
                className={`absolute w-14 h-14 md:w-16 md:h-16 rounded-2xl flex flex-col items-center justify-center border-2 bg-white dark:bg-dark-800 transition-all duration-300 shadow-[4px_4px_0px_rgba(11,7,30,0.06)] dark:shadow-none select-none`}
                style={{
                  left: '17.8%',
                  top: '36.1%',
                  transform: 'translate(-50%, -50%)',
                  borderColor: current.nodes.includes('you') ? current.color : 'rgba(11, 7, 30, 0.1)',
                  boxShadow: current.nodes.includes('you') ? `0px 0px 16px ${current.color}35` : '',
                  transformOrigin: 'center',
                }}
              >
                <GraduationCap size={24} style={{ color: current.nodes.includes('you') ? current.color : '#8E8A9E' }} />
                <span className="text-[10px] font-black text-dark/70 dark:text-white/70 absolute -bottom-6">STUDENT</span>
              </div>

              {/* The Vault Node */}
              <div
                className={`absolute w-14 h-14 md:w-16 md:h-16 rounded-2xl flex flex-col items-center justify-center border-2 bg-white dark:bg-dark-800 transition-all duration-300 shadow-[4px_4px_0px_rgba(11,7,30,0.06)] dark:shadow-none select-none`}
                style={{
                  left: '82.1%',
                  top: '19.4%',
                  transform: 'translate(-50%, -50%)',
                  borderColor: current.nodes.includes('vault') ? current.color : 'rgba(11, 7, 30, 0.1)',
                  boxShadow: current.nodes.includes('vault') ? `0px 0px 16px ${current.color}35` : '',
                }}
              >
                <BookOpen size={24} style={{ color: current.nodes.includes('vault') ? current.color : '#8E8A9E' }} />
                <span className="text-[10px] font-black text-dark/70 dark:text-white/70 absolute -bottom-6">THE VAULT</span>
              </div>

              {/* Marketplace Node */}
              <div
                className={`absolute w-14 h-14 md:w-16 md:h-16 rounded-2xl flex flex-col items-center justify-center border-2 bg-white dark:bg-dark-800 transition-all duration-300 shadow-[4px_4px_0px_rgba(11,7,30,0.06)] dark:shadow-none select-none`}
                style={{
                  left: '82.1%',
                  top: '61.1%',
                  transform: 'translate(-50%, -50%)',
                  borderColor: current.nodes.includes('marketplace') ? current.color : 'rgba(11, 7, 30, 0.1)',
                  boxShadow: current.nodes.includes('marketplace') ? `0px 0px 16px ${current.color}35` : '',
                }}
              >
                <Users size={24} style={{ color: current.nodes.includes('marketplace') ? current.color : '#8E8A9E' }} />
                <span className="text-[10px] font-black text-dark/70 dark:text-white/70 absolute -bottom-6">MARKETPLACE</span>
              </div>

              {/* Wallet Node */}
              <div
                className={`absolute w-14 h-14 md:w-16 md:h-16 rounded-2xl flex flex-col items-center justify-center border-2 bg-white dark:bg-dark-800 transition-all duration-300 shadow-[4px_4px_0px_rgba(11,7,30,0.06)] dark:shadow-none select-none`}
                style={{
                  left: '50.0%',
                  top: '86.1%',
                  transform: 'translate(-50%, -50%)',
                  borderColor: current.nodes.includes('wallet') ? current.color : 'rgba(11, 7, 30, 0.1)',
                  boxShadow: current.nodes.includes('wallet') ? `0px 0px 16px ${current.color}35` : '',
                }}
              >
                <Coins size={24} style={{ color: current.nodes.includes('wallet') ? current.color : '#8E8A9E' }} />
                <span className="text-[10px] font-black text-dark/70 dark:text-white/70 absolute -bottom-6">WALLET</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
