import React from 'react';

const SkillProgressCard = ({ pillars = [] }) => (
  <div className="sd-panel sd-skill-panel">
    <div className="sd-panel-header">
      <h3>Skill Progress</h3>
    </div>
    <div className="sd-skill-list">
      {pillars.map((pillar) => (
        <div key={pillar.key} className="sd-skill-item">
          <div className="sd-skill-label">
            <span>{pillar.label}</span>
            <span className="sd-skill-value">{pillar.progress}%</span>
          </div>
          <div className="sd-progress-bar" role="presentation">
            <span className="sd-progress-fill" style={{ width: `${pillar.progress}%` }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SkillProgressCard;
