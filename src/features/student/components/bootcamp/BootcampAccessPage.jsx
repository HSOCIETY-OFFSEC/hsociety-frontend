import React from 'react';
import Button from '../../../../shared/components/ui/Button';
import { CONTACT_CHANNELS } from '../../../../config/app/contact.config';

const SUPPORT_EMAIL = CONTACT_CHANNELS.find((channel) => channel.label === 'Email')?.value;

const BootcampAccessPage = ({
  kicker = 'Restricted',
  title,
  description,
  primaryLabel,
  onPrimary,
  primaryDisabled = false,
  secondaryLabel = 'Contact Support',
  onSecondary,
  className = '',
}) => {
  const handleSupport = () => {
    if (onSecondary) {
      onSecondary();
      return;
    }

    if (SUPPORT_EMAIL) {
      window.location.href = `mailto:${SUPPORT_EMAIL}`;
    }
  };

  const pageClassName =
    'min-h-[calc(100vh-60px)] w-full bg-[radial-gradient(circle_at_top_right,rgba(var(--brand-rgb),0.12),transparent_45%),radial-gradient(circle_at_20%_10%,rgba(var(--warning-rgb),0.18),transparent_55%)] px-6 py-10';
  const cardClassName = 'mx-auto w-full max-w-[520px] rounded-lg border border-border bg-bg-secondary p-8 shadow-lg';
  const kickerClassName = 'inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand';
  const titleClassName = 'mt-4 text-2xl font-semibold text-text-primary';
  const descClassName = 'mt-2 text-sm text-text-secondary';
  const actionsClassName = 'mt-6 flex flex-wrap gap-3';
  const footnoteClassName = 'mt-4 text-sm text-text-tertiary';
  const footnoteStrongClassName = 'text-text-primary font-semibold';

  return (
    <div className={`${pageClassName}${className ? ` ${className}` : ''}`}>
      <div className={cardClassName}>
        <span className={kickerClassName}>{kicker}</span>
        <h1 className={titleClassName}>{title}</h1>
        <p className={descClassName}>{description}</p>

        <div className={actionsClassName}>
          <Button variant="ghost" size="small" onClick={handleSupport}>
            {secondaryLabel}
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={onPrimary}
            disabled={primaryDisabled}
          >
            {primaryLabel}
          </Button>
        </div>
        {SUPPORT_EMAIL && (
          <p className={footnoteClassName}>
            Need help? Email <span className={footnoteStrongClassName}>{SUPPORT_EMAIL}</span>.
          </p>
        )}
      </div>
    </div>
  );
};

export default BootcampAccessPage;
