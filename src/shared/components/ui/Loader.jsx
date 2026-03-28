import React from 'react';
const Loader = ({ size = 'md', className = '', label = 'Loading' }) => {
  const isTerminal = size === 'lg';
  const sizeClasses = {
    xs: 'h-[18px] w-[18px]',
    sm: 'h-6 w-6',
    md: 'h-9 w-9',
    lg: 'min-h-[52px] min-w-[52px] h-auto w-auto',
  };
  const ringSizes = {
    xs: 2,
    sm: 2,
    md: 2,
    lg: 3,
  };
  const ringSize = ringSizes[size] ?? 2;

  return (
    <div
      className={`relative grid place-items-center text-text-primary ${sizeClasses[size] || sizeClasses.md} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {isTerminal ? (
        <div className="flex items-center justify-center font-mono text-lg text-text-secondary" aria-hidden="true">
          <span className="whitespace-pre">root@shell:~$ </span>
          <span className="h-[22px] w-[11px] rounded-[1px] bg-text-primary opacity-85 motion-reduce:opacity-85 motion-reduce:animate-none animate-cursor-blink" />
        </div>
      ) : (
        <div
          className="absolute inset-0 rounded-full animate-spin motion-reduce:animate-none"
          style={{
            background:
              'conic-gradient(from 90deg, transparent 0deg, rgb(var(--brand-rgb) / 0.85) 120deg, rgb(var(--brand-rgb) / 0.08) 240deg, transparent 360deg)',
            mask: `radial-gradient(farthest-side, transparent calc(100% - ${ringSize}px), #000 calc(100% - ${ringSize}px))`,
            WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${ringSize}px), #000 calc(100% - ${ringSize}px))`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Loader;
