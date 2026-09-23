import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Clock, MessageSquare, Calendar, ArrowRight } from 'lucide-react';
import { Post } from '../types';
import Avatar from './Avatar';
import { calculateReadingTime, formatRelativeDate } from '../utils/readingTime';

interface TiltPostCardProps {
  post: Post;
  index: number;
}

export const TiltPostCard: React.FC<TiltPostCardProps> = ({ post, index }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tilt motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 220, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 220, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const readingTime = calculateReadingTime(post.content);
  const relativeDate = formatRelativeDate(post.created_at);

  const cleanExcerpt = post.content
    .replace(/[#*`_>\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 190);

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.65,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: 1000 }}
      className="mb-8"
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
        className="relative group rounded-2xl glass-panel p-6 sm:p-8 transition-shadow duration-300 hover:shadow-2xl border border-white/10 dark:border-white/10 not-dark:border-violet-500/15 overflow-hidden"
      >
        {/* Dynamic color blob behind card shifting on hover */}
        <div
          className={`absolute -right-10 -bottom-10 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-500 mix-blend-screen ${
            isHovered
              ? 'opacity-40 scale-125 bg-gradient-to-tr from-ink-magenta via-ink-violet to-ink-cyan'
              : 'opacity-15 scale-100 bg-ink-violet'
          }`}
        />

        {/* Shifting Gradient Border Highlight */}
        <div
          className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 border-2 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            borderImage: 'linear-gradient(135deg, #FF2E88, #7C3AED, #00E5FF, #FFD23F) 1',
            borderRadius: 'inherit',
          }}
        />

        {/* Author Metadata Row */}
        <div className="flex items-center gap-3 mb-4">
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

        {/* Title with Gradient Flow on hover */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white dark:text-white not-dark:text-ink-lightText mb-3 leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-ink-magenta group-hover:via-ink-violet group-hover:to-ink-cyan transition-all duration-300">
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </h2>

        {/* Excerpt */}
        <p className="font-sans text-stone-300 dark:text-stone-300 not-dark:text-stone-700 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
          {cleanExcerpt}
          {post.content.length > 190 ? '...' : ''}
        </p>

        {/* Card Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 dark:border-white/10 not-dark:border-stone-200 text-xs text-ink-textMuted dark:text-ink-textMuted not-dark:text-stone-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-ink-cyan" />
              {readingTime}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-ink-magenta" />
              {post._count?.comments ?? 0} reflections
            </span>
          </div>

          <Link
            to={`/posts/${post.id}`}
            className="inline-flex items-center gap-1.5 text-ink-cyan hover:text-ink-magenta font-semibold transition-colors group-hover:translate-x-1 duration-200"
          >
            <span>Read essay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TiltPostCard;
