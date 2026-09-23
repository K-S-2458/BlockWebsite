import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, X, Sparkles, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Post, PaginationMeta } from '../types';
import BentoPostCard, { BentoVariant } from '../components/BentoPostCard';
import KineticHeadline from '../components/KineticHeadline';
import SurrealHeroIllustration from '../components/SurrealHeroIllustration';
import { PostCardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const searchParam = searchParams.get('search') || '';

  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>(searchParam);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const fetchPosts = async (page: number, search: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/posts', {
        params: {
          page,
          limit: 6,
          ...(search ? { search } : {}),
        },
      });
      setPosts(res.data.posts);
      setPagination(res.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Unable to load essays. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(pageParam, searchParam);
  }, [pageParam, searchParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (searchInput.trim()) {
        next.set('search', searchInput.trim());
      } else {
        next.delete('search');
      }
      next.set('page', '1');
      return next;
    });
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('search');
      next.set('page', '1');
      return next;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', newPage.toString());
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Assign asymmetric bento variants to cards
  const getBentoVariant = (index: number, isFirstPage: boolean): BentoVariant => {
    if (isFirstPage && index === 0) return 'spotlight';
    const patternIndex = isFirstPage ? index - 1 : index;
    // Pattern: Wide, Standard, Standard, Wide, Standard...
    const cycle = patternIndex % 5;
    if (cycle === 0 || cycle === 3) return 'wide';
    return 'standard';
  };

  return (
    <main className="min-h-screen pb-24 relative z-10">
      {/* Living Ink Surreal Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel mb-6 border border-white/10 shadow-glow-violet"
          >
            <Sparkles className="w-3.5 h-3.5 text-ink-gold animate-spin-slow" />
            <span className="text-[11px] uppercase tracking-widest font-semibold bg-gradient-to-r from-ink-gold via-ink-magenta to-ink-cyan bg-clip-text text-transparent">
              Where Ink Comes to Life
            </span>
          </motion.div>

          {/* Kinetic Typography Headline */}
          <KineticHeadline
            line1="Thoughts Spilled Across"
            line2="The Living Aurora."
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-base sm:text-lg text-stone-300 dark:text-stone-300 not-dark:text-stone-600 max-w-2xl mx-auto font-sans leading-relaxed mb-4"
          >
            A luminous publication where ideas breathe, words ignite in color, and
            readers gather beneath an endless celestial ink sky.
          </motion.p>

          {/* Central Surreal Floating Book Illustration */}
          <SurrealHeroIllustration />

          {/* Search Bar with Focus-Reactive Pulsing Aura Ring */}
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onSubmit={handleSearchSubmit}
            className="mt-6 max-w-lg mx-auto relative flex items-center"
          >
            {/* Glowing animated aura ring */}
            <div
              className={`absolute -inset-1 rounded-full transition-all duration-500 blur-md pointer-events-none ${
                isSearchFocused
                  ? 'opacity-90 bg-gradient-to-r from-ink-magenta via-ink-violet to-ink-cyan animate-pulse-glow'
                  : 'opacity-30 bg-gradient-to-r from-ink-violet to-ink-cyan'
              }`}
            />

            <div className="relative w-full flex items-center rounded-full glass-panel border border-white/20 dark:border-white/20 not-dark:border-violet-500/20 shadow-xl overflow-hidden">
              <Search className="w-5 h-5 absolute left-4 text-ink-cyan pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search essays by title or keyword..."
                className="w-full pl-12 pr-28 py-3.5 text-sm bg-transparent focus:outline-none text-white dark:text-white not-dark:text-stone-900 placeholder-stone-400 font-sans"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-20 p-1 text-stone-400 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="liquid-button absolute right-1.5 px-5 py-2 rounded-full text-white text-xs font-semibold shadow-glow-magenta active:scale-95"
              >
                Search
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Editorial Bento Grid Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {searchParam && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 rounded-2xl glass-panel mb-8 text-sm text-stone-300 dark:text-stone-300 not-dark:text-stone-700 border border-white/10"
          >
            <span>
              Articles containing:{' '}
              <strong className="text-ink-cyan">"{searchParam}"</strong>
            </span>
            <button
              onClick={clearSearch}
              className="text-xs text-ink-magenta hover:underline font-semibold"
            >
              Clear filter
            </button>
          </motion.div>
        )}

        {/* Section Title */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10 dark:border-white/10 not-dark:border-stone-200">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-ink-cyan" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white dark:text-white not-dark:text-ink-lightText">
              {searchParam ? 'Search Results' : 'The Chronicle Bento Feed'}
            </h2>
          </div>
          <span className="text-xs text-ink-textMuted dark:text-ink-textMuted not-dark:text-stone-500 font-sans">
            Curated Longform
          </span>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <PostCardSkeleton />
            </div>
            <div className="col-span-1 md:col-span-2">
              <PostCardSkeleton />
            </div>
            <div className="col-span-1">
              <PostCardSkeleton />
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="py-12 text-center">
            <div className="inline-block p-5 rounded-2xl glass-panel border border-rose-500/30 text-rose-300 text-sm max-w-md shadow-glow-magenta">
              {error}
            </div>
            <div className="mt-4">
              <button
                onClick={() => fetchPosts(pageParam, searchParam)}
                className="text-sm font-semibold text-ink-cyan hover:underline"
              >
                Try reloading
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <EmptyState
            title={searchParam ? 'No matching stories found' : 'The page awaits your ink'}
            description={
              searchParam
                ? `No essays match "${searchParam}". Try a different keyword.`
                : 'The chronicle is waiting for its first essay. Awaken the living ink today.'
            }
            actionText="Write an Essay"
            actionHref="/posts/new"
          />
        )}

        {/* Asymmetric Bento Magazine Grid */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, idx) => {
              const variant = getBentoVariant(idx, pageParam === 1 && !searchParam);
              return (
                <BentoPostCard
                  key={post.id}
                  post={post}
                  variant={variant}
                  index={idx}
                />
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && pagination && pagination.totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="flex items-center justify-between glass-panel p-4 rounded-2xl border border-white/10 mt-12 max-w-2xl mx-auto"
          >
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                pagination.hasPrevPage
                  ? 'text-white dark:text-white not-dark:text-stone-800 hover:bg-white/10 not-dark:hover:bg-black/5'
                  : 'text-stone-500 opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-semibold text-ink-textMuted dark:text-ink-textMuted not-dark:text-stone-600 font-sans">
              Page <span className="text-ink-cyan">{pagination.page}</span> of{' '}
              <span className="text-ink-magenta">{pagination.totalPages}</span>
            </span>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                pagination.hasNextPage
                  ? 'text-white dark:text-white not-dark:text-stone-800 hover:bg-white/10 not-dark:hover:bg-black/5'
                  : 'text-stone-500 opacity-40 cursor-not-allowed'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        )}
      </section>
    </main>
  );
};

export default HomePage;
