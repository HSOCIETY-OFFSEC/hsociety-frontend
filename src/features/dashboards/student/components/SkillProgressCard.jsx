import React from 'react';

const panelClassName =
  'flex flex-col gap-4 rounded-lg border border-border bg-bg-secondary p-6 shadow-[0_12px_24px_rgba(15,23,42,0.08)]';

const SkillProgressCard = ({ pillars = [] }) => (
  <div className={panelClassName}>
    <div className="font-semibold text-text-primary">
      <h3 className="text-sm">Skill Progress</h3>
    </div>
    <div className="flex flex-col gap-4">
      {pillars.map((pillar) => (
        <div key={pillar.key} className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>{pillar.label}</span>
            <span className="font-semibold text-text-primary">{pillar.progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-bg-tertiary" role="presentation">
            <span className="block h-full rounded-full bg-brand" style={{ width: `${pillar.progress}%` }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SkillProgressCard;
