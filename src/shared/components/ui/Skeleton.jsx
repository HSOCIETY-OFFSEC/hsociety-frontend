import React from 'react';
/**
 * Skeleton Component
 * Location: src/shared/components/ui/Skeleton.jsx
 *
 * Props:
 * - className: string
 * - style: object (width/height overrides)
 * - variant: 'line' | 'rect' | 'circle'
 */

const Skeleton = ({ className = '', style = {}, variant = 'line' }) => {
  const variantClass =
    variant === 'circle'
      ? 'rounded-full'
      : variant === 'rect'
        ? 'rounded-xl'
        : 'h-3 rounded-full';

  return (
    <div
      className={`relative grid place-items-center overflow-hidden border border-[color-mix(in_srgb,var(--border-color)_70%,transparent)] bg-[color-mix(in_srgb,var(--input-bg)_85%,transparent)] after:absolute after:inset-0 after:translate-x-[-100%] after:bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--text-primary)_35%,transparent),transparent)] after:content-[''] after:animate-skeleton-shimmer motion-reduce:after:animate-none ${variantClass} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
