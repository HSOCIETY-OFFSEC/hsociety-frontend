import React from 'react';
import Card from '../../../../shared/components/ui/Card';

const SkillProgressCard = ({ pillars = [] }) => (
  <Card padding="medium" className="student-card skill-progress-card">
    <div className="student-card-header">
      <h3>Skill Progress</h3>
    </div>
    <div className="skill-progress-list">
      {pillars.map((pillar) => (
        <div key={pillar.key} className="skill-progress-item">
          <div className="skill-progress-label">
            <span>{pillar.label}</span>
            <span className="skill-progress-value">{pillar.progress}%</span>
          </div>
          <div className="student-progress-bar">
            <span className="student-progress-fill" style={{ width: `${pillar.progress}%` }} />
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export default SkillProgressCard;
