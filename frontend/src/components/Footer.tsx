import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 mt-auto pt-16 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent">
      {/* Footer Ambient Aurora Color Wash */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70vw] h-48 bg-gradient-to-t from-ink-violet/20 via-ink-magenta/15 to-transparent blur-3xl pointer-events-none rounded-t-full" />

      {/* Animated Gradient Divider Line */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="h-[1.5px] w-full rounded-full bg-gradient-to-r from-transparent via-ink-magenta to-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ink-cyan to-transparent animate-[shimmer_3s_infinite]" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-white dark:text-white not-dark:text-ink-lightText">
              The Chronicle
            </span>
            <Sparkles className="w-4 h-4 text-ink-gold animate-pulse" />
          </div>
          <p className="text-xs text-ink-textMuted dark:text-ink-textMuted not-dark:text-stone-500 mt-1.5 max-w-sm font-sans leading-relaxed">
            An animated publication portal designed inside an aurora. Where longform thought, living ink, and vibrant community convene.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3 text-xs text-ink-textMuted dark:text-ink-textMuted not-dark:text-stone-600">
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-ink-cyan transition-colors">
              Feed
            </Link>
            <Link to="/login" className="hover:text-ink-magenta transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-ink-gold transition-colors">
              Register
            </Link>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-ink-magenta fill-current animate-pulse" />
            <span>in The Living Ink.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
