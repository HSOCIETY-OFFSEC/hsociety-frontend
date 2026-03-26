import React from 'react';
import BootcampAccessPage from './BootcampAccessPage';
import { useNavigate } from 'react-router-dom';
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
          kicker="Coming Soon"
          title="Bootcamp access is opening soon."
          description="We are preparing the next cohort. Join the waitlist to get early access when modules go live."
          primaryLabel="Join Waitlist"
          onPrimary={() => navigate('/contact')}
          secondaryLabel="Back to Dashboard"
          onSecondary={handleClose}
        />
      </div>
    </div>
  );
};

export default BootcampComingSoonModal;
