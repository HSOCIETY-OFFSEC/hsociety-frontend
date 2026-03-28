import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../app/router/routes';
import useAuthModal from '../../../../shared/hooks/useAuthModal';
import ImageWithLoader from '../../../../shared/components/ui/ImageWithLoader';
import handsOnImage from '../../../../assets/images/why-choose-hsociety-images/hands-on-learning.webp';
import supervisedPentestsImage from '../../../../assets/images/why-choose-hsociety-images/supervised-pentests.webp';
import communityEngagementsImage from '../../../../assets/images/why-choose-hsociety-images/community-engagements.webp';
import { FiCheckCircle } from 'react-icons/fi';

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
      imageAlt: 'HSOCIETY OFFSEC community collaboration',
    },
  ];

  const handleRoute = (route) => {
    if (route === ROUTES.LOGIN) { openAuthModal('login'); return; }
    if (route === ROUTES.REGISTER) { openAuthModal('register'); return; }
    if (route === ROUTES.CORPORATE_REGISTER) { navigate('/contact'); return; }
    navigate(route);
  };

  return (
    <section className="reveal-on-scroll bg-bg-secondary py-16" id="pathways">
      <div className="section-container">
        <header className="section-header-center">
          <p className="section-eyebrow"><span className="eyebrow-dot" />Pathways</p>
          <h2 className="section-title">Choose your entry lane.</h2>
          <p className="section-subtitle">Three clear paths into HSOCIETY OFFSEC's ecosystem.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.key}
              className={`relative flex min-h-full flex-col gap-4 overflow-hidden rounded-md border border-border bg-bg-secondary p-6 transition-all duration-200 hover:border-[color-mix(in_srgb,var(--primary-color)_45%,var(--border-color))] hover:shadow-md ${
                card.isPrimary ? 'border-brand' : ''
              }`}
            >
              <div className="hs-signature" aria-hidden="true" />
              <div className="relative h-[clamp(140px,22vw,180px)] overflow-hidden rounded-sm border border-border bg-bg-tertiary">
                <ImageWithLoader
                  src={card.image}
                  alt={card.imageAlt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-tertiary">{card.tag}</span>
              <h3 className="text-lg font-semibold text-text-primary">{card.title}</h3>
              <ul className="flex flex-col gap-2 text-sm text-text-secondary">
                {card.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <FiCheckCircle size={14} aria-hidden="true" className="text-brand" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`mt-auto rounded-md border border-border px-4 py-3 font-semibold text-text-primary transition-colors ${
                  card.isPrimary
                    ? 'border-brand hover:bg-[color-mix(in_srgb,var(--primary-color)_12%,transparent)]'
                    : 'hover:bg-bg-tertiary hover:border-text-secondary'
                }`}
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
