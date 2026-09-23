import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ArrowLeft,
  Edit3,
  Trash2,
  MessageSquare,
  Send,
  Check,
  X,
  Share2,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Post, Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Avatar from '../components/Avatar';
import GenerativeCoverArt, { detectCategory } from '../components/GenerativeCoverArt';
import { PostDetailSkeleton, CommentRowSkeleton } from '../components/Skeleton';
import ConfirmModal from '../components/ConfirmModal';
import EditorialMarkdown from '../utils/markdown';
import { calculateReadingTime, formatRelativeDate } from '../utils/readingTime';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingPost, setLoadingPost] = useState<boolean>(true);
  const [loadingComments, setLoadingComments] = useState<boolean>(true);
  const [postError, setPostError] = useState<string | null>(null);

  // New Comment state
  const [newCommentContent, setNewCommentContent] = useState<string>('');
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);

  // Editing comment state
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');
  const [updatingComment, setUpdatingComment] = useState<boolean>(false);

  // Modal States
  const [showDeletePostModal, setShowDeletePostModal] = useState<boolean>(false);
  const [deletingPost, setDeletingPost] = useState<boolean>(false);

  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [deletingComment, setDeletingComment] = useState<boolean>(false);

  const fetchPost = useCallback(async () => {
    try {
      setLoadingPost(true);
      setPostError(null);
      const res = await api.get(`/posts/${id}`);
      setPost(res.data.post);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setPostError('The requested essay could not be found.');
      } else {
        setPostError(err.response?.data?.error || 'Failed to load essay.');
      }
    } finally {
      setLoadingPost(false);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      setLoadingComments(true);
      const res = await api.get(`/posts/${id}/comments`);
      setComments(res.data.comments);
    } catch {
      // Non-blocking error for comments
    } finally {
      setLoadingComments(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  // Handle Post Deletion
  const handleDeletePost = async () => {
    if (!id) return;
    try {
      setDeletingPost(true);
      await api.delete(`/posts/${id}`);
      success('Essay deleted successfully.');
      navigate('/');
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to delete essay.');
      setDeletingPost(false);
      setShowDeletePostModal(false);
    }
  };

  // Handle Create Comment
  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim() || !id) return;

    try {
      setSubmittingComment(true);
      const res = await api.post(`/posts/${id}/comments`, {
        content: newCommentContent.trim(),
      });
      setComments((prev) => [...prev, res.data.comment]);
      setNewCommentContent('');
      success('Reflection published.');
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to add comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Handle Save Edited Comment
  const handleSaveEditComment = async (commentId: string) => {
    if (!editingContent.trim()) return;
    try {
      setUpdatingComment(true);
      const res = await api.put(`/comments/${commentId}`, {
        content: editingContent.trim(),
      });
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? res.data.comment : c))
      );
      setEditingCommentId(null);
      setEditingContent('');
      success('Reflection updated.');
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to update comment.');
    } finally {
      setUpdatingComment(false);
    }
  };

  // Handle Delete Comment
  const handleConfirmDeleteComment = async () => {
    if (!commentToDelete) return;
    try {
      setDeletingComment(true);
      await api.delete(`/comments/${commentToDelete}`);
      setComments((prev) => prev.filter((c) => c.id !== commentToDelete));
      success('Comment deleted.');
      setCommentToDelete(null);
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to delete comment.');
    } finally {
      setDeletingComment(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      success('Essay portal link copied to clipboard!');
    }
  };

  if (loadingPost) {
    return <PostDetailSkeleton />;
  }

  if (postError || !post) {
    return (
      <div className="max-w-reading mx-auto px-4 py-20 text-center relative z-10">
        <h2 className="font-serif text-3xl font-bold mb-3 text-white dark:text-white not-dark:text-ink-lightText">
          Essay Not Found
        </h2>
        <p className="text-stone-400 dark:text-stone-400 not-dark:text-stone-600 mb-6 text-sm">
          {postError || 'This post may have been removed or does not exist.'}
        </p>
        <Link
          to="/"
          className="liquid-button inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-sm font-semibold shadow-glow-magenta"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Feed</span>
        </Link>
      </div>
    );
  }

  const isAuthor = user && user.id === post.user_id;
  const category = detectCategory(post.title, post.content);
  const readingTime = calculateReadingTime(post.content);
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="min-h-screen pb-28 relative z-10">
      {/* 1. Full-Bleed Generative Cover Art at the Top with Gradient Fade */}
      <div className="relative w-full -mt-20">
        <GenerativeCoverArt
          id={post.id}
          title={post.title}
          content={post.content}
          variant="detail"
        />

        {/* Ambient Overlay to blend with sticky navigation */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0A10]/60 via-transparent to-[#0B0A10] dark:from-[#0B0A10]/60 dark:to-[#0B0A10] not-dark:from-black/30 not-dark:to-[#FBF9F5]" />

        {/* Floating Top Nav within Cover Header */}
        <div className="absolute top-24 left-0 right-0 max-w-reading mx-auto px-4 sm:px-6 flex items-center justify-between z-20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-xs uppercase tracking-wider font-semibold text-white hover:text-ink-cyan border border-white/20 transition-all shadow-md backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to feed</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs text-white hover:text-ink-gold transition-colors p-2 rounded-full glass-panel border border-white/20 shadow-md backdrop-blur-md"
            title="Copy essay link"
          >
            <Share2 className="w-4 h-4 text-ink-gold" />
            <span className="hidden sm:inline font-medium pr-1">Share</span>
          </button>
        </div>
      </div>

      {/* 2. Centered Reading Column (max-w ~680px) */}
      <div className="max-w-reading mx-auto px-4 sm:px-6 -mt-16 sm:-mt-24 relative z-20">
        {/* Category Tag Pill */}
        <div className="mb-4">
          <span
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs uppercase tracking-wider font-semibold backdrop-blur-md shadow-sm border"
            style={{
              backgroundColor: category.pillBg,
              borderColor: category.pillBorder,
              color: category.pillText,
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: category.dominantColor }}
            />
            {category.name}
          </span>
        </div>

        {/* Post Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white dark:text-white not-dark:text-ink-lightText leading-[1.2] mb-6"
        >
          {post.title}
        </motion.h1>

        {/* Author Byline & Actions Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-10 border-b border-white/10 dark:border-white/10 not-dark:border-stone-200">
          <div className="flex items-center gap-3">
            <Avatar name={post.user.username} size="md" showHalo={true} />
            <div>
              <p className="font-semibold text-sm text-white dark:text-white not-dark:text-stone-900">
                {post.user.username}
              </p>
              <div className="flex items-center gap-3 text-xs text-ink-textMuted dark:text-ink-textMuted not-dark:text-stone-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-ink-gold" />
                  {formattedDate}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" style={{ color: category.dominantColor }} />
                  {readingTime}
                </span>
              </div>
            </div>
          </div>

          {/* Edit/Delete Actions for Owner */}
          {isAuthor && (
            <div className="flex items-center gap-2 self-start sm:self-center">
              <Link
                to={`/posts/${post.id}/edit`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl glass-panel border border-white/10 text-white dark:text-white not-dark:text-stone-800 hover:text-ink-cyan hover:border-ink-cyan/40 text-xs font-semibold transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Link>
              <button
                onClick={() => setShowDeletePostModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl glass-panel border border-rose-500/30 text-rose-400 hover:bg-rose-500/15 text-xs font-semibold transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Post Content rendered in Living Ink Editorial Typography */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-stone-200 dark:text-stone-200 not-dark:text-stone-800 text-base sm:text-lg leading-editorial mb-16 select-text"
        >
          <EditorialMarkdown content={post.content} />
        </motion.div>

        {/* Luminous Separator */}
        <div className="my-14 flex items-center justify-center">
          <div
            className="w-24 h-0.5 rounded-full animate-pulse-glow"
            style={{
              background: `linear-gradient(90deg, transparent, ${category.dominantColor}, transparent)`,
            }}
          />
        </div>

        {/* Comments / Reflections Section */}
        <section className="pt-4" id="comments">
          <div className="flex items-center gap-2.5 mb-6">
            <MessageSquare className="w-5 h-5 text-ink-magenta" />
            <h2 className="font-serif text-2xl font-bold text-white dark:text-white not-dark:text-ink-lightText flex items-center gap-2">
              <span>Discussion</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-ink-magenta/20 text-ink-magenta border border-ink-magenta/30 font-sans">
                {comments.length}
              </span>
            </h2>
          </div>

          {/* Comment Composer */}
          <div className="mb-10 glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden shadow-glass-card">
            {/* Ambient Corner Glow */}
            <div
              className="absolute top-0 right-0 w-32 h-32 blur-2xl pointer-events-none rounded-full"
              style={{ background: `${category.dominantColor}15` }}
            />

            {user ? (
              <form onSubmit={handleCreateComment}>
                <div className="flex items-center gap-2.5 mb-3">
                  <Avatar name={user.username} size="sm" showHalo={true} />
                  <span className="text-xs font-semibold text-stone-300 dark:text-stone-300 not-dark:text-stone-700">
                    Contributing as <strong className="text-ink-cyan">{user.username}</strong>
                  </span>
                </div>
                <textarea
                  value={newCommentContent}
                  onChange={(e) => setNewCommentContent(e.target.value)}
                  placeholder="Leave your reflection or perspective on this essay..."
                  rows={3}
                  className="w-full p-3.5 rounded-xl border border-white/10 dark:border-white/10 not-dark:border-stone-300 bg-white/5 dark:bg-white/5 not-dark:bg-white/70 text-sm text-white dark:text-white not-dark:text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-ink-magenta/50 focus:border-ink-magenta transition-all resize-y"
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[11px] text-ink-textMuted flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-ink-gold" />
                    <span>Thoughtful discourse is celebrated.</span>
                  </span>
                  <button
                    type="submit"
                    disabled={!newCommentContent.trim() || submittingComment}
                    className="liquid-button inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-xs font-semibold shadow-glow-magenta disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingComment ? 'Publishing...' : 'Publish Reflection'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-stone-300 dark:text-stone-300 not-dark:text-stone-600 mb-4 font-medium">
                  Join this reflection thread by stepping inside the journal.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Link
                    to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
                    className="liquid-button px-5 py-2.5 text-xs font-semibold rounded-full text-white shadow-glow-magenta"
                  >
                    Sign In to Comment
                  </Link>
                  <Link
                    to={`/register?redirect=${encodeURIComponent(window.location.pathname)}`}
                    className="px-5 py-2.5 text-xs font-semibold rounded-full glass-panel border border-white/15 text-white dark:text-white not-dark:text-stone-800 hover:bg-white/10 transition-colors"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Comments List */}
          {loadingComments && (
            <div className="space-y-4">
              <CommentRowSkeleton />
              <CommentRowSkeleton />
            </div>
          )}

          {!loadingComments && comments.length === 0 && (
            <div className="text-center py-12 glass-panel rounded-2xl border border-white/10 text-stone-400 text-sm">
              <p className="font-serif text-lg text-stone-300 dark:text-stone-300 not-dark:text-stone-700">
                No reflections yet on this essay.
              </p>
              <p className="text-xs text-ink-textMuted mt-1">
                Be the first mind to leave an ink mark.
              </p>
            </div>
          )}

          {/* Expanding Ink-Blot Pop Animation on comments */}
          {!loadingComments && comments.length > 0 && (
            <div className="space-y-4">
              <AnimatePresence>
                {comments.map((comment) => {
                  const isCommentAuthor = user && user.id === comment.user_id;
                  const isEditing = editingCommentId === comment.id;

                  return (
                    <motion.div
                      key={comment.id}
                      initial={{ scale: 0.85, opacity: 0, y: 15 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.85, opacity: 0 }}
                      transition={{
                        type: 'spring',
                        damping: 18,
                        stiffness: 160,
                      }}
                      className="group relative flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      <Avatar name={comment.user.username} size="sm" showHalo={true} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-white dark:text-white not-dark:text-stone-900">
                              {comment.user.username}
                            </span>
                            {comment.user_id === post.user_id && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-ink-magenta/30 to-ink-violet/30 text-ink-magenta border border-ink-magenta/30">
                                Author
                              </span>
                            )}
                            <span className="text-stone-500 text-xs">•</span>
                            <span className="text-[11px] text-ink-textMuted dark:text-ink-textMuted not-dark:text-stone-500">
                              {formatRelativeDate(comment.created_at)}
                            </span>
                          </div>

                          {/* Owner Actions */}
                          {isCommentAuthor && !isEditing && (
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditingContent(comment.content);
                                }}
                                className="p-1 text-stone-400 hover:text-ink-cyan transition-colors"
                                title="Edit reflection"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setCommentToDelete(comment.id)}
                                className="p-1 text-stone-400 hover:text-rose-400 transition-colors"
                                title="Delete reflection"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Inline Editor / Content */}
                        {isEditing ? (
                          <div className="mt-2 space-y-2.5">
                            <textarea
                              value={editingContent}
                              onChange={(e) => setEditingContent(e.target.value)}
                              rows={2}
                              className="w-full p-3 text-sm rounded-xl border border-white/20 bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-ink-magenta"
                            />
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditingContent('');
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs text-stone-300 hover:bg-white/10 rounded-lg transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Cancel</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEditComment(comment.id)}
                                disabled={updatingComment || !editingContent.trim()}
                                className="liquid-button inline-flex items-center gap-1 px-4 py-1 text-xs text-white rounded-lg transition-colors disabled:opacity-50"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>{updatingComment ? 'Saving...' : 'Save'}</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-stone-300 dark:text-stone-300 not-dark:text-stone-700 leading-relaxed break-words">
                            {comment.content}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>

      {/* Delete Post Modal */}
      <ConfirmModal
        isOpen={showDeletePostModal}
        title="Delete Essay"
        message="Are you sure you want to extinguish this essay? Its associated comments and reflections will also dissolve forever."
        confirmText="Dissolve Essay"
        isLoading={deletingPost}
        onConfirm={handleDeletePost}
        onCancel={() => setShowDeletePostModal(false)}
      />

      {/* Delete Comment Modal */}
      <ConfirmModal
        isOpen={Boolean(commentToDelete)}
        title="Delete Reflection"
        message="Are you sure you want to remove this reflection?"
        confirmText="Remove Reflection"
        isLoading={deletingComment}
        onConfirm={handleConfirmDeleteComment}
        onCancel={() => setCommentToDelete(null)}
      />
    </article>
  );
};

export default PostDetailPage;
