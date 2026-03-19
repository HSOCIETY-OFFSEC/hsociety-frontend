import React, { useEffect, useRef, useState } from 'react';
import './stats.css';

/**
 * Animate a numeric value from 0 to `target` over `duration` ms.
 * Non-numeric values (e.g. "0+") are returned as-is.
 */
const useCountUp = (rawValue, isVisible, duration = 1400) => {
  const [display, setDisplay] = useState(rawValue);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!isVisible) return undefined;

    // Parse suffix like "+" or "%"
    const str = String(rawValue || '');
    const suffix = str.replace(/[\d,]/g, '');
    const numeric = parseFloat(str.replace(/[^\d.]/g, ''));

    if (Number.isNaN(numeric) || numeric === 0) {
      setDisplay(rawValue);
      return undefined;
    }

    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * numeric);
      setDisplay(`${current.toLocaleString()}${suffix}`);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isVisible, rawValue, duration]);

  return display;
};

const StatItem = ({ item, isVisible }) => {
  const animated = useCountUp(item.value, isVisible);
  return (
    <div className="stat-item">
      <span className="stat-value">{animated}</span>
      <span className="stat-label">{item.label}</span>
    </div>
  );
};

const StatsSection = ({ content, error = '' }) => {
  const items = (content?.items || []).slice(0, 4);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (!items.length) return null;

  return (
    <section
      ref={sectionRef}
      className="stats-section reveal-on-scroll"
      aria-label="HSOCIETY stats"
    >
      <div className="stats-bar">
        {items.map((item, index) => (
          <StatItem key={item.label || item.key || index} item={item} isVisible={isVisible} />
        ))}
        {error && <span className="stats-error" role="status">{error}</span>}
      </div>
    </section>
  );
};

export default StatsSection;
