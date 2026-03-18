import React, { useEffect, useState, useRef } from 'react';
import Loader from './Loader';
import '../../../styles/components/ui/PageLoader.css';

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

  return (
    <div
      className={`page-loader ${phase}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="page-loader-inner">
        <Loader size="lg" label={message} />
      </div>
    </div>
  );
};

export default PageLoader;
