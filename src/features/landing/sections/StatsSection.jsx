import React from 'react';
import Skeleton from '../../../shared/components/ui/Skeleton';
import '../../../styles/landing/stats.css';

const StatsSection = ({ content, loading = false, error = '' }) => (
  <section className="stats-section reveal-on-scroll">
    <div className="stats-container">
      <div className="stats-inner">
        <div className="stats-header">
          <p className="stats-eyebrow">{content.eyebrow}</p>
          <h2 className="stats-title">{content.title}</h2>
          <p className="stats-subtitle">{content.subtitle}</p>
        </div>
        {loading ? (
          <div className="stats-grid">
            {content.items.map((item, index) => (
              <div key={item.label} className="stat-item is-loading" style={{ '--i': index }}>
                <Skeleton className="stat-skeleton-value" />
                <Skeleton className="stat-skeleton-label" />
                <Skeleton className="stat-skeleton-desc" />
              </div>
            ))}
          </div>
        ) : (
          <div className="stats-grid">
            {content.items.map((item, index) => (
              <div key={item.label} className="stat-item" style={{ '--i': index }}>
                <div className="stat-value">{item.value ?? '—'}</div>
                <div className="stat-label">{item.label}</div>
                {item.description && (
                  <div className="stat-description">{item.description}</div>
                )}
              </div>
            ))}
          </div>
        )}
        {!loading && error && (
          <p className="stats-error">{error}</p>
        )}
      </div>
    </div>
  </section>
);

export default StatsSection;
