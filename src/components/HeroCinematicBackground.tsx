import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { FloralCorner } from './FloralDecorations';

interface HeroCinematicBackgroundProps {
  stage: number; // 0 to 7 corresponding to animation seconds
  replayKey: number;
}

export const HeroCinematicBackground: React.FC<HeroCinematicBackgroundProps> = ({ replayKey }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas particle engine for floating gold dust, sparkling stars & gentle petals
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle definitions
    interface DustParticle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      opacity: number;
      pulseSpeed: number;
      hue: number;
    }

    interface StarParticle {
      x: number;
      y: number;
      radius: number;
      opacity: number;
      twinkleSpeed: number;
      angle: number;
    }

    interface PetalParticle {
      x: number;
      y: number;
      size: number;
      vy: number;
      vx: number;
      angle: number;
      angleSpeed: number;
      opacity: number;
    }

    // Initialize 60 floating golden dust particles
    const dustParticles: DustParticle[] = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 0.8 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.2 - Math.random() * 0.4,
      opacity: 0.2 + Math.random() * 0.6,
      pulseSpeed: 0.02 + Math.random() * 0.03,
      hue: 40 + Math.random() * 8, // warm champagne gold
    }));

    // Initialize 24 subtle sparkling stars
    const stars: StarParticle[] = Array.from({ length: 24 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1 + Math.random() * 1.5,
      opacity: Math.random(),
      twinkleSpeed: 0.02 + Math.random() * 0.04,
      angle: Math.random() * Math.PI * 2,
    }));

    // Initialize 16 slow romantic flower petals
    const petals: PetalParticle[] = Array.from({ length: 16 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 6 + Math.random() * 7,
      vy: 0.4 + Math.random() * 0.6,
      vx: Math.sin(Math.random() * Math.PI) * 0.3,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: 0.01 + Math.random() * 0.02,
      opacity: 0.25 + Math.random() * 0.4,
    }));

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Gold Dust Particles
      for (const p of dustParticles) {
        p.x += p.vx;
        p.y += p.vy;
        p.opacity += Math.sin(Date.now() * p.pulseSpeed * 0.01) * 0.01;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, `hsla(${p.hue}, 70%, 75%, ${Math.min(0.85, Math.max(0.1, p.opacity))})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 80%, 55%, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw Sparkling Stars (4-point sparkle)
      for (const s of stars) {
        s.angle += s.twinkleSpeed;
        const currentOpacity = (Math.sin(s.angle) + 1) / 2 * 0.75 + 0.1;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.strokeStyle = `rgba(245, 229, 192, ${currentOpacity})`;
        ctx.fillStyle = `rgba(255, 253, 247, ${currentOpacity})`;
        ctx.lineWidth = 0.75;

        // Draw 4-point star
        ctx.beginPath();
        ctx.moveTo(-s.radius * 2.5, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s.radius * 2.5);
        ctx.quadraticCurveTo(0, 0, s.radius * 2.5, 0);
        ctx.quadraticCurveTo(0, 0, 0, s.radius * 2.5);
        ctx.quadraticCurveTo(0, 0, -s.radius * 2.5, 0);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }

      // 3. Draw Slow Falling Petals
      for (const pt of petals) {
        pt.y += pt.vy;
        pt.x += Math.sin(pt.angle) * 0.4;
        pt.angle += pt.angleSpeed;

        if (pt.y > height + 20) {
          pt.y = -20;
          pt.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.angle);
        ctx.beginPath();
        // Rose/jasmine petal oval curve
        ctx.ellipse(0, 0, pt.size * 0.5, pt.size, pt.angle * 0.3, 0, Math.PI * 2);
        const petalGrad = ctx.createLinearGradient(-pt.size, -pt.size, pt.size, pt.size);
        petalGrad.addColorStop(0, `rgba(255, 250, 242, ${pt.opacity})`);
        petalGrad.addColorStop(0.5, `rgba(245, 230, 205, ${pt.opacity * 0.85})`);
        petalGrad.addColorStop(1, `rgba(224, 195, 142, ${pt.opacity * 0.5})`);
        ctx.fillStyle = petalGrad;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [replayKey]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* 1. Ivory Cream Base with Warm Champagne Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF7] via-[#FAF5E8] to-[#FFF8EA]" />

      {/* 2. Soft Moving Light Rays (Volumetric ambient beams) */}
      <motion.div
        key={`light-rays-${replayKey}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-[25%] left-1/2 -translate-x-1/2 w-[1200px] h-[900px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse 65% 50% at 50% 20%, rgba(245, 229, 192, 0.45) 0%, rgba(212, 175, 103, 0.15) 50%, transparent 80%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Additional ambient warm light beam from top-right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle at 80% 10%, rgba(212, 175, 103, 0.25) 0%, transparent 60%)',
          filter: 'blur(45px)',
        }}
      />

      {/* 3. Interactive Canvas Particles Layer (Gold Dust, Stars, Petals) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none" />

      {/* 4. Thin Decorative Gold Lines Drawing Themselves Onto Screen */}
      <svg
        key={`svg-lines-${replayKey}`}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heroLineGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C6A15B" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#F5DFB3" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#C6A15B" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Top border drawing line */}
        <motion.line
          x1="6%"
          y1="24"
          x2="94%"
          y2="24"
          stroke="url(#heroLineGold)"
          strokeWidth="1"
          strokeDasharray="1200"
          initial={{ strokeDashoffset: 1200 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 2.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Bottom border drawing line removed as requested */}

        {/* Left vertical framing line */}
        <motion.line
          x1="24"
          y1="6%"
          x2="24"
          y2="94%"
          stroke="url(#heroLineGold)"
          strokeWidth="0.75"
          strokeDasharray="900"
          initial={{ strokeDashoffset: 900 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 2.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Right vertical framing line */}
        <motion.line
          x1="calc(100% - 24px)"
          y1="6%"
          x2="calc(100% - 24px)"
          y2="94%"
          stroke="url(#heroLineGold)"
          strokeWidth="0.75"
          strokeDasharray="900"
          initial={{ strokeDashoffset: 900 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 2.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      {/* 5. Elegant Floral Corner Ornaments entering from corners / diagonals */}
      {/* Top Left */}
      <motion.div
        key={`corner-tl-${replayKey}`}
        initial={{ opacity: 0, x: -60, y: -60, scale: 0.7 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <FloralCorner position="top-left" className="top-2 left-2 sm:top-4 sm:left-4" />
      </motion.div>

      {/* Top Right */}
      <motion.div
        key={`corner-tr-${replayKey}`}
        initial={{ opacity: 0, x: 60, y: -60, scale: 0.7 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ duration: 1.4, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        <FloralCorner position="top-right" className="top-2 right-2 sm:top-4 sm:right-4" />
      </motion.div>

      {/* Bottom Left */}
      <motion.div
        key={`corner-bl-${replayKey}`}
        initial={{ opacity: 0, x: -60, y: 60, scale: 0.7 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ duration: 1.4, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <FloralCorner position="bottom-left" className="bottom-2 left-2 sm:bottom-4 sm:left-4" />
      </motion.div>

      {/* Bottom Right */}
      <motion.div
        key={`corner-br-${replayKey}`}
        initial={{ opacity: 0, x: 60, y: 60, scale: 0.7 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ duration: 1.4, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <FloralCorner position="bottom-right" className="bottom-2 right-2 sm:bottom-4 sm:right-4" />
      </motion.div>
    </div>
  );
};
