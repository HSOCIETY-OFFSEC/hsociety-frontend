import React from 'react';

const SecurityActivityFeedCard = ({ activity = [] }) => (
  <div className="cd-panel cd-activity-panel">
    <div className="cd-panel-header">
      <h3 className="cd-panel-title">Security Activity</h3>
    </div>
    {activity.length === 0 ? (
      <p className="cd-muted-text">No recent activity.</p>
    ) : (
      <ul className="cd-activity-list">
        {activity.slice(0, 6).map((item) => (
          <li key={item.id || item.date || item.message} className="cd-activity-item">
            <span className="cd-activity-time">{item.time}</span>
            <span className="cd-activity-message">{item.message}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default SecurityActivityFeedCard;
