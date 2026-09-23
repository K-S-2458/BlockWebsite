import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="glass-panel rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-white/20 relative overflow-hidden"
        >
          {/* Subtle destructive ambient aura */}
          {isDestructive && (
            <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/15 blur-2xl pointer-events-none rounded-full" />
          )}

          <div className="flex items-center gap-3.5 mb-4 relative z-10">
            {isDestructive && (
              <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 flex-shrink-0 shadow-glow-magenta">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            <h3 className="font-serif text-2xl font-bold text-white dark:text-white not-dark:text-ink-lightText">
              {title}
            </h3>
          </div>

          <p className="text-stone-300 dark:text-stone-300 not-dark:text-stone-600 text-sm mb-6 leading-relaxed relative z-10">
            {message}
          </p>

          <div className="flex items-center justify-end gap-3 relative z-10">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-medium rounded-full glass-panel border border-white/10 text-stone-300 hover:bg-white/10 transition-colors"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-6 py-2.5 text-sm font-semibold rounded-full text-white transition-all shadow-md active:scale-95 ${
                isDestructive
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 shadow-rose-900/40'
                  : 'liquid-button shadow-glow-magenta'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
