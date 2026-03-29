import React from 'react';
import cpIcon from '../../../../assets/icons/CP/cp-icon.webp';

const panelClassName =
 'flex flex-col gap-4 card-plain p-6 ';

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
  <div className={panelClassName}>
   <div className="flex items-center gap-2 font-semibold text-text-primary">
    <img src={cpIcon} alt="CP" className="h-5 w-5" />
    <h3 className="text-sm">Progress</h3>
   </div>
   <p className="text-sm text-text-secondary">Level: <strong className="text-text-primary">{levelTitle}</strong></p>
   <p className="text-sm text-text-secondary">
    XP: <strong className="text-text-primary">{currentXp}</strong> / {nextXp}
   </p>
   <div className="h-1.5 w-full rounded-full bg-bg-tertiary" role="presentation">
    <span className="block h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
   </div>
   <p className="text-xs text-text-tertiary">Next Level: {nextLevel}</p>
  </div>
 );
};

export default StudentXpSummaryCard;
