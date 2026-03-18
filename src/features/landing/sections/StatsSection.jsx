import React from 'react';
import './stats.css';

const StatsSection = ({ content, error = '' }) => {
  const items = (content?.items || []).slice(0, 4);
  if (!items.length) return null;

  return (
    <section className="stats-section reveal-on-scroll" aria-label="HSOCIETY stats">
      <div className="stats-bar">
        {items.map((item, index) => (
          <div key={item.label || item.key || index} className="stat-item">
            <span className="stat-value">{item.value}</span>
            <span className="stat-label">{item.label}</span>
          </div>
        ))}
        {error && <span className="stats-error" role="status">{error}</span>}
      </div>
    </section>
  );
};

export default StatsSection;
