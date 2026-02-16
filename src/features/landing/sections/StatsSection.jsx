import React from 'react';
import Logo from '../../../shared/components/common/Logo';
import '../../../styles/features/landing/stats.css';

const StatsSection = ({ stats = [] }) => (
  <section className="stats-section reveal-on-scroll">
    <div className="stats-container">
      <div className="stats-brand">
        <Logo size="small" className="stats-logo" />
        <p>Trusted offensive security partner</p>
      </div>
      {stats.map((stat, index) => (
        <div key={index} className="stat-item">
          <div className="stat-value">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  </section>
);

export default StatsSection;
