import React from 'react';
import BootcampAccessPage from './BootcampAccessPage';
import { useNavigate } from 'react-router-dom';
import { getWhatsAppLink } from '../../../../config/app/social.config';

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--modal-overlay-bg)] p-6 backdrop-blur"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-[min(90vw,720px)] rounded-lg border border-border bg-bg-secondary p-10 shadow-xl animate-modal-card-in max-sm:p-6">
        <button
          type="button"
          className="absolute right-4 top-3 text-2xl text-text-secondary transition-opacity hover:opacity-80"
          aria-label="Close"
          onClick={handleClose}
        >
          ×
        </button>
        <BootcampAccessPage
          className="bootcamp-access-page--modal min-h-0 bg-transparent p-0"
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
