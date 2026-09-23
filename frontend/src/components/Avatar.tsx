import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showHalo?: boolean;
}

const colorPalettes = [
  'bg-gradient-to-tr from-[#7C3AED] to-[#FF2E88] text-white',
  'bg-gradient-to-tr from-[#00E5FF] to-[#7C3AED] text-white',
  'bg-gradient-to-tr from-[#FFD23F] to-[#FF2E88] text-stone-900',
  'bg-gradient-to-tr from-[#FF2E88] to-[#00E5FF] text-white',
  'bg-gradient-to-tr from-[#7C3AED] to-[#FFD23F] text-white',
  'bg-gradient-to-tr from-[#00E5FF] to-[#FFD23F] text-stone-900',
];

function getColorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colorPalettes.length;
  return colorPalettes[index];
}

function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().replace(/_/g, ' ').split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'md',
  className = '',
  showHalo = true,
}) => {
  const initials = getInitials(name);
  const colorClass = getColorForName(name);

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base font-semibold',
    xl: 'w-16 h-16 text-xl font-bold',
  };

  const haloClasses = {
    sm: 'p-[1.5px]',
    md: 'p-[2px]',
    lg: 'p-[2.5px]',
    xl: 'p-[3px]',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 ${
        showHalo ? 'group' : ''
      }`}
    >
      {showHalo && (
        <div
          className={`absolute -inset-[2px] rounded-full bg-gradient-to-r from-ink-magenta via-ink-violet to-ink-cyan opacity-75 blur-[2px] group-hover:opacity-100 transition-opacity duration-300 animate-pulse-glow ${haloClasses[size]}`}
          aria-hidden="true"
        />
      )}
      <div
        className={`relative inline-flex items-center justify-center rounded-full font-serif font-bold select-none shadow-md z-10 ${sizeClasses[size]} ${colorClass} ${className}`}
        title={name}
      >
        {initials}
      </div>
    </div>
  );
};

export default Avatar;
