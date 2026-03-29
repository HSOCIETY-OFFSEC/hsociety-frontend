/**
 * Contact Page Component — Landing UI
 * Location: src/features/contact/Contact.jsx
 */

import {
  FiMessageSquare,
  FiArrowUpRight,
  FiCheckCircle,
} from 'react-icons/fi';
import PublicCardGrid from '../../../shared/components/public/PublicCardGrid';
import {
  CONTACT_HERO,
  CONTACT_CHANNELS,
  CONTACT_STATS,
  CONTACT_SOCIAL_LINKS,
} from '../../../config/app/contact.config';
import { getPublicCardMedia } from '../../../shared/data/publicCardMedia';
import {
  publicBadge,
  publicButtonBase,
  publicButtonGhost,
  publicButtonPrimary,
  publicButtonSmall,
  publicCard,
  publicCardDesc,
  publicCardTitle,
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
  publicSection,
} from '../../../shared/styles/publicClasses';

export default function Contact() {
  const hero = CONTACT_HERO;
  const PrimaryActionIcon = hero.primaryAction.icon;
  const SecondaryActionIcon = hero.secondaryAction.icon;

  return (
    <div className={`${publicPage} text-text-primary`}>
      {/* ── HERO ─────────────────────────────────── */}
      <section className={`hero-section reveal-on-scroll ${publicHeroSection}`}>
        <div className={`section-container ${publicHeroGrid}`}>
          <div>
            <p className={publicHeroKicker}>
              <span className="eyebrow-dot" />
              HSOCIETY OFFSEC / Contact
            </p>
            <h1 className={publicHeroTitle}>Talk to the operators.</h1>
            <p className={publicHeroDesc}>{hero.description}</p>
            <div className={publicHeroActions}>
              <a
                href={hero.primaryAction.href}
                className={`${publicButtonBase} ${publicButtonSmall} ${publicButtonPrimary} px-[1.1rem] text-[0.9rem]`}
              >
                <PrimaryActionIcon size={14} />
                {hero.primaryAction.label}
              </a>
              <a
                href={hero.secondaryAction.href}
                className={`${publicButtonBase} ${publicButtonSmall} ${publicButtonGhost} bg-transparent px-[1.1rem] text-[0.9rem]`}
              >
                <SecondaryActionIcon size={14} />
                {hero.secondaryAction.label}
              </a>
            </div>
          </div>
          <div className={publicHeroPanel}>
            <p className={publicBadge}>Support signals</p>
            <div className={publicList}>
              <div className={publicListItem}>
                <FiCheckCircle size={14} />
                <span>24-hour email response.</span>
              </div>
              <div className={publicListItem}>
                <FiCheckCircle size={14} />
                <span>Dedicated support desk.</span>
              </div>
              <div className={publicListItem}>
                <FiCheckCircle size={14} />
                <span>Global team coverage.</span>
              </div>
              <div className={publicListItem}>
                <FiCheckCircle size={14} />
                <span>98% satisfaction rate.</span>
              </div>
            </div>
            <div className={publicHeroStats}>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">24h</strong> response
              </span>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">98%</strong> CSAT
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
              Contact channels
            </p>
            <h2 className="section-title">Choose the fastest way to reach us.</h2>
            <p className="section-subtitle">
              Direct lines for partnerships, support, and training inquiries.
            </p>
          </div>
          <PublicCardGrid className="contact-card-grid">
            {CONTACT_CHANNELS.map((card, index) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.label}
                  className={`${publicCard} gap-3`}
                  style={{ '--public-card-media': `url(${getPublicCardMedia(index)})` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--primary-color)_14%,var(--bg-secondary))] text-brand">
                      <Icon size={18} />
                    </span>
                    <span className="text-[0.65rem] uppercase tracking-[0.18em] text-text-tertiary">
                      {card.tag}
                    </span>
                  </div>
                  <h3 className={publicCardTitle}>{card.label}</h3>
                  <p className="text-[0.95rem] text-text-secondary">{card.value}</p>
                  <div className="flex items-center gap-2 text-xs text-text-tertiary">
                    <span className="h-2 w-2 rounded-full bg-brand" />
                    <span>{card.sub}</span>
                  </div>
                </article>
              );
            })}
          </PublicCardGrid>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className={`reveal-on-scroll ${publicCtaSection}`}>
        <div className={`section-container ${publicCtaInner}`}>
          <div>
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Follow our journey
            </p>
            <h2 className="section-title">Stay connected with HSOCIETY OFFSEC.</h2>
            <p className="section-subtitle">
              Product updates, behind-the-scenes stories, and industry insights.
            </p>
            <div className={publicHeroActions}>
              <a
                href={hero.primaryAction.href}
                className={`${publicButtonBase} ${publicButtonSmall} ${publicButtonPrimary} px-[1.1rem] text-[0.9rem]`}
              >
                <FiMessageSquare size={14} />
                Start a conversation
              </a>
              <a
                href={hero.secondaryAction.href}
                className={`${publicButtonBase} ${publicButtonSmall} ${publicButtonGhost} bg-transparent px-[1.1rem] text-[0.9rem]`}
              >
                <FiArrowUpRight size={14} />
                Request a briefing
              </a>
            </div>
          </div>
          <div className={publicCtaCard}>
            <h3 className={publicCardTitle}>Follow our channels</h3>
            <p className={publicCardDesc}>
              Stay up to date with product updates, behind-the-scenes stories,
              and industry insights across our channels.
            </p>
            <div className="grid gap-3">
              {CONTACT_SOCIAL_LINKS.map((link) => {
                const SocialIcon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="inline-flex items-center gap-2 rounded-sm border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--primary-color)_25%,var(--border-color))]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcon size={14} />
                    {link.label}
                    <FiArrowUpRight size={12} className="ml-auto" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
