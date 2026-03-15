/* FILE: src/features/landing/sections/PathwaysSection.jsx */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import useRequestPentest from '../../../shared/hooks/useRequestPentest';
import useAuthModal from '../../../shared/hooks/useAuthModal';
import { trackEvent } from '../../../shared/services/analytics.service';
import { ROUTES } from '../../../app/routes';
import '../../../styles/landing/pathways.css';

import studentImg from '../../../assets/brand-images/brand-image-black.webp';
import companyImg from '../../../assets/brand-images/brand-image-white.webp';

const PathwaysSection = ({ content }) => {
  const navigate = useNavigate();
  const { requestPentest, requestPentestModal } = useRequestPentest();
  const { openAuthModal } = useAuthModal();
  const { student, company } = content;

  const handleRoute = (route) => {
    trackEvent('landing_cta_click', { location: 'pathways', route });
    if (route === ROUTES.CORPORATE_PENTEST) { requestPentest(); return; }
    if (route === ROUTES.LOGIN)             { openAuthModal('login'); return; }
    if (route === ROUTES.REGISTER)          { openAuthModal('register'); return; }
    if (route === ROUTES.CORPORATE_REGISTER){ openAuthModal('register-corporate'); return; }
    navigate(route);
  };

  return (
    <section className="pathways-section reveal-on-scroll">
      <div className="section-container">
        <div className="pathways-grid">

          <Card padding="none" className="pathway-card reveal-on-scroll">
            <div className="pathway-card__image-wrapper">
              <img src={studentImg} alt={student.title} className="pathway-card__image" />
              <div className="pathway-card__image-overlay" />
            </div>
            <div className="pathway-card__body">
              <h3>{student.title}</h3>
              <ul className="pathway-list">
                {student.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Button variant="primary" size="small" onClick={() => handleRoute(student.route)}>
                {student.cta}
              </Button>
            </div>
          </Card>

          <Card padding="none" className="pathway-card reveal-on-scroll">
            <div className="pathway-card__image-wrapper">
              <img src={companyImg} alt={company.title} className="pathway-card__image" />
              <div className="pathway-card__image-overlay" />
            </div>
            <div className="pathway-card__body">
              <h3>{company.title}</h3>
              <ul className="pathway-list">
                {company.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Button variant="primary" size="small" onClick={() => handleRoute(company.route)}>
                {company.cta}
              </Button>
            </div>
          </Card>

        </div>
      </div>
      {requestPentestModal}
    </section>
  );
};

export default PathwaysSection;
