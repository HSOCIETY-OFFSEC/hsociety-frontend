import React, { useEffect, useRef, useState } from 'react';
import { FiSearch, FiMap, FiShield, FiCheckCircle } from 'react-icons/fi';

const ProcessSection = ({ steps = [] }) => {
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

  if (!steps.length) return null;

  const icons = [FiSearch, FiMap, FiShield, FiCheckCircle];

  return (
    <section className="reveal-on-scroll border-t border-border bg-bg-secondary py-16" id="process" ref={sectionRef}>
      <div className="section-container">
        <header className="section-header-center">
          <p className="section-eyebrow"><span className="eyebrow-dot" />Process</p>
          <h2 className="section-title">A disciplined offensive workflow.</h2>
          <p className="section-subtitle">
            Each phase is documented, supervised, and built for evidence-driven delivery.
          </p>
        </header>

        <div className="relative mt-12 pb-8" role="list">
          <div
            className="absolute bottom-0 left-1/2 top-0 hidden w-0.5 -translate-x-1/2 bg-[linear-gradient(180deg,transparent,var(--border-color)_8%,var(--border-color)_92%,transparent)] transition-transform duration-[1200ms] motion-reduce:hidden lg:block"
            style={{ transform: `translateX(-50%) scaleY(${isVisible ? 1 : 0})`, transformOrigin: 'top center' }}
            aria-hidden="true"
          />
          {steps.map((step, index) => (
            <div
              key={step.title || index}
              className={`relative mb-10 flex transition-all duration-500 motion-reduce:transition-none ${
                index % 2 === 0
                  ? 'justify-end pr-[calc(50%+2.5rem)]'
                  : 'justify-start pl-[calc(50%+2.5rem)]'
              } max-lg:mb-4 max-lg:pr-0 max-lg:pl-0 ${
                isVisible
                  ? 'opacity-100 translate-x-0 max-lg:translate-y-0'
                  : index % 2 === 0
                    ? 'opacity-0 -translate-x-6 max-lg:translate-x-0 max-lg:translate-y-4'
                    : 'opacity-0 translate-x-6 max-lg:translate-x-0 max-lg:translate-y-4'
              }`}
              role="listitem"
              style={{ transitionDelay: isVisible ? `${(index + 1) * 100}ms` : '0ms' }}
            >
              <div className="absolute left-1/2 top-6 hidden h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-brand shadow-[0_0_0_3px_var(--bg-secondary),0_0_0_4px_var(--primary-color)] transition-shadow duration-200 lg:block" aria-hidden="true" />
              <div className={`relative flex w-full max-w-[340px] flex-col gap-2 rounded-md border border-border bg-bg-secondary px-5 py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--primary-color)_50%,var(--border-color))] hover:shadow-md max-lg:max-w-none ${index % 2 === 0 ? 'items-end text-right' : 'items-start text-left'}`}>
                <span className="inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-brand/80">
                  {React.createElement(icons[index] || FiSearch, { size: 13 })}
                  Phase {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-base font-semibold text-text-primary transition-colors hover:text-[color-mix(in_srgb,var(--primary-color)_70%,var(--text-primary))]">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">{step.detail || step.description}</p>
                <span
                  className={`pointer-events-none absolute top-6 hidden h-px w-10 ${
                    index % 2 === 0 ? 'right-[-2.5rem] bg-[linear-gradient(90deg,var(--border-color),color-mix(in_srgb,var(--primary-color)_50%,var(--border-color)))]' : 'left-[-2.5rem] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--primary-color)_50%,var(--border-color)),var(--border-color)))]'
                  } lg:block`}
                  aria-hidden="true"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
