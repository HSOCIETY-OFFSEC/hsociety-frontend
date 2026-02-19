import React from 'react';
import '../../../styles/features/landing/stats.css';

const StatsSection = ({ content }) => (
  <section className="stats-section reveal-on-scroll">
    <div className="stats-container">
      <div className="stats-header">
        <p className="stats-eyebrow">{content.eyebrow}</p>
        <h2>{content.title}</h2>
        <p className="stats-subtitle">{content.subtitle}</p>
      </div>
      <div className="stats-grid">
        {content.items.map((item) => (
          <div key={item.label} className="stat-item">
            <div className="stat-value">{item.value}</div>
            <div className="stat-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
