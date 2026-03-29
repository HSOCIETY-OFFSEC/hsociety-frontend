import React from 'react';

const panelClassName =
  'flex flex-col gap-4 rounded-lg border border-border bg-bg-secondary p-5 shadow-[0_12px_24px_rgba(15,23,42,0.08)]';
const panelTitleClassName = 'text-base font-semibold text-text-primary';

const SecurityActivityFeedCard = ({ activity = [] }) => (
  <div className={panelClassName}>
    <div className="flex items-center justify-between">
      <h3 className={panelTitleClassName}>Security Activity</h3>
    </div>
    {activity.length === 0 ? (
      <p className="text-sm text-text-tertiary">No recent activity.</p>
    ) : (
      <ul className="flex flex-col gap-3">
        {activity.slice(0, 6).map((item) => (
          <li key={item.id || item.date || item.message} className="flex items-center justify-between gap-4 border-b border-border pb-2 text-sm text-text-secondary">
            <span className="font-mono text-xs text-text-tertiary">{item.time}</span>
            <span className="flex-1 text-right">{item.message}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default SecurityActivityFeedCard;
