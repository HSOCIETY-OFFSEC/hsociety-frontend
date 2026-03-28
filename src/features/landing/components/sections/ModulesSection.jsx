import React, { useEffect, useRef, useState } from 'react';

const ModulesSection = ({ modules = [] }) => {
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
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (!modules.length) return null;

  return (
    <section className="reveal-on-scroll border-t border-border bg-bg-primary py-16" id="modules" ref={sectionRef}>
      <div className="section-container">
        <header className="section-header-center">
          <p className="section-eyebrow"><span className="eyebrow-dot" />Modules</p>
          <h2 className="section-title">Bootcamp emblems.</h2>
          <p className="section-subtitle">Preview the Hacker Protocol phases.</p>
        </header>

        <div
          className="grid auto-cols-[minmax(140px,1fr)] grid-flow-col gap-5 overflow-x-auto pb-3 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="list"
        >
          {modules.map((module, index) => (
            <div
              key={module.codename}
              className={`flex w-full flex-col items-center gap-3 text-center ${
                isVisible
                  ? 'animate-why-in-y'
                  : 'opacity-0 translate-y-3 motion-reduce:opacity-100 motion-reduce:translate-y-0'
              }`}
              style={isVisible ? { animationDelay: `${index * 60}ms` } : undefined}
              role="listitem"
            >
              <div className="group relative flex aspect-square w-full max-w-[120px] items-center justify-center overflow-hidden rounded-lg border border-border bg-bg-secondary transition-all duration-200 hover:-translate-y-1 hover:scale-[1.03] hover:border-[color-mix(in_srgb,var(--primary-color)_55%,var(--border-color))] hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--primary-color)_12%,transparent),0_8px_24px_-8px_color-mix(in_srgb,var(--primary-color)_20%,transparent),var(--shadow-md)] motion-reduce:transform-none">
                <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(circle at 50% 60%, color-mix(in_srgb,var(--primary-color)_18%,transparent) 0%, transparent 68%)' }} />
                <span className="pointer-events-none absolute left-0 right-0 top-0 h-px origin-left scale-x-0 bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--primary-color)_70%,transparent),transparent)] transition-transform duration-300 group-hover:scale-x-100" />
                <img
                  src={module.emblem}
                  alt={module.codename}
                  width={80}
                  height={80}
                  loading="lazy"
                  className="relative z-10 h-[64%] w-[64%] object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:translate-y-[-2px] group-hover:scale-110"
                />
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-text-tertiary transition-colors group-hover:text-[color-mix(in_srgb,var(--primary-color)_70%,var(--text-tertiary))]">
                {module.codename}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
