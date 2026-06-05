'use client';

import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeShutter() {
  const { isTransitioning, targetTheme } = useTheme();

  return (
    <AnimatePresence>
      {isTransitioning && (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
          
          {/* ─── ANIMATION A: TRANSITION TO DARK (LIGHTS OFF) ─── */}
          {targetTheme === 'dark' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 bg-[#0A0514] pointer-events-auto flex flex-col items-center justify-center"
            >
              {/* Outer Switch Plate */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                className="w-24 h-40 rounded-3xl bg-[#1A0F30] border-2 border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)] flex items-center justify-center relative p-3"
              >
                {/* Switch Groove */}
                <div className="w-10 h-28 rounded-full bg-[#0B071E] border border-white/5 flex flex-col justify-between py-2 items-center relative overflow-hidden">
                  {/* ON/OFF Labels */}
                  <span className="text-[8px] font-black text-white/20 select-none">ON</span>
                  <span className="text-[8px] font-black text-white/20 select-none">OFF</span>

                  {/* Switch Handle Toggle */}
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: 44 }} // Moves down to turn off
                    transition={{
                      delay: 0.25,
                      type: 'spring',
                      stiffness: 400,
                      damping: 15
                    }}
                    className="absolute top-2 w-8 h-10 rounded-2xl bg-gradient-to-b from-[#2EF2FF] to-[#0066FF] border border-[#2EF2FF]/50 shadow-[0_0_20px_rgba(46,242,255,0.6)] cursor-pointer flex items-center justify-center"
                  >
                    {/* Ridge lines on switch */}
                    <div className="flex flex-col gap-0.5">
                      <div className="w-4 h-[2px] bg-white/60 rounded" />
                      <div className="w-4 h-[2px] bg-white/60 rounded" />
                      <div className="w-4 h-[2px] bg-white/60 rounded" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Clicking ripple wave */}
              <motion.div
                initial={{ scale: 0.2, opacity: 0 }}
                animate={{ scale: 3, opacity: [0, 1, 0] }}
                transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
                className="absolute w-80 h-80 rounded-full border border-[#2EF2FF] pointer-events-none"
              />

              {/* Click label text */}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 1, 1, 0], y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-[9px] font-black text-[#2EF2FF] tracking-[0.3em] uppercase mt-6"
              >
                * CLICK *
              </motion.span>
            </motion.div>
          )}

          {/* ─── ANIMATION B: TRANSITION TO LIGHT (SHUTTERS OPENING) ─── */}
          {targetTheme === 'light' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Top shutter panel */}
              <motion.div
                initial={{ y: '-100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '-100%' }}
                transition={{
                  duration: 0.45,
                  ease: [0.76, 0, 0.24, 1]
                }}
                className="w-full h-1/2 bg-[#0A0514] border-b border-[#0066FF]/30 relative pointer-events-auto"
              >
                {/* Subtle glow edge */}
                <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#0066FF] shadow-[0_0_15px_rgba(0,102,255,0.7)]" />
              </motion.div>

              {/* Bottom shutter panel */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '100%' }}
                transition={{
                  duration: 0.45,
                  ease: [0.76, 0, 0.24, 1]
                }}
                className="w-full h-1/2 bg-[#0A0514] border-t border-[#0066FF]/30 relative pointer-events-auto"
              >
                {/* Subtle glow edge */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#0066FF] shadow-[0_0_15px_rgba(0,102,255,0.7)]" />
              </motion.div>

              {/* Center brand badge overlay */}
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -15 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0, rotate: 15 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  delay: 0.25
                }}
                className="absolute z-[10000] w-20 h-20 rounded-3xl bg-[#110A20] border-2 border-[#0066FF] shadow-[0_0_30px_rgba(0,102,255,0.6)] flex flex-col items-center justify-center"
              >
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#2EF2FF]">Tute</span>
                <span className="text-[7px] font-black text-white/50 tracking-widest mt-0.5 animate-pulse">L O A D</span>
              </motion.div>
            </div>
          )}

        </div>
      )}
    </AnimatePresence>
  );
}
