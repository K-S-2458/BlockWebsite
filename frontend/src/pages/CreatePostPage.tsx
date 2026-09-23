import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, Edit3, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import EditorialMarkdown from '../utils/markdown';
import { calculateReadingTime } from '../utils/readingTime';

const postSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(150, 'Title cannot exceed 150 characters'),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters long'),
});

type PostFormValues = z.infer<typeof postSchema>;

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const watchedTitle = watch('title');
  const watchedContent = watch('content');

  const onSubmit = async (values: PostFormValues) => {
    try {
      setIsSubmitting(true);
      const res = await api.post('/posts', values);
      success('Your essay has been brought to life!');
      navigate(`/posts/${res.data.post.id}`);
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to publish post. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 relative z-10">
      <div className="max-w-3xl mx-auto">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-stone-400 hover:text-ink-cyan transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </Link>

          {/* Mode Switch Tabs */}
          <div className="inline-flex rounded-xl p-1 glass-panel border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'write'
                  ? 'bg-gradient-to-r from-ink-magenta to-ink-violet text-white shadow-glow-magenta'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Write</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'preview'
                  ? 'bg-gradient-to-r from-ink-violet to-ink-cyan text-white shadow-glow-cyan'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {activeTab === 'write' ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl space-y-6"
            >
              {/* Decorative Corner Glow */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-ink-magenta/10 blur-3xl rounded-full pointer-events-none" />

              {/* Title input */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-xs uppercase tracking-wider font-semibold text-stone-300 dark:text-stone-300 not-dark:text-stone-700 mb-2"
                >
                  Essay Title
                </label>
                <input
                  id="title"
                  type="text"
                  {...register('title')}
                  placeholder="e.g. The Architecture of Silence: Designing for Cognitive Stillness"
                  className={`w-full px-4 py-3.5 text-lg font-serif rounded-xl border bg-white/5 dark:bg-white/5 not-dark:bg-white/70 focus:outline-none focus:ring-2 transition-all ${
                    errors.title
                      ? 'border-rose-500 focus:ring-rose-500/30'
                      : 'border-white/15 dark:border-white/15 not-dark:border-stone-300 focus:ring-ink-magenta/40 focus:border-ink-magenta'
                  } text-white dark:text-white not-dark:text-stone-900 placeholder-stone-500`}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-rose-400 font-medium">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Content textarea */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="content"
                    className="block text-xs uppercase tracking-wider font-semibold text-stone-300 dark:text-stone-300 not-dark:text-stone-700"
                  >
                    Essay Content (Living Markdown)
                  </label>
                  <span className="text-xs text-ink-gold font-sans flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {calculateReadingTime(watchedContent || '')}
                  </span>
                </div>
                <textarea
                  id="content"
                  rows={14}
                  {...register('content')}
                  placeholder="Pour your thoughts onto the page... Use # for headings, > for blockquotes, - for bullet lists, and **bold** for emphasis."
                  className={`w-full p-4 rounded-xl border text-sm sm:text-base leading-relaxed bg-white/5 dark:bg-white/5 not-dark:bg-white/70 focus:outline-none focus:ring-2 font-sans transition-all resize-y ${
                    errors.content
                      ? 'border-rose-500 focus:ring-rose-500/30'
                      : 'border-white/15 dark:border-white/15 not-dark:border-stone-300 focus:ring-ink-magenta/40 focus:border-ink-magenta'
                  } text-white dark:text-white not-dark:text-stone-900 placeholder-stone-500`}
                />
                {errors.content && (
                  <p className="mt-1 text-xs text-rose-400 font-medium">
                    {errors.content.message}
                  </p>
                )}
              </div>
            </motion.div>
          ) : (
            /* Live Markdown Preview Container */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/15 shadow-2xl relative overflow-hidden"
            >
              <div className="mb-4 text-xs uppercase tracking-wider text-ink-cyan font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Living Editorial Preview</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white dark:text-white not-dark:text-ink-lightText leading-[1.2] mb-6">
                {watchedTitle || 'Untitled Essay'}
              </h1>
              <div className="pb-6 mb-6 border-b border-white/10 flex items-center gap-3 text-xs text-ink-textMuted">
                <span>Estimated reading time: {calculateReadingTime(watchedContent || '')}</span>
              </div>
              {watchedContent ? (
                <div className="text-stone-200 dark:text-stone-200 not-dark:text-stone-800 leading-editorial text-base sm:text-lg">
                  <EditorialMarkdown content={watchedContent} />
                </div>
              ) : (
                <p className="italic text-stone-500 text-sm">
                  Start pouring words into the write tab to witness your formatted essay...
                </p>
              )}
            </motion.div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-full glass-panel border border-white/15 text-sm font-medium text-stone-300 hover:bg-white/10 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="liquid-button inline-flex items-center gap-2 px-7 py-3 rounded-full text-white text-sm font-semibold shadow-glow-magenta disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Igniting Essay...' : 'Publish Essay'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
