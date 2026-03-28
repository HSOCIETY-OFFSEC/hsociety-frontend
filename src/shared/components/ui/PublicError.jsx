import React from 'react';

const defaultClasses =
  'flex items-start gap-2 rounded-xs border border-[rgb(var(--danger-rgb)/0.3)] bg-[rgb(var(--danger-rgb)/0.08)] px-3 py-2 text-sm text-status-danger';
const PublicError = ({ message, className = defaultClasses, icon = null, role = 'alert' }) => {
  if (!message) return null;

  return (
    <div className={className} role={role}>
      {icon ? <span className="mt-0.5 inline-flex flex-shrink-0">{icon}</span> : null}
      {message}
    </div>
  );
};

export default PublicError;
