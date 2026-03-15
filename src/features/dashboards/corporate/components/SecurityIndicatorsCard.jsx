import React from 'react';

const SecurityIndicatorsCard = ({ securityScore, riskLevel, criticalCount }) => (
  <div className="cd-panel cd-indicators-panel">
    <div className="cd-panel-header">
      <h3 className="cd-panel-title">Security Indicators</h3>
    </div>
    <div className="cd-metric-grid">
      <div className="cd-metric">
        <span className="cd-metric-label">Security Score</span>
        <strong className="cd-metric-value">{securityScore}</strong>
      </div>
      <div className="cd-metric">
        <span className="cd-metric-label">Risk Level</span>
        <strong className="cd-metric-value">{riskLevel}</strong>
      </div>
      <div className="cd-metric">
        <span className="cd-metric-label">Critical Vulnerabilities</span>
        <strong className="cd-metric-value">{criticalCount}</strong>
      </div>
    </div>
  </div>
);

export default SecurityIndicatorsCard;
