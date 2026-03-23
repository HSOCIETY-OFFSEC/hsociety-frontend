/**
 * Contact Page Component — Landing UI
 * Location: src/features/contact/Contact.jsx
 */

import {
  FiMessageSquare,
  FiArrowUpRight,
  FiCheckCircle,
} from 'react-icons/fi';
import '../../public/styles/public-landing.css';
import '../styles/contact.css';
import {
  CONTACT_HERO,
  CONTACT_CHANNELS,
  CONTACT_STATS,
  CONTACT_SOCIAL_LINKS,
} from '../../../config/app/contact.config';

export default function Contact() {
  const hero = CONTACT_HERO;
  const PrimaryActionIcon = hero.primaryAction.icon;
  const SecondaryActionIcon = hero.secondaryAction.icon;

  return (
    <div className="landing-page public-page contact-page">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero-section public-hero reveal-on-scroll">
        <div className="section-container">
          <div>
            <p className="public-hero-kicker">
              <span className="eyebrow-dot" />
              HSOCIETY / Contact
            </p>
            <h1 className="public-hero-title">Talk to the operators.</h1>
            <p className="public-hero-desc">{hero.description}</p>
            <div className="public-hero-actions">
              <a
                href={hero.primaryAction.href}
                className="public-btn public-btn--primary"
              >
                <PrimaryActionIcon size={14} />
                {hero.primaryAction.label}
              </a>
              <a
                href={hero.secondaryAction.href}
                className="public-btn public-btn--ghost"
              >
                <SecondaryActionIcon size={14} />
                {hero.secondaryAction.label}
              </a>
            </div>
            <div className="public-pill-row">
              <span className="public-pill">
                <span className="contact-status-dot" />
                {hero.availability}
              </span>
              {CONTACT_STATS.map((s) => (
                <span key={s.label} className="public-pill">
                  {s.value} {s.label}
                </span>
              ))}
            </div>
          </div>
          <div className="public-hero-panel">
            <p className="public-badge">Support signals</p>
            <div className="public-list">
              <div className="public-list-item">
                <FiCheckCircle size={14} />
                <span>24-hour email response.</span>
              </div>
              <div className="public-list-item">
                <FiCheckCircle size={14} />
                <span>Dedicated support desk.</span>
              </div>
              <div className="public-list-item">
                <FiCheckCircle size={14} />
                <span>Global team coverage.</span>
              </div>
              <div className="public-list-item">
                <FiCheckCircle size={14} />
                <span>98% satisfaction rate.</span>
              </div>
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
              Contact channels
            </p>
            <h2 className="section-title">Choose the fastest way to reach us.</h2>
            <p className="section-subtitle">
              Direct lines for partnerships, support, and training inquiries.
            </p>
          </div>
          <div className="public-card-grid contact-card-grid">
            {CONTACT_CHANNELS.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.label}
                  className={`public-card contact-card contact-card-${card.accent}`}
                >
                  <div className="contact-card-header">
                    <span className="contact-card-icon">
                      <Icon size={18} />
                    </span>
                    <span className={`contact-label contact-label-${card.accent}`}>
                      {card.tag}
                    </span>
                  </div>
                  <h3 className="public-card-title">{card.label}</h3>
                  <p className="contact-card-value">{card.value}</p>
                  <div className="contact-card-footer">
                    <span className={`contact-lang-dot contact-lang-dot-${card.accent}`} />
                    <span className="contact-lang-label">{card.sub}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className="public-cta reveal-on-scroll">
        <div className="section-container public-cta-inner">
          <div>
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Follow our journey
            </p>
            <h2 className="section-title">Stay connected with HSOCIETY.</h2>
            <p className="section-subtitle">
              Product updates, behind-the-scenes stories, and industry insights.
            </p>
            <div className="public-hero-actions">
              <a href={hero.primaryAction.href} className="public-btn public-btn--primary">
                <FiMessageSquare size={14} />
                Start a conversation
              </a>
              <a href={hero.secondaryAction.href} className="public-btn public-btn--ghost">
                <FiArrowUpRight size={14} />
                Request a briefing
              </a>
            </div>
          </div>
          <div className="public-cta-card">
            <h3 className="public-card-title">Follow our channels</h3>
            <p className="public-card-desc">
              Stay up to date with product updates, behind-the-scenes stories,
              and industry insights across our channels.
            </p>
            <div className="contact-social-links">
              {CONTACT_SOCIAL_LINKS.map((link) => {
                const SocialIcon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="contact-social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcon size={14} />
                    {link.label}
                    <FiArrowUpRight size={12} className="contact-social-arrow" />
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
