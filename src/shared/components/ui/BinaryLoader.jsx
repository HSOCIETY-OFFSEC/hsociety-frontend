import React from 'react';
import '../../../styles/shared/components/ui/BinaryLoader.css';

const BINARY_SEQUENCE = '01010111 01110011 01110101 01101001 01110100 01110011 00110110';

const BinaryLoader = ({ message = 'Loading...', size = 'md', className = '' }) => {
  return (
    <div className={`binary-loader binary-loader-${size} ${className}`} role="status" aria-live="polite">
      <div className="binary-circle" aria-hidden="true">
        <div className="binary-ring" />
        <div className="binary-orbit">
          <span>{BINARY_SEQUENCE}</span>
        </div>
      </div>
      <div className="binary-message">{message}</div>
    </div>
  );
};

export default BinaryLoader;
