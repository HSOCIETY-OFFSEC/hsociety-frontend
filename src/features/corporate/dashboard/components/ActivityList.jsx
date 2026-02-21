import React from 'react';
import { FiAlertTriangle, FiFileText, FiShield } from 'react-icons/fi';
import Card from '../../../../shared/components/ui/Card';
import { getRelativeTime } from '../../../../utils/helpers';

const iconMap = {
  pentest: FiShield,
  audit: FiFileText,
  report: FiAlertTriangle
};

const ActivityList = ({ activities = [], onViewAll, getStatusColor, getStatusLabel }) => (
  <div className="section reveal-on-scroll dramatic-section">
    <div className="section-header">
      <h2 className="section-title">Recent Activity</h2>
      <button
        onClick={onViewAll}
        className="view-all-link"
      >
        View All →
      </button>
    </div>

    <Card padding="none" shadow="medium">
      <div className="activity-list">
        {activities.map((activity, index) => {
          const Icon = iconMap[activity.type] || FiAlertTriangle;
          return (
            <div
              key={activity.id}
              className="activity-item dramatic-item"
              style={{
                borderBottom: index < activities.length - 1
                  ? '1px solid var(--border-color)'
                  : 'none',
                animationDelay: `${0.1 + index * 0.1}s`
              }}
            >
              <div className="activity-icon">
                <Icon size={20} />
              </div>
              <div className="activity-content">
                <h4 className="activity-title">{activity.title}</h4>
                <p className="activity-date">{getRelativeTime(activity.date)}</p>
              </div>
              <div className="activity-status">
                <span
                  className="status-badge"
                  style={{ '--status-color': getStatusColor(activity.status) }}
                >
                  {getStatusLabel(activity.status)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  </div>
);

export default ActivityList;
