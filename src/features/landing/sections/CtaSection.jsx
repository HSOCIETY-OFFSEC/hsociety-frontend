import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthModal from '../../../shared/hooks/useAuthModal';
import '../../../styles/landing/cta.css';

const CtaSection = ({ content }) => {
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();

  const handleRoute = (route) => {
    if (route === '/register') { openAuthModal('register'); return; }
    navigate(route);
  };

  return (
    <section className="cta-section reveal-on-scroll" id="cta">
      <div className="section-container">
        <div className="cta-shell">
          <div className="cta-grid" aria-hidden="true" />
          <h2>{content?.left?.title || 'Ready to join HSOCIETY?'}</h2>
          <p>{content?.left?.description || 'Launch your offensive security journey.'}</p>
          <div className="cta-actions">
            <button
              type="button"
              className="cta-primary"
              onClick={() => handleRoute(content?.left?.route || '/register')}
            >
              {content?.left?.button || 'Join as Student'}
            </button>
            <button
              type="button"
              className="cta-secondary"
              onClick={() => handleRoute(content?.right?.route || '/corporate/pentest')}
            >
              {content?.right?.button || 'Book Pentest'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
