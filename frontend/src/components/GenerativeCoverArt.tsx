import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export interface PostCategoryInfo {
  name: string;
  dominantColor: string;
  secondaryColor: string;
  accentColor: string;
  pillBg: string;
  pillBorder: string;
  pillText: string;
}

/**
 * Detects category and color palette based on title and content keywords
 */
export function detectCategory(title: string, content: string = ''): PostCategoryInfo {
  const combined = `${title} ${content}`.toLowerCase();

  if (combined.includes('architect') || combined.includes('space') || combined.includes('structure') || combined.includes('urban')) {
    return {
      name: 'Architecture',
      dominantColor: '#7C3AED', // violet
      secondaryColor: '#FF2E88',
      accentColor: '#00E5FF',
      pillBg: 'rgba(124, 58, 237, 0.18)',
      pillBorder: 'rgba(124, 58, 237, 0.35)',
      pillText: '#C4B5FD',
    };
  }

  if (combined.includes('type') || combined.includes('serif') || combined.includes('font') || combined.includes('design') || combined.includes('interface')) {
    return {
      name: 'Design & Typography',
      dominantColor: '#00E5FF', // cyan
      secondaryColor: '#7C3AED',
      accentColor: '#FFD23F',
      pillBg: 'rgba(0, 229, 255, 0.18)',
      pillBorder: 'rgba(0, 229, 255, 0.35)',
      pillText: '#A5F3FC',
    };
  }

  if (combined.includes('software') || combined.includes('code') || combined.includes('craft') || combined.includes('build') || combined.includes('tech')) {
    return {
      name: 'Software Craft',
      dominantColor: '#FFD23F', // gold
      secondaryColor: '#FF2E88',
      accentColor: '#7C3AED',
      pillBg: 'rgba(255, 210, 63, 0.18)',
      pillBorder: 'rgba(255, 210, 63, 0.35)',
      pillText: '#FDE68A',
    };
  }

  // Default: Writing & Thought
  return {
    name: 'Writing & Thought',
    dominantColor: '#FF2E88', // magenta
    secondaryColor: '#00E5FF',
    accentColor: '#FFD23F',
    pillBg: 'rgba(255, 46, 136, 0.18)',
    pillBorder: 'rgba(255, 46, 136, 0.35)',
    pillText: '#FBCFE8',
  };
}

