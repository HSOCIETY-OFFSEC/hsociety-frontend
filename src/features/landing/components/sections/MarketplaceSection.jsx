import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiDownloadCloud, FiZap } from 'react-icons/fi';

const MarketplaceSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      if (sectionRef.current) sectionRef.current.classList.add('is-visible');
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (sectionRef.current) sectionRef.current.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="reveal-on-scroll border-t border-border bg-bg-primary py-[clamp(3rem,7vw,5.5rem)]" id="marketplace" ref={sectionRef}>
      <div className="section-container">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              ZeroDay Market
            </p>
            <h2 className="section-title mt-2">Spend CP or download for free.</h2>
            <p className="section-subtitle mt-3 max-w-[52ch] text-text-secondary">
              ZeroDay Market is the student-only shelf for operator books and curated freebies.
              Earn CP points inside HSOCIETY, then redeem them for premium titles.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 max-sm:w-full max-sm:flex-col">
              <button
                type="button"
                className="rounded-md bg-brand px-6 py-3 font-semibold text-ink-black shadow-[0_12px_18px_color-mix(in_srgb,var(--primary-color)_25%,transparent)] transition-transform duration-200 hover:-translate-y-0.5 max-sm:w-full"
                onClick={() => navigate('/marketplace')}
              >
                Explore ZeroDay Market
              </button>
              <button
                type="button"
                className="rounded-md border border-border bg-bg-secondary px-6 py-3 font-semibold text-text-primary transition-transform duration-200 hover:-translate-y-0.5 max-sm:w-full"
                onClick={() => navigate('/register')}
              >
                Earn CP Points
              </button>
            </div>
          </div>

          <div className="grid gap-4" role="list">
            <article className="card-plain p-5" role="listitem">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-bg-tertiary text-brand">
                <FiBookOpen size={16} />
              </span>
              <h3 className="mt-2 text-lg font-semibold text-text-primary">CP Books</h3>
              <p className="text-sm leading-relaxed text-text-secondary">Redeem points for operator-grade playbooks and guides.</p>
            </article>
            <article className="card-plain p-5" role="listitem">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-bg-tertiary text-brand">
                <FiDownloadCloud size={16} />
              </span>
              <h3 className="mt-2 text-lg font-semibold text-text-primary">Free Resources</h3>
              <p className="text-sm leading-relaxed text-text-secondary">Download analyst-ready PDFs without spending CP.</p>
            </article>
            <article className="card-plain p-5" role="listitem">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-bg-tertiary text-brand">
                <FiZap size={16} />
              </span>
              <h3 className="mt-2 text-lg font-semibold text-text-primary">Student-Only</h3>
              <p className="text-sm leading-relaxed text-text-secondary">ZeroDay Market is reserved for students and pentesters.</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceSection;
