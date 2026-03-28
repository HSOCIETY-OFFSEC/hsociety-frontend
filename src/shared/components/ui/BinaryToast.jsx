import React, { useEffect, useMemo, useState } from 'react';

const buildParticles = () =>
  Array.from({ length: 26 }, () => {
    const originX = `${20 + Math.random() * 60}%`;
    const originY = `${20 + Math.random() * 50}%`;
    const direction = Math.random() > 0.5 ? 1 : -1;
    const spreadX = 40 + Math.random() * 120;
    const spreadY = 30 + Math.random() * 90;
    return {
      digit: Math.random() > 0.5 ? '1' : '0',
      originX,
      originY,
      x: `${direction * spreadX}px`,
      y: `${-spreadY}px`,
      delay: `${Math.random() * 0.25}s`,
      duration: `${0.9 + Math.random() * 0.7}s`,
      size: `${10 + Math.random() * 10}px`,
      opacity: 0.6 + Math.random() * 0.4,
    };
  });

const BinaryToast = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const particles = useMemo(() => buildParticles(), [toast?.id]);

  useEffect(() => {
    if (!toast) {
      setIsVisible(false);
      return;
    }
    const raf = window.requestAnimationFrame(() => setIsVisible(true));
    return () => window.cancelAnimationFrame(raf);
  }, [toast]);

  if (!toast) return null;

  const variant = toast.variant || 'success';
  const dotClasses =
    variant === 'info'
      ? 'bg-status-info shadow-[0_0_10px_color-mix(in_srgb,rgb(var(--info-rgb))_70%,transparent)]'
      : 'bg-brand shadow-[0_0_10px_color-mix(in_srgb,var(--primary-color)_70%,transparent)]';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center pt-4 transition-all duration-200 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
      }`}
      aria-live="polite"
    >
      <div className="pointer-events-auto relative min-w-[260px] max-w-[min(90vw,380px)] overflow-hidden rounded-xl border border-border bg-[color-mix(in_srgb,var(--card-bg)_92%,transparent)] px-4 py-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <span className={`h-2 w-2 rounded-full ${dotClasses}`} aria-hidden="true" />
          <strong className="mr-auto text-sm text-text-primary">{toast.title || 'Success'}</strong>
          <button
            type="button"
            className="text-lg leading-none text-text-tertiary transition-colors hover:text-text-secondary"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {toast.message && <p className="mt-2 text-sm text-text-secondary">{toast.message}</p>}
        <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
          {particles.map((particle, index) => (
            <span
              key={`${particle.digit}-${index}`}
              style={{
                '--origin-x': particle.originX,
                '--origin-y': particle.originY,
                '--x': particle.x,
                '--y': particle.y,
                '--duration': particle.duration,
                '--size': particle.size,
                '--opacity': particle.opacity,
                animationDelay: particle.delay,
              }}
              className="absolute left-[var(--origin-x)] top-[var(--origin-y)] -translate-x-1/2 -translate-y-1/2 font-bold text-[length:var(--size)] text-[color-mix(in_srgb,var(--primary-color)_80%,var(--text-primary))] opacity-[var(--opacity)] animate-binary-pop"
            >
              {particle.digit}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BinaryToast;
