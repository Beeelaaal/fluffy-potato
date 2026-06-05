'use client';

import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

export default function ThemeShutter() {
  const { isTransitioning, targetTheme } = useTheme();

  if (!isTransitioning) return null;

  const isToDark = targetTheme === 'dark';

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
      {/* ─── FULL SCREEN POINTER BLOCKER / AMBIENT CARD OVERLAY ─── */}
      <motion.div
        className="absolute inset-0 bg-black/5 dark:bg-black/20 pointer-events-auto"
        animate={{
          opacity: [0, 1, 1, 0]
        }}
        transition={{
          times: [0, 0.25, 0.85, 1],
          duration: 1.2,
          ease: 'easeInOut'
        }}
      />

      {/* ─── FULL SCREEN RADIAL LIGHTING GLOW ─── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(255, 210, 20, 0.25) 0%, rgba(255, 210, 20, 0) 65%)',
        }}
        animate={{
          opacity: isToDark
            ? [1, 1, 1, 0, 0] // fades out when light switches off
            : [0, 0, 0, 1, 1]  // fades in when light switches on
        }}
        transition={{
          times: [0, 0.36, 0.42, 0.50, 1],
          duration: 1.2,
          ease: 'easeInOut'
        }}
      />

      {/* ─── HANGING CAFE LAMP CONTAINER ─── */}
      <motion.div
        animate={{
          y: ['-100%', '0%', '0%', '-100%'],
          rotate: [0, -8, 8, 10, -5, 3, -1, 0, 0]
        }}
        transition={{
          y: {
            times: [0, 0.25, 0.85, 1],
            duration: 1.2,
            ease: [0.76, 0, 0.24, 1]
          },
          rotate: {
            times: [0, 0.15, 0.28, 0.36, 0.45, 0.58, 0.70, 0.82, 1],
            duration: 1.2,
            ease: 'easeOut'
          }
        }}
        style={{ width: '200px', height: '350px', transformOrigin: 'top center' }}
        className="absolute top-0 left-0 right-0 mx-auto flex flex-col items-center z-10"
      >
        <svg viewBox="0 0 200 350" className="w-full h-full drop-shadow-lg">
          <defs>
            {/* Lamp Glow Gradients */}
            <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF3A1" stopOpacity="0.8" />
              <stop offset="30%" stopColor="#FFD214" stopOpacity="0.55" />
              <stop offset="70%" stopColor="#FFD214" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#FFD214" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="shadeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2D1A52" />
              <stop offset="100%" stopColor="#110A20" />
            </linearGradient>
          </defs>

          {/* Hanging Cord */}
          <line x1="100" y1="0" x2="100" y2="140" stroke="#4A465B" strokeWidth="2.5" />

          {/* Cord Attachment Loop */}
          <circle cx="100" cy="140" r="4" fill="none" stroke="#4A465B" strokeWidth="2" />

          {/* Vintage Lamp Shade */}
          <path
            d="M 85 145 C 85 145, 88 165, 60 185 L 140 185 C 112 165, 115 145, 115 145 Z"
            fill="url(#shadeGrad)"
            stroke="#4A465B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Pull Cord String (Chain-link beads styled via stroke-dasharray) */}
          <motion.line
            x1="120"
            y1="180"
            animate={{
              y2: [230, 230, 255, 230, 230] // cord pull down and snap back
            }}
            x2="120"
            transition={{
              times: [0, 0.28, 0.36, 0.45, 1],
              duration: 1.2,
              ease: 'easeInOut'
            }}
            stroke="#8E8A9E"
            strokeWidth="1.5"
            strokeDasharray="2 3"
          />

          {/* Pull Knob */}
          <motion.circle
            cx="120"
            animate={{
              cy: [230, 230, 255, 230, 230]
            }}
            transition={{
              times: [0, 0.28, 0.36, 0.45, 1],
              duration: 1.2,
              ease: 'easeInOut'
            }}
            r="4"
            fill="#FF4B72"
          />

          {/* ─── LAMP GLOW AREA ─── */}
          {/* Bulb Glow: Turns ON or OFF */}
          <motion.circle
            cx="100"
            cy="205"
            r="70"
            fill="url(#bulbGlow)"
            animate={{
              opacity: isToDark
                ? [0.95, 0.95, 0.95, 0, 0] // turns off
                : [0, 0, 0, 0.95, 0.95]  // turns on
            }}
            transition={{
              times: [0, 0.36, 0.42, 0.50, 1],
              duration: 1.2,
              ease: 'easeOut'
            }}
          />

          {/* Warm Light Beam Cone */}
          <motion.polygon
            points="70,185 130,185 180,350 20,350"
            fill="url(#bulbGlow)"
            animate={{
              opacity: isToDark
                ? [0.38, 0.38, 0.38, 0, 0]
                : [0, 0, 0, 0.38, 0.38]
            }}
            transition={{
              times: [0, 0.36, 0.42, 0.50, 1],
              duration: 1.2,
              ease: 'easeOut'
            }}
          />

          {/* Bulb Socket/Base */}
          <rect x="94" y="185" width="12" height="6" fill="#D1D5DB" stroke="#4A465B" strokeWidth="1.5" rx="1" />

          {/* Glass Bulb Outline */}
          <circle cx="100" cy="205" r="16" fill="rgba(255, 255, 255, 0.08)" stroke="#4A465B" strokeWidth="1.5" />

          {/* Edison Bulb Filament Glow */}
          <motion.circle
            cx="100"
            cy="198"
            r="4"
            animate={{
              fill: isToDark
                ? ['#FFF3A1', '#FFF3A1', '#FFF3A1', '#4B5563', '#4B5563']
                : ['#4B5563', '#4B5563', '#4B5563', '#FFF3A1', '#FFF3A1']
            }}
            transition={{
              times: [0, 0.36, 0.42, 0.50, 1],
              duration: 1.2
            }}
          />

          {/* Edison Bulb Filament Wire */}
          <motion.path
            d="M 97 208 L 99 196 L 101 196 L 103 208"
            fill="none"
            animate={{
              stroke: isToDark
                ? ['#FFA500', '#FFA500', '#FFA500', '#4A465B', '#4A465B']
                : ['#4A465B', '#4A465B', '#4A465B', '#FFA500', '#FFA500']
            }}
            transition={{
              times: [0, 0.36, 0.42, 0.50, 1],
              duration: 1.2
            }}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}
