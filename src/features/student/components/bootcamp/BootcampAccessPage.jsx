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

  return (
    <div className="bootcamp-access-page">
      <div className="bootcamp-access-card">
        <span className="bootcamp-access-kicker">{kicker}</span>
        <h1 className="bootcamp-access-title">{title}</h1>
        <p className="bootcamp-access-description">{description}</p>

        <div className="bootcamp-access-actions">
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
          <p className="bootcamp-access-footnote">
            Need help? Email <span>{SUPPORT_EMAIL}</span>.
          </p>
        )}
      </div>
    </div>
  );
};

export default BootcampAccessPage;
