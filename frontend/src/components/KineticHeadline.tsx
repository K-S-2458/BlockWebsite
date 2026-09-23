import React from 'react';
import { motion } from 'framer-motion';

interface KineticHeadlineProps {
  line1: string;
  line2: string;
}

export const KineticHeadline: React.FC<KineticHeadlineProps> = ({ line1, line2 }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.035,
        delayChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 35,
      rotateX: -45,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        damping: 14,
        stiffness: 120,
      },
    },
  };

  return (
    <div className="text-center select-none">
      <motion.h1
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="font-serif text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.12] mb-5 inline-block"
      >
        <span className="block mb-1">
          {line1.split('').map((char, index) => (
            <motion.span
              key={`l1-${index}`}
              variants={letterVariants}
              className="inline-block living-ink-text"
              style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </span>

        <span className="block text-white dark:text-white not-dark:text-ink-lightText">
          {line2.split('').map((char, index) => (
            <motion.span
              key={`l2-${index}`}
              variants={letterVariants}
              className="inline-block"
              style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </span>
      </motion.h1>
    </div>
  );
};

export default KineticHeadline;
