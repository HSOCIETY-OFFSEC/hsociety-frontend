import React from 'react';
import cpIcon from '../../../../assets/icons/CP/cp-icon.webp';

const LEVELS = [
  { min: 0, max: 500, title: 'Script Kiddie', next: 'Exploit Apprentice' },
  { min: 500, max: 1000, title: 'Exploit Apprentice', next: 'Payload Architect' },
  { min: 1000, max: 2000, title: 'Payload Architect', next: 'Red Team Operative' },
  { min: 2000, max: 3000, title: 'Red Team Operative', next: 'Zero-Day Hunter' },
  { min: 3000, max: Infinity, title: 'Zero-Day Hunter', next: null },
];

const getLevelInfo = (xp = 0) => {
  const totalXp = Number(xp) || 0;
  const current = LEVELS.find((level) => totalXp >= level.min && totalXp < level.max) || LEVELS[0];
  const max = Number.isFinite(current.max) ? current.max : totalXp;
  const progress = max > current.min
    ? Math.min(100, Math.round(((totalXp - current.min) / (max - current.min)) * 100))
    : 100;

  return {
    levelTitle: current.title,
    nextLevel: current.next || 'Master Operator',
    currentXp: totalXp,
    nextXp: max,
    progress
  };
};

const StudentXpSummaryCard = ({ xpSummary }) => {
  if (!xpSummary) return null;
  const { levelTitle, nextLevel, currentXp, nextXp, progress } = getLevelInfo(xpSummary.totalXp);

  return (
    <div className="sd-panel sd-xp-panel">
      <div className="sd-panel-header">
        <img src={cpIcon} alt="CP" className="sd-cp-icon" />
        <h3>Progress</h3>
      </div>
      <p className="sd-xp-line">Level: <strong>{levelTitle}</strong></p>
      <p className="sd-xp-line">
        XP: <strong>{currentXp}</strong> / {nextXp}
      </p>
      <div className="sd-progress-bar" role="presentation">
        <span className="sd-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="sd-xp-next">Next Level: {nextLevel}</p>
    </div>
  );
};

export default StudentXpSummaryCard;