/**
 * Deterministic pseudo-random generator seeded from string
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

interface GenerativeCoverArtProps {
  id: string;
  title: string;
  content?: string;
  variant?: 'card' | 'featured' | 'detail';
  className?: string;
}

export const GenerativeCoverArt: React.FC<GenerativeCoverArtProps> = ({
  id,
  title,
  content = '',
  variant = 'card',
  className = '',
}) => {
  const category = useMemo(() => detectCategory(title, content), [title, content]);
  const seed = useMemo(() => hashString(`${id}-${title}`), [id, title]);

  // Deterministic SVG coordinates and bezier curves based on seed
  const shapes = useMemo(() => {
    const s1 = (seed % 97) / 100;
    const s2 = ((seed >> 2) % 89) / 100;
    const s3 = ((seed >> 4) % 73) / 100;

    return {
      blob1: {
        cx: 30 + s1 * 40,
        cy: 35 + s2 * 30,
        r: 35 + s3 * 20,
      },
      blob2: {
        cx: 65 + s2 * 25,
        cy: 60 + s1 * 25,
        r: 30 + s1 * 25,
      },
      blob3: {
        cx: 45 + s3 * 30,
        cy: 50 + s2 * 35,
        r: 25 + s2 * 18,
      },
      squiggle: {
        startX: 15 + s1 * 20,
        startY: 70 + s3 * 15,
        cp1X: 35 + s2 * 25,
        cp1Y: 30 + s1 * 20,
        cp2X: 65 + s3 * 20,
        cp2Y: 85 - s2 * 30,
        endX: 85 + s1 * 10,
        endY: 45 + s2 * 25,
      },
      particles: [
        { cx: 20 + s2 * 25, cy: 30 + s1 * 30, r: 2.2 + s3 * 1.5, color: category.accentColor },
        { cx: 75 + s3 * 15, cy: 25 + s2 * 20, r: 1.8 + s1 * 1.2, color: category.dominantColor },
        { cx: 60 + s1 * 20, cy: 75 + s3 * 15, r: 2.5 + s2 * 1.2, color: category.secondaryColor },
        { cx: 82 + s2 * 10, cy: 65 + s1 * 20, r: 1.5 + s3 * 1.0, color: '#FFFFFF' },
      ],
    };
  }, [seed, category]);

  const heightClasses = {
    card: 'h-48 sm:h-52 w-full',
    featured: 'h-64 sm:h-80 md:h-96 w-full',
    detail: 'h-72 sm:h-96 md:h-[420px] w-full',
  };

  return (
    <div
      className={`relative overflow-hidden select-none bg-[#0B0A10] ${heightClasses[variant]} ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full object-cover"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id={`blur-${seed}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
          </filter>

          <linearGradient id={`grad1-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={category.dominantColor} stopOpacity="0.85" />
            <stop offset="100%" stopColor={category.secondaryColor} stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id={`grad2-${seed}`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={category.secondaryColor} stopOpacity="0.75" />
            <stop offset="100%" stopColor={category.accentColor} stopOpacity="0.7" />
          </linearGradient>

          <radialGradient id={`grad3-${seed}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={category.accentColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Ambient Dark Ink Canvas Base */}
        <rect width="100" height="100" fill="#0D0B14" />

        {/* Morphing Soft Blurred Organic Blobs */}
        <g filter={`url(#blur-${seed})`}>
          {/* Blob 1 */}
          <motion.circle
            cx={shapes.blob1.cx}
            cy={shapes.blob1.cy}
            r={shapes.blob1.r}
            fill={`url(#grad1-${seed})`}
            animate={{
              cx: [shapes.blob1.cx, shapes.blob1.cx + 5, shapes.blob1.cx - 5, shapes.blob1.cx],
              cy: [shapes.blob1.cy, shapes.blob1.cy - 4, shapes.blob1.cy + 4, shapes.blob1.cy],
              scale: [1, 1.08, 0.95, 1],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Blob 2 */}
          <motion.circle
            cx={shapes.blob2.cx}
            cy={shapes.blob2.cy}
            r={shapes.blob2.r}
            fill={`url(#grad2-${seed})`}
            animate={{
              cx: [shapes.blob2.cx, shapes.blob2.cx - 6, shapes.blob2.cx + 4, shapes.blob2.cx],
              cy: [shapes.blob2.cy, shapes.blob2.cy + 5, shapes.blob2.cy - 4, shapes.blob2.cy],
              scale: [1, 0.94, 1.06, 1],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Blob 3 */}
          <motion.circle
            cx={shapes.blob3.cx}
            cy={shapes.blob3.cy}
            r={shapes.blob3.r}
            fill={`url(#grad3-${seed})`}
            animate={{
              cx: [shapes.blob3.cx, shapes.blob3.cx + 4, shapes.blob3.cx - 4, shapes.blob3.cx],
              cy: [shapes.blob3.cy, shapes.blob3.cy - 6, shapes.blob3.cy + 5, shapes.blob3.cy],
              scale: [0.92, 1.1, 0.96, 0.92],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </g>

        {/* Thin Floating Animated Ink Contour Squiggle */}
        <motion.path
          d={`M ${shapes.squiggle.startX} ${shapes.squiggle.startY} C ${shapes.squiggle.cp1X} ${shapes.squiggle.cp1Y}, ${shapes.squiggle.cp2X} ${shapes.squiggle.cp2Y}, ${shapes.squiggle.endX} ${shapes.squiggle.endY}`}
          fill="none"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="0.8"
          strokeDasharray="2 3"
          animate={{
            pathOffset: [0, 1],
            opacity: [0.35, 0.7, 0.35],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Floating Sparks Layer */}
        {shapes.particles.map((p, idx) => (
          <motion.circle
            key={idx}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill={p.color}
            opacity="0.8"
            animate={{
              y: [-2, 2, -2],
              opacity: [0.5, 0.95, 0.5],
              scale: [0.85, 1.25, 0.85],
            }}
            transition={{
              duration: 4 + idx,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>

      {/* High-Contrast Legibility Scrims */}
      {variant === 'card' && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A10] via-[#0B0A10]/40 to-transparent" />
      )}

      {variant === 'featured' && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A10] via-[#0B0A10]/60 to-transparent" />
      )}

      {variant === 'detail' && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0A10]/50 to-[#0B0A10]" />
      )}
    </div>
  );
};

export default GenerativeCoverArt;
