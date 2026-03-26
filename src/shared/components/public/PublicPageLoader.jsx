import React from 'react';
import Skeleton from '../ui/Skeleton';
import './PublicPageLoader.css';

const PublicPageLoader = () => {
  return (
    <div className="public-page public-page-inner public-page-loader" aria-hidden="true">
      <section className="public-hero hero-section">
        <div className="section-container public-page-loader-hero">
          <div className="public-page-loader-copy">
            <Skeleton className="ppl-kicker" style={{ width: '160px', height: '12px' }} />
            <Skeleton className="ppl-title" style={{ width: '72%', height: '36px' }} />
            <Skeleton className="ppl-title" style={{ width: '58%', height: '36px' }} />
            <Skeleton className="ppl-line" style={{ width: '92%', height: '14px' }} />
            <Skeleton className="ppl-line" style={{ width: '82%', height: '14px' }} />
            <div className="public-page-loader-actions">
              <Skeleton className="ppl-button" style={{ width: '160px', height: '44px' }} />
              <Skeleton className="ppl-button" style={{ width: '140px', height: '44px' }} />
            </div>
          </div>
          <div className="public-page-loader-panel">
            <Skeleton variant="rect" className="ppl-panel" style={{ width: '100%', height: '220px' }} />
            <div className="public-page-loader-stats">
              <Skeleton className="ppl-pill" style={{ width: '120px', height: '26px' }} />
              <Skeleton className="ppl-pill" style={{ width: '110px', height: '26px' }} />
              <Skeleton className="ppl-pill" style={{ width: '140px', height: '26px' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="public-section">
        <div className="section-container">
          <div className="public-page-loader-header">
            <Skeleton className="ppl-section-title" style={{ width: '220px', height: '22px' }} />
            <Skeleton className="ppl-line" style={{ width: '70%', height: '14px' }} />
          </div>
          <div className="public-page-loader-grid">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="public-page-loader-card" key={`public-loader-card-${index}`}>
                <Skeleton variant="rect" className="ppl-card-media" style={{ width: '100%', height: '150px' }} />
                <div className="ppl-card-body">
                  <Skeleton className="ppl-card-chip" style={{ width: '90px', height: '12px' }} />
                  <Skeleton className="ppl-card-title" style={{ width: '70%', height: '18px' }} />
                  <Skeleton className="ppl-line" style={{ width: '100%', height: '12px' }} />
                  <Skeleton className="ppl-line" style={{ width: '85%', height: '12px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicPageLoader;
