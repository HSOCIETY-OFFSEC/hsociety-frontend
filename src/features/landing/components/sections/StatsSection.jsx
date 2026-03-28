import React, { useEffect, useRef, useState } from 'react';

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

const StatItem = ({ item, isVisible, delay = 0 }) => {
  const animated = useCountUp(item.value, isVisible);
  const isActive = isVisible;
  const baseClasses =
    'flex cursor-default flex-col gap-1 rounded-md border border-border bg-bg-secondary px-6 py-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-brand hover:shadow-md motion-reduce:transform-none';
  const motionClasses = isActive
    ? 'animate-stat-in motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0'
    : 'opacity-0 translate-y-3 motion-reduce:opacity-100 motion-reduce:translate-y-0';

  return (
    <div className={`${baseClasses} ${motionClasses}`} style={isActive ? { animationDelay: `${delay}ms` } : undefined}>
      <span className="bg-[linear-gradient(90deg,var(--primary-color)_0%,var(--primary-color)_40%,color-mix(in_srgb,var(--primary-color)_55%,transparent)_55%,var(--primary-color)_70%,var(--primary-color)_100%)] bg-[length:200%_100%] bg-clip-text text-transparent text-xl font-semibold tracking-tight leading-tight animate-stat-shimmer motion-reduce:animate-none md:text-2xl">
        {animated}
      </span>
      <span className="text-xs font-medium uppercase tracking-[0.1em] text-text-tertiary">
        {item.label}
      </span>
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
          // // inside the IntersectionObserver callback, replace:
          // setIsVisible(true);
          // // with:
          setIsVisible(true);
          if (sectionRef.current) sectionRef.current.classList.add('is-visible');
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
      className="reveal-on-scroll bg-transparent pt-10"
      aria-label="HSOCIETY OFFSEC stats"
    >
      <div className="relative mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5 px-6 max-lg:grid-cols-2 max-lg:gap-4 max-lg:px-4">
        {items.map((item, index) => (
          <StatItem
            key={item.label || item.key || index}
            item={item}
            isVisible={isVisible}
            delay={index * 80}
          />
        ))}
        {error && (
          <span className="absolute bottom-3 right-6 text-xs text-text-tertiary opacity-60" role="status">
            {error}
          </span>
        )}
      </div>
    </section>
  );
};

export default StatsSection;
