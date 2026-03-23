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
import '../../public/styles/public-landing.css';
import '../styles/services.css';

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
    <div className="landing-page public-page svc-page">
      {requestPentestModal}

      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero-section public-hero reveal-on-scroll">
        <div className="section-container">
          <div>
            <p className="public-hero-kicker">
              <span className="eyebrow-dot" />
              HSOCIETY / Services
            </p>
            <h1 className="public-hero-title">Security work that maps directly to fixes.</h1>
            <p className="public-hero-desc">
              Evidence-driven engagements with clear remediation playbooks. We
              run supervised pentests, red team operations, and operator-grade
              training for modern teams.
            </p>
            <div className="public-hero-actions">
              <button
                className="public-btn public-btn--primary"
                onClick={requestPentest}
              >
                <FiZap size={14} />
                Request pentest
              </button>
              <button
                className="public-btn public-btn--ghost"
                onClick={() => openAuthModal('login')}
              >
                Join training cycle
                <FiArrowUpRight size={14} />
              </button>
            </div>
            <div className="public-pill-row">
              {heroTrust.map((item) => (
                <span key={item} className="public-pill">{item}</span>
              ))}
            </div>
          </div>
          <div className="public-hero-panel">
            <p className="public-badge">Engagements / Open</p>
            <h3 className="public-card-title">Why teams choose HSOCIETY</h3>
            <div className="public-list">
              {highlights.map((item) => (
                <div key={item} className="public-list-item">
                  <FiCheckCircle size={14} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CARDS ────────────────────────────────── */}
      <section className="public-section reveal-on-scroll">
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
          <div className="public-card-grid svc-card-grid">
            {services.map((service) => (
              <article
                key={service.title}
                className="public-card svc-card"
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
                <div className="public-card-meta">
                  <span className="public-chip">
                    {service.icon && <service.icon size={14} />}
                    {service.title}
                  </span>
                </div>
                <h3 className="public-card-title">{service.title}</h3>
                <p className="public-card-desc">{service.description}</p>
                <div className="public-card-meta svc-tags">
                  {service.features.map((f) => (
                    <span key={f} className="public-pill">{f}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className="public-cta reveal-on-scroll">
        <div className="section-container public-cta-inner">
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
            <div className="public-hero-actions">
              <button
                className="public-btn public-btn--primary"
                onClick={() => handleRoute(cta?.right?.route || '/corporate/pentest')}
              >
                {cta?.right?.button || 'Request Pentest'}
                <FiArrowUpRight size={14} />
              </button>
              <button
                className="public-btn public-btn--ghost"
                onClick={() => navigate('/contact')}
              >
                Talk to our team
              </button>
            </div>
          </div>
          <div className="public-cta-card">
            <h3 className="public-card-title">Security + training under one roof.</h3>
            <p className="public-card-desc">
              Move from assessment to remediation to upskilling without switching vendors.
            </p>
            <div className="public-card-meta">
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
