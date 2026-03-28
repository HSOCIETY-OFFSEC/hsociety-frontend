import React, { useEffect, useState, useRef } from 'react';
import Loader from './Loader';

/**
 * Page Loader
 * Location: src/shared/components/ui/PageLoader.jsx
 */

const PageLoader = ({
  message    = 'Initializing secure workspace...',
  durationMs = 3000,
  onComplete,
}) => {
  const [visible, setVisible] = useState(true);
  const [phase,   setPhase]   = useState('');
  const rafRef   = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    // durationMs=0 is used by route guards; keep loader visible until parent unmounts it.
    if (!durationMs) {
      setPhase('is-visible');
      return undefined;
    }

    const enterTimer = setTimeout(() => setPhase('is-visible'), 60);
    startRef.current = performance.now();

    const tick = (now) => {
      const pct = Math.min(((now - startRef.current) / durationMs) * 100, 100);

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPhase('is-exiting');
        setTimeout(() => {
          setVisible(false);
          onComplete?.();
        }, 480);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      clearTimeout(enterTimer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [durationMs, onComplete]);

  if (!visible) return null;

  const phaseClasses =
    phase === 'is-visible'
      ? 'opacity-100 pointer-events-auto'
      : 'opacity-0 pointer-events-none';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(800px_420px_at_18%_16%,rgb(var(--brand-rgb)/0.18),transparent_60%),radial-gradient(680px_360px_at_82%_86%,rgb(var(--info-rgb)/0.14),transparent_62%),var(--bg-primary)] transition-opacity duration-300 ${phaseClasses}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-[color-mix(in_srgb,var(--border-color)_70%,transparent)] bg-[color-mix(in_srgb,var(--bg-primary)_86%,transparent)] px-7 py-6 shadow-xl">
        <Loader size="lg" label={message} />
        <p className="m-0 text-center font-mono text-sm uppercase tracking-[0.08em] text-text-secondary">
          {message}
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
