'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  hoverShadowColor?: string;
  [key: string]: any;
}

export default function TiltCard({ children, className = '', maxTilt = 10, hoverShadowColor, ...props }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center (-0.5 to 0.5)
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Calculate rotation degree
    const rY = (mouseX / (width / 2)) * maxTilt;
    const rX = -(mouseY / (height / 2)) * maxTilt;

    setRotateX(rX);
    setRotateY(rY);

    // Calculate glare position percentage
    const glX = ((e.clientX - rect.left) / width) * 100;
    const glY = ((e.clientY - rect.top) / height) * 100;
    setGlareX(glX);
    setGlareY(glY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className="w-full h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          scale: isHovered ? 1.025 : 1,
          z: isHovered ? 15 : 0
        }}
        style={{
          boxShadow: isHovered && hoverShadowColor ? `0 20px 45px -12px ${hoverShadowColor}` : undefined,
          ...props.style
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className={`w-full h-full relative overflow-hidden transform-style-3d ${className}`}
        {...props}
      >
        {/* Shiny Light Reflection Glare Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 opacity-0 group-hover:opacity-30 mix-blend-overlay"
          style={{
            background: `radial-gradient(circle 220px at ${glareX}% ${glareY}%, rgba(255,255,255,0.7), transparent)`,
          }}
        />
        {children}
      </motion.div>
    </div>
  );
}
