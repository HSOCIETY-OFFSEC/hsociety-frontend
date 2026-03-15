import React from 'react';
import {
  FiAward,
  FiBell,
  FiBookOpen,
  FiMessageSquare,
  FiShield
} from 'react-icons/fi';

const TYPE_CONFIG = {
  XP_EARNED: { label: 'XP', icon: FiAward, className: 'sd-label-beta' },
  LAB_UNLOCKED: { label: 'Lab', icon: FiBookOpen, className: 'sd-label-alpha' },
  BOOTCAMP_UPDATE: { label: 'Bootcamp', icon: FiShield, className: 'sd-label-delta' },
  MENTOR_MESSAGE: { label: 'Mentor', icon: FiMessageSquare, className: 'sd-label-alpha' },
  DEFAULT: { label: 'Update', icon: FiBell, className: 'sd-label-alpha' }
};

const StudentRecentNotificationsCard = ({ notifications = [] }) => (
  <div className="sd-panel sd-notifications-panel">
    <div className="sd-panel-header">
      <FiBell size={18} />
      <h3>Notifications</h3>
    </div>
    {notifications.length === 0 ? (
      <p className="sd-muted">No notifications yet.</p>
    ) : (
      <div className="sd-item-list">
        {notifications.slice(0, 5).map((item) => {
          const typeKey = item.type || item.category || item.kind || 'DEFAULT';
          const config = TYPE_CONFIG[typeKey] || TYPE_CONFIG.DEFAULT;
          const Icon = config.icon;

          return (
            <article key={item.id} className="sd-item-row">
              <div className="sd-item-main">
                <span className="sd-item-title">
                  <Icon size={12} />
                  {item.title || config.label}
                </span>
                <span className="sd-item-subtitle">
                  {item.message || 'New update available.'}
                </span>
              </div>
              <div className="sd-item-meta">
                <span className={`sd-label ${config.className}`}>{config.label}</span>
              </div>
            </article>
          );
        })}
      </div>
    )}
  </div>
);

export default StudentRecentNotificationsCard;
