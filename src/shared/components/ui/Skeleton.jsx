import React from 'react';
import '../../../styles/shared/components/ui/Skeleton.css';

/**
 * Skeleton Component
 * Location: src/shared/components/ui/Skeleton.jsx
 *
 * Props:
 * - className: string
 * - style: object (width/height overrides)
 * - variant: 'line' | 'rect' | 'circle'
 */

const Skeleton = ({ className = '', style = {}, variant = 'line' }) => {
  return (
    <div
      className={`skeleton skeleton-${variant} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
