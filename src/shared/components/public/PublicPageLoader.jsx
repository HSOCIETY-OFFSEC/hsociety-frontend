import React from 'react';
import Skeleton from '../ui/Skeleton';

const PublicPageLoader = () => {
  return (
    <div className="public-page public-page-inner pb-12" aria-hidden="true">
      <section className="public-hero hero-section">
        <div className="section-container items-stretch">
          <div className="flex flex-col gap-3">
            <Skeleton style={{ width: '160px', height: '12px' }} />
            <Skeleton style={{ width: '72%', height: '36px' }} />
            <Skeleton style={{ width: '58%', height: '36px' }} />
            <Skeleton style={{ width: '92%', height: '14px' }} />
            <Skeleton style={{ width: '82%', height: '14px' }} />
            <div className="mt-2 flex flex-wrap gap-3">
              <Skeleton style={{ width: '160px', height: '44px' }} />
              <Skeleton style={{ width: '140px', height: '44px' }} />
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-lg border border-[color-mix(in_srgb,var(--border-color)_70%,transparent)] bg-[color-mix(in_srgb,var(--bg-secondary)_88%,transparent)] p-6 shadow-sm">
            <Skeleton variant="rect" className="rounded-md" style={{ width: '100%', height: '220px' }} />
            <div className="flex flex-wrap gap-2">
              <Skeleton style={{ width: '120px', height: '26px' }} />
              <Skeleton style={{ width: '110px', height: '26px' }} />
              <Skeleton style={{ width: '140px', height: '26px' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="public-section">
        <div className="section-container">
          <div className="mb-6 flex flex-col gap-2.5">
            <Skeleton style={{ width: '220px', height: '22px' }} />
            <Skeleton style={{ width: '70%', height: '14px' }} />
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                className="flex flex-col gap-4 rounded-2xl border border-[color-mix(in_srgb,var(--border-color)_70%,transparent)] bg-[color-mix(in_srgb,var(--bg-secondary)_92%,transparent)] p-4 shadow-sm"
                key={`public-loader-card-${index}`}
              >
                <Skeleton variant="rect" className="rounded-md" style={{ width: '100%', height: '150px' }} />
                <div className="flex flex-col gap-2.5">
                  <Skeleton style={{ width: '90px', height: '12px' }} />
                  <Skeleton style={{ width: '70%', height: '18px' }} />
                  <Skeleton style={{ width: '100%', height: '12px' }} />
                  <Skeleton style={{ width: '85%', height: '12px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicPageLoader;
