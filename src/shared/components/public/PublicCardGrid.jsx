import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from '../ui/Skeleton';

const PublicCardSkeleton = ({ index }) => {
  const titleWidth = useMemo(() => {
    const widths = ['68%', '58%', '72%', '64%'];
    return widths[index % widths.length];
  }, [index]);

  return (
    <article className="public-card public-card--skeleton" aria-hidden="true">
      <div className="public-card-skeleton-body">
        <Skeleton className="public-card-skeleton-chip" style={{ width: '38%' }} />
        <Skeleton className="public-card-skeleton-title" style={{ width: titleWidth }} />
        <Skeleton className="public-card-skeleton-line" style={{ width: '100%' }} />
        <Skeleton className="public-card-skeleton-line" style={{ width: '85%' }} />
      </div>
    </article>
  );
};

const PublicCardGrid = ({
  children,
  className = '',
  skeletonCount = 3,
  loading,
  minDelayMs = 350,
}) => {
  const hasExternalLoading = typeof loading === 'boolean';
  const [localLoading, setLocalLoading] = useState(!hasExternalLoading);

  useEffect(() => {
    if (hasExternalLoading) return undefined;
    const timer = setTimeout(() => setLocalLoading(false), minDelayMs);
    return () => clearTimeout(timer);
  }, [hasExternalLoading, minDelayMs]);

  const isLoading = hasExternalLoading ? loading : localLoading;

  return (
    <div
      className={`public-card-grid ${className} ${isLoading ? 'public-card-grid--loading' : ''}`.trim()}
    >
      {isLoading
        ? Array.from({ length: skeletonCount }).map((_, index) => (
          <PublicCardSkeleton key={`public-card-skeleton-${index}`} index={index} />
        ))
        : children}
    </div>
  );
};

export default PublicCardGrid;
