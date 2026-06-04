'use client';

import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeShutter() {
  const { isTransitioning } = useTheme();

  return (
    <AnimatePresence>
      {isTransitioning && (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center justify-center">
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
    </AnimatePresence>
  );
}
