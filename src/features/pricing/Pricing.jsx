/**
 * Pricing Page Component — Precision Security Aesthetic
 * Location: src/pages/Pricing.jsx  (or wherever your original lives)
 *
 * Drop-in replacement — preserves all original data imports & hooks.
 * Icons: react-icons/fi (already used) + a tiny inline SVG check.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthModal from '../../shared/hooks/useAuthModal';
import {
  FiArrowRight,
  FiUsers,
  FiShield,
  FiZap,
  FiLock,
  FiFileText,
  FiInfo,
  FiCheck,
  FiStar,
  FiClock,
  FiGlobe,
  FiAward,
} from 'react-icons/fi';
import Button from '../../shared/components/ui/Button';
import {
  PRICING_INCLUDED_ITEMS,
  PRICING_NOTE,
  PRICING_TIERS,
} from '../../data/pricing/pricingData';
import '../../styles/sections/pricing/index.css';

/* ─── icon map — assign an icon to each tier by index ─── */
const TIER_ICONS = [
  <FiZap size={18} strokeWidth={1.75} />,
  <FiShield size={18} strokeWidth={1.75} />,
  <FiAward size={18} strokeWidth={1.75} />,
  <FiGlobe size={18} strokeWidth={1.75} />,
];

/* ─── trust strip data ──────────────────────────────────── */
const TRUST_ITEMS = [
  {
    icon: <FiShield size={18} strokeWidth={1.75} />,
    title: 'Evidence-First Reports',
    sub: 'Every finding is reproducible',
  },
  {
    icon: <FiLock size={18} strokeWidth={1.75} />,
    title: 'NDA by Default',
    sub: 'Your data stays private',
  },
  {
    icon: <FiClock size={18} strokeWidth={1.75} />,
    title: 'Fast Turnaround',
    sub: 'Results in days, not weeks',
  },
  {
    icon: <FiFileText size={18} strokeWidth={1.75} />,
    title: 'Remediation Guidance',
    sub: 'Step-by-step fix playbooks',
  },
];

/* ─── inline checkmark SVG ──────────────────────────────── */
const CheckIcon = () => (
  <span className="pricing-check-icon" aria-hidden="true">
    <FiCheck size={10} strokeWidth={3} />
  </span>
);

const FeatureCheck = () => (
  <span className="pricing-feature-check" aria-hidden="true">
    <FiCheck size={9} strokeWidth={3} />
  </span>
);

/* ─── scroll-reveal hook ────────────────────────────────── */
function useReveal(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll('.reveal-on-scroll');
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.07 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
}

