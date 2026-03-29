import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import Button from '../../../../shared/components/ui/Button';

const panelClassName =
 'flex flex-col gap-4 card-plain p-5 ';
const panelHeaderClassName = 'flex flex-wrap items-center justify-between gap-3';
const panelTitleClassName = 'text-base font-semibold text-text-primary';
const labelBaseClassName =
 'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold';
const labelStyles = {
 alpha: 'border-brand/30 bg-brand/10 text-brand',
 beta: 'border-status-success/30 bg-status-success/10 text-status-success',
 gamma: 'border-status-warning/30 bg-status-warning/10 text-status-warning',
};

const SecurityActionCenterCard = ({ status, onNavigate }) => {
 let title = 'Start Security Assessment';
 let actionLabel = 'Start Engagement';
 let route = '/engagements';
 let statusLabel = 'No active engagement';
 let statusClass = labelStyles.gamma;

 if (status === 'active') {
  title = 'Active Security Engagement';
  actionLabel = 'View Engagement';
  route = '/engagements';
  statusLabel = 'In Progress';
  statusClass = labelStyles.alpha;
 } else if (status === 'completed') {
  title = 'Engagement Completed';
  actionLabel = 'View Security Reports';
  route = '/reports';
  statusLabel = 'Completed';
  statusClass = labelStyles.beta;
 }

 return (
  <div className={panelClassName}>
   <div className={panelHeaderClassName}>
    <div>
     <h3 className={panelTitleClassName}>{title}</h3>
    </div>
    <span className={`${labelBaseClassName} ${statusClass}`}>{statusLabel}</span>
   </div>
   <Button type="button" variant="primary" size="small" onClick={() => onNavigate(route)}>
    {actionLabel}
    <FiArrowRight size={14} />
   </Button>
  </div>
 );
};

export default SecurityActionCenterCard;
