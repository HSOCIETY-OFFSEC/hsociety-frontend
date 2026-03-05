import React from 'react';
import Skeleton from '../../shared/components/ui/Skeleton';
import '../../styles/landing/landing-skeleton.css';

const SectionSkeleton = ({ items = 3, columns = 3, tall = false }) => (
  <section className="landing-skeleton-section">
    <div className="section-container">
      <div className="landing-skeleton-header">
        <Skeleton className="landing-skeleton-eyebrow" />
        <Skeleton className="landing-skeleton-title" />
        <Skeleton className="landing-skeleton-subtitle" />
      </div>
      <div
        className="landing-skeleton-grid"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: items }).map((_, index) => (
          <div key={`card-${index}`} className={`landing-skeleton-card ${tall ? 'is-tall' : ''}`}>
            <Skeleton className="landing-skeleton-card-title" />
            <Skeleton className="landing-skeleton-card-line" />
            <Skeleton className="landing-skeleton-card-line short" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const LandingSkeleton = () => {
  return (
    <div className="landing-page landing-skeleton">
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content-panel">
            <Skeleton className="landing-skeleton-badge" />
            <Skeleton className="landing-skeleton-kicker" />
            <Skeleton className="landing-skeleton-hero-title" />
            <Skeleton className="landing-skeleton-hero-title long" />
            <Skeleton className="landing-skeleton-hero-desc" />
            <Skeleton className="landing-skeleton-hero-desc long" />
            <div className="landing-skeleton-cta">
              <Skeleton className="landing-skeleton-button" />
              <Skeleton className="landing-skeleton-button ghost" />
            </div>
          </div>
          <div className="hero-visual-panel">
            <Skeleton className="landing-skeleton-hero-visual" variant="circle" />
          </div>
        </div>
      </section>

      <SectionSkeleton items={3} columns={3} />
      <SectionSkeleton items={4} columns={4} />
      <SectionSkeleton items={4} columns={4} />
      <SectionSkeleton items={6} columns={6} />
      <SectionSkeleton items={3} columns={3} />
      <SectionSkeleton items={3} columns={3} />
      <SectionSkeleton items={4} columns={4} />
      <SectionSkeleton items={3} columns={3} tall />
      <SectionSkeleton items={6} columns={3} tall />
      <SectionSkeleton items={3} columns={3} />

      <section className="landing-skeleton-section">
        <div className="section-container">
          <div className="landing-skeleton-header">
            <Skeleton className="landing-skeleton-eyebrow" />
            <Skeleton className="landing-skeleton-title" />
            <Skeleton className="landing-skeleton-subtitle" />
          </div>
          <div className="landing-skeleton-cycle">
            <Skeleton className="landing-skeleton-orbit" />
            <div className="landing-skeleton-cycle-list">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={`cycle-${index}`} className="landing-skeleton-cycle-item" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionSkeleton items={5} columns={2} />
      <SectionSkeleton items={1} columns={1} tall />
    </div>
  );
};

export default LandingSkeleton;
