import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Feather } from 'lucide-react';

interface AuthSplitLayoutProps {
  mode: 'login' | 'register';
  onModeSwitch: (target: 'login' | 'register') => void;
  children: React.ReactNode;
}

export const AuthSplitLayout: React.FC<AuthSplitLayoutProps> = ({
  mode,
  onModeSwitch,
  children,
}) => {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-10 relative z-10">
      <div className="w-full max-w-5xl rounded-3xl glass-panel border border-white/15 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Left / Top Panel: Full-Bleed Animated Aurora Scene */}
        <div className="lg:col-span-6 relative p-8 sm:p-12 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#120F20] via-[#0E0C18] to-[#1A1428] border-b lg:border-b-0 lg:border-r border-white/10">
          {/* Animated Background Aurora Blooms */}
          <div className="absolute -top-16 -left-16 w-72 h-72 bg-ink-magenta/25 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-ink-cyan/25 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-ink-violet/30 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />

          {/* Floating Surreal Ink Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {/* Drifting Ink Blot */}
            <motion.div
              animate={{
                y: [-10, 10, -10],
                rotate: [0, 8, 0],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-12 right-10 w-28 h-28 opacity-30 text-ink-violet"
            >
              <svg viewBox="0 0 200 200" fill="currentColor">
                <path d="M44.5,-75.4C58.1,-69.5,70.1,-58.5,77.9,-44.7C85.7,-30.9,89.3,-14.3,86.9,1.4C84.5,17.1,76.2,31.9,66.3,44.9C56.4,57.9,45,69.1,31.4,75.4C17.8,81.7,2.1,83.1,-13.8,80.7C-29.7,78.3,-45.8,72.1,-58.2,61.5C-70.6,50.9,-79.3,35.9,-83.4,19.5C-87.5,3.1,-87,-14.7,-80.4,-29.8C-73.8,-44.9,-61.1,-57.3,-46.8,-63.1C-32.5,-68.9,-16.2,-68.1,-0.3,-67.6C15.6,-67.1,30.9,-81.3,44.5,-75.4Z" transform="translate(100 100)" />
              </svg>
            </motion.div>

            {/* Floating Origami Paper Airplane */}
            <motion.div
              animate={{
                x: [-15, 15, -15],
                y: [-12, 12, -12],
                rotate: [-8, 8, -8],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-20 left-10 opacity-35 text-ink-cyan"
            >
              <svg className="w-16 h-16 stroke-current fill-none stroke-[1.2]" viewBox="0 0 24 24">
                <polygon points="3 3 21 12 3 21 7 12 3 3" />
                <line x1="7" y1="12" x2="21" y2="12" />
              </svg>
            </motion.div>
          </div>

          {/* Top Brand Mark */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-ink-violet to-ink-magenta text-white flex items-center justify-center font-serif text-xl font-bold shadow-glow-magenta">
                C
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                The Chronicle
              </span>
            </Link>
          </div>

          {/* Centerpiece: Animated Gradient Tagline */}
          <div className="my-10 lg:my-0 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel mb-4 text-xs font-semibold text-ink-gold border border-white/10 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-ink-gold" />
              <span>Living Ink Sanctuary</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-4">
              <span className="living-ink-text block">
                Where every idea
              </span>
              <span className="text-white block">
                leaves a mark.
              </span>
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-md font-sans">
              Enter a dreamlike journal where typography breathes, colors shift with
              each scroll, and readers leave lasting reflections.
            </p>
          </div>

          {/* Bottom Aesthetic Quote */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-ink-textMuted">
            <span className="flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-ink-magenta" />
              <span>Editorial Journal</span>
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-ink-cyan" />
              <span>Independent Craft</span>
            </span>
          </div>
        </div>

        {/* Right Panel: Form Card with Smooth Tab Transition */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center relative bg-[#0B0A10]/90 dark:bg-[#0B0A10]/90 not-dark:bg-white/90">
          {/* Animated Tab Switcher */}
          <div className="flex items-center justify-center mb-8">
            <div className="inline-flex p-1 rounded-full glass-panel border border-white/15 dark:border-white/15 not-dark:border-stone-300">
              <button
                type="button"
                onClick={() => onModeSwitch('login')}
                className={`relative px-6 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  mode === 'login'
                    ? 'text-white'
                    : 'text-stone-400 hover:text-white dark:hover:text-white not-dark:hover:text-stone-900'
                }`}
              >
                {mode === 'login' && (
                  <motion.div
                    layoutId="authTabIndicator"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-ink-magenta to-ink-violet shadow-glow-magenta"
                    transition={{ type: 'spring', damping: 22, stiffness: 220 }}
                  />
                )}
                <span className="relative z-10">Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => onModeSwitch('register')}
                className={`relative px-6 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  mode === 'register'
                    ? 'text-white'
                    : 'text-stone-400 hover:text-white dark:hover:text-white not-dark:hover:text-stone-900'
                }`}
              >
                {mode === 'register' && (
                  <motion.div
                    layoutId="authTabIndicator"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-ink-magenta to-ink-violet shadow-glow-magenta"
                    transition={{ type: 'spring', damping: 22, stiffness: 220 }}
                  />
                )}
                <span className="relative z-10">Create Account</span>
              </button>
            </div>
          </div>

          {/* Form Children Content */}
          <div className="w-full max-w-sm mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthSplitLayout;
