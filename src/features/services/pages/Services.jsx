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

  const handleRoute = (route) => {
    if (route === '/corporate/pentest') { requestPentest(); return; }
    if (route) navigate(route);
  };

  return (
    <div className="svc-page">
      {requestPentestModal}

      {/* ── PAGE HEADER ─────────────────────────────── */}
      <header className="svc-page-header">
        <div className="svc-page-header-inner">

          <div className="svc-header-left">
            <div className="svc-header-icon-wrap">
              <FiShield size={20} className="svc-header-icon" />
            </div>
            <div>
              <div className="svc-header-breadcrumb">
                <span className="svc-breadcrumb-org">HSOCIETY</span>
                <span className="svc-breadcrumb-sep">/</span>
                <span className="svc-breadcrumb-page">services</span>
                <span className="svc-header-visibility">Public</span>
              </div>
              <p className="svc-header-desc">
                Evidence-driven security work with reporting that maps directly to fixes.
              </p>
            </div>
          </div>

          <div className="svc-header-actions">
            <button
              className="svc-btn svc-btn-secondary"
              onClick={() => openAuthModal('login')}
            >
              Join training cycle
            </button>
            <button
              className="svc-btn svc-btn-primary"
              onClick={requestPentest}
            >
              <FiZap size={14} />
              Request pentest
            </button>
          </div>
        </div>

        {/* Trust pills row */}
        <div className="svc-header-meta">
          {heroTrust.map((item) => (
            <span key={item} className="svc-meta-pill">
              <span className="svc-meta-dot" />
              {item}
            </span>
          ))}
        </div>
      </header>

      {/* ── TWO-COLUMN LAYOUT ───────────────────────── */}
      <div className="svc-layout">

        {/* ── MAIN COLUMN ─────────────────────────── */}
        <main className="svc-main">

          {/* Section: services list */}
          <section className="svc-section">
            <h2 className="svc-section-title">
              <FiLayers size={15} className="svc-section-icon" />
              Core services
            </h2>
            <p className="svc-section-desc">
              Built to surface risk, validate impact, and accelerate remediation.
            </p>

            <div className="svc-card-list">
              {services.map((service) => (
                <article
                  key={service.title}
                  className="svc-card"
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
                  {/* Card header */}
                  <div className="svc-card-header">
                    <div className="svc-card-header-left">
                      <span className="svc-card-icon">
                        {service.icon && <service.icon size={16} />}
                      </span>
                      <h3 className="svc-card-title">{service.title}</h3>
                    </div>
                    <FiArrowUpRight size={14} className="svc-card-arrow" />
                  </div>

                  {/* Description */}
                  <p className="svc-card-desc">{service.description}</p>

                  {/* Feature tags — GitHub topic tags */}
                  <div className="svc-card-footer">
                    {service.features.map((f) => (
                      <span key={f} className="svc-tag">{f}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="svc-divider" />

          {/* CTA section */}
          <section className="svc-section svc-cta-section">
            <div className="svc-cta-body">
              <p className="svc-cta-eyebrow">
                <FiCheckCircle size={13} />
                Ready to engage
              </p>
              <h2 className="svc-cta-title">
                {cta?.right?.title || 'Start a security engagement.'}
              </h2>
              <p className="svc-cta-desc">
                {cta?.right?.description || 'Talk to our team about your attack surface.'}
              </p>
              <button
                className="svc-btn svc-btn-primary"
                onClick={() => handleRoute(cta?.right?.route || '/corporate/pentest')}
              >
                {cta?.right?.button || 'Request Pentest'}
                <FiArrowUpRight size={14} />
              </button>
            </div>
          </section>

        </main>

        {/* ── SIDEBAR ─────────────────────────────── */}
        <aside className="svc-sidebar">

          {/* About */}
          <div className="svc-sidebar-box">
            <h3 className="svc-sidebar-heading">About</h3>
            <p className="svc-sidebar-about">
              HSOCIETY delivers offensive security services: penetration tests, red team
              operations, and training engagements for real-world risk reduction.
            </p>
            <div className="svc-sidebar-divider" />
            <ul className="svc-sidebar-list">
              <li><FiCheckCircle size={13} className="svc-sidebar-icon" />Evidence-driven reports</li>
              <li><FiCheckCircle size={13} className="svc-sidebar-icon" />Direct remediation mapping</li>
              <li><FiCheckCircle size={13} className="svc-sidebar-icon" />Supervised pentest engagements</li>
              <li><FiCheckCircle size={13} className="svc-sidebar-icon" />Beginner-to-advanced training</li>
            </ul>
          </div>

          {/* Status box */}
          <div className="svc-sidebar-box svc-status-box">
            <div className="svc-status-row">
              <span className="svc-status-dot" />
              <span className="svc-status-label">ENGAGEMENTS</span>
            </div>
            <strong className="svc-status-value">OPEN</strong>
            <div className="svc-status-track">
              <div className="svc-status-fill" />
            </div>
            <p className="svc-status-note">
              Accepting new clients. SLA-backed delivery.
            </p>
          </div>

          {/* Topics */}
          <div className="svc-sidebar-box">
            <h3 className="svc-sidebar-heading">Topics</h3>
            <div className="svc-topics">
              {['pentesting', 'red-team', 'offsec', 'training', 'vulnerability', 'remediation'].map(
                (t) => <span key={t} className="svc-topic">{t}</span>
              )}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
};

export default Services;