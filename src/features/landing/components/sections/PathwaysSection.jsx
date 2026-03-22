import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../app/router/routes';
import useAuthModal from '../../../../shared/hooks/useAuthModal';
import ImageWithLoader from '../../../../shared/components/ui/ImageWithLoader';
import handsOnImage from '../../../../assets/images/why-choose-hsociety-images/hands-on-learning.webp';
import supervisedPentestsImage from '../../../../assets/images/why-choose-hsociety-images/supervised-pentests.webp';
import communityEngagementsImage from '../../../../assets/images/why-choose-hsociety-images/community-engagements.webp';
import { FiCheckCircle } from 'react-icons/fi';
import '../../styles/sections/pathways.css';

const PathwaysSection = ({ pathways }) => {
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();

  const cards = [
    {
      key: 'student',
      tag: 'Student',
      title: pathways?.student?.title || 'For Aspiring Cybersecurity Professionals',
      items: pathways?.student?.items || [],
      cta: pathways?.student?.cta || 'Join as a Student',
      route: pathways?.student?.route || ROUTES.REGISTER,
      isPrimary: true,
      image: handsOnImage,
      imageAlt: 'Hands-on cybersecurity training',
    },
    {
      key: 'corporate',
      tag: 'Corporate',
      title: pathways?.company?.title || 'For Companies & Organizations',
      items: pathways?.company?.items || [],
      cta: pathways?.company?.cta || 'Request Security Assessment',
      route: pathways?.company?.route || ROUTES.CORPORATE_PENTEST,
      isPrimary: false,
      image: supervisedPentestsImage,
      imageAlt: 'Supervised security assessments',
    },
    {
      key: 'pentester',
      tag: 'Pentester',
      title: 'For Offensive Operators',
      items: [
        'Access live, supervised engagements',
        'Earn with verified delivery',
        'Build a public operator profile',
        'Advance into specialized teams',
      ],
      cta: 'Enter Pentester Hub',
      route: '/pentester',
      isPrimary: false,
      image: communityEngagementsImage,
      imageAlt: 'HSOCIETY community collaboration',
    },
  ];

  const handleRoute = (route) => {
    if (route === ROUTES.LOGIN) { openAuthModal('login'); return; }
    if (route === ROUTES.REGISTER) { openAuthModal('register'); return; }
    if (route === ROUTES.CORPORATE_REGISTER) { openAuthModal('login'); return; }
    navigate(route);
  };

  return (
    <section className="pathways-section reveal-on-scroll" id="pathways">
      <div className="section-container">
        <header className="section-header-center">
          <p className="section-eyebrow"><span className="eyebrow-dot" />Pathways</p>
          <h2 className="section-title">Choose your entry lane.</h2>
          <p className="section-subtitle">Three clear paths into HSOCIETY's ecosystem.</p>
        </header>

        <div className="pathways-grid">
          {cards.map((card) => (
            <article
              key={card.key}
              className={`pathway-card${card.isPrimary ? ' is-primary' : ''}`}
            >
              <div className="pathway-media">
                <ImageWithLoader
                  src={card.image}
                  alt={card.imageAlt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span className="pathway-tag">{card.tag}</span>
              <h3>{card.title}</h3>
              <ul>
                {card.items.map((item) => (
                  <li key={item}>
                    <FiCheckCircle size={14} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="pathway-cta"
                onClick={() => handleRoute(card.route)}
              >
                {card.cta}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PathwaysSection;
