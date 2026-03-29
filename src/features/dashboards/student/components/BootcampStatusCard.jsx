import React from 'react';
import { FiShield } from 'react-icons/fi';
import Card from '../../../../shared/components/ui/Card';
import Button from '../../../../shared/components/ui/Button';

const STATUS_COPY = {
 not_enrolled: {
  title: 'Cybersecurity Bootcamp',
  description: 'Start your offensive security training.',
  cta: 'Join Bootcamp',
  route: '/student-bootcamps',
  pill: null,
  disabled: false
 },
 enrolled_but_unpaid: {
  title: 'Bootcamp Enrollment Pending',
  description: 'Complete payment to unlock labs and modules.',
  cta: 'Complete Payment',
  route: '/student-payments',
  pill: 'Pending payment',
  disabled: false
 },
 enrolled: {
  title: 'Cybersecurity Bootcamp',
  description: 'You are enrolled and ready to train.',
  cta: 'Enrolled',
  route: null,
  pill: 'Enrolled',
  disabled: true
 },
 completed: {
  title: 'Cybersecurity Bootcamp',
  description: 'You have completed the bootcamp.',
  cta: 'Completed',
  route: null,
  pill: 'Completed',
  disabled: true
 }
};

const BootcampStatusCard = ({ status, onNavigate }) => {
 const config = STATUS_COPY[status] || STATUS_COPY.not_enrolled;
 const statusPillStyles = {
  enrolled: 'border-status-success/30 bg-status-success/10 text-status-success',
  completed: 'border-status-success/30 bg-status-success/10 text-status-success',
  enrolled_but_unpaid: 'border-status-warning/30 bg-status-warning/10 text-status-warning',
 };
 const statusPillClassName = statusPillStyles[status] || 'border-border bg-bg-secondary text-text-secondary';

 return (
  <Card padding="medium" shadow="small" className="border-border bg-card">
   <div className="flex items-center gap-3 border-b border-border pb-3">
    <FiShield size={20} className="text-text-tertiary" />
    <h3 className="text-sm font-semibold text-text-primary">{config.title}</h3>
    {config.pill && (
     <span className={`ml-auto inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${statusPillClassName}`}>
      {config.pill}
     </span>
    )}
   </div>
   <p className="text-sm text-text-secondary">{config.description}</p>
   <Button
    variant={config.disabled ? 'ghost' : 'primary'}
    size="small"
    onClick={() => config.route && onNavigate(config.route)}
    disabled={config.disabled}
   >
    {config.cta}
   </Button>
  </Card>
 );
};

export default BootcampStatusCard;
