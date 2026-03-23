import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthModal from '../../../shared/hooks/useAuthModal';
import landingContent from '../../../data/static/landing.json';
import '../../public/styles/public-landing.css';
import '../styles/services.css';
import {
  FiArrowUpRight,
  FiCheckCircle,
  FiZap,
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
    <div className="public-page public-page-inner svc-detail-page">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero-section public-hero reveal-on-scroll">
        <div className="section-container">
          <div>
            <p className="public-hero-kicker">
              <span className="eyebrow-dot" />
              HSOCIETY / Services
            </p>
            <h1 className="public-hero-title">{service.title}</h1>
            <p className="public-hero-desc">{service.description}</p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={() => navigate('/contact')}>
                <FiZap size={14} />
                Talk to HSOCIETY
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => openAuthModal('login')}>
                Join training cycle
              </button>
            </div>
            <div className="public-pill-row">
              <span className="public-pill">
                <FiCheckCircle size={12} />
                {service.features.length} coverage areas
              </span>
              <span className="public-pill">Active service</span>
            </div>
          </div>
          <div className="public-hero-panel">
            <p className="public-badge">Coverage summary</p>
            <div className="public-list">
              {service.features.slice(0, 4).map((item) => (
                <div key={item} className="public-list-item">
                  <FiCheckCircle size={14} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="public-hero-stats">
              <span className="public-hero-stat">
                <strong>{service.features.length}</strong> controls
              </span>
              <span className="public-hero-stat">
                <strong>Rapid</strong> reporting
              </span>
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
              What we cover
            </p>
            <h2 className="section-title">Evidence-driven coverage areas.</h2>
            <p className="section-subtitle">Every engagement prioritizes clarity, evidence, and impact.</p>
          </div>
          <div className="public-card-grid">
            {service.features.map((feature) => (
              <article key={feature} className="public-card">
                <h3 className="public-card-title">{feature}</h3>
                <p className="public-card-desc">Operator-led coverage with remediation guidance.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CARDS ────────────────────────────────── */}
      <section className="public-section reveal-on-scroll">
        <div className="section-container">
          <div className="section-header">
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Explore more
            </p>
            <h2 className="section-title">Related services</h2>
            <p className="section-subtitle">Jump to another service or go back to the catalog.</p>
          </div>
          <div className="public-card-grid">
            {prevService && (
              <article
                className="public-card svc-nav-card interactive-card"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/services/${slugify(prevService.title)}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/services/${slugify(prevService.title)}`);
                  }
                }}
                aria-label={`View service ${prevService.title}`}
              >
                <p className="public-card-meta">Previous service</p>
                <h3 className="public-card-title">{prevService.title}</h3>
                <p className="public-card-desc">{prevService.description}</p>
              </article>
            )}
            {nextService && (
              <article
                className="public-card svc-nav-card interactive-card"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/services/${slugify(nextService.title)}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/services/${slugify(nextService.title)}`);
                  }
                }}
                aria-label={`View service ${nextService.title}`}
              >
                <p className="public-card-meta">Next service</p>
                <h3 className="public-card-title">{nextService.title}</h3>
                <p className="public-card-desc">{nextService.description}</p>
              </article>
            )}
            <article
              className="public-card svc-nav-card interactive-card"
              role="button"
              tabIndex={0}
              onClick={() => navigate('/services')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/services');
                }
              }}
              aria-label="View all services"
            >
              <p className="public-card-meta">All services</p>
              <h3 className="public-card-title">Service catalog</h3>
              <p className="public-card-desc">Browse all HSOCIETY offerings.</p>
            </article>
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
            <h2 className="section-title">Start a security engagement.</h2>
            <p className="section-subtitle">Talk to our team about your attack surface and goals.</p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={() => navigate('/contact')}>
                Book a call
                <FiArrowUpRight size={14} />
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/pricing')}>
                View pricing
              </button>
            </div>
          </div>
          <div className="public-cta-card">
            <h3 className="public-card-title">Operator-led delivery.</h3>
            <p className="public-card-desc">Supervised pentests, clear findings, and remediation mapping.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
