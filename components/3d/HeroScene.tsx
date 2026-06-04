'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number; // 3D coordinates
  y: number;
  z: number;
  vx: number; // Velocity
  vy: number;
  vz: number;
  r: number; // Radius
  color: string;
  baseAlpha: number;
}

export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let time = 0;

    // Canvas size
    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Mouse move handler
    function handleMouseMove(e: MouseEvent) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      // Normalized between -0.5 and 0.5
      mouseRef.current.targetX = (e.clientX - cx) / cx;
      mouseRef.current.targetY = (e.clientY - cy) / cy;
    }
    window.addEventListener('mousemove', handleMouseMove);

    // Initialize 3D particles in a box
    const particles: Particle[] = [];
    const colors = ['#2EF2FF', '#FF4B72', '#0066FF', '#D8FF3E'];
    const pCount = 90;
    const boxSize = 800; // 3D boundary: -400 to 400

    for (let i = 0; i < pCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * boxSize,
        y: (Math.random() - 0.5) * boxSize - 50, // slightly offset upwards
        z: (Math.random() - 0.5) * boxSize,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        vz: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha: Math.random() * 0.5 + 0.3,
      });
    }

    // Camera parameters
    const focalLength = 600;
    const cameraZ = 700; // Distance of camera from center of coordinates

    // Animation loop
    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.005;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Smooth mouse rotation
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Rotation angles (yaw & pitch)
      const angleY = time * 0.08 + mouse.x * 0.35; // auto-rotate + mouse X tilt
      const angleX = -0.15 + mouse.y * 0.25; // default angle + mouse Y tilt

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // 1. PROJECT AND UPDATE FLOOR WAVE GRID
      // Grid dimensions in 3D: -600 to 600 on X and Z axis
      const gridSpacing = 80;
      const gridMin = -600;
      const gridMax = 600;
      const wavePoints: { sx: number; sy: number; zDepth: number }[][] = [];

      for (let gz = gridMin; gz <= gridMax; gz += gridSpacing) {
        const row: { sx: number; sy: number; zDepth: number }[] = [];
        for (let gx = gridMin; gx <= gridMax; gx += gridSpacing) {
          // Dynamic wave height (Y)
          const dist = Math.sqrt(gx * gx + gz * gz);
          const gy = 260 + Math.sin(dist * 0.006 - time * 2) * 35;

          // 3D rotation
          // Rotate around Y
          let rx1 = gx * cosY - gz * sinY;
          let rz1 = gx * sinY + gz * cosY;

          // Rotate around X
          let ry2 = gy * cosX - rz1 * sinX;
          let rz2 = gy * sinX + rz1 * cosX;

          // Perspective projection
          const zDepth = rz2 + cameraZ;
          if (zDepth > 50) {
            const scale = focalLength / zDepth;
            const sx = centerX + rx1 * scale;
            const sy = centerY + ry2 * scale;
            row.push({ sx, sy, zDepth });
          } else {
            row.push({ sx: -999, sy: -999, zDepth: -1 });
          }
        }
        wavePoints.push(row);
      }

      // Draw wireframe grid lines
      ctx.lineWidth = 0.55;
      for (let r = 0; r < wavePoints.length; r++) {
        for (let c = 0; c < wavePoints[r].length; c++) {
          const pt = wavePoints[r][c];
          if (pt.zDepth <= 50) continue;

          const opacity = Math.max(0, Math.min(0.2, (1 - pt.zDepth / 1300) * 0.18));
          ctx.strokeStyle = `rgba(0, 102, 255, ${opacity})`; // primary blue mesh

          // Connect to right neighbor
          if (c + 1 < wavePoints[r].length) {
            const nextPt = wavePoints[r][c + 1];
            if (nextPt.zDepth > 50) {
              ctx.beginPath();
              ctx.moveTo(pt.sx, pt.sy);
              ctx.lineTo(nextPt.sx, nextPt.sy);
              ctx.stroke();
            }
          }

          // Connect to bottom neighbor
          if (r + 1 < wavePoints.length) {
            const nextPt = wavePoints[r + 1][c];
            if (nextPt.zDepth > 50) {
              ctx.beginPath();
              ctx.moveTo(pt.sx, pt.sy);
              ctx.lineTo(nextPt.sx, nextPt.sy);
              ctx.stroke();
            }
          }
        }
      }

      // 2. ROTATE AND PROJECT PARTICLES
      const projected: { x: number; y: number; zDepth: number; size: number; opacity: number; color: string }[] = [];

      particles.forEach((p) => {
        // Drift movement
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Boundaries bounce
        const halfSize = boxSize / 2;
        if (Math.abs(p.x) > halfSize) p.vx *= -1;
        if (Math.abs(p.y) > halfSize) p.vy *= -1;
        if (Math.abs(p.z) > halfSize) p.vz *= -1;

        // 3D rotation
        // Y-axis rotation
        const rx1 = p.x * cosY - p.z * sinY;
        const rz1 = p.x * sinY + p.z * cosY;

        // X-axis rotation
        const ry2 = p.y * cosX - rz1 * sinX;
        const rz2 = p.y * sinX + rz1 * cosX;

        // Translate depth
        const zDepth = rz2 + cameraZ;

        if (zDepth > 50) {
          const scale = focalLength / zDepth;
          const sx = centerX + rx1 * scale;
          const sy = centerY + ry2 * scale;

          const size = p.r * scale * 1.2;
          const opacity = Math.max(0, Math.min(1, (1 - zDepth / 1200) * p.baseAlpha));

          projected.push({
            x: sx,
            y: sy,
            zDepth,
            size,
            opacity,
            color: p.color
          });
        } else {
          projected.push({ x: -999, y: -999, zDepth: -1, size: 0, opacity: 0, color: '' });
        }
      });

      // 3. DRAW CONNECTING LINES IN 3D SPACE
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 130) {
            const pr1 = projected[i];
            const pr2 = projected[j];

            if (pr1 && pr2 && pr1.zDepth > 50 && pr2.zDepth > 50) {
              const lineOpacity = Math.max(0, Math.min(0.25, (1 - dist / 130) * Math.min(pr1.opacity, pr2.opacity) * 0.6));
              ctx.strokeStyle = `rgba(46, 242, 255, ${lineOpacity})`; // cyan connections
              ctx.beginPath();
              ctx.moveTo(pr1.x, pr1.y);
              ctx.lineTo(pr2.x, pr2.y);
              ctx.stroke();
            }
          }
        }
      }

      // 4. DRAW THE PARTICLES
      projected.forEach((p) => {
        if (p.zDepth <= 50) return;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const alphaHex = Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fillStyle = p.color + alphaHex;
        ctx.fill();

        if (p.zDepth < 600) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color + Math.floor(p.opacity * 60).toString(16).padStart(2, '0');
          ctx.fill();
        }
      });

      raf = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      <motion.div
        className="absolute top-1/4 right-[10%] w-32 h-32 rounded-full border border-funky-cyan/15 bg-funky-cyan/5 blur-[2px]"
        animate={{ y: [0, -25, 0], rotate: [0, 45, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/3 left-[8%] w-24 h-24 rounded-full border border-funky-orange/15 bg-funky-orange/5 blur-[2px]"
        animate={{ y: [0, 20, 0], rotate: [0, -45, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
    </div>
  );
}
