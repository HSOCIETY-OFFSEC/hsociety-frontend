import React from 'react';
import Card from '../../../../shared/components/ui/Card';

const statusLabelMap = {
  none: 'No engagement yet',
  active: 'Active engagement',
  completed: 'Last engagement completed'
};

const riskColorMap = {
  low: '#10b981',
  medium: '#facc15',
  high: '#ef4444'
};

const SecurityStatusCard = ({ status = 'none', risk = 'medium', lastScan }) => {
  const label = statusLabelMap[status] || 'Waiting for engagement';
  const riskColor = riskColorMap[risk] || riskColorMap.medium;

  return (
    <Card padding="large" className="status-card">
      <div className="status-card-header">
        <h3>Security Status</h3>
        <span className="status-chip" style={{ borderColor: riskColor }}>
          {status === 'active' ? 'Live' : status === 'completed' ? 'Finished' : 'Idle'}
        </span>
      </div>
      <div className="status-row">
        <p className="status-label">Current engagement</p>
        <p className="status-value">{label}</p>
      </div>
      <div className="status-row">
        <p className="status-label">Risk level</p>
        <p className="status-value" style={{ color: riskColor }}>{risk.toUpperCase()}</p>
      </div>
      <div className="status-row">
        <p className="status-label">Last scan</p>
        <p className="status-value">{lastScan || 'No scan data'}</p>
      </div>
    </Card>
  );
};

export default SecurityStatusCard;
