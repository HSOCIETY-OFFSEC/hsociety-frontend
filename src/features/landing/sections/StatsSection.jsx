import React from 'react';
import '../../../styles/landing/stats.css';

const StatsSection = ({ content }) => (
  <section className="stats-section reveal-on-scroll">
    <div className="stats-container">
      <div className="stats-inner">
        <div className="stats-header">
          <p className="stats-eyebrow">{content.eyebrow}</p>
          <h2 className="stats-title">{content.title}</h2>
          <p className="stats-subtitle">{content.subtitle}</p>
        </div>
        <div className="stats-grid">
          {content.items.map((item, index) => (
            <div key={item.label} className="stat-item" style={{ '--i': index }}>
              <div className="stat-value">{item.value}</div>
              <div className="stat-label">{item.label}</div>
              {item.description && (
                <div className="stat-description">{item.description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default StatsSection;