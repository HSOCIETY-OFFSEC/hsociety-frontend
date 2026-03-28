import React from 'react';

const RankBadge = ({ badge, size = 'md', className = '' }) => {
  if (!badge) return null;
  const sizeClasses = {
    tiny: {
      wrapper: 'px-1.5 py-[0.15rem]',
      icon: 'h-5 w-5',
      text: 'hidden',
    },
    compact: {
      wrapper: 'px-2.5 py-[0.18rem]',
      icon: 'h-6 w-6',
      text: 'text-[0.6rem]',
    },
    md: {
      wrapper: 'px-2.5 py-[0.18rem]',
      icon: 'h-7 w-7',
      text: '',
    },
  };
  const current = sizeClasses[size] || sizeClasses.md;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-secondary text-[0.72rem] uppercase tracking-[0.08em] text-text-secondary ${current.wrapper} ${className}`}
      role="status"
    >
      {badge.image && (
        <span
          className={`inline-flex items-center justify-center overflow-hidden rounded-full bg-bg-primary ${current.icon}`}
          aria-hidden="true"
        >
          <img src={badge.image} alt={badge.label} className="block h-full w-full object-cover" />
        </span>
      )}
      <span className={`flex flex-col gap-[0.05rem] font-semibold ${current.text}`}>
        <span className="text-[0.65rem] text-text-primary">{badge.label}</span>
        {badge.subtitle && (
          <span className="text-[0.55rem] tracking-[0.08em] text-text-tertiary">{badge.subtitle}</span>
        )}
      </span>
    </span>
  );
};

export default RankBadge;
