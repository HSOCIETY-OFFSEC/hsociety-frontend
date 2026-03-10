import React from 'react';
import Card from '../../../../shared/components/ui/Card';
import Button from '../../../../shared/components/ui/Button';

const SecurityCommandCenterCard = ({ securityScore, riskLevel, lastScan, onRunScan, onViewReports }) => (
  <Card padding="large" className="corp-card corp-command-card">
    {/* Section 1: Security Command Center */}
    <div className="corp-card-header">
      <div>
        <p className="corp-card-kicker">Security Status</p>
        <h2 className="corp-card-title">Security Command Center</h2>
      </div>
      <span className={`corp-risk-pill risk-${String(riskLevel).toLowerCase()}`}>{riskLevel}</span>
    </div>

    <div className="corp-command-metrics">
      <div className="corp-metric">
        <span className="corp-metric-label">Security Score</span>
        <strong className="corp-metric-value">{securityScore} / 100</strong>
      </div>
      <div className="corp-metric">
        <span className="corp-metric-label">Risk Level</span>
        <strong className="corp-metric-value">{riskLevel}</strong>
      </div>
      <div className="corp-metric">
        <span className="corp-metric-label">Last Scan</span>
        <strong className="corp-metric-value">{lastScan}</strong>
      </div>
    </div>

    <div className="corp-card-actions">
      <Button variant="primary" size="medium" onClick={onRunScan}>
        Run Security Scan
      </Button>
      <Button variant="ghost" size="medium" onClick={onViewReports}>
        View Reports
      </Button>
    </div>
  </Card>
);

export default SecurityCommandCenterCard;
