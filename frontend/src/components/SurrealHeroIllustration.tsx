import React from 'react';
import { motion } from 'framer-motion';

export const SurrealHeroIllustration: React.FC = () => {
  return (
    <div className="relative w-72 h-56 sm:w-96 sm:h-64 mx-auto my-6 flex items-center justify-center select-none pointer-events-none">
      {/* Background Aurora Nebula Bloom */}
      <div className="absolute inset-0 bg-gradient-to-tr from-ink-violet/40 via-ink-magenta/40 to-ink-cyan/40 rounded-full blur-3xl animate-pulse-glow" />

      {/* Floating Galaxy Particles pouring upwards */}
      <svg
        className="absolute inset-0 w-full h-full overflow-visible"
        viewBox="0 0 400 300"
        fill="none"
      >
        {/* Swirling Star / Color Streams */}
        <motion.path
          d="M 160 170 C 130 110, 200 60, 240 30 C 270 10, 310 40, 290 80 C 270 120, 200 130, 240 170"
          stroke="url(#galaxyStream1)"
          strokeWidth="2"
          strokeDasharray="4 8"
          initial={{ pathOffset: 0 }}
          animate={{ pathOffset: [0, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          opacity="0.75"
        />
        <motion.path
          d="M 240 170 C 270 110, 200 50, 160 30 C 130 10, 90 40, 110 80 C 130 120, 200 130, 160 170"
          stroke="url(#galaxyStream2)"
          strokeWidth="2.5"
          strokeDasharray="6 10"
          initial={{ pathOffset: 0 }}
          animate={{ pathOffset: [1, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          opacity="0.7"
        />

        {/* Orbiting glowing sparks */}
        {[
          { cx: 200, cy: 70, r: 3, color: '#FFD23F', dur: 4, delay: 0 },
          { cx: 270, cy: 50, r: 2.5, color: '#00E5FF', dur: 5, delay: 1 },
          { cx: 130, cy: 60, r: 3.5, color: '#FF2E88', dur: 6, delay: 0.5 },
          { cx: 220, cy: 20, r: 2, color: '#7C3AED', dur: 4.5, delay: 1.5 },
          { cx: 170, cy: 90, r: 2.8, color: '#00E5FF', dur: 5.5, delay: 2 },
        ].map((star, i) => (
          <motion.circle
            key={i}
            cx={star.cx}
            cy={star.cy}
            r={star.r}
            fill={star.color}
            filter={`drop-shadow(0 0 6px ${star.color})`}
            animate={{
              y: [-12, 12, -12],
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: star.dur,
              delay: star.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        <defs>
          <linearGradient id="galaxyStream1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="50%" stopColor="#FF2E88" />
            <stop offset="100%" stopColor="#FFD23F" />
          </linearGradient>
          <linearGradient id="galaxyStream2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="60%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#FF2E88" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating Surreal Book Mid-Air (Abstract Isometric Luminous Pages) */}
      <motion.div
        animate={{
          y: [-8, 8, -8],
          rotateZ: [-2, 2, -2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative z-10 filter drop-shadow-[0_15px_30px_rgba(124,58,237,0.5)]"
      >
        <svg width="220" height="150" viewBox="0 0 220 150" fill="none">
          {/* Glowing Aura underneath Book */}
          <ellipse
            cx="110"
            cy="135"
            rx="75"
            ry="12"
            fill="url(#bookShadow)"
            opacity="0.6"
          />

          {/* Book Spine Center Glow */}
          <path
            d="M 110 115 L 110 45"
            stroke="#FFD23F"
            strokeWidth="3"
            filter="drop-shadow(0 0 8px #FFD23F)"
          />

          {/* Left Wing Pages */}
          <path
            d="M 110 115 C 75 125, 30 110, 15 95 L 15 35 C 30 50, 75 60, 110 45 Z"
            fill="url(#leftPageGradient)"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1"
          />
          {/* Additional Left Page Sheet */}
          <path
            d="M 110 112 C 78 120, 38 108, 22 93 L 22 36 C 38 48, 78 58, 110 45 Z"
            fill="url(#leftInnerPage)"
            opacity="0.75"
          />

          {/* Right Wing Pages */}
          <path
            d="M 110 115 C 145 125, 190 110, 205 95 L 205 35 C 190 50, 145 60, 110 45 Z"
            fill="url(#rightPageGradient)"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1"
          />
          {/* Additional Right Page Sheet */}
          <path
            d="M 110 112 C 142 120, 182 108, 198 93 L 198 36 C 182 48, 142 58, 110 45 Z"
            fill="url(#rightInnerPage)"
            opacity="0.75"
          />

          {/* Liquid Light Geyser rising out of book fold */}
          <motion.path
            d="M 105 45 Q 110 10, 115 45 Z"
            fill="url(#geyserGradient)"
            animate={{
              d: [
                'M 105 45 Q 110 5, 115 45 Z',
                'M 103 45 Q 110 -15, 117 45 Z',
                'M 105 45 Q 110 5, 115 45 Z',
              ],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            filter="drop-shadow(0 0 10px #00E5FF)"
          />

          <defs>
            <radialGradient id="bookShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <linearGradient id="leftPageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E1933" />
              <stop offset="70%" stopColor="#2E1B4E" />
              <stop offset="100%" stopColor="#FF2E88" />
            </linearGradient>
            <linearGradient id="leftInnerPage" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#FF2E88" />
            </linearGradient>
            <linearGradient id="rightPageGradient" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#132338" />
              <stop offset="70%" stopColor="#1B3E59" />
              <stop offset="100%" stopColor="#00E5FF" />
            </linearGradient>
            <linearGradient id="rightInnerPage" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="geyserGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FF2E88" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#00E5FF" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
};

export default SurrealHeroIllustration;
