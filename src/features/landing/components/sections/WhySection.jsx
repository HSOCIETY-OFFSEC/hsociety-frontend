import React, { useEffect, useRef, useState } from 'react';
import { FiTarget, FiUsers, FiShield, FiTrendingUp } from 'react-icons/fi';

const WhySection = ({ items = [] }) => {
  const sectionRef = useRef(null); // ← added
  const [isVisible, setIsVisible] = useState(false);

  // ← added: IntersectionObserver for .is-visible
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
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (!items.length) return null;

  return (
    <section className="reveal-on-scroll border-t border-border bg-bg-secondary py-16" id="why" ref={sectionRef}>
      <div className="section-container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="lg:sticky lg:top-[calc(var(--navbar-height,64px)+1.5rem)] lg:max-h-[calc(100vh-var(--navbar-height,64px)-3rem)] lg:overflow-hidden">
            <p className="section-eyebrow"><span className="eyebrow-dot" />Why HSOCIETY OFFSEC</p>
            <h2 className="section-title">Built for operators, not spectators.</h2>
            <p className="section-subtitle">
              We combine beginner training, community feedback, and supervised
              execution so skill converts into real-world outcomes.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {items.map((item, index) => {
              const icons = [FiTarget, FiUsers, FiShield, FiTrendingUp];
              const Icon = icons[index % icons.length];
              return (
                <div
                  key={item.title || index}
                  className={`group relative flex gap-4 overflow-hidden rounded-md border border-border bg-bg-secondary p-5 transition-all duration-200 hover:border-[color-mix(in_srgb,var(--primary-color)_45%,var(--border-color))] hover:shadow-md motion-reduce:transition-none ${
                    isVisible
                      ? 'animate-why-in-x max-lg:animate-why-in-y'
                      : 'opacity-0 translate-x-4 max-lg:translate-x-0 max-lg:translate-y-4 motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:translate-x-0'
                  }`}
                  style={isVisible ? { animationDelay: `${index * 80}ms` } : undefined}
                >
                  <span className="absolute left-0 top-0 h-0 w-0.5 rounded-b-sm bg-brand transition-all duration-300 group-hover:h-full" aria-hidden="true" />
                  <div className="h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-sm border border-border shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:border-[color-mix(in_srgb,var(--primary-color)_40%,var(--border-color))]">
                    <img
                      src={item.image}
                      alt={item.title}
                      width={64}
                      height={64}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-text-primary transition-colors group-hover:text-[color-mix(in_srgb,var(--primary-color)_80%,var(--text-primary))]">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm border border-border bg-bg-tertiary text-brand">
                        <Icon size={14} aria-hidden="true" />
                      </span>
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-text-secondary">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
