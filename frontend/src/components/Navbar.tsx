import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, PenLine, User as UserIcon, LogOut, Menu, X, BookOpen, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import Avatar from './Avatar';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [colorBurst, setColorBurst] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  }, [location.pathname]);

  const handleToggleThemeWithBurst = () => {
    setColorBurst(true);
    toggleTheme();
    setTimeout(() => setColorBurst(false), 700);
  };

  const handleLogout = async () => {
    await logout();
    success('You have been logged out.');
    navigate('/');
  };

  return (
    <>
      {/* Full-screen color-burst wave on theme toggle */}
      <AnimatePresence>
        {colorBurst && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="fixed top-5 right-20 w-32 h-32 rounded-full pointer-events-none z-50 mix-blend-screen bg-gradient-to-r from-ink-magenta via-ink-cyan to-ink-gold blur-2xl"
          />
        )}
      </AnimatePresence>

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0B0A10]/75 dark:bg-[#0B0A10]/75 not-dark:bg-white/75 backdrop-blur-xl shadow-lg border-b border-white/10 dark:border-white/10 not-dark:border-violet-500/15'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo / Brand with Living Ink Glow */}
            <Link
              to="/"
              className="flex items-center gap-3 group focus:outline-none"
              aria-label="The Chronicle Home"
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-ink-magenta via-ink-violet to-ink-cyan opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300 animate-pulse-glow" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-ink-violet to-ink-magenta text-white flex items-center justify-center font-serif text-2xl font-black shadow-md transition-transform duration-300 group-hover:scale-105">
                  C
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white dark:text-white not-dark:text-ink-lightText transition-colors flex items-center gap-1.5">
                  <span>The Chronicle</span>
                  <Sparkles className="w-4 h-4 text-ink-gold opacity-80 animate-pulse" />
                </span>
                <span className="text-[10px] uppercase tracking-widest text-ink-textMuted dark:text-ink-textMuted not-dark:text-ink-lightMuted font-sans -mt-1 font-semibold">
                  The Living Ink Journal
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-5">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors py-2 relative ${
                  location.pathname === '/'
                    ? 'text-ink-cyan font-semibold'
                    : 'text-stone-300 dark:text-stone-300 not-dark:text-stone-700 hover:text-ink-cyan'
                }`}
              >
                Feed
                {location.pathname === '/' && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-ink-cyan to-ink-magenta"
                  />
                )}
              </Link>

              {/* Morphing Sun/Moon Theme Toggle */}
              <button
                onClick={handleToggleThemeWithBurst}
                className="relative p-2.5 rounded-full text-stone-300 dark:text-stone-300 not-dark:text-stone-700 hover:text-ink-gold transition-colors focus:outline-none bg-white/5 dark:bg-white/5 not-dark:bg-black/5 hover:bg-white/15 dark:hover:bg-white/15 backdrop-blur-sm border border-white/10 dark:border-white/10 not-dark:border-black/10 shadow-sm"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === 'light' ? (
                    <motion.div
                      key="moon"
                      initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0.5, rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Moon className="w-4 h-4 text-ink-violet" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0.5, rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Sun className="w-4 h-4 text-ink-gold" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    to="/posts/new"
                    className="liquid-button inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-glow-magenta"
                  >
                    <PenLine className="w-4 h-4" />
                    <span>Write Post</span>
                  </Link>

                  {/* User Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center gap-2.5 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-ink-magenta/60"
                      aria-expanded={isUserDropdownOpen}
                    >
                      <Avatar name={user.username} size="sm" />
                      <span className="text-sm font-medium text-stone-200 dark:text-stone-200 not-dark:text-stone-800 max-w-[120px] truncate">
                        {user.username}
                      </span>
                    </button>

                    <AnimatePresence>
                      {isUserDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel p-2 shadow-2xl z-50"
                        >
                          <div className="px-3 py-2 border-b border-white/10 dark:border-white/10 not-dark:border-stone-200">
                            <p className="text-[11px] text-ink-textMuted dark:text-ink-textMuted not-dark:text-stone-500 font-sans">
                              Signed in as
                            </p>
                            <p className="text-sm font-semibold truncate text-white dark:text-white not-dark:text-stone-900">
                              {user.email}
                            </p>
                          </div>

                          <div className="py-1 space-y-0.5">
                            <Link
                              to="/profile"
                              className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-stone-200 dark:text-stone-200 not-dark:text-stone-800 hover:bg-white/10 dark:hover:bg-white/10 not-dark:hover:bg-stone-100 transition-colors"
                            >
                              <UserIcon className="w-4 h-4 text-ink-cyan" />
                              <span>My Essays</span>
                            </Link>

                            <Link
                              to="/posts/new"
                              className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-stone-200 dark:text-stone-200 not-dark:text-stone-800 hover:bg-white/10 dark:hover:bg-white/10 not-dark:hover:bg-stone-100 transition-colors"
                            >
                              <PenLine className="w-4 h-4 text-ink-magenta" />
                              <span>Create Essay</span>
                            </Link>
                          </div>

                          <div className="border-t border-white/10 dark:border-white/10 not-dark:border-stone-200 my-1" />

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-rose-400 hover:bg-rose-500/15 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-stone-300 dark:text-stone-300 not-dark:text-stone-700 hover:text-ink-magenta transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="liquid-button px-5 py-2 rounded-full text-white text-sm font-semibold shadow-glow-magenta"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu & Theme Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={handleToggleThemeWithBurst}
                className="p-2.5 rounded-full text-stone-300 dark:text-stone-300 not-dark:text-stone-700 min-h-[44px] min-w-[44px] flex items-center justify-center bg-white/5 rounded-full border border-white/10"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-ink-violet" />
                ) : (
                  <Sun className="w-5 h-5 text-ink-gold" />
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl text-stone-200 dark:text-stone-200 not-dark:text-stone-800 min-h-[44px] min-w-[44px] flex items-center justify-center bg-white/5 border border-white/10"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden glass-panel border-b border-white/10 px-5 py-6 space-y-4 overflow-hidden"
            >
              <Link
                to="/"
                className="flex items-center gap-3 py-2 text-base font-medium text-stone-200 dark:text-stone-200 not-dark:text-stone-800"
              >
                <BookOpen className="w-5 h-5 text-ink-cyan" />
                <span>Read Articles</span>
              </Link>

              {user ? (
                <div className="pt-2 border-t border-white/10 space-y-3">
                  <div className="flex items-center gap-3 py-2">
                    <Avatar name={user.username} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-white dark:text-white not-dark:text-stone-900">
                        {user.username}
                      </p>
                      <p className="text-xs text-ink-textMuted dark:text-ink-textMuted not-dark:text-stone-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/posts/new"
                    className="liquid-button flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold text-sm shadow-glow-magenta"
                  >
                    <PenLine className="w-4 h-4" />
                    <span>Write New Essay</span>
                  </Link>

                  <Link
                    to="/profile"
                    className="flex items-center gap-3 py-2.5 text-sm font-medium text-stone-300 dark:text-stone-300 not-dark:text-stone-700"
                  >
                    <UserIcon className="w-4 h-4 text-ink-cyan" />
                    <span>My Essays</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full py-2.5 text-sm font-medium text-rose-400"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-white/10 space-y-3">
                  <Link
                    to="/login"
                    className="block w-full py-3 text-center rounded-xl border border-white/15 dark:border-white/15 not-dark:border-stone-300 font-medium text-sm text-stone-200 dark:text-stone-200 not-dark:text-stone-800"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="liquid-button block w-full py-3 text-center rounded-xl text-white font-semibold text-sm shadow-glow-magenta"
                  >
                    Create an Account
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;
