/**
 * Service Detail Page
 * Location: src/features/services/ServiceDetail.jsx
 *
 * GitHub repo-page layout:
 *   page header (breadcrumb + actions) → two-column (main + sidebar)
 */

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthModal from '../../../shared/hooks/useAuthModal';
import landingContent from '../../../data/static/landing.json';
import '../styles/services.css';
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiCheckCircle,
  FiList,
  FiZap,
  FiMessageSquare,
} from 'react-icons/fi';

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();

  const services = landingContent.services || [];
  const service = services.find((item) => slugify(item.title) === slug);
  const serviceIndex = services.findIndex((item) => slugify(item.title) === slug);
  const prevService = serviceIndex > 0 ? services[serviceIndex - 1] : null;
  const nextService = serviceIndex < services.length - 1 ? services[serviceIndex + 1] : null;

  useEffect(() => {
    if (!service) navigate('/services', { replace: true });
  }, [navigate, service]);

  if (!service) return null;

  return (
    <div className="svc-detail-page">

      {/* ── PAGE HEADER ─────────────────────────────── */}
      <header className="svc-detail-page-header">
        <div className="svc-detail-page-header-inner">

          <div className="svc-detail-header-left">
            <div className="svc-detail-header-icon-wrap">
              <FiList size={20} className="svc-detail-header-icon" />
            </div>
            <div>
              <div className="svc-detail-header-breadcrumb">
                <button
                  className="svc-detail-breadcrumb-link"
                  onClick={() => navigate('/services')}
                >
                  services
                </button>
                <span className="svc-detail-breadcrumb-sep">/</span>
                <span className="svc-detail-breadcrumb-page">{service.title}</span>
              </div>
              <p className="svc-detail-header-desc">
                {service.description}
              </p>
            </div>
          </div>

          <div className="svc-detail-header-actions">
            <button
              className="svc-detail-btn svc-detail-btn-secondary"
              onClick={() => openAuthModal('register-corporate')}
            >
              Join training cycle
            </button>
            <button
              className="svc-detail-btn svc-detail-btn-primary"
              onClick={() => navigate('/contact')}
            >
              <FiZap size={14} />
              Talk to HSOCIETY
            </button>
          </div>
        </div>

        {/* Feature count pill */}
        <div className="svc-detail-header-meta">
          <span className="svc-detail-meta-pill">
            <FiCheckCircle size={13} className="svc-detail-meta-icon" />
            <span>{service.features.length} coverage areas</span>
          </span>
          <span className="svc-detail-meta-pill">
            <span className="svc-detail-meta-dot" />
            <span>Active service</span>
          </span>
        </div>
      </header>

      {/* ── TWO-COLUMN LAYOUT ───────────────────────── */}
      <div className="svc-detail-layout">

        {/* ── MAIN COLUMN ─────────────────────────── */}
        <main className="svc-detail-main">

          {/* Features section */}
          <section className="svc-detail-section">
            <h2 className="svc-detail-section-title">
              <FiList size={15} className="svc-detail-section-icon" />
              What we cover
            </h2>
            <p className="svc-detail-section-desc">
              Every engagement prioritises clarity, evidence, and immediate impact.
            </p>

            {/* Feature list — GitHub issue list style */}
            <div className="svc-detail-feature-list">
              {service.features.map((feature, i) => (
                <div key={feature} className="svc-detail-feature-item">
                  <span className="svc-detail-feature-num">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <FiCheckCircle size={14} className="svc-detail-feature-check" />
                  <p className="svc-detail-feature-text">{feature}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="svc-detail-divider" />

          {/* Pagination — prev / next service */}
          <section className="svc-detail-section svc-detail-nav-section">
            <h2 className="svc-detail-section-title">
              <FiArrowUpRight size={15} className="svc-detail-section-icon" />
              Other services
            </h2>
            <div className="svc-detail-nav">
              {prevService && (
                <button
                  className="svc-detail-nav-card"
                  onClick={() => navigate(`/services/${slugify(prevService.title)}`)}
                >
                  <FiArrowLeft size={13} className="svc-detail-nav-arrow" />
                  <div>
                    <span className="svc-detail-nav-label">Previous</span>
                    <span className="svc-detail-nav-title">{prevService.title}</span>
                  </div>
                </button>
              )}
              {nextService && (
                <button
                  className="svc-detail-nav-card"
                  onClick={() => navigate(`/services/${slugify(nextService.title)}`)}
                >
                  <div>
                    <span className="svc-detail-nav-label">Next</span>
                    <span className="svc-detail-nav-title">{nextService.title}</span>
                  </div>
                  <FiArrowUpRight size={13} className="svc-detail-nav-arrow" />
                </button>
              )}
            </div>
          </section>

        </main>

        {/* ── SIDEBAR ─────────────────────────────── */}
        <aside className="svc-detail-sidebar">

          {/* About this service */}
          <div className="svc-detail-sidebar-box">
            <h3 className="svc-detail-sidebar-heading">About this service</h3>
            <p className="svc-detail-sidebar-about">{service.description}</p>
            <div className="svc-detail-sidebar-divider" />
            <ul className="svc-detail-sidebar-list">
              <li>
                <FiCheckCircle size={13} className="svc-detail-sidebar-icon" />
                {service.features.length} defined coverage areas
              </li>
              <li>
                <FiCheckCircle size={13} className="svc-detail-sidebar-icon" />
                Evidence-based reporting
              </li>
              <li>
                <FiCheckCircle size={13} className="svc-detail-sidebar-icon" />
                Remediation-mapped findings
              </li>
            </ul>
          </div>

          {/* CTA box */}
          <div className="svc-detail-sidebar-box svc-detail-cta-box">
            <div className="svc-detail-cta-row">
              <span className="svc-detail-cta-dot" />
              <span className="svc-detail-cta-label">GET STARTED</span>
            </div>
            <strong className="svc-detail-cta-value">Engage now</strong>
            <p className="svc-detail-cta-note">
              Request an engagement or join the training cycle below.
            </p>
            <div className="svc-detail-cta-actions">
              <button
                className="svc-detail-btn svc-detail-btn-primary svc-detail-btn-full"
                onClick={() => navigate('/contact')}
              >
                <FiMessageSquare size={13} />
                Contact us
              </button>
              <button
                className="svc-detail-btn svc-detail-btn-secondary svc-detail-btn-full"
                onClick={() => openAuthModal('register-corporate')}
              >
                Join training
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="svc-detail-sidebar-box">
            <h3 className="svc-detail-sidebar-heading">Tags</h3>
            <div className="svc-detail-topics">
              {['offsec', 'pentesting', 'red-team', 'hsociety'].map((t) => (
                <span key={t} className="svc-detail-topic">{t}</span>
              ))}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
};

export default ServiceDetail;
