import React from 'react';
import { FiArrowRight } from 'react-icons/fi';

const SecurityActionCenterCard = ({ status, onNavigate }) => {
  let title = 'Start Security Assessment';
  let actionLabel = 'Start Engagement';
  let route = '/engagements';
  let statusLabel = 'No active engagement';
  let statusClass = 'cd-label-gamma';

  if (status === 'active') {
    title = 'Active Security Engagement';
    actionLabel = 'View Engagement';
    route = '/engagements';
    statusLabel = 'In Progress';
    statusClass = 'cd-label-alpha';
  } else if (status === 'completed') {
    title = 'Engagement Completed';
    actionLabel = 'View Security Reports';
    route = '/reports';
    statusLabel = 'Completed';
    statusClass = 'cd-label-beta';
  }

  return (
    <div className="cd-panel cd-action-panel">
      <div className="cd-panel-header">
        <div>
          <h3 className="cd-panel-title">{title}</h3>
        </div>
        <span className={`cd-label ${statusClass}`}>{statusLabel}</span>
      </div>
      <button type="button" className="cd-btn cd-btn-primary" onClick={() => onNavigate(route)}>
        {actionLabel}
        <FiArrowRight size={14} />
      </button>
    </div>
  );
};

export default SecurityActionCenterCard;
