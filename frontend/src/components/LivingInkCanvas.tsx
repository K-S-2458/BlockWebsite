import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
}

export const LivingInkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Track mouse coordinates for subtle parallax
  useEffect(() => {
    if (isReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isReducedMotion]);

  // Track scroll scrub for continuous aurora hue and depth shifting
  useEffect(() => {
    if (isReducedMotion) return;

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const current = totalScroll > 0 ? window.scrollY / totalScroll : 0;
      setScrollProgress(Math.min(1, Math.max(0, current)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isReducedMotion]);

  // Canvas floating ink droplets and glowing embers
  useEffect(() => {
    if (isReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const palette = [
      'rgba(124, 58, 237, ', // violet
      'rgba(255, 46, 136, ', // magenta
      'rgba(0, 229, 255, ',  // cyan
      'rgba(255, 210, 63, ',  // gold
    ];

    const particleCount = Math.min(38, Math.floor((width * height) / 32000));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const baseAlpha = Math.random() * 0.45 + 0.15;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.8 + 1,
        color: palette[Math.floor(Math.random() * palette.length)],
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35 - 0.12,
        alpha: baseAlpha,
        baseAlpha,
        pulseSpeed: Math.random() * 0.02 + 0.008,
      });
    }

    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.alpha = p.baseAlpha + Math.sin(time * p.pulseSpeed * 50) * 0.15;

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.2);
        gradient.addColorStop(0, `${p.color}${Math.max(0, p.alpha)})`);
        gradient.addColorStop(1, `${p.color}0)`);

        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isReducedMotion]);

  const pX = isReducedMotion ? 0 : mousePos.x;
  const pY = isReducedMotion ? 0 : mousePos.y;
  const sP = isReducedMotion ? 0 : scrollProgress;

  // Scroll scrubbed hue shift: violet dominant near top, drifting towards cyan/gold as you scroll
  const hueShift = sP * 85;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Full-Page Animated Gradient Aurora Mesh (Scroll-Scrubbed) */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-35 transition-all duration-300"
        style={{
          filter: isReducedMotion ? 'none' : `hue-rotate(${hueShift}deg)`,
        }}
      >
        {/* Violet Aurora Node */}
        <div
          className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full blur-[110px] mix-blend-screen animate-aurora-drift"
          style={{
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.45) 0%, rgba(124, 58, 237, 0) 70%)',
            transform: `translate(${pX * 22}px, ${pY * 18 + sP * -70}px)`,
            transition: 'transform 0.2s ease-out',
          }}
        />

        {/* Magenta Aurora Node */}
        <div
          className="absolute top-[35%] -right-[15%] w-[60vw] h-[60vw] rounded-full blur-[130px] mix-blend-screen animate-aurora-drift"
          style={{
            animationDelay: '-8s',
            background: 'radial-gradient(circle, rgba(255, 46, 136, 0.38) 0%, rgba(255, 46, 136, 0) 70%)',
            transform: `translate(${pX * -28}px, ${pY * -20 + sP * -90}px)`,
            transition: 'transform 0.2s ease-out',
          }}
        />

        {/* Cyan Aurora Node */}
        <div
          className="absolute -bottom-[15%] left-[20%] w-[50vw] h-[50vw] rounded-full blur-[120px] mix-blend-screen animate-aurora-drift"
          style={{
            animationDelay: '-16s',
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.35) 0%, rgba(0, 229, 255, 0) 70%)',
            transform: `translate(${pX * 16}px, ${pY * 26 + sP * 80}px)`,
            transition: 'transform 0.2s ease-out',
          }}
        />

        {/* Warm Gold Sunburst Node */}
        <div
          className="absolute top-[10%] right-[30%] w-[35vw] h-[35vw] rounded-full blur-[90px] mix-blend-screen animate-pulse-glow"
          style={{
            background: 'radial-gradient(circle, rgba(255, 210, 63, 0.25) 0%, rgba(255, 210, 63, 0) 70%)',
            transform: `translate(${pX * -12}px, ${pY * 15 + sP * 40}px)`,
            transition: 'transform 0.2s ease-out',
          }}
        />
      </div>

      {/* 2. Layered Floating Surreal Elements with Scroll Parallax */}
      {!isReducedMotion && (
        <>
          {/* Drifting Ink-Blot Shape 1 */}
          <svg
            className="absolute top-[18%] left-[6%] w-48 h-48 opacity-25 dark:opacity-30 animate-float-slow"
            style={{
              transform: `translate(${pX * 45}px, ${pY * 35 + sP * -120}px) rotate(${pX * 10 + sP * 25}deg)`,
              transition: 'transform 0.25s ease-out',
            }}
            viewBox="0 0 200 200"
          >
            <path
              fill="url(#inkGradient1)"
              d="M44.5,-75.4C58.1,-69.5,70.1,-58.5,77.9,-44.7C85.7,-30.9,89.3,-14.3,86.9,1.4C84.5,17.1,76.2,31.9,66.3,44.9C56.4,57.9,45,69.1,31.4,75.4C17.8,81.7,2.1,83.1,-13.8,80.7C-29.7,78.3,-45.8,72.1,-58.2,61.5C-70.6,50.9,-79.3,35.9,-83.4,19.5C-87.5,3.1,-87,-14.7,-80.4,-29.8C-73.8,-44.9,-61.1,-57.3,-46.8,-63.1C-32.5,-68.9,-16.2,-68.1,-0.3,-67.6C15.6,-67.1,30.9,-81.3,44.5,-75.4Z"
              transform="translate(100 100)"
            />
            <defs>
              <linearGradient id="inkGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF2E88" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>

          {/* Drifting Ink-Blot Shape 2 */}
          <svg
            className="absolute bottom-[22%] right-[8%] w-56 h-56 opacity-20 dark:opacity-25 animate-float-reverse"
            style={{
              transform: `translate(${pX * -35}px, ${pY * -45 + sP * -150}px) rotate(${pY * 12 + sP * -20}deg)`,
              transition: 'transform 0.25s ease-out',
            }}
            viewBox="0 0 200 200"
          >
            <path
              fill="url(#inkGradient2)"
              d="M37.9,-62.4C49.9,-55.4,61,-46.2,69.5,-34.5C78,-22.8,83.9,-8.6,82.5,5.1C81.1,18.8,72.4,32,62.3,43.4C52.2,54.8,40.7,64.4,27.7,69.4C14.7,74.4,0.2,74.8,-14.2,71.7C-28.6,68.6,-42.9,62.1,-54.1,51.8C-65.3,41.5,-73.4,27.4,-77.6,11.8C-81.8,-3.8,-82.1,-20.9,-75.3,-34.3C-68.5,-47.7,-54.6,-57.4,-40.5,-63.3C-26.4,-69.2,-12.1,-71.3,0.9,-72.7C13.9,-74.1,25.9,-69.4,37.9,-62.4Z"
              transform="translate(100 100)"
            />
            <defs>
              <linearGradient id="inkGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>

          {/* Folded Paper Airplane with Parallax Depth */}
          <div
            className="absolute top-[32%] right-[12%] opacity-20 dark:opacity-30 animate-float-slow"
            style={{
              transform: `translate(${pX * -50}px, ${pY * -30 + sP * -200}px) rotate(${-15 + pX * 8 + sP * 30}deg)`,
              transition: 'transform 0.25s ease-out',
            }}
          >
            <svg
              className="w-16 h-16 text-cyan-400 stroke-current fill-none stroke-[1.2]"
              viewBox="0 0 24 24"
            >
              <polygon points="3 3 21 12 3 21 7 12 3 3" />
              <line x1="7" y1="12" x2="21" y2="12" />
            </svg>
          </div>

          {/* Floating Feather Silhouette */}
          <div
            className="absolute bottom-[30%] left-[12%] opacity-20 dark:opacity-30 animate-float-reverse"
            style={{
              transform: `translate(${pX * 40}px, ${pY * 40 + sP * -180}px) rotate(${25 + pY * -10 + sP * -35}deg)`,
              transition: 'transform 0.25s ease-out',
            }}
          >
            <svg
              className="w-20 h-20 text-pink-400 stroke-current fill-none stroke-[1.2]"
              viewBox="0 0 24 24"
            >
              <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
              <line x1="16" y1="8" x2="2" y2="22" />
              <line x1="17.5" y1="15" x2="9" y2="15" />
            </svg>
          </div>
        </>
      )}

      {/* 3. Floating Canvas Particles: Sparks & Ink Droplets */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

export default LivingInkCanvas;
