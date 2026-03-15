import React from 'react';
import { FiShield } from 'react-icons/fi';

const SecurityCommandCenterCard = ({ securityScore, riskLevel, lastScan, onRunScan, onViewReports }) => {
  const normalizedRisk = String(riskLevel || 'medium').toLowerCase();
  const riskClass = normalizedRisk.includes('low')
    ? 'cd-label-beta'
    : normalizedRisk.includes('high')
      ? 'cd-label-delta'
      : 'cd-label-gamma';

  return (
    <div className="cd-panel cd-command-panel">
      <div className="cd-panel-header">
        <div>
          <p className="cd-panel-kicker">Security Status</p>
          <h2 className="cd-panel-title">Security Command Center</h2>
        </div>
        <span className={`cd-label ${riskClass}`}>{riskLevel}</span>
      </div>

      <div className="cd-metric-grid">
        <div className="cd-metric">
          <span className="cd-metric-label">Security Score</span>
          <strong className="cd-metric-value">{securityScore} / 100</strong>
        </div>
        <div className="cd-metric">
          <span className="cd-metric-label">Risk Level</span>
          <strong className="cd-metric-value">{riskLevel}</strong>
        </div>
        <div className="cd-metric">
          <span className="cd-metric-label">Last Scan</span>
          <strong className="cd-metric-value">{lastScan}</strong>
        </div>
      </div>

      <div className="cd-panel-actions">
        <button type="button" className="cd-btn cd-btn-primary" onClick={onRunScan}>
          <FiShield size={14} />
          Run Security Scan
        </button>
        <button type="button" className="cd-btn cd-btn-secondary" onClick={onViewReports}>
          View Reports
        </button>
      </div>
    </div>
  );
};

export default SecurityCommandCenterCard;
