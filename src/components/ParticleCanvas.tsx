import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  wobble: number;
  wobbleSpeed: number;
}

interface GoldParticle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
  pulseSpeed: number;
  pulseAngle: number;
}

export const ParticleCanvas: React.FC<{
  enablePetals?: boolean;
  enableGoldDust?: boolean;
}> = ({ enablePetals = true, enableGoldDust = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color palette for soft cream/champagne/blush petals
    const petalColors = [
      'rgba(255, 240, 243, 0.75)',
      'rgba(250, 238, 218, 0.75)',
      'rgba(245, 225, 200, 0.65)',
      'rgba(240, 230, 210, 0.7)',
      'rgba(255, 250, 242, 0.8)',
    ];

    // Initialize petals
    const petalsCount = Math.min(22, Math.floor(width / 60));
    const petals: Petal[] = [];
    if (enablePetals) {
      for (let i = 0; i < petalsCount; i++) {
        petals.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 8 + 8,
          speedY: Math.random() * 0.8 + 0.4,
          speedX: Math.random() * 0.6 - 0.3,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 1.5,
          opacity: Math.random() * 0.4 + 0.4,
          color: petalColors[Math.floor(Math.random() * petalColors.length)],
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.03 + 0.01,
        });
      }
    }

    // Initialize gold dust
    const goldCount = Math.min(45, Math.floor(width / 35));
    const goldDust: GoldParticle[] = [];
    if (enableGoldDust) {
      for (let i = 0; i < goldCount; i++) {
        goldDust.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.8 + 0.5,
          speedY: -(Math.random() * 0.4 + 0.15),
          speedX: (Math.random() - 0.5) * 0.25,
          opacity: Math.random() * 0.6 + 0.2,
          pulseSpeed: Math.random() * 0.04 + 0.015,
          pulseAngle: Math.random() * Math.PI * 2,
        });
      }
    }

    // Draw single petal shape
    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.scale(Math.sin(p.wobble) * 0.3 + 0.85, 1);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size, p.size / 3, 0, p.size);
      ctx.bezierCurveTo(p.size, p.size / 3, p.size / 2, -p.size / 2, 0, 0);
      ctx.closePath();

      ctx.fillStyle = p.color;
      ctx.shadowColor = 'rgba(212, 175, 103, 0.2)';
      ctx.shadowBlur = 4;
      ctx.fill();

      // Delicate gold vein
      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.lineTo(0, p.size * 0.7);
      ctx.strokeStyle = 'rgba(212, 175, 103, 0.25)';
      ctx.lineWidth = 0.6;
      ctx.stroke();

      ctx.restore();
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Render Gold Dust
      if (enableGoldDust) {
        for (let i = 0; i < goldDust.length; i++) {
          const g = goldDust[i];
          g.y += g.speedY;
          g.x += g.speedX;
          g.pulseAngle += g.pulseSpeed;

          // Wrap around top
          if (g.y < -10) {
            g.y = height + 10;
            g.x = Math.random() * width;
          }
          if (g.x < -10) g.x = width + 10;
          if (g.x > width + 10) g.x = -10;

          const currentOpacity = g.opacity * (0.6 + 0.4 * Math.sin(g.pulseAngle));

          ctx.beginPath();
          ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 175, 103, ${currentOpacity})`;
          ctx.shadowColor = 'rgba(243, 229, 200, 0.8)';
          ctx.shadowBlur = 6;
          ctx.fill();
        }
      }

      // 2. Render Petals
      if (enablePetals) {
        for (let i = 0; i < petals.length; i++) {
          const p = petals[i];
          p.y += p.speedY;
          p.x += p.speedX + Math.sin(p.wobble) * 0.6;
          p.rotation += p.rotationSpeed;
          p.wobble += p.wobbleSpeed;

          // Wrap around bottom
          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;

          drawPetal(p);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enablePetals, enableGoldDust]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20 h-full w-full opacity-80"
      aria-hidden="true"
    />
  );
};
