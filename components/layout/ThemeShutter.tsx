'use client';

import React, { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

// Synthesize a mechanical pull-switch click sound using browser Web Audio API
const playClickSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // 1. High-frequency metallic latch click
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1600, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.02);
    gain1.gain.setValueAtTime(0.06, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    // 2. Low-frequency casing housing resonance (delayed by 15ms)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(220, ctx.currentTime + 0.015);
    osc2.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.05);
    gain2.gain.setValueAtTime(0.12, ctx.currentTime + 0.015);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.03);
    osc2.stop(ctx.currentTime + 0.07);
  } catch (e) {
    console.warn('Web Audio API click sound was blocked or is unsupported:', e);
  }
};

const sparkDirections = [
  { dx: -24, dy: 6, rot: 15 },
  { dx: 24, dy: 6, rot: -15 },
  { dx: -16, dy: -20, rot: 45 },
  { dx: 16, dy: -20, rot: -45 },
  { dx: -8, dy: 24, rot: 75 },
  { dx: 8, dy: 24, rot: -75 },
];

export default function ThemeShutter() {
  const { isTransitioning, targetTheme } = useTheme();

  const isToDark = targetTheme === 'dark';

  useEffect(() => {
    if (isTransitioning) {
      // Play pull cord latch click sound at 430ms (when pull reaches max & snaps back)
      const timer = setTimeout(() => {
        playClickSound();
      }, 430);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  if (!isTransitioning) return null;

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
          background: 'radial-gradient(circle at 50% 0%, rgba(255, 210, 20, 0.22) 0%, rgba(255, 210, 20, 0) 65%)',
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
          y: ['-100%', '3%', '-1%', '0%', '0%', '-100%'], // Elastic spring entry bounce + exit
          rotate: [0, -8, 8, 10, -5, 3, -1, 0, 0]
        }}
        transition={{
          y: {
            times: [0, 0.22, 0.27, 0.32, 0.85, 1],
            duration: 1.2,
            ease: [0.25, 1, 0.5, 1]
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
              <stop offset="0%" stopColor="#FFF3A1" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#FFD214" stopOpacity="0.6" />
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
          {/* Bulb Glow with realistic power flickers */}
          <motion.circle
            cx="100"
            cy="205"
            r="70"
            fill="url(#bulbGlow)"
            animate={{
              opacity: isToDark
                ? [0.95, 0.95, 0.95, 0.2, 0.8, 0, 0] // dying filament fade-out
                : [0, 0, 0, 0.95, 0.2, 0.95, 0.4, 0.95, 0.95]  // double electric flicker ignite
            }}
            transition={{
              times: isToDark
                ? [0, 0.36, 0.42, 0.44, 0.46, 0.48, 1]
                : [0, 0.36, 0.42, 0.44, 0.46, 0.48, 0.50, 0.52, 1],
              duration: 1.2,
              ease: 'easeOut'
            }}
          />

          {/* Warm Light Beam Cone with coordinated flickers */}
          <motion.polygon
            points="70,185 130,185 180,350 20,350"
            fill="url(#bulbGlow)"
            animate={{
              opacity: isToDark
                ? [0.38, 0.38, 0.38, 0.08, 0.3, 0, 0]
                : [0, 0, 0, 0.38, 0.08, 0.38, 0.15, 0.38, 0.38]
            }}
            transition={{
              times: isToDark
                ? [0, 0.36, 0.42, 0.44, 0.46, 0.48, 1]
                : [0, 0.36, 0.42, 0.44, 0.46, 0.48, 0.50, 0.52, 1],
              duration: 1.2,
              ease: 'easeOut'
            }}
          />

          {/* Bulb Socket/Base */}
          <rect x="94" y="185" width="12" height="6" fill="#D1D5DB" stroke="#4A465B" strokeWidth="1.5" rx="1" />

          {/* Glass Bulb Outline */}
          <circle cx="100" cy="205" r="16" fill="rgba(255, 255, 255, 0.08)" stroke="#4A465B" strokeWidth="1.5" />

          {/* Edison Bulb Filament Glow Center */}
          <motion.circle
            cx="100"
            cy="198"
            r="4"
            animate={{
              fill: isToDark
                ? ['#FFF3A1', '#FFF3A1', '#FFF3A1', '#FF8C00', '#FF4500', '#4B5563', '#4B5563']
                : ['#4B5563', '#4B5563', '#4B5563', '#FF4500', '#FF8C00', '#FFF3A1', '#FFF3A1']
            }}
            transition={{
              times: [0, 0.36, 0.42, 0.44, 0.46, 0.48, 1],
              duration: 1.2
            }}
          />

          {/* Edison Bulb Filament Wire */}
          <motion.path
            d="M 97 208 L 99 196 L 101 196 L 103 208"
            fill="none"
            animate={{
              stroke: isToDark
                ? ['#FFA500', '#FFA500', '#FFA500', '#FF4500', '#E25822', '#4A465B', '#4A465B']
                : ['#4A465B', '#4A465B', '#4A465B', '#E25822', '#FF4500', '#FFA500', '#FFA500']
            }}
            transition={{
              times: [0, 0.36, 0.42, 0.44, 0.46, 0.48, 1],
              duration: 1.2
            }}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* ─── DYNAMIC ELECTRICAL SPARK BURST ─── */}
          {sparkDirections.map((dir, sIndex) => (
            <motion.line
              key={sIndex}
              x1="100"
              y1="205"
              x2="100"
              y2="205"
              stroke="#FFB800"
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={{
                x2: [100, 100 + dir.dx],
                y2: [205, 205 + dir.dy],
                opacity: [0, 1, 0],
              }}
              transition={{
                delay: 0.43, // Fire exactly when the mechanical click plays
                duration: 0.22,
                ease: 'easeOut',
                repeat: 0,
              }}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
}
