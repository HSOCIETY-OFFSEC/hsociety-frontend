import React from 'react';
import Card from '../../../../shared/components/ui/Card';

const SecurityIndicatorsCard = ({ securityScore, riskLevel, criticalCount }) => {
  const normalizedRisk = String(riskLevel || 'medium').toLowerCase();
  const riskClass = normalizedRisk.includes('low') ? 'risk-low' : normalizedRisk.includes('high') ? 'risk-high' : 'risk-medium';

  return (
    <Card padding="medium" className="corp-card corp-indicators-card">
      {/* Section 3: Security Indicators */}
      <div className="corp-card-header">
        <h3 className="corp-card-title">Security Indicators</h3>
      </div>
      <div className="corp-indicators-grid">
        <div className="corp-indicator">
          <span className="corp-indicator-label">Security Score</span>
          <strong className="corp-indicator-value">{securityScore}</strong>
        </div>
        <div className="corp-indicator">
          <span className="corp-indicator-label">Risk Level</span>
          <strong className={`corp-indicator-value ${riskClass}`}>{riskLevel}</strong>
        </div>
        <div className="corp-indicator">
          <span className="corp-indicator-label">Critical Vulnerabilities</span>
          <strong className="corp-indicator-value">{criticalCount}</strong>
        </div>
      </div>
    </Card>
  );
};

export default SecurityIndicatorsCard;