/* ─── component ─────────────────────────────────────────── */
const Pricing = () => {
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  const pageRef = useRef(null);
  const [annual, setAnnual] = useState(false);

  useReveal(pageRef);

  /* Figure out which tier is "featured" (middle tier or marked) */
  const featuredIndex =
    PRICING_TIERS.findIndex((t) => t.featured) !== -1
      ? PRICING_TIERS.findIndex((t) => t.featured)
      : Math.floor(PRICING_TIERS.length / 2);

  return (
    <div className="pricing-page" ref={pageRef}>

      {/* ── HERO ──────────────────────────────────────────── */}
      <header className="pricing-hero reveal-on-scroll">
        <p className="pricing-kicker">Pricing &amp; Engagements</p>

        <h1>
          Security engagements that{' '}
          <em>scale with you</em>
        </h1>

        <p className="pricing-hero-sub">
          Choose a model based on your current risk posture and engineering
          capacity. Every plan includes evidence-first reporting and
          remediation guidance.
        </p>

        {/* Billing toggle */}
        <div className="pricing-toggle">
          <span className="pricing-toggle-label">Monthly</span>
          <button
            className={`pricing-toggle-track${annual ? ' active' : ''}`}
            onClick={() => setAnnual((v) => !v)}
            aria-pressed={annual}
            aria-label="Toggle annual billing"
          >
            <span className="pricing-toggle-thumb" />
          </button>
          <span className="pricing-toggle-label">Annual</span>
          {annual && <span className="pricing-toggle-badge">Save 20%</span>}
        </div>
      </header>

      {/* ── PRICING CARDS ─────────────────────────────────── */}
      <section
        className="pricing-grid reveal-on-scroll"
        aria-label="Pricing tiers"
        style={{ '--reveal-delay': '60ms' }}
      >
        {PRICING_TIERS.map((tier, i) => {
          const isFeatured = i === featuredIndex;
          return (
            <article
              key={tier.title}
              className={`pricing-card${isFeatured ? ' pricing-card--featured' : ''}`}
            >
              {isFeatured && (
                <span className="pricing-featured-badge" aria-label="Most popular plan">
                  Most popular
                </span>
              )}

              <div className="pricing-card-header">
                <div className="pricing-card-icon" aria-hidden="true">
                  {TIER_ICONS[i] ?? <FiShield size={18} strokeWidth={1.75} />}
                </div>
                <p className="pricing-card-name">{tier.title}</p>
                {tier.subtitle && (
                  <p className="pricing-card-title">{tier.subtitle}</p>
                )}

                <div className="pricing-value-block">
                  <span className="pricing-value">{tier.price}</span>
                  {tier.priceUnit && (
                    <span className="pricing-value-unit">{tier.priceUnit}</span>
                  )}
                </div>

                <p className="pricing-card-details">{tier.details}</p>
              </div>

              {/* Features list — uses tier.features if available */}
              {Array.isArray(tier.features) && tier.features.length > 0 && (
                <ul
                  className="pricing-card-features"
                  aria-label={`${tier.title} features`}
                >
                  {tier.features.map((f) => (
                    <li key={f}>
                      <FeatureCheck />
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              <button
                className="pricing-card-cta"
                onClick={() =>
                  isFeatured
                    ? navigate('/contact')
                    : openAuthModal('register-corporate')
                }
              >
                {isFeatured ? 'Talk to our team' : 'Get started'}
                <FiArrowRight size={15} strokeWidth={2} />
              </button>
            </article>
          );
        })}
      </section>

      {/* ── NOTE ──────────────────────────────────────────── */}
      <div
        className="pricing-note-wrap reveal-on-scroll"
        style={{ '--reveal-delay': '40ms' }}
      >
        <p className="pricing-note">
          <FiInfo
            className="pricing-note-icon"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          {PRICING_NOTE}
        </p>
      </div>

      {/* ── TRUST STRIP ───────────────────────────────────── */}
      <div
        className="pricing-trust reveal-on-scroll"
        style={{ '--reveal-delay': '60ms' }}
        aria-label="Trust indicators"
      >
        {TRUST_ITEMS.map((item) => (
          <div className="pricing-trust-item" key={item.title}>
            <span className="pricing-trust-item-icon" aria-hidden="true">
              {item.icon}
            </span>
            <div className="pricing-trust-item-text">
              <span className="pricing-trust-item-title">{item.title}</span>
              <span className="pricing-trust-item-sub">{item.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── INCLUDED SECTION ──────────────────────────────── */}
      <section
        className="pricing-included reveal-on-scroll"
        aria-label="What's included"
        style={{ '--reveal-delay': '40ms' }}
      >
        <div className="pricing-included-inner">
          <div className="pricing-included-header">
            <div className="pricing-included-icon" aria-hidden="true">
              <FiStar size={18} strokeWidth={1.75} />
            </div>
            <h2>What&apos;s included in every engagement</h2>
          </div>

          <p className="pricing-included-sub">
            Regardless of tier, every client receives the same rigorous
            standard of work.
          </p>

          <ul
            className="pricing-included-list"
            aria-label="Included features"
          >
            {PRICING_INCLUDED_ITEMS.map((item) => (
              <li key={item}>
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── DIVIDER ───────────────────────────────────────── */}
      <div className="pricing-divider reveal-on-scroll">
        <span>Ready to get started?</span>
      </div>

      {/* ── CTA SECTION ───────────────────────────────────── */}
      <section
        className="pricing-actions-section reveal-on-scroll"
        aria-label="Call to action"
        style={{ '--reveal-delay': '60ms' }}
      >
        <div className="pricing-actions-inner">
          <h2 className="pricing-actions-title">
            Not sure which plan fits?
          </h2>
          <p className="pricing-actions-sub">
            Talk to our security team — we'll scope the right engagement for
            your risk posture, timeline, and budget. No sales pressure.
          </p>

          <div className="pricing-actions">
            <Button
              variant="primary"
              size="large"
              onClick={() => navigate('/contact')}
            >
              Talk to Security Team <FiArrowRight size={16} />
            </Button>
            <Button
              variant="ghost"
              size="large"
              onClick={() => openAuthModal('register-corporate')}
            >
              Create Corporate Account <FiUsers size={16} />
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Pricing;