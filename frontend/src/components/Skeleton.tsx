import React from 'react';

/**
 * Shimmering iridescent gradient sweep across placeholder blocks
 * mimicking light passing through colored stained glass.
 */
export const IridescentShimmer: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`relative overflow-hidden rounded-lg bg-white/5 dark:bg-white/5 not-dark:bg-black/5 ${className}`}
  >
    <div
      className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
      style={{
        background:
          'linear-gradient(90deg, transparent 0%, rgba(124, 58, 237, 0.15) 25%, rgba(255, 46, 136, 0.25) 50%, rgba(0, 229, 255, 0.2) 75%, transparent 100%)',
      }}
    />
  </div>
);

export const PostCardSkeleton: React.FC = () => (
  <div className="glass-panel p-6 sm:p-7 rounded-2xl mb-6 relative overflow-hidden">
    <div className="flex items-center gap-3 mb-4">
      <IridescentShimmer className="w-9 h-9 rounded-full" />
      <div className="flex flex-col gap-1.5">
        <IridescentShimmer className="w-28 h-4" />
        <IridescentShimmer className="w-16 h-3" />
      </div>
    </div>
    <IridescentShimmer className="w-4/5 h-8 mb-3" />
    <IridescentShimmer className="w-full h-4 mb-2" />
    <IridescentShimmer className="w-2/3 h-4 mb-5" />
    <div className="flex items-center justify-between pt-2 border-t border-white/5">
      <div className="flex items-center gap-4">
        <IridescentShimmer className="w-20 h-3" />
        <IridescentShimmer className="w-16 h-3" />
      </div>
      <IridescentShimmer className="w-24 h-3" />
    </div>
  </div>
);

export const PostDetailSkeleton: React.FC = () => (
  <div className="max-w-reading mx-auto px-4 py-12">
    <IridescentShimmer className="w-24 h-4 mb-8" />
    <IridescentShimmer className="w-full h-12 mb-4" />
    <IridescentShimmer className="w-3/4 h-12 mb-8" />

    <div className="flex items-center gap-4 pb-8 mb-8 border-b border-white/10">
      <IridescentShimmer className="w-12 h-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <IridescentShimmer className="w-36 h-4" />
        <IridescentShimmer className="w-24 h-3" />
      </div>
    </div>

    <div className="space-y-4">
      <IridescentShimmer className="w-full h-4" />
      <IridescentShimmer className="w-full h-4" />
      <IridescentShimmer className="w-5/6 h-4" />
      <div className="py-6">
        <IridescentShimmer className="w-full h-28 rounded-xl" />
      </div>
      <IridescentShimmer className="w-full h-4" />
      <IridescentShimmer className="w-4/5 h-4" />
      <IridescentShimmer className="w-full h-4" />
    </div>
  </div>
);

export const CommentRowSkeleton: React.FC = () => (
  <div className="flex items-start gap-3.5 p-4 rounded-xl glass-panel">
    <IridescentShimmer className="w-8 h-8 rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="flex items-center gap-3">
        <IridescentShimmer className="w-24 h-3.5" />
        <IridescentShimmer className="w-16 h-3" />
      </div>
      <IridescentShimmer className="w-full h-3.5" />
      <IridescentShimmer className="w-3/4 h-3.5" />
    </div>
  </div>
);
