import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PenLine } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'book' | 'pen' | 'comment';
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No stories yet',
  description = 'The living ink is quiet. Awaken the page with your unique thoughts.',
  actionText,
  actionHref,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      {/* Animated Looping Illustration: Feather Quill Sketching an Ink Line */}
      <div className="relative w-48 h-32 mb-6 flex items-center justify-center">
        {/* Glow behind illustration */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-violet/25 via-ink-magenta/25 to-ink-cyan/25 blur-2xl rounded-full animate-pulse-glow" />

        <svg
          className="relative w-full h-full"
          viewBox="0 0 200 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Animated Squiggly Ink Line */}
          <motion.path
            d="M 20 85 Q 50 65, 80 85 T 140 85 T 180 85"
            stroke="url(#emptyInkGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0.2 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0.3, 1, 1, 0.3],
            }}
            transition={{
              duration: 3.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Animated Feather Quill quietly moving along the path */}
          <motion.g
            animate={{
              x: [20, 80, 140, 175, 20],
              y: [85, 75, 85, 85, 85],
              rotate: [0, 8, -5, 12, 0],
            }}
            transition={{
              duration: 3.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Feather Body */}
            <path
              d="M 0 0 C -5 -25, -20 -45, -35 -55 C -25 -40, -15 -20, 0 0 Z"
              fill="url(#featherGradient)"
              opacity="0.9"
            />
            {/* Feather Spine */}
            <line x1="0" y1="0" x2="-35" y2="-55" stroke="#FFD23F" strokeWidth="1.5" />
            {/* Glowing Ink Nib */}
            <circle cx="0" cy="0" r="3" fill="#00E5FF" filter="drop-shadow(0 0 4px #00E5FF)" />
          </motion.g>

          <defs>
            <linearGradient id="emptyInkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="50%" stopColor="#FF2E88" />
              <stop offset="100%" stopColor="#00E5FF" />
            </linearGradient>
            <linearGradient id="featherGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF2E88" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white dark:text-white not-dark:text-ink-lightText mb-2">
        {title}
      </h3>
      <p className="text-stone-400 dark:text-stone-400 not-dark:text-stone-600 text-sm max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && actionHref && (
        <Link
          to={actionHref}
          className="liquid-button inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold shadow-glow-magenta"
        >
          <PenLine className="w-4 h-4" />
          <span>{actionText}</span>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
