import React from 'react';
import { FiTarget } from 'react-icons/fi';
import Card from '../../../../shared/components/ui/Card';
import Button from '../../../../shared/components/ui/Button';

const DailyMissionCard = ({ onStart }) => (
  <Card padding="medium" shadow="small" className="border-border bg-card">
    <div className="flex items-center gap-3 border-b border-border pb-3">
      <FiTarget size={20} className="text-text-tertiary" />
      <h3 className="text-sm font-semibold text-text-primary">Daily Mission</h3>
    </div>
    <p className="text-sm text-text-secondary">Complete 1 Linux Lab</p>
    <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">Reward: +50 XP</p>
    <Button variant="secondary" size="small" onClick={onStart}>
      Start Mission
    </Button>
  </Card>
);

export default DailyMissionCard;
