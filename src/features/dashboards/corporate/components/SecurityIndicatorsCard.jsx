import React from 'react';

const panelClassName =
 'flex flex-col gap-4 card-plain p-5 ';
const panelTitleClassName = 'text-base font-semibold text-text-primary';

const SecurityIndicatorsCard = ({ securityScore, riskLevel, criticalCount }) => (
 <div className={panelClassName}>
  <div className="flex items-center justify-between">
   <h3 className={panelTitleClassName}>Security Indicators</h3>
  </div>
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
   <div className="flex flex-col gap-1 rounded-sm border border-border bg-bg-tertiary px-3 py-3">
    <span className="text-xs uppercase tracking-widest text-text-tertiary">Security Score</span>
    <strong className="text-sm font-semibold text-text-primary">{securityScore}</strong>
   </div>
   <div className="flex flex-col gap-1 rounded-sm border border-border bg-bg-tertiary px-3 py-3">
    <span className="text-xs uppercase tracking-widest text-text-tertiary">Risk Level</span>
    <strong className="text-sm font-semibold text-text-primary">{riskLevel}</strong>
   </div>
   <div className="flex flex-col gap-1 rounded-sm border border-border bg-bg-tertiary px-3 py-3">
    <span className="text-xs uppercase tracking-widest text-text-tertiary">Critical Vulnerabilities</span>
    <strong className="text-sm font-semibold text-text-primary">{criticalCount}</strong>
   </div>
  </div>
 </div>
);

export default SecurityIndicatorsCard;
