import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import Card from '../../../../shared/components/ui/Card';
import Button from '../../../../shared/components/ui/Button';

const ContinueLearningCard = ({ moduleTitle, progress = 0, onContinue, hasModule }) => {
  const clampedProgress = Math.min(100, Math.max(0, Number(progress) || 0));

  return (
    <Card padding="large" className="student-card continue-learning-card">
      {/* Top action hero */}
      <div className="continue-learning-header">
        <div>
          <p className="continue-learning-kicker">Next action</p>
          <h2>Continue Your Training</h2>
          <p className="continue-learning-module">
            {hasModule ? moduleTitle : 'Pick up where you left off.'}
          </p>
        </div>
        {hasModule && (
          <span className="continue-learning-progress-pill">
            {clampedProgress}% complete
          </span>
        )}
      </div>

      {hasModule && (
        <div className="student-progress">
          <div className="student-progress-bar">
            <span className="student-progress-fill" style={{ width: `${clampedProgress}%` }} />
          </div>
        </div>
      )}

      <Button
        variant="primary"
        size="large"
        onClick={onContinue}
        className="continue-learning-button"
      >
        {hasModule ? 'Continue Training' : 'Start Learning'}
        <FiArrowRight size={18} />
      </Button>
    </Card>
  );
};

export default ContinueLearningCard;
