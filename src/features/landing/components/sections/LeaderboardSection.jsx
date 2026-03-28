import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resolveProfileAvatar } from '../../../../shared/utils/display/profileAvatar';
import ImageWithLoader from '../../../../shared/components/ui/ImageWithLoader';

const SkeletonRow = () => (
  <div
    className="grid grid-cols-[64px_minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,0.7fr)] items-center gap-4 border-t border-border px-5 py-3 text-sm max-[720px]:grid-cols-[52px_minmax(0,1fr)_minmax(0,0.8fr)] max-[480px]:grid-cols-[44px_minmax(0,1fr)]"
    role="row"
    aria-hidden="true"
  >
    <span className="h-4 w-10 rounded-sm bg-bg-tertiary" />
    <span className="flex items-center gap-3">
      <span className="h-8 w-8 rounded-full border border-border bg-bg-tertiary" />
      <span className="flex flex-col gap-1">
        <span className="h-3 w-28 rounded-sm bg-bg-tertiary" />
        <span className="h-3 w-20 rounded-sm bg-bg-tertiary" />
      </span>
    </span>
    <span className="h-3 w-16 rounded-sm bg-bg-tertiary max-[480px]:hidden" />
    <span className="h-3 w-14 rounded-full bg-bg-tertiary max-[720px]:hidden" />
  </div>
);

const LeaderboardSection = ({ entries = [], loading = false }) => {
  const navigate = useNavigate();
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

  if (loading) {
    return (
      <section
        className="reveal-on-scroll border-t border-border bg-bg-primary py-16"
        id="leaderboard"
        aria-busy="true"
        aria-label="Leaderboard loading"
        ref={sectionRef}
      >
        <div className="section-container">
          <header className="section-header">
            <p className="section-eyebrow"><span className="eyebrow-dot" />Leaderboard</p>
            <h2 className="section-title">Top operators right now.</h2>
            <p className="section-subtitle">Proof of progress from the HSOCIETY OFFSEC community.</p>
          </header>
          <div className="overflow-hidden rounded-md border border-border bg-bg-secondary" role="table">
            <div
              className="grid grid-cols-[64px_minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,0.7fr)] items-center gap-4 border-t-0 border-border px-5 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-text-tertiary max-[720px]:grid-cols-[52px_minmax(0,1fr)_minmax(0,0.8fr)] max-[480px]:grid-cols-[44px_minmax(0,1fr)]"
              role="row"
            >
              <span role="columnheader">Rank</span>
              <span role="columnheader">Operator</span>
              <span role="columnheader" className="max-[480px]:hidden">Score</span>
              <span role="columnheader" className="max-[720px]:hidden">Badge</span>
            </div>
            {Array.from({ length: 5 }, (_, i) => <SkeletonRow key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  const top = entries.slice(0, 5);
  if (!top.length) return null;

  return (
    <section
      className="reveal-on-scroll border-t border-border bg-bg-primary py-16"
      id="leaderboard"
      ref={sectionRef}
    >
      <div className="section-container">
        <header className="section-header">
          <p className="section-eyebrow"><span className="eyebrow-dot" />Leaderboard</p>
          <h2 className="section-title">Top operators right now.</h2>
          <p className="section-subtitle">Proof of progress from the HSOCIETY OFFSEC community.</p>
        </header>

        <div className="overflow-hidden rounded-md border border-border bg-bg-secondary" role="table">
          <div
            className="grid grid-cols-[64px_minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,0.7fr)] items-center gap-4 border-t-0 border-border px-5 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-text-tertiary max-[720px]:grid-cols-[52px_minmax(0,1fr)_minmax(0,0.8fr)] max-[480px]:grid-cols-[44px_minmax(0,1fr)]"
            role="row"
          >
            <span role="columnheader">Rank</span>
            <span role="columnheader">Operator</span>
            <span role="columnheader" className="max-[480px]:hidden">Score</span>
            <span role="columnheader" className="max-[720px]:hidden">Badge</span>
          </div>
          {top.map((entry, index) => (
            <div
              key={entry.id}
              className={`grid grid-cols-[64px_minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,0.7fr)] items-center gap-4 border-t border-border px-5 py-3 text-sm transition-colors hover:bg-bg-tertiary max-[720px]:grid-cols-[52px_minmax(0,1fr)_minmax(0,0.8fr)] max-[480px]:grid-cols-[44px_minmax(0,1fr)] ${
                isVisible
                  ? 'animate-why-in-x'
                  : 'opacity-0 -translate-x-2 motion-reduce:opacity-100 motion-reduce:translate-x-0'
              }`}
              style={isVisible ? { animationDelay: `${(index + 1) * 60}ms` } : undefined}
              role="row"
            >
              <span
                className={`font-mono text-xs text-text-tertiary ${
                  index === 0 ? 'font-bold text-brand' : 'font-medium'
                }`}
                role="cell"
              >
                <span className={index === 0 ? 'relative' : undefined}>
                  {index === 0 && (
                    <span className="absolute -left-2 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-brand animate-lb-rank-pulse" />
                  )}
                  #{index + 1}
                </span>
              </span>
              <span className="inline-flex items-center gap-3 text-text-primary" role="cell">
                {(() => {
                  const { src } = resolveProfileAvatar(entry);
                  return (
                    <ImageWithLoader
                      src={src}
                      alt={entry.name || 'Community member'}
                      loading="lazy"
                      className="h-9 w-9 rounded-full border border-border bg-bg-tertiary transition-transform duration-200 group-hover:scale-105 max-[480px]:h-8 max-[480px]:w-8"
                      imgClassName="h-full w-full object-cover"
                    />
                  );
                })()}
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="truncate text-sm font-medium">{entry.name || 'Community member'}</span>
                  <em className="truncate font-mono text-[0.68rem] text-text-tertiary">
                    @{entry.name || entry.handle || 'operator'}
                  </em>
                </span>
              </span>
              <span role="cell" className="font-mono text-xs font-medium text-text-secondary max-[480px]:hidden">
                {entry.totalXp.toLocaleString()} XP
              </span>
              <span
                className="w-fit rounded-full border border-border bg-bg-tertiary px-2 py-1 font-mono text-[0.68rem] text-text-tertiary transition-colors max-[720px]:hidden"
                role="cell"
              >
                {entry.rank}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="ml-auto mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold text-text-secondary transition-all hover:gap-2 hover:text-brand"
          onClick={() => navigate('/leaderboard')}
        >
          View Full Leaderboard &rarr;
        </button>
      </div>
    </section>
  );
};

export default LeaderboardSection;
