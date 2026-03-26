import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getWhatsAppLink } from '../../../../config/app/social.config';
import BootcampAccessPage from '../../components/bootcamp/BootcampAccessPage';

const BootcampComingSoon = () => {
  const navigate = useNavigate();
  const whatsappLink = getWhatsAppLink();

  const handlePrimary = () => {
    if (whatsappLink) {
      window.open(whatsappLink, '_blank', 'noopener,noreferrer');
      return;
    }
    navigate('/contact');
  };

  return (
    <BootcampAccessPage
      kicker="Coming Soon"
      title="Bootcamp is coming soon"
      description="We are preparing the next bootcamp cohort. Join WhatsApp to register your interest and get early updates before we open the modules."
      primaryLabel={whatsappLink ? 'Join WhatsApp' : 'Contact Support'}
      onPrimary={handlePrimary}
      secondaryLabel="Back to Dashboard"
      onSecondary={() => navigate('/student-dashboard')}
    />
  );
};

export default BootcampComingSoon;
