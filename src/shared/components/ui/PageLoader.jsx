import React, { useEffect, useState, useRef } from 'react';
import Logo from '../common/Logo';
import '../../../styles/shared/components/ui/PageLoader.css';

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
    if (!durationMs) return;

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
        <div className="pl-logo-wrap">
          <div className="pl-logo-ring" aria-hidden="true" />
          <Logo size="large" className="page-loader-logo" />
        </div>
        <p className="page-loader-message">{message}</p>
      </div>
    </div>
  );
};

export default PageLoader;