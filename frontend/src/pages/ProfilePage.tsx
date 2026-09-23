import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PenLine, Edit3, Trash2, Calendar, MessageSquare, Clock, PlusCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Avatar from '../components/Avatar';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import { PostCardSkeleton } from '../components/Skeleton';
import { calculateReadingTime, formatRelativeDate } from '../utils/readingTime';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUserPosts = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get('/posts', {
        params: {
          author: user.username,
          limit: 50,
        },
      });
      setPosts(res.data.posts);
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to load your posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [user]);

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    try {
      setIsDeleting(true);
      await api.delete(`/posts/${postToDelete}`);
      setPosts((prev) => prev.filter((p) => p.id !== postToDelete));
      success('Post dissolved successfully.');
      setPostToDelete(null);
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to delete post.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pb-24 relative z-10">
      {/* Profile Header with Luminous Aurora Backing */}
      <section className="relative py-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-4xl mx-auto glass-panel p-8 sm:p-10 rounded-3xl border border-white/15 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-ink-magenta/20 to-ink-cyan/20 blur-3xl rounded-full pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative z-10">
            <Avatar name={user.username} size="xl" showHalo={true} />
            <div className="flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white dark:text-white not-dark:text-ink-lightText">
                  {user.username}
                </h1>
                <Sparkles className="w-5 h-5 text-ink-gold" />
              </div>
              <p className="text-sm text-ink-textMuted dark:text-ink-textMuted not-dark:text-stone-600 mt-1">
                {user.email}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-xs text-stone-300 dark:text-stone-300 not-dark:text-stone-600">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-white/10">
                  <PenLine className="w-3.5 h-3.5 text-ink-cyan" />
                  <strong>{posts.length}</strong> {posts.length === 1 ? 'Essay' : 'Essays'} in the Living Ink
                </span>
              </div>
            </div>
            <Link
              to="/posts/new"
              className="liquid-button inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-sm font-semibold shadow-glow-magenta"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Essay</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Published Posts Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <h2 className="font-serif text-2xl font-bold text-white dark:text-white not-dark:text-ink-lightText mb-6 flex items-center gap-2">
          <span>Your Works in Print</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-ink-cyan/20 text-ink-cyan border border-ink-cyan/30 font-sans">
            {posts.length}
          </span>
        </h2>

        {loading && (
          <div className="space-y-4">
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        )}

        {!loading && posts.length === 0 && (
          <EmptyState
            icon="pen"
            title="Your chronicle awaits its first mark"
            description="Start writing to share your ideas, insights, and stories with readers across the aurora."
            actionText="Write Your First Essay"
            actionHref="/posts/new"
          />
        )}

        {!loading && posts.length > 0 && (
          <div className="space-y-4">
            {posts.map((post) => {
              const readingTime = calculateReadingTime(post.content);
              const relativeDate = formatRelativeDate(post.created_at);

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-white/20 transition-all"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <Link
                      to={`/posts/${post.id}`}
                      className="font-serif text-xl font-bold text-white dark:text-white not-dark:text-ink-lightText hover:text-ink-cyan transition-colors line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-2 text-xs text-ink-textMuted dark:text-ink-textMuted not-dark:text-stone-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-ink-gold" />
                        {relativeDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-ink-cyan" />
                        {readingTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-ink-magenta" />
                        {post._count?.comments ?? 0} reflections
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <Link
                      to={`/posts/${post.id}/edit`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg glass-panel border border-white/10 text-xs font-semibold text-stone-200 hover:text-ink-cyan hover:border-ink-cyan/40 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => setPostToDelete(post.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg glass-panel border border-rose-500/30 text-xs font-semibold text-rose-400 hover:bg-rose-500/15 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(postToDelete)}
        title="Dissolve Essay"
        message="Are you sure you want to extinguish this essay? Its reflections and comments will be permanently erased."
        confirmText="Dissolve Essay"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPostToDelete(null)}
      />
    </div>
  );
};

export default ProfilePage;
