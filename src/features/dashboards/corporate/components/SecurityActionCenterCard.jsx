import React from 'react';
import Card from '../../../../shared/components/ui/Card';
import Button from '../../../../shared/components/ui/Button';

const SecurityActionCenterCard = ({ status, onNavigate }) => {
  let title = 'Start Security Assessment';
  let description = 'Run a new vulnerability scan.';
  let actionLabel = 'Start Engagement';
  let route = '/engagements';
  let statusLabel = 'No active engagement';

  if (status === 'active') {
    title = 'Active Security Engagement';
    description = 'Engagement in progress.';
    actionLabel = 'View Engagement';
    route = '/engagements';
    statusLabel = 'In Progress';
  } else if (status === 'completed') {
    title = 'Engagement Completed';
    description = 'Security reports available.';
    actionLabel = 'View Security Reports';
    route = '/reports';
    statusLabel = 'Completed';
  }

  return (
    <Card padding="medium" className="corp-card corp-action-card">
      {/* Section 2: Action Center */}
      <div className="corp-card-header">
        <div>
          <p className="corp-card-kicker">Action Center</p>
          <h3 className="corp-card-title">{title}</h3>
        </div>
        <span className={`corp-status-pill status-${status}`}>{statusLabel}</span>
      </div>
      <p className="corp-card-body">{description}</p>
      <Button variant="primary" size="medium" onClick={() => onNavigate(route)}>
        {actionLabel}
      </Button>
    </Card>
  );
};

export default SecurityActionCenterCard;
