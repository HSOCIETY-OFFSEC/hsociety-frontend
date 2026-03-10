import React from 'react';
import {
  FiAward,
  FiBell,
  FiBookOpen,
  FiMessageSquare,
  FiShield
} from 'react-icons/fi';
import Card from '../../../../shared/components/ui/Card';

const TYPE_CONFIG = {
  XP_EARNED: { label: 'XP', icon: FiAward, className: 'type-xp' },
  LAB_UNLOCKED: { label: 'Lab', icon: FiBookOpen, className: 'type-lab' },
  BOOTCAMP_UPDATE: { label: 'Bootcamp', icon: FiShield, className: 'type-bootcamp' },
  MENTOR_MESSAGE: { label: 'Mentor', icon: FiMessageSquare, className: 'type-mentor' },
  DEFAULT: { label: 'Update', icon: FiBell, className: 'type-default' }
};

const StudentRecentNotificationsCard = ({ notifications = [] }) => (
  <Card padding="medium" className="student-card notifications-card">
    <div className="student-card-header">
      <FiBell size={20} />
      <h3>Notifications</h3>
    </div>
    {notifications.length === 0 ? (
      <p className="student-muted-text">No notifications yet.</p>
    ) : (
      notifications.slice(0, 5).map((item) => {
        const typeKey = item.type || item.category || item.kind || 'DEFAULT';
        const config = TYPE_CONFIG[typeKey] || TYPE_CONFIG.DEFAULT;
        const Icon = config.icon;

        return (
          <div key={item.id} className={`student-notification-item ${config.className}`}>
            <span className="student-notification-indicator" aria-hidden="true" />
            <div className="student-notification-body">
              <div className="student-notification-head">
                <Icon size={14} />
                <strong className="student-notification-title">
                  {item.title || config.label}
                </strong>
              </div>
              <span className="student-notification-message">
                {item.message || 'New update available.'}
              </span>
            </div>
          </div>
        );
      })
    )}
  </Card>
);

export default StudentRecentNotificationsCard;
