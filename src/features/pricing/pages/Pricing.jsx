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
  FiShield,
  FiZap,
  FiLock,
  FiFileText,
  FiCheck,
  FiClock,
  FiGlobe,
  FiAward,
} from 'react-icons/fi';
import PublicCardGrid from '../../../shared/components/public/PublicCardGrid';
import Button from '../../../shared/components/ui/Button';
import {
  publicBadge,
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
  publicPage,
  publicPill,
  publicPillRow,
  publicSection,
  publicButtonBase,
  publicButtonGhost,
  publicButtonPrimary,
  publicButtonSmall,
} from '../../../shared/styles/publicClasses';
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
    <div className={`${publicPage} text-text-primary`}>
      {/* ── HERO ─────────────────────────────────── */}
      <section className={`hero-section reveal-on-scroll ${publicHeroSection}`}>
        <div className={`section-container ${publicHeroGrid}`}>
          <div>
            <p className={publicHeroKicker}>
              <span className="eyebrow-dot" />
              HSOCIETY OFFSEC / Pricing
            </p>
            <h1 className={publicHeroTitle}>Engagement tiers built for real-world risk.</h1>
            <p className={publicHeroDesc}>
              Security engagements that scale with your risk posture and engineering capacity.
            </p>
            <div className={publicHeroActions}>
              <Button size="small" onClick={() => navigate('/contact')}>
                Talk to our team
                <FiArrowUpRight size={14} />
              </Button>
              <button
                className={`${publicButtonBase} ${publicButtonSmall} ${publicButtonGhost}`}
                onClick={() => openAuthModal('login')}
                type="button"
              >
                Corporate account
              </button>
            </div>
          </div>
          <div className={publicHeroPanel}>
            <div className="hs-signature" aria-hidden="true" />
            <p className={publicBadge}>Billing toggle</p>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-secondary px-3 py-2">
              <span className="text-[0.7rem] uppercase tracking-[0.15em] text-text-tertiary">
                Monthly
              </span>
              <button
                className={[
                  'inline-flex h-6 w-12 items-center rounded-full border border-border bg-bg-primary p-[2px] transition-colors',
                  annual
                    ? 'justify-end bg-[color-mix(in_srgb,var(--primary-color)_16%,var(--bg-secondary))]'
                    : 'justify-start',
                ].join(' ')}
                onClick={() => setAnnual((v) => !v)}
                aria-pressed={annual}
                aria-label="Toggle annual billing"
                type="button"
              >
                <span className="h-[18px] w-[18px] rounded-full bg-brand" />
              </button>
              <span className="text-[0.7rem] uppercase tracking-[0.15em] text-text-tertiary">
                Annual
              </span>
              {annual && <span className="text-[0.7rem] font-semibold text-brand">Save 20%</span>}
            </div>
            <div className={publicPillRow}>
              {TRUST_ITEMS.map((t) => (
                <span key={t.title} className={publicPill}>
                  {t.icon}
                  {t.title}
                </span>
              ))}
            </div>
            <div className={publicHeroStats}>
              <span className={publicHeroStat}>
                <strong>24/7</strong> support
              </span>
              <span className={publicHeroStat}>
                <strong>Global</strong> coverage
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
              Engagement tiers
            </p>
            <h2 className="section-title">Pick the intensity that matches your mission.</h2>
            <p className="section-subtitle">
              Every plan includes evidence-first reporting and remediation guidance.
            </p>
          </div>
          <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
            {PRICING_TIERS.map((tier, i) => {
              const isFeatured = i === featuredIndex;
              return (
                <article
                  key={tier.title}
                  className={[
                    'grid gap-4 rounded-lg border border-border bg-bg-secondary p-6',
                    isFeatured
                      ? 'border-[color-mix(in_srgb,var(--primary-color)_40%,var(--border-color))] shadow-md'
                      : '',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-[color-mix(in_srgb,var(--primary-color)_15%,var(--bg-secondary))] text-brand">
                        {TIER_ICONS[i] ?? <FiShield size={16} />}
                      </span>
                      <div>
                        <p className="m-0 font-semibold text-text-primary">{tier.title}</p>
                        {tier.subtitle && (
                          <p className="m-0 text-[0.85rem] text-text-tertiary">{tier.subtitle}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[1.4rem] font-semibold">{tier.price}</span>
                      {tier.priceUnit && (
                        <span className="block text-[0.75rem] text-text-tertiary">{tier.priceUnit}</span>
                      )}
                      {isFeatured && (
                        <span className="mt-2 inline-flex items-center rounded-full bg-[color-mix(in_srgb,var(--primary-color)_20%,var(--bg-secondary))] px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-brand">
                          Popular
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="m-0 text-text-secondary">{tier.details}</p>

                  {Array.isArray(tier.features) && tier.features.length > 0 && (
                    <ul className="grid gap-2 text-text-secondary">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <FiCheck size={12} className="mt-0.5 text-brand" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex">
                    {isFeatured ? (
                      <Button size="small" onClick={() => navigate('/contact')}>
                        Talk to our team
                        <FiArrowUpRight size={13} />
                      </Button>
                    ) : (
                      <button
                        className={`${publicButtonBase} ${publicButtonSmall} ${publicButtonPrimary}`}
                        onClick={() => openAuthModal('login')}
                        type="button"
                      >
                        Get started
                        <FiArrowUpRight size={13} />
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CARDS ────────────────────────────────── */}
      <section className={`reveal-on-scroll ${publicSection}`}>
        <div className="section-container">
          <div className="section-header">
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Included
            </p>
            <h2 className="section-title">Included in every engagement.</h2>
            <p className="section-subtitle">{PRICING_NOTE}</p>
          </div>
          <PublicCardGrid>
            {PRICING_INCLUDED_ITEMS.map((item) => (
              <article key={item} className={publicCard}>
                <div className="hs-signature" aria-hidden="true" />
                <div className={publicCardMeta}>
                  <span className={publicChip}>Deliverable</span>
                </div>
                <p className={publicCardDesc}>{item}</p>
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
              Not sure which plan fits?
            </p>
            <h2 className="section-title">Talk to our security team.</h2>
            <p className="section-subtitle">
              We'll scope the right engagement for your risk posture, timeline, and budget.
            </p>
            <div className={publicHeroActions}>
              <Button size="small" onClick={() => navigate('/contact')}>
                Contact security team
                <FiArrowUpRight size={13} />
              </Button>
              <button
                className={`${publicButtonBase} ${publicButtonSmall} ${publicButtonGhost}`}
                onClick={() => openAuthModal('login')}
                type="button"
              >
                Corporate account
              </button>
            </div>
          </div>
          <div className={publicCtaCard}>
            <div className="hs-signature" aria-hidden="true" />
            <h3 className={publicCardTitle}>Engagements open</h3>
            <p className={publicCardDesc}>
              Accepting new clients. SLA-backed delivery and clear remediation paths.
            </p>
            <div className={publicCardMeta}>
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
