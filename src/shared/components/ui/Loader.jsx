import React from 'react';
import './Loader.css';

const Loader = ({ size = 'md', className = '', label = 'Loading' }) => {
  const isTerminal = size === 'lg';

  return (
    <div
      className={`loader loader-${size} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {isTerminal ? (
        <div className="loader-terminal" aria-hidden="true">
          <span className="loader-terminal-prompt">root@shell:~$ </span>
          <span className="loader-terminal-cursor" />
        </div>
      ) : (
        <div className="loader-ring" aria-hidden="true" />
      )}
    </div>
  );
};

export default Loader;
