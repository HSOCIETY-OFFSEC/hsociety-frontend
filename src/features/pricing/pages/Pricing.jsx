/**
 * Pricing Page
 * Location: src/features/pricing/Pricing.jsx
 *
 * GitHub repo-page layout:
 *   page header (breadcrumb + meta) → two-column (main + sidebar)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthModal from '../../../shared/hooks/useAuthModal';
import {
  FiArrowUpRight,
  FiUsers,
  FiShield,
  FiZap,
  FiLock,
  FiFileText,
  FiCheck,
  FiStar,
  FiClock,
  FiGlobe,
  FiAward,
  FiInfo,
  FiCheckCircle,
  FiTag,
} from 'react-icons/fi';
import '../../public/styles/public-landing.css';
import '../styles/pricing.css';
import {
  PRICING_INCLUDED_ITEMS,
  PRICING_NOTE,
  PRICING_TIERS,
} from '../../../data/static/pricing/pricingData';

const TIER_ICONS = [
  <FiZap key="zap" size={16} />,
  <FiShield key="shield" size={16} />,
  <FiAward key="award" size={16} />,
  <FiGlobe key="globe" size={16} />,
];

const TRUST_ITEMS = [
  { icon: <FiShield   size={14} />, title: 'Evidence-First Reports', sub: 'Every finding is reproducible' },
  { icon: <FiLock     size={14} />, title: 'NDA by Default',         sub: 'Your data stays private'       },
  { icon: <FiClock    size={14} />, title: 'Fast Turnaround',        sub: 'Results in days, not weeks'    },
  { icon: <FiFileText size={14} />, title: 'Remediation Guidance',   sub: 'Step-by-step fix playbooks'    },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  const [annual, setAnnual] = useState(false);

  const featuredIndex =
    PRICING_TIERS.findIndex((t) => t.featured) !== -1
      ? PRICING_TIERS.findIndex((t) => t.featured)
      : Math.floor(PRICING_TIERS.length / 2);

  return (
    <div className="public-page public-page-inner pri-page">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero-section public-hero reveal-on-scroll">
        <div className="section-container">
          <div>
            <p className="public-hero-kicker">
              <span className="eyebrow-dot" />
              HSOCIETY / Pricing
            </p>
            <h1 className="public-hero-title">Engagement tiers built for real-world risk.</h1>
            <p className="public-hero-desc">
              Security engagements that scale with your risk posture and engineering capacity.
            </p>
            <div className="public-hero-actions">
              <button
                className="public-btn public-btn--primary"
                onClick={() => navigate('/contact')}
              >
                Talk to our team
                <FiArrowUpRight size={14} />
              </button>
              <button
                className="public-btn public-btn--ghost"
                onClick={() => openAuthModal('login')}
              >
                Corporate account
              </button>
            </div>
          </div>
          <div className="public-hero-panel">
            <p className="public-badge">Billing toggle</p>
            <div className="pri-toggle-wrap">
              <span className="pri-toggle-label">Monthly</span>
              <button
                className={`pri-toggle-track${annual ? ' is-on' : ''}`}
                onClick={() => setAnnual((v) => !v)}
                aria-pressed={annual}
                aria-label="Toggle annual billing"
              >
                <span className="pri-toggle-thumb" />
              </button>
              <span className="pri-toggle-label">Annual</span>
              {annual && <span className="pri-toggle-badge">Save 20%</span>}
            </div>
            <div className="public-pill-row">
              {TRUST_ITEMS.map((t) => (
                <span key={t.title} className="public-pill">
                  {t.icon}
                  {t.title}
                </span>
              ))}
            </div>
            <div className="public-hero-stats">
              <span className="public-hero-stat">
                <strong>24/7</strong> support
              </span>
              <span className="public-hero-stat">
                <strong>Global</strong> coverage
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
              Engagement tiers
            </p>
            <h2 className="section-title">Pick the intensity that matches your mission.</h2>
            <p className="section-subtitle">
              Every plan includes evidence-first reporting and remediation guidance.
            </p>
          </div>
          <div className="pri-tier-grid">
            {PRICING_TIERS.map((tier, i) => {
              const isFeatured = i === featuredIndex;
              return (
                <article
                  key={tier.title}
                  className={`pri-tier-card${isFeatured ? ' pri-tier-card--featured' : ''}`}
                >
                  <div className="pri-tier-header">
                    <div className="pri-tier-header-left">
                      <span className="pri-tier-icon">
                        {TIER_ICONS[i] ?? <FiShield size={16} />}
                      </span>
                      <div>
                        <p className="pri-tier-name">{tier.title}</p>
                        {tier.subtitle && (
                          <p className="pri-tier-subtitle">{tier.subtitle}</p>
                        )}
                      </div>
                    </div>
                    <div className="pri-tier-price-block">
                      <span className="pri-tier-price">{tier.price}</span>
                      {tier.priceUnit && (
                        <span className="pri-tier-price-unit">{tier.priceUnit}</span>
                      )}
                      {isFeatured && (
                        <span className="pri-label pri-label-alpha">Popular</span>
                      )}
                    </div>
                  </div>

                  <p className="pri-tier-details">{tier.details}</p>

                  {Array.isArray(tier.features) && tier.features.length > 0 && (
                    <ul className="pri-tier-features">
                      {tier.features.map((f) => (
                        <li key={f}>
                          <FiCheck size={12} className="pri-tier-check" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="pri-tier-footer">
                    <button
                      className={`public-btn${isFeatured ? ' public-btn--primary' : ''}`}
                      onClick={() =>
                        isFeatured
                          ? navigate('/contact')
                          : openAuthModal('login')
                      }
                    >
                      {isFeatured ? 'Talk to our team' : 'Get started'}
                      <FiArrowUpRight size={13} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CARDS ────────────────────────────────── */}
      <section className="public-section reveal-on-scroll">
        <div className="section-container">
          <div className="section-header">
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Included
            </p>
            <h2 className="section-title">Included in every engagement.</h2>
            <p className="section-subtitle">{PRICING_NOTE}</p>
          </div>
          <div className="public-card-grid">
            {PRICING_INCLUDED_ITEMS.map((item) => (
              <article key={item} className="public-card">
                <div className="public-card-meta">
                  <span className="public-chip">Deliverable</span>
                </div>
                <p className="public-card-desc">{item}</p>
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
              Not sure which plan fits?
            </p>
            <h2 className="section-title">Talk to our security team.</h2>
            <p className="section-subtitle">
              We'll scope the right engagement for your risk posture, timeline, and budget.
            </p>
            <div className="public-hero-actions">
              <button
                className="public-btn public-btn--primary"
                onClick={() => navigate('/contact')}
              >
                Contact security team
                <FiArrowUpRight size={13} />
              </button>
              <button
                className="public-btn public-btn--ghost"
                onClick={() => openAuthModal('login')}
              >
                Corporate account
              </button>
            </div>
          </div>
          <div className="public-cta-card">
            <h3 className="public-card-title">Engagements open</h3>
            <p className="public-card-desc">
              Accepting new clients. SLA-backed delivery and clear remediation paths.
            </p>
            <div className="public-card-meta">
              <span><FiShield size={12} /> Evidence-first</span>
              <span><FiClock size={12} /> 48h kickoff</span>
              <span><FiFileText size={12} /> Clear playbooks</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
