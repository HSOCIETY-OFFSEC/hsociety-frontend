import React from 'react';
import {
 FiAward,
 FiBell,
 FiBookOpen,
 FiMessageSquare,
 FiShield
} from 'react-icons/fi';

const panelClassName =
 'flex flex-col gap-4 card-plain p-6 ';
const labelBaseClassName =
 'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold';
const labelStyles = {
 alpha: 'border-brand/30 bg-brand/10 text-brand',
 beta: 'border-status-success/30 bg-status-success/10 text-status-success',
 gamma: 'border-status-warning/30 bg-status-warning/10 text-status-warning',
 delta: 'border-status-purple/30 bg-status-purple/10 text-status-purple',
};

const TYPE_CONFIG = {
 XP_EARNED: { label: 'XP', icon: FiAward, className: labelStyles.beta },
 LAB_UNLOCKED: { label: 'Lab', icon: FiBookOpen, className: labelStyles.alpha },
 BOOTCAMP_UPDATE: { label: 'Bootcamp', icon: FiShield, className: labelStyles.delta },
 MENTOR_MESSAGE: { label: 'Mentor', icon: FiMessageSquare, className: labelStyles.alpha },
 DEFAULT: { label: 'Update', icon: FiBell, className: labelStyles.alpha }
};

const StudentRecentNotificationsCard = ({ notifications = [] }) => (
 <div className={panelClassName}>
  <div className="flex items-center gap-2 font-semibold text-text-primary">
   <FiBell size={18} />
   <h3 className="text-sm">Notifications</h3>
  </div>
  {notifications.length === 0 ? (
   <p className="text-sm text-text-tertiary">No notifications yet.</p>
  ) : (
   <div className="overflow-hidden rounded-sm border border-border">
    {notifications.slice(0, 5).map((item) => {
     const typeKey = item.type || item.category || item.kind || 'DEFAULT';
     const config = TYPE_CONFIG[typeKey] || TYPE_CONFIG.DEFAULT;
     const Icon = config.icon;

     return (
      <article key={item.id} className="flex flex-col gap-3 border-b border-border bg-bg-secondary px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
       <div className="min-w-0">
        <span className="flex items-center gap-2 font-semibold text-text-primary">
         <Icon size={12} />
         {item.title || config.label}
        </span>
        <span className="text-sm text-text-secondary">
         {item.message || 'New update available.'}
        </span>
       </div>
       <div className="flex w-full items-center justify-start sm:w-auto sm:justify-end">
        <span className={`${labelBaseClassName} ${config.className}`}>{config.label}</span>
       </div>
      </article>
     );
    })}
   </div>
  )}
 </div>
);

export default StudentRecentNotificationsCard;
