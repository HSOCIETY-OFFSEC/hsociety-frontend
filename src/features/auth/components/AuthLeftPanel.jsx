import React from 'react';

const AuthLeftPanel = () => (
  <aside className="auth-portal-marketing" aria-hidden="true">
    <div className="auth-portal-marketing-inner">
      <p className="auth-portal-eyebrow">HSOCIETY ACCESS</p>
      <h2>Build your security edge before the next breach.</h2>
      <p className="auth-portal-lead">
        Choose the path that matches your mission. We tailor onboarding for students
        who want hands-on training and teams that need real-world defense.
      </p>
      <div className="auth-portal-stats">
        <div>
          <strong>Real-world labs</strong>
          <span>Operator-led training with live tooling.</span>
        </div>
        <div>
          <strong>Team defense</strong>
          <span>Corporate workflows built for rapid hardening.</span>
        </div>
      </div>
    </div>
  </aside>
);

export default AuthLeftPanel;
