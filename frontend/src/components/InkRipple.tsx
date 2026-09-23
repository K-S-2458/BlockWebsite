import React, { useEffect, useState } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  color: string;
}

const RIPPLE_COLORS = [
  'rgba(255, 46, 136, 0.7)', // magenta
  'rgba(124, 58, 237, 0.7)', // violet
  'rgba(0, 229, 255, 0.7)',  // cyan
  'rgba(255, 210, 63, 0.7)',  // gold
];

export const InkRippleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    let nextId = 0;

    const handleClick = (e: MouseEvent) => {
      // Don't trigger if user requested reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const randomColor = RIPPLE_COLORS[Math.floor(Math.random() * RIPPLE_COLORS.length)];
      const newRipple: Ripple = {
        id: nextId++,
        x: e.clientX,
        y: e.clientY,
        color: randomColor,
      };

      setRipples((prev) => [...prev.slice(-8), newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 700);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      {children}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ink-ripple"
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
              borderColor: ripple.color,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default InkRippleProvider;
