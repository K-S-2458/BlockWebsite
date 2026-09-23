import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Clock, MessageSquare, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Post } from '../types';
import Avatar from './Avatar';
import GenerativeCoverArt, { detectCategory } from './GenerativeCoverArt';
import { calculateReadingTime, formatRelativeDate } from '../utils/readingTime';

export type BentoVariant = 'spotlight' | 'wide' | 'standard';

interface BentoPostCardProps {
  post: Post;
  variant?: BentoVariant;
  index: number;
}

export const BentoPostCard: React.FC<BentoPostCardProps> = ({
  post,
  variant = 'standard',
  index,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const category = detectCategory(post.title, post.content);
  const readingTime = calculateReadingTime(post.content);
  const relativeDate = formatRelativeDate(post.created_at);

  // Clean excerpt
  const cleanExcerpt = post.content
    .replace(/[#*`_>\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, variant === 'spotlight' ? 240 : variant === 'wide' ? 180 : 130);

  // 3D Tilt springs
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 220, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 220, damping: 22 });

  const maxTilt = variant === 'spotlight' ? '4.5deg' : '7.5deg';
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [maxTilt, `-${maxTilt}`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${maxTilt}`, maxTilt]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // Bento grid spans
  const containerClasses = {
    spotlight: 'col-span-1 md:col-span-2 lg:col-span-3 mb-10',
    wide: 'col-span-1 md:col-span-2',
    standard: 'col-span-1',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.65,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: 1100 }}
      className={containerClasses[variant]}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`relative group rounded-3xl glass-panel border border-white/12 dark:border-white/12 not-dark:border-stone-200 overflow-hidden transition-all duration-300 flex flex-col justify-between ${
          variant === 'spotlight'
            ? 'p-0 shadow-2xl min-h-[440px]'
            : variant === 'wide'
            ? 'p-0 shadow-xl min-h-[380px]'
            : 'p-0 shadow-lg min-h-[360px]'
        }`}
      >
        {/* Dynamic Color Bloom behind Card */}
        <div
          className={`absolute -right-12 -bottom-12 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-all duration-500 mix-blend-screen ${
            isHovered ? 'opacity-50 scale-125' : 'opacity-20 scale-100'
          }`}
          style={{ background: category.dominantColor }}
        />

        {/* Shifting Gradient Border Highlight */}
        <div
          className={`absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300 border-2 z-20 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            borderImage: `linear-gradient(135deg, ${category.dominantColor}, ${category.secondaryColor}, ${category.accentColor}) 1`,
            borderRadius: 'inherit',
          }}
        />

        {/* Generative Cover Art Banner */}
        <div className="relative w-full overflow-hidden">
          <GenerativeCoverArt
            id={post.id}
            title={post.title}
            content={post.content}
            variant={variant === 'spotlight' ? 'featured' : 'card'}
          />

          {/* Category Tag Pill Floating Top-Left over Cover Art */}
          <div className="absolute top-4 left-4 z-20">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-semibold backdrop-blur-md transition-transform duration-200 group-hover:scale-105 shadow-sm"
              style={{
                backgroundColor: category.pillBg,
                borderColor: category.pillBorder,
                color: category.pillText,
                borderWidth: '1px',
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: category.dominantColor }}
              />
              {category.name}
            </span>
          </div>

          {/* Featured Spotlight Badge */}
          {variant === 'spotlight' && (
            <div className="absolute top-4 right-4 z-20">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold bg-gradient-to-r from-ink-magenta to-ink-violet text-white shadow-glow-magenta">
                <Sparkles className="w-3.5 h-3.5 text-ink-gold" />
                Featured Story
              </span>
            </div>
          )}
        </div>

        {/* Content Body with High-Contrast Legibility Scrim */}
        <div className="relative z-10 p-6 sm:p-8 flex-1 flex flex-col justify-between -mt-8 bg-gradient-to-b from-transparent via-[#0B0A10]/95 to-[#0B0A10] dark:via-[#0B0A10]/95 dark:to-[#0B0A10] not-dark:via-white/95 not-dark:to-white">
          <div>
            {/* Author Row */}
            <div className="flex items-center gap-3 mb-3">
              <Avatar name={post.user.username} size="sm" showHalo={true} />
              <span className="text-xs font-semibold text-white dark:text-white not-dark:text-stone-900">
                {post.user.username}
              </span>
              <span className="text-stone-500 text-xs">•</span>
              <span className="flex items-center gap-1 text-xs text-ink-textMuted dark:text-ink-textMuted not-dark:text-stone-500">
                <Calendar className="w-3 h-3 text-ink-gold" />
                {relativeDate}
              </span>
            </div>

            {/* Post Title */}
            <h2
              className={`font-serif font-bold tracking-tight text-white dark:text-white not-dark:text-ink-lightText mb-3 leading-snug transition-colors group-hover:text-transparent group-hover:bg-clip-text ${
                variant === 'spotlight'
                  ? 'text-2xl sm:text-4xl md:text-5xl font-black'
                  : variant === 'wide'
                  ? 'text-2xl sm:text-3xl'
                  : 'text-xl sm:text-2xl'
              }`}
              style={{
                backgroundImage: isHovered
                  ? `linear-gradient(135deg, ${category.dominantColor}, ${category.secondaryColor}, ${category.accentColor})`
                  : undefined,
              }}
            >
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h2>

            {/* Excerpt */}
            <p className="font-sans text-stone-300 dark:text-stone-300 not-dark:text-stone-600 text-sm sm:text-base leading-relaxed mb-6 line-clamp-2 sm:line-clamp-3">
              {cleanExcerpt}
              {post.content.length > 130 ? '...' : ''}
            </p>
          </div>

          {/* Footer Metadata */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 dark:border-white/10 not-dark:border-stone-200 text-xs text-ink-textMuted dark:text-ink-textMuted not-dark:text-stone-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" style={{ color: category.dominantColor }} />
                {readingTime}
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" style={{ color: category.secondaryColor }} />
                {post._count?.comments ?? 0} reflections
              </span>
            </div>

            <Link
              to={`/posts/${post.id}`}
              className="inline-flex items-center gap-1.5 font-semibold transition-all duration-200 group-hover:translate-x-1"
              style={{ color: category.accentColor }}
            >
              <span>Read essay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BentoPostCard;
