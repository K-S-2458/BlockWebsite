import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Eye, Edit3, ArrowLeft, Save, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import EditorialMarkdown from '../utils/markdown';
import { calculateReadingTime } from '../utils/readingTime';
import { PostDetailSkeleton } from '../components/Skeleton';

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

export const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
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

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/posts/${id}`);
        const post = res.data.post;

        // Check ownership
        if (user && post.user_id !== user.id) {
          setIsForbidden(true);
          return;
        }

        setValue('title', post.title);
        setValue('content', post.content);
      } catch (err: any) {
        error(err.response?.data?.error || 'Failed to load post for editing.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPost();
    }
  }, [id, user, setValue, navigate, error]);

  const onSubmit = async (values: PostFormValues) => {
    try {
      setIsSubmitting(true);
      await api.put(`/posts/${id}`, values);
      success('Essay updated successfully.');
      navigate(`/posts/${id}`);
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to save changes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <PostDetailSkeleton />;
  }

  if (isForbidden) {
    return (
      <div className="max-w-reading mx-auto px-4 py-20 text-center relative z-10">
        <h2 className="font-serif text-3xl font-bold mb-3 text-white dark:text-white not-dark:text-ink-lightText">
          Access Restricted
        </h2>
        <p className="text-stone-400 dark:text-stone-400 not-dark:text-stone-600 mb-6 text-sm">
          You do not have permission to edit this post. Only the original author can edit their own essays.
        </p>
        <Link
          to={`/posts/${id}`}
          className="liquid-button inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-sm font-semibold shadow-glow-magenta"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Essay</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 relative z-10">
      <div className="max-w-3xl mx-auto">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <Link
            to={`/posts/${id}`}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-stone-400 hover:text-ink-cyan transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </Link>

          {/* Mode Tabs */}
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
              <span>Edit</span>
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
              <div className="absolute top-0 right-0 w-44 h-44 bg-ink-cyan/10 blur-3xl rounded-full pointer-events-none" />

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
                  className={`w-full px-4 py-3.5 text-lg font-serif rounded-xl border bg-white/5 dark:bg-white/5 not-dark:bg-white/70 focus:outline-none focus:ring-2 transition-all ${
                    errors.title
                      ? 'border-rose-500 focus:ring-rose-500/30'
                      : 'border-white/15 dark:border-white/15 not-dark:border-stone-300 focus:ring-ink-magenta/40 focus:border-ink-magenta'
                  } text-white dark:text-white not-dark:text-stone-900`}
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
                  rows={16}
                  {...register('content')}
                  className={`w-full p-4 rounded-xl border text-sm sm:text-base leading-relaxed bg-white/5 dark:bg-white/5 not-dark:bg-white/70 focus:outline-none focus:ring-2 font-sans transition-all resize-y ${
                    errors.content
                      ? 'border-rose-500 focus:ring-rose-500/30'
                      : 'border-white/15 dark:border-white/15 not-dark:border-stone-300 focus:ring-ink-magenta/40 focus:border-ink-magenta'
                  } text-white dark:text-white not-dark:text-stone-900`}
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
              <div className="mb-4 text-xs uppercase tracking-wider text-ink-magenta font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Updated Preview</span>
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
                <p className="italic text-stone-500 text-sm">No content to preview.</p>
              )}
            </motion.div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to={`/posts/${id}`}
              className="px-5 py-2.5 rounded-full glass-panel border border-white/15 text-sm font-medium text-stone-300 hover:bg-white/10 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="liquid-button inline-flex items-center gap-2 px-7 py-3 rounded-full text-white text-sm font-semibold shadow-glow-magenta disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Preserving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;
