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

  return (
    <Card padding="medium" className="student-card bootcamp-status-card">
      <div className="student-card-header">
        <FiShield size={20} />
        <h3>{config.title}</h3>
        {config.pill && (
          <span className={`student-status-pill status-${status}`}>
            {config.pill}
          </span>
        )}
      </div>
      <p>{config.description}</p>
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
