import React from 'react';
import Card from '../../../../shared/components/ui/Card';
import Button from '../../../../shared/components/ui/Button';

const QuickActions = ({ actions = [], onAction }) => (
  <div className="section reveal-on-scroll dramatic-section">
    <h2 className="section-title">Quick Actions</h2>
    <div className="quick-actions-grid">
      {actions.map((action) => (
        <Card
          key={action.title}
          hover3d={false}
          onClick={() => onAction(action)}
          padding="medium"
          shadow="small"
          className="quick-action-card reveal-on-scroll dramatic-card"
        >
          <div className="quick-action-content">
            <div className="quick-action-icon">
              <action.icon size={28} />
            </div>
            <h3 className="quick-action-title">{action.title}</h3>
            <p className="quick-action-description">{action.description}</p>
            <Button variant="card" size="small" style={{ marginTop: 'auto' }}>
              Get Started →
            </Button>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default QuickActions;
