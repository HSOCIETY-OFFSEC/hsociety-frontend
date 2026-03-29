/* FILE: src/features/landing/sections/CoursesSection.jsx */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Button from '../../../../shared/components/ui/Button';
import { HACKER_PROTOCOL_BOOTCAMP, HACKER_PROTOCOL_PHASES } from '../../../../data/static/bootcamps/hackerProtocolData';

function useReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

const CoursesSection = () => {
  const navigate = useNavigate();
  const [sectionRef, visible] = useReveal();
  const total = HACKER_PROTOCOL_PHASES.length;

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden bg-bg-primary px-6 pt-20 transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] max-sm:px-3 max-sm:pt-16 motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12">
        <header className="section-header">
          <p className="section-eyebrow">
            <span className="eyebrow-dot" />
            Courses
          </p>
          <h2 className="section-title">Explore Hacker Protocol</h2>
          <p className="section-subtitle">{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>
        </header>

        {/* Laptop shell */}
        <div className="flex w-full items-center justify-center">
          <div className="w-full max-w-[980px]">
            <div className="rounded-t-[14px] border border-b-0 border-border bg-bg-secondary p-2 shadow-lg">
              <div className="flex min-h-[360px] flex-col overflow-hidden rounded-[10px] border border-border bg-bg-secondary">
                <div className="flex h-8 items-center justify-between border-b border-border bg-bg-tertiary px-4 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-text-tertiary">
                  <span>hacker-protocol</span>
                  <span>terminal</span>
                </div>
                <div className="flex flex-col gap-4 px-6 py-5 font-mono text-sm text-text-primary">
                  {HACKER_PROTOCOL_PHASES.map((phase, index) => (
                    <div key={phase.moduleId} className="flex flex-col gap-1">
                      <div className="text-brand">
                        {String(index + 1).padStart(2, '0')}. {phase.codename}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {phase.description || 'Offensive security training module.'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-[7px] w-full border-x border-border bg-bg-tertiary" />
            <div className="flex w-[104%] -translate-x-[2%] items-end justify-center rounded-b-[12px] border border-t-0 border-border bg-bg-secondary pb-1">
              <div className="h-1 w-[88px] rounded-[2px] bg-[color-mix(in_srgb,var(--border-color)_60%,var(--bg-primary)_40%)]" />
            </div>
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border py-6 max-sm:flex-col max-sm:items-start">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-brand">
              Offensive Security
            </span>
            <span className="text-[0.75rem] text-text-tertiary" aria-hidden="true">·</span>
            <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-text-tertiary">
              {total} Phases
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 max-sm:w-full max-sm:flex-col max-sm:items-stretch">
            <Button variant="secondary" size="small" onClick={() => navigate('/courses')}>
              Browse All Courses
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={() => navigate('/courses/hacker-protocol')}
              className="max-sm:w-full"
            >
              Start Learning <FiArrowRight size={13} />
            </Button>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default CoursesSection;
