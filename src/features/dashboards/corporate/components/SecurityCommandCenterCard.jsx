import React from 'react';
import { FiShield } from 'react-icons/fi';
import Button from '../../../../shared/components/ui/Button';

const panelClassName =
  'flex flex-col gap-4 rounded-lg border border-border bg-bg-secondary p-5 shadow-[0_12px_24px_rgba(15,23,42,0.08)]';
const panelHeaderClassName = 'flex flex-wrap items-center justify-between gap-3';
const panelTitleClassName = 'text-base font-semibold text-text-primary';
const labelBaseClassName =
  'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold';
const labelStyles = {
  low: 'border-status-success/30 bg-status-success/10 text-status-success',
  medium: 'border-status-warning/30 bg-status-warning/10 text-status-warning',
  high: 'border-status-purple/30 bg-status-purple/10 text-status-purple',
};

const SecurityCommandCenterCard = ({ securityScore, riskLevel, lastScan, onRunScan, onViewReports }) => {
  const normalizedRisk = String(riskLevel || 'medium').toLowerCase();
  const riskClass = normalizedRisk.includes('low')
    ? labelStyles.low
    : normalizedRisk.includes('high')
      ? labelStyles.high
      : labelStyles.medium;

  return (
    <div className={panelClassName}>
      <div className={panelHeaderClassName}>
        <div>
          <h2 className={panelTitleClassName}>Security Command Center</h2>
        </div>
        <span className={`${labelBaseClassName} ${riskClass}`}>{riskLevel}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-1 rounded-sm border border-border bg-bg-tertiary px-3 py-3">
          <span className="text-xs uppercase tracking-widest text-text-tertiary">Security Score</span>
          <strong className="text-sm font-semibold text-text-primary">{securityScore} / 100</strong>
        </div>
        <div className="flex flex-col gap-1 rounded-sm border border-border bg-bg-tertiary px-3 py-3">
          <span className="text-xs uppercase tracking-widest text-text-tertiary">Risk Level</span>
          <strong className="text-sm font-semibold text-text-primary">{riskLevel}</strong>
        </div>
        <div className="flex flex-col gap-1 rounded-sm border border-border bg-bg-tertiary px-3 py-3">
          <span className="text-xs uppercase tracking-widest text-text-tertiary">Last Scan</span>
          <strong className="text-sm font-semibold text-text-primary">{lastScan}</strong>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="primary" size="small" onClick={onRunScan}>
          <FiShield size={14} />
          Run Security Scan
        </Button>
        <Button type="button" variant="secondary" size="small" onClick={onViewReports}>
          View Reports
        </Button>
      </div>
    </div>
  );
};

export default SecurityCommandCenterCard;
