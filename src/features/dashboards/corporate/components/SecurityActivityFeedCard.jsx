import React from 'react';
import Card from '../../../../shared/components/ui/Card';

const SecurityActivityFeedCard = ({ activity = [] }) => (
  <Card padding="medium" className="corp-card corp-activity-card">
    {/* Section 6: Security Activity Feed */}
    <div className="corp-card-header">
      <h3 className="corp-card-title">Security Activity</h3>
    </div>
    {activity.length === 0 ? (
      <p className="corp-muted-text">No recent activity.</p>
    ) : (
      <ul className="corp-activity-list">
        {activity.slice(0, 6).map((item) => (
          <li key={item.id || item.date || item.message} className="corp-activity-item">
            <span className="corp-activity-time">{item.time}</span>
            <span className="corp-activity-message">{item.message}</span>
          </li>
        ))}
      </ul>
    )}
  </Card>
);

export default SecurityActivityFeedCard;
