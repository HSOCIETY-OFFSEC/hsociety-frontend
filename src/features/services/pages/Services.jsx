/**
 * Services Page
 * Location: src/features/services/Services.jsx
 *
 * GitHub repo-page layout:
 *   page header (breadcrumb + actions) → two-column (main + sidebar)
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthModal from '../../../shared/hooks/useAuthModal';
import {
  FiShield,
  FiFileText,
  FiTarget,
  FiClipboard,
  FiSearch,
  FiLayers,
  FiCheckCircle,
  FiTerminal,
  FiLock,
  FiMessageSquare,
  FiArrowUpRight,
  FiZap,
} from 'react-icons/fi';
import { FaGraduationCap, FaUsers, FaShieldAlt, FaRocket } from 'react-icons/fa';
import landingContent from '../../../data/static/landing.json';
import useRequestPentest from '../../../shared/hooks/useRequestPentest';
import { slugify } from '../../../shared/utils/display/slugify';
import PublicCardGrid from '../../../shared/components/public/PublicCardGrid';
import Button from '../../../shared/components/ui/Button';
import {
  publicBadge,
  publicBadgePulse,
  publicCard,
  publicCardDesc,
  publicCardMeta,
  publicCardTitle,
  publicChip,
  publicCtaCard,
  publicCtaInner,
  publicCtaSection,
  publicHeroActions,
  publicHeroDesc,
  publicHeroGrid,
  publicHeroKicker,
  publicHeroPanel,
  publicHeroSection,
  publicHeroStat,
  publicHeroStats,
  publicHeroTitle,
  publicList,
  publicListItem,
  publicPage,
  publicPill,
  publicSection,
} from '../../../shared/styles/publicClasses';

const Services = () => {
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  const { requestPentest, requestPentestModal } = useRequestPentest();

  const iconMap = useMemo(
    () => ({
      FiShield, FiFileText, FiTarget, FiClipboard,
      FiSearch, FiLayers, FiCheckCircle, FiTerminal,
      FiLock, FiMessageSquare, FaGraduationCap,
      FaUsers, FaShieldAlt, FaRocket,
    }),
    []
  );

  const services = landingContent.services.map((item) => ({
    ...item,
    icon: iconMap[item.icon],
  }));

  const heroTrust = landingContent.hero?.trust || [];
  const cta = landingContent.cta;
  const highlights = [
    'Evidence-driven reports mapped to remediation.',
    'Operator-led engagements with supervised delivery.',
    'Training programs backed by live pentest experience.',
    'Direct collaboration with your engineering teams.',
  ];

  const handleRoute = (route) => {
    if (route === '/corporate/pentest') { requestPentest(); return; }
    if (route) navigate(route);
  };

  return (
    <div className={`${publicPage} text-text-primary`}>
      {requestPentestModal}

      {/* ── HERO ─────────────────────────────────── */}
      <section className={`hero-section reveal-on-scroll ${publicHeroSection}`}>
        <div className={`section-container ${publicHeroGrid}`}>
          <div>
            <p className={publicHeroKicker}>
              <span className="eyebrow-dot" />
              HSOCIETY OFFSEC / Services
            </p>
            <h1 className={publicHeroTitle}>Security work that maps directly to fixes.</h1>
            <p className={publicHeroDesc}>
              Evidence-driven engagements with clear remediation playbooks. We
              run supervised pentests, red team operations, and operator-grade
              training for modern teams.
            </p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={requestPentest}
              >
                <FiZap size={14} />
                Request pentest
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="bg-transparent px-[1.1rem] text-[0.9rem]"
                onClick={() => openAuthModal('login')}
              >
                Join training cycle
                <FiArrowUpRight size={14} />
              </Button>
            </div>
          </div>
          <div className={publicHeroPanel}>
            <p className={`${publicBadge} ${publicBadgePulse}`}>Engagements / Open</p>
            <h3 className={publicCardTitle}>Why teams choose HSOCIETY OFFSEC</h3>
            <div className={publicList}>
              {highlights.map((item) => (
                <div key={item} className={publicListItem}>
                  <FiCheckCircle size={14} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className={publicHeroStats}>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">24h</strong> response
              </span>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">Global</strong> coverage
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CARDS ────────────────────────────────── */}
      <section className={`reveal-on-scroll ${publicSection}`}>
        <div className="section-container">
          <div className="section-header">
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Core services
            </p>
            <h2 className="section-title">Operator-led engagements.</h2>
            <p className="section-subtitle">
              Built to surface risk, validate impact, and accelerate remediation.
            </p>
          </div>
          <PublicCardGrid className="svc-card-grid">
            {services.map((service) => (
              <article
                key={service.title}
                className={`${publicCard} cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand`}
                onClick={() => navigate(`/services/${slugify(service.title)}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/services/${slugify(service.title)}`);
                  }
                }}
              >
                <div className={publicCardMeta}>
                  <span className={publicChip}>
                    {service.icon && <service.icon size={14} />}
                    {service.title}
                  </span>
                </div>
                <h3 className={publicCardTitle}>{service.title}</h3>
                <p className={publicCardDesc}>{service.description}</p>
                <div className={`${publicCardMeta} gap-2`}>
                  {service.features.map((f) => (
                    <span
                      key={f}
                      className={`${publicPill} bg-[color-mix(in_srgb,var(--primary-color)_10%,var(--bg-secondary))]`}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </PublicCardGrid>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className={`reveal-on-scroll ${publicCtaSection}`}>
        <div className={`section-container ${publicCtaInner}`}>
          <div>
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Ready to engage
            </p>
            <h2 className="section-title">
              {cta?.right?.title || 'Start a security engagement.'}
            </h2>
            <p className="section-subtitle">
              {cta?.right?.description || 'Talk to our team about your attack surface.'}
            </p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => handleRoute(cta?.right?.route || '/corporate/pentest')}
              >
                {cta?.right?.button || 'Request Pentest'}
                <FiArrowUpRight size={14} />
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="bg-transparent px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/contact')}
              >
                Talk to our team
              </Button>
            </div>
          </div>
          <div className={publicCtaCard}>
            <h3 className={publicCardTitle}>Security + training under one roof.</h3>
            <p className={publicCardDesc}>
              Move from assessment to remediation to upskilling without switching vendors.
            </p>
            <div className={publicCardMeta}>
              <span>Engagements</span>
              <span>Training</span>
              <span>Community</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
