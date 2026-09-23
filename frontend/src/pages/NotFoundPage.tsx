import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <span className="font-serif text-8xl font-black text-editorial-accent/30 dark:text-editorial-accent/20 mb-2">
        404
      </span>
      <h1 className="font-serif text-3xl font-bold text-editorial-lightText dark:text-editorial-darkText mb-3">
        Page Not Found
      </h1>
      <p className="text-stone-500 dark:text-stone-400 text-sm max-w-sm mb-8 leading-relaxed">
        The page or story you are looking for has been moved, removed, or never existed.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-editorial-accent hover:bg-editorial-accentHover text-white text-sm font-semibold transition-all active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Feed</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
