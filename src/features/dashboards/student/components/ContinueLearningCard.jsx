import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import Card from '../../../../shared/components/ui/Card';
import Button from '../../../../shared/components/ui/Button';

const ContinueLearningCard = ({ moduleTitle, progress = 0, onContinue, hasModule }) => {
  const clampedProgress = Math.min(100, Math.max(0, Number(progress) || 0));
  const headerClassName = 'flex flex-wrap items-start justify-between gap-4';
  const kickerClassName = 'text-xs font-semibold uppercase tracking-widest text-text-tertiary';
  const titleClassName = 'mt-2 text-2xl font-semibold text-text-primary';
  const moduleClassName = 'mt-2 text-sm text-text-secondary';
  const progressPillClassName =
    'inline-flex items-center rounded-full border border-border bg-bg-secondary px-3 py-1 text-xs font-semibold text-text-secondary';
  const progressTrackClassName = 'h-2 w-full rounded-full bg-bg-tertiary';
  const progressFillClassName = 'block h-full rounded-full bg-brand transition-[width] duration-300';
  const buttonClassName = 'w-full justify-center sm:w-auto';

  return (
    <Card padding="large" shadow="small" className="border-border bg-card">
      {/* Top action hero */}
      <div className={headerClassName}>
        <div>
          <p className={kickerClassName}>Next action</p>
          <h2 className={titleClassName}>Continue Your Training</h2>
          <p className={moduleClassName}>
            {hasModule ? moduleTitle : 'Pick up where you left off.'}
          </p>
        </div>
        {hasModule && (
          <span className={progressPillClassName}>
            {clampedProgress}% complete
          </span>
        )}
      </div>

      {hasModule && (
        <div className="w-full">
          <div className={progressTrackClassName}>
            <span className={progressFillClassName} style={{ width: `${clampedProgress}%` }} />
          </div>
        </div>
      )}

      <Button
        variant="primary"
        size="large"
        onClick={onContinue}
        className={buttonClassName}
      >
        {hasModule ? 'Continue Training' : 'Start Learning'}
        <FiArrowRight size={18} />
      </Button>
    </Card>
  );
};

export default ContinueLearningCard;
