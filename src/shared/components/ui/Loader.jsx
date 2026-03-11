import React from 'react';
import '../../../styles/shared/components/ui/Loader.css';

const Loader = ({ size = 'md', className = '', label = 'Loading' }) => {
  return (
    <div
      className={`loader loader-${size} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="loader-ring" aria-hidden="true" />
      <div className="loader-core" aria-hidden="true" />
    </div>
  );
};

export default Loader;
