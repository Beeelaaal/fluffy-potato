'use client';

import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

export default function ThemeShutter() {
  const { isTransitioning, targetTheme } = useTheme();

  if (!isTransitioning) return null;

  const isToDark = targetTheme === 'dark';

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
      {/* ─── FULL SCREEN OVERLAY BACKGROUND ─── */}
      <motion.div
        animate={{
          backgroundColor: isToDark
            ? ['rgba(253, 251, 247, 0)', 'rgba(253, 251, 247, 0.85)', '#0A0514', '#0A0514', 'rgba(10, 5, 20, 0)']
            : ['rgba(10, 5, 20, 0)', 'rgba(10, 5, 20, 0.9)', '#FDFBF7', '#FDFBF7', 'rgba(253, 251, 247, 0)']
        }}
        transition={{
          times: [0, 0.25, 0.45, 0.75, 1],
          duration: 0.95,
          ease: 'easeInOut'
        }}
        className="absolute inset-0 pointer-events-auto"
      />

      {/* ─── HANGING CAFE LAMP CONTAINER ─── */}
      <motion.div
        animate={{
          y: ['-100%', '0%', '0%', '-100%']
        }}
        transition={{
          times: [0, 0.25, 0.75, 1],
          duration: 0.95,
          ease: [0.76, 0, 0.24, 1] // smooth cubic-bezier curve
        }}
        className="absolute top-0 flex flex-col items-center z-10"
        style={{ width: '200px', height: '350px' }}
      >
        <svg viewBox="0 0 200 350" className="w-full h-full drop-shadow-lg">
          <defs>
            {/* Lamp Glow Gradients */}
            <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF3A1" stopOpacity="0.8" />
              <stop offset="30%" stopColor="#FFD214" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#FFD214" stopOpacity="0.15" />
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

          {/* Pull Cord String */}
          <motion.line
            x1="120"
            y1="180"
            animate={{
              y2: isToDark
                ? [230, 230, 250, 230, 230] // pull down at t = 280ms - 350ms
                : [230, 230, 250, 230, 230]
            }}
            x2="120"
            transition={{
              times: [0, 0.28, 0.35, 0.45, 1],
              duration: 0.95,
              ease: 'easeInOut'
            }}
            stroke="#8E8A9E"
            strokeWidth="1.5"
          />

          {/* Pull Knob */}
          <motion.circle
            cx="120"
            animate={{
              cy: isToDark
                ? [230, 230, 250, 230, 230]
                : [230, 230, 250, 230, 230]
            }}
            transition={{
              times: [0, 0.28, 0.35, 0.45, 1],
              duration: 0.95,
              ease: 'easeInOut'
            }}
            r="4"
            fill="#FF4B72"
          />

          {/* ─── LAMP GLOW AREA ─── */}
          {/* Transition to Dark: Starts ON, turns OFF at 380ms */}
          <motion.circle
            cx="100"
            cy="210"
            r="80"
            fill="url(#bulbGlow)"
            animate={{
              opacity: isToDark
                ? [0.9, 0.9, 0.9, 0, 0] // turns off at t = 380ms
                : [0, 0, 0, 0.9, 0.9]  // turns on at t = 380ms
            }}
            transition={{
              times: [0, 0.25, 0.36, 0.4, 1],
              duration: 0.95,
              ease: 'easeOut'
            }}
          />

          {/* Warm Light Beam Cone */}
          <motion.polygon
            points="70,185 130,185 170,350 30,350"
            fill="url(#bulbGlow)"
            animate={{
              opacity: isToDark
                ? [0.35, 0.35, 0.35, 0, 0]
                : [0, 0, 0, 0.35, 0.35]
            }}
            transition={{
              times: [0, 0.25, 0.36, 0.4, 1],
              duration: 0.95,
              ease: 'easeOut'
            }}
          />

          {/* Edison Bulb Filament Glow */}
          <motion.circle
            cx="100"
            cy="195"
            r="12"
            animate={{
              fill: isToDark
                ? ['#FFF3A1', '#FFF3A1', '#FFF3A1', '#4B5563', '#4B5563']
                : ['#4B5563', '#4B5563', '#4B5563', '#FFF3A1', '#FFF3A1']
            }}
            transition={{
              times: [0, 0.25, 0.36, 0.4, 1],
              duration: 0.95
            }}
            stroke="#4A465B"
            strokeWidth="1.5"
          />
        </svg>
      </motion.div>
    </div>
  );
}
