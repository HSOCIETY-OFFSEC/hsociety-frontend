import React from 'react';
import '../../../styles/shared/components/ui/rank-badge.css';

const RankBadge = ({ badge, size = 'md', className = '' }) => {
  if (!badge) return null;
  return (
    <span className={`rank-badge rank-badge--${size} ${className}`} role="status">
      {badge.image && (
        <span className="rank-badge-icon" aria-hidden="true">
          <img src={badge.image} alt={badge.label} />
        </span>
      )}
      <span className="rank-badge-text">
        <span className="rank-badge-label">{badge.label}</span>
        {badge.subtitle && <span className="rank-badge-subtitle">{badge.subtitle}</span>}
      </span>
    </span>
  );
};

export default RankBadge;
