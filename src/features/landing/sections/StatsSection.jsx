import React from 'react';
import '../../../styles/features/landing/stats.css';

const StatsSection = () => (
  <section className="stats-section reveal-on-scroll">
    <div className="stats-container">
      <div className="stats-header">
        <p className="stats-eyebrow">Proof of Execution</p>
        <h2>Measured training. Verified delivery.</h2>
        <p className="stats-subtitle">
          We track outcomes across training, community growth, and real-world security work.
        </p>
      </div>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">500+</div>
          <div className="stat-label">Learners Trained</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">1,200+</div>
          <div className="stat-label">Community Members</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">120+</div>
          <div className="stat-label">Engagements Completed</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">500+</div>
          <div className="stat-label">Vulnerabilities Identified</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">40+</div>
          <div className="stat-label">Paid Pentests Delivered</div>
        </div>
      </div>
    </div>
  </section>
);

export default StatsSection;
