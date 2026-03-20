import React from 'react';
import '../styles/auth-portal.css';

const IMAGE_URL = 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1400&q=80';

const AuthLeftPanel = () => (
  <aside className="ap-left" aria-hidden="true">
    <div
      className="ap-left-img"
      style={{ backgroundImage: `url(${IMAGE_URL})` }}
    />
    <div className="ap-left-overlay" />
    <div className="ap-left-content">
      <p className="ap-eyebrow">HSOCIETY ACCESS</p>
      <h2 className="ap-hero-title">Build your security edge before the next breach.</h2>
      <p className="ap-hero-lead">
        Choose the path that matches your mission. We tailor onboarding for students
        who want hands-on training and teams that need real-world defense.
      </p>
      <div className="ap-stats">
        <div className="ap-stat">
          <strong>Real-world labs</strong>
          <span>Operator-led training with live tooling.</span>
        </div>
        <div className="ap-stat-divider" />
        <div className="ap-stat">
          <strong>Team defense</strong>
          <span>Corporate workflows built for rapid hardening.</span>
        </div>
      </div>
    </div>
  </aside>
);

export default AuthLeftPanel;
