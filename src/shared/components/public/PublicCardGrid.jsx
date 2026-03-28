import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from '../ui/Skeleton';
import { PUBLIC_CARD_MEDIA } from '../../data/publicCardMedia';
import {
  publicCard,
  publicCardGrid,
  publicCardSkeleton,
} from '../../styles/publicClasses';

const PublicCardSkeleton = ({ index }) => {
  const titleWidth = useMemo(() => {
    const widths = ['68%', '58%', '72%', '64%'];
    return widths[index % widths.length];
  }, [index]);

  return (
    <article className={`${publicCard} ${publicCardSkeleton}`} aria-hidden="true">
      <div className="flex flex-col gap-2.5">
        <Skeleton className="h-[18px] rounded-full" style={{ width: '38%' }} />
        <Skeleton className="h-4 rounded-full" style={{ width: titleWidth }} />
        <Skeleton className="h-3 rounded-full" style={{ width: '100%' }} />
        <Skeleton className="h-3 rounded-full" style={{ width: '85%' }} />
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
      className={`${publicCardGrid} ${className} ${isLoading ? 'pointer-events-none' : ''}`.trim()}
      style={{
        '--public-card-media-1': `url(${PUBLIC_CARD_MEDIA[0]})`,
        '--public-card-media-2': `url(${PUBLIC_CARD_MEDIA[1]})`,
        '--public-card-media-3': `url(${PUBLIC_CARD_MEDIA[2]})`,
      }}
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
