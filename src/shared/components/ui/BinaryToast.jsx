import React, { useEffect, useMemo, useState } from 'react';
import '../../../styles/components/ui/BinaryToast.css';

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

  return (
    <div className={`binary-toast ${isVisible ? 'is-visible' : ''}`} aria-live="polite">
      <div className={`binary-toast-card ${toast.variant || 'success'}`}>
        <div className="binary-toast-header">
          <span className="binary-toast-dot" aria-hidden="true" />
          <strong>{toast.title || 'Success'}</strong>
          <button type="button" className="binary-toast-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        {toast.message && <p className="binary-toast-message">{toast.message}</p>}
        <div className="binary-toast-particles" aria-hidden="true">
          {particles.map((particle, index) => (
            <span
              key={`${particle.digit}-${index}`}
              style={{
                '--origin-x': particle.originX,
                '--origin-y': particle.originY,
                '--x': particle.x,
                '--y': particle.y,
                '--delay': particle.delay,
                '--duration': particle.duration,
                '--size': particle.size,
                '--opacity': particle.opacity,
              }}
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
