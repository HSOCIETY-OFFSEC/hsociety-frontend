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
    <div className="pri-page">

      {/* ── PAGE HEADER ─────────────────────────────── */}
      <header className="pri-page-header">
        <div className="pri-page-header-inner">
          <div className="pri-header-left">
            <div className="pri-header-icon-wrap">
              <FiTag size={20} className="pri-header-icon" />
            </div>
            <div>
              <div className="pri-header-breadcrumb">
                <span className="pri-breadcrumb-org">HSOCIETY</span>
                <span className="pri-breadcrumb-sep">/</span>
                <span className="pri-breadcrumb-page">pricing</span>
                <span className="pri-header-visibility">Public</span>
              </div>
              <p className="pri-header-desc">
                Security engagements that scale with your risk posture and
                engineering capacity.
              </p>
            </div>
          </div>

          {/* Billing toggle in header actions */}
          <div className="pri-header-actions">
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
          </div>
        </div>

        {/* Trust stat pills */}
        <div className="pri-header-meta">
          {TRUST_ITEMS.map((t) => (
            <span key={t.title} className="pri-meta-pill">
              {t.icon}
              <span className="pri-meta-label">{t.title}</span>
            </span>
          ))}
        </div>
      </header>

      {/* ── TWO-COLUMN LAYOUT ───────────────────────── */}
      <div className="pri-layout">

        {/* ── MAIN COLUMN ─────────────────────────── */}
        <main className="pri-main">

          {/* Pricing tiers list */}
          <section className="pri-section">
            <h2 className="pri-section-title">
              <FiTag size={15} className="pri-section-icon" />
              Engagement tiers
            </h2>
            <p className="pri-section-desc">
              Every plan includes evidence-first reporting and remediation
              guidance.
            </p>

            <div className="pri-tier-list">
              {PRICING_TIERS.map((tier, i) => {
                const isFeatured = i === featuredIndex;
                return (
                  <article
                    key={tier.title}
                    className={`pri-tier-card${isFeatured ? ' pri-tier-card--featured' : ''}`}
                  >
                    {/* Card header */}
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

                    {/* Details */}
                    <p className="pri-tier-details">{tier.details}</p>

                    {/* Features */}
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

                    {/* CTA */}
                    <div className="pri-tier-footer">
                      <button
                        className={`pri-btn${isFeatured ? ' pri-btn-primary' : ' pri-btn-secondary'}`}
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
          </section>

          <div className="pri-divider" />

          {/* What's included */}
          <section className="pri-section">
            <h2 className="pri-section-title">
              <FiStar size={15} className="pri-section-icon" />
              Included in every engagement
            </h2>
            <p className="pri-section-desc">
              Regardless of tier, every client receives the same rigorous
              standard of work.
            </p>

            <div className="pri-included-grid">
              {PRICING_INCLUDED_ITEMS.map((item) => (
                <div key={item} className="pri-included-item">
                  <FiCheckCircle size={13} className="pri-included-check" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="pri-divider" />

          {/* CTA section */}
          <section className="pri-section pri-cta-section">
            <p className="pri-cta-eyebrow">
              <FiUsers size={13} />
              Not sure which plan fits?
            </p>
            <h2 className="pri-cta-title">
              Talk to our security team.
            </h2>
            <p className="pri-cta-desc">
              We'll scope the right engagement for your risk posture, timeline,
              and budget. No sales pressure.
            </p>
            <div className="pri-cta-actions">
              <button
                className="pri-btn pri-btn-primary"
                onClick={() => navigate('/contact')}
              >
                Contact security team
                <FiArrowUpRight size={13} />
              </button>
              <button
                className="pri-btn pri-btn-secondary"
                onClick={() => openAuthModal('login')}
              >
                <FiUsers size={13} />
                Corporate account
              </button>
            </div>
          </section>

        </main>

        {/* ── SIDEBAR ─────────────────────────────── */}
        <aside className="pri-sidebar">

          {/* Note box */}
          {PRICING_NOTE && (
            <div className="pri-sidebar-box pri-note-box">
              <div className="pri-note-row">
                <FiInfo size={14} className="pri-note-icon" />
                <span className="pri-sidebar-heading">Note</span>
              </div>
              <p className="pri-sidebar-about">{PRICING_NOTE}</p>
            </div>
          )}

          {/* Trust box */}
          <div className="pri-sidebar-box">
            <h3 className="pri-sidebar-heading">Trust signals</h3>
            <div className="pri-sidebar-divider" />
            <ul className="pri-sidebar-list">
              {TRUST_ITEMS.map((t) => (
                <li key={t.title}>
                  <span className="pri-sidebar-trust-icon">{t.icon}</span>
                  <div>
                    <strong className="pri-sidebar-trust-title">{t.title}</strong>
                    <span className="pri-sidebar-trust-sub">{t.sub}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Status box */}
          <div className="pri-sidebar-box pri-status-box">
            <div className="pri-status-row">
              <span className="pri-status-dot" />
              <span className="pri-status-label">ENGAGEMENTS</span>
            </div>
            <strong className="pri-status-value">OPEN</strong>
            <div className="pri-status-track">
              <div className="pri-status-fill" />
            </div>
            <p className="pri-status-note">
              Accepting new clients. SLA-backed delivery.
            </p>
          </div>

          {/* Topics */}
          <div className="pri-sidebar-box">
            <h3 className="pri-sidebar-heading">Topics</h3>
            <div className="pri-topics">
              {['pricing', 'pentesting', 'offsec', 'enterprise', 'sla', 'remediation'].map(
                (t) => <span key={t} className="pri-topic">{t}</span>
              )}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
};

export default Pricing;
