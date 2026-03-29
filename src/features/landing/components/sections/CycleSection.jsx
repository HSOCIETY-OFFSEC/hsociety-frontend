import React, { useEffect, useRef, useState } from 'react';
import { FiBookOpen, FiShield, FiDollarSign } from 'react-icons/fi';

const CycleSection = ({ steps }) => {
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
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const cycle = steps?.length
    ? steps
    : [
        { title: 'Train', description: 'Learn offensive security through guided labs and coaching.' },
        { title: 'Deploy', description: 'Apply skills in supervised real-world engagements.' },
        { title: 'Earn', description: 'Build credibility and get paid for verified delivery.' },
      ];

  const icons = [FiBookOpen, FiShield, FiDollarSign];

  return (
    <section className="reveal-on-scroll relative overflow-visible bg-bg-primary py-24" id="cycle" ref={sectionRef}>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--primary-color)_6%,transparent)_0%,transparent_70%)]" aria-hidden="true" />

      <div className="section-container">
        <header className="section-header-center">
          <p className="section-eyebrow"><span className="eyebrow-dot" />Cycle</p>
          <h2 className="section-title">Train. Deploy. Earn.</h2>
          <p className="section-subtitle">A simple loop that compounds skill into real outcomes.</p>
        </header>

        <div
          className="relative z-10 mt-14 flex items-start justify-center gap-10 transition-all duration-500 motion-reduce:transition-none max-lg:flex-col max-lg:items-stretch max-lg:gap-6"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          {cycle.slice(0, 3).map((step, index) => (
            <div
              key={step.title}
              className="group relative flex min-h-[250px] flex-1 flex-col items-center gap-2 rounded-lg border border-[color-mix(in_srgb,var(--border-color)_85%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary-color)_8%,transparent),transparent_55%),var(--bg-secondary)] px-6 py-7 text-center shadow-[0_14px_28px_rgba(15,23,42,0.12)] transition-all duration-200 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--primary-color)_35%,var(--border-color))] hover:shadow-[0_18px_36px_rgba(15,23,42,0.18)] motion-reduce:transform-none max-lg:items-start max-lg:px-5 max-lg:text-left"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--primary-color)_45%,var(--border-color))] bg-[color-mix(in_srgb,var(--primary-color)_8%,var(--bg-secondary))] text-brand transition-colors group-hover:border-brand group-hover:bg-[color-mix(in_srgb,var(--primary-color)_14%,var(--bg-secondary))]" aria-hidden="true">
                <div className="pointer-events-none absolute -inset-1.5 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--primary-color)_18%,transparent)_0%,transparent_70%)] opacity-0 transition-opacity group-hover:opacity-100" />
                {React.createElement(icons[index] || FiBookOpen, { size: 18 })}
              </div>
              <h3 className="mt-2 text-base font-semibold tracking-wide text-text-primary">{step.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary max-lg:max-w-none">{step.description}</p>
              {index < 2 && (
                <span
                  className="absolute right-[-1.15rem] top-[26px] h-px w-9 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--primary-color)_40%,transparent),color-mix(in_srgb,var(--primary-color)_10%,transparent))] max-lg:hidden"
                  aria-hidden="true"
                >
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 border-b-[4px] border-t-[4px] border-l-[5px] border-b-transparent border-t-transparent border-l-[color-mix(in_srgb,var(--primary-color)_40%,transparent)]" />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CycleSection;
