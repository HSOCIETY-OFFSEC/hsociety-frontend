import React from 'react';
import BootcampAccessPage from './BootcampAccessPage';
import { useNavigate } from 'react-router-dom';
import { getWhatsAppLink } from '../../../../config/app/social.config';
import './bootcamp-coming-soon-modal.css';

const BootcampComingSoonModal = ({ onClose }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    navigate('/student-dashboard');
  };

  const handlePrimary = () => {
    const whatsappLink = getWhatsAppLink();
    if (whatsappLink) {
      window.open(whatsappLink, '_blank', 'noopener,noreferrer');
      return;
    }
    navigate('/contact');
  };

  return (
    <div className="bootcamp-soon-modal-backdrop" role="dialog" aria-modal="true">
      <div className="bootcamp-soon-modal">
        <button
          type="button"
          className="bootcamp-soon-close"
          aria-label="Close"
          onClick={handleClose}
        >
          ×
        </button>
        <BootcampAccessPage
          className="bootcamp-access-page--modal"
          kicker="Coming Soon"
          title="Bootcamp access is opening soon."
          description="We are preparing the next cohort. Join the community on WhatsApp to get early access when modules go live."
          primaryLabel="Join WhatsApp Community"
          onPrimary={handlePrimary}
          secondaryLabel="Back to Dashboard"
          onSecondary={handleClose}
        />
      </div>
    </div>
  );
};

export default BootcampComingSoonModal;
