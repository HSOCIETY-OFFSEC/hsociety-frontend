import React, { useEffect, useState, useRef } from 'react';
import Logo from '../common/Logo';
import '../../../styles/shared/components/ui/PageLoader.css';

/**
 * Page Loader
 * Location: src/shared/components/ui/PageLoader.jsx
 *
 * Sleek full-page loader with animated progress, dynamic status phases,
 * and smooth enter/exit transitions.
 */

const BINARY_CHUNKS = [
  '01010111', '01110011', '01110101',
  '01101001', '01110100', '01110011', '00110110',
];

const STATUS_PHASES = [
  { at:  0, text: 'Establishing secure link...' },
  { at: 30, text: 'Encrypting channel...'       },
  { at: 65, text: 'Verifying identity...'        },
  { at: 90, text: 'Ready.'                       },
];

const PageLoader = ({
  message    = 'Initializing secure workspace...',
  durationMs = 3000,
  onComplete,
}) => {
  const [visible,  setVisible]  = useState(true);
  const [phase,    setPhase]    = useState('');        // '' | 'is-visible' | 'is-exiting'
  const [progress, setProgress] = useState(0);
  const rafRef   = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (!durationMs) return;

    const enterTimer = setTimeout(() => setPhase('is-visible'), 60);

    startRef.current = performance.now();

    const tick = (now) => {
      const pct = Math.min(((now - startRef.current) / durationMs) * 100, 100);
      setProgress(pct);

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

  const statusText = STATUS_PHASES.reduce(
    (label, p) => (progress >= p.at ? p.text : label),
    STATUS_PHASES[0].text,
  );

  return (
    <div
      className={`page-loader ${phase}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="pl-orb pl-orb-a" aria-hidden="true" />
      <div className="pl-orb pl-orb-b" aria-hidden="true" />

      <div className="page-loader-inner">

        <div className="pl-logo-wrap">
          <div className="pl-logo-ring" aria-hidden="true" />
          <Logo size="large" className="page-loader-logo" />
        </div>

        <p className="page-loader-message">{message}</p>

        <div
          className="page-loader-bar"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            className="page-loader-bar-fill"
            style={{ width: `${progress}%` }}
          >
            <span className="page-loader-bar-shimmer" aria-hidden="true" />
          </div>
        </div>

        <div className="pl-status-row">
          <span className="pl-dot"         aria-hidden="true" />
          <span className="pl-status-text">{statusText}</span>
          <span className="pl-pct">{Math.round(progress)}%</span>
        </div>

        <div className="pl-binary" aria-hidden="true">
          {BINARY_CHUNKS.map((chunk, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.18}s` }}>
              {chunk}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PageLoader;