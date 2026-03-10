import React from 'react';
import { FiTarget } from 'react-icons/fi';
import Card from '../../../../shared/components/ui/Card';
import Button from '../../../../shared/components/ui/Button';

const DailyMissionCard = ({ onStart }) => (
  <Card padding="medium" className="student-card daily-mission-card">
    <div className="student-card-header">
      <FiTarget size={20} />
      <h3>Daily Mission</h3>
    </div>
    <p className="daily-mission-task">Complete 1 Linux Lab</p>
    <p className="daily-mission-reward">Reward: +50 XP</p>
    <Button variant="secondary" size="small" onClick={onStart}>
      Start Mission
    </Button>
  </Card>
);

export default DailyMissionCard;
