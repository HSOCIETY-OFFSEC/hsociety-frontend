import React from 'react';

const PublicError = ({ message, className = 'auth-error', icon = null, role = 'alert' }) => {
  if (!message) return null;

  return (
    <div className={className} role={role}>
      {icon ? <span className="error-icon">{icon}</span> : null}
      {message}
    </div>
  );
};

export default PublicError;
