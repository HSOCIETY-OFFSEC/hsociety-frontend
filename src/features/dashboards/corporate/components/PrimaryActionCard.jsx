import React from 'react';
import Button from '../../../../shared/components/ui/Button';
import Card from '../../../../shared/components/ui/Card';

const PrimaryActionCard = ({ engagementStatus = 'none', onAction }) => {
  const label = engagementStatus === 'active'
    ? 'Continue Engagement'
    : engagementStatus === 'completed'
      ? 'View Report'
      : 'Start Security Assessment';

  return (
    <Card padding="large" className="primary-action-card">
      <div className="primary-action-body">
        <p className="primary-action-label">Primary action</p>
        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={() => onAction?.(engagementStatus)}
        >
          {label}
        </Button>
      </div>
    </Card>
  );
};

export default PrimaryActionCard;
