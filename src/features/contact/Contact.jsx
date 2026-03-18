/**
 * Contact Page Component — GitHub UI
 * Location: src/features/contact/Contact.jsx
 *
 * Layout mirrors CP Points: page header (breadcrumb + actions)
 * then two-column main + sidebar — pure site token variables.
 */

import {
  FiMessageSquare,
  FiArrowUpRight,
  FiCheckCircle,
} from 'react-icons/fi';
import {
import './contact.css';
  CONTACT_HERO,
  CONTACT_CHANNELS,
  CONTACT_STATS,
  CONTACT_SOCIAL_LINKS,
} from '../../config/contact.config';

export default function Contact() {
  const hero = CONTACT_HERO;
  const PrimaryActionIcon = hero.primaryAction.icon;
  const SecondaryActionIcon = hero.secondaryAction.icon;
  return (
    <div className="contact-page">

      {/* ── PAGE HEADER ─────────────────────────── */}
      <header className="contact-page-header">
        <div className="contact-page-header-inner">

          {/* Left: icon + breadcrumb */}
          <div className="contact-header-left">
            <div className="contact-header-icon-wrap">
              <FiMessageSquare size={20} className="contact-header-icon" />
            </div>
            <div>
              <div className="contact-header-breadcrumb">
                <span className="contact-breadcrumb-org">HSOCIETY</span>
                <span className="contact-breadcrumb-sep">/</span>
                <span className="contact-breadcrumb-page">contact</span>
                <span className="contact-header-visibility">Public</span>
              </div>
              <p className="contact-header-desc">{hero.description}</p>
            </div>
          </div>

          {/* Right: CTAs */}
          <div className="contact-header-actions">
            <a
              href={hero.primaryAction.href}
              className="contact-btn contact-btn-primary"
            >
              <PrimaryActionIcon size={14} />
              {hero.primaryAction.label}
            </a>
            <a
              href={hero.secondaryAction.href}
              className="contact-btn contact-btn-secondary"
            >
              <SecondaryActionIcon size={14} />
              {hero.secondaryAction.label}
            </a>
          </div>
        </div>

        {/* Meta pill row — availability + stats */}
        <div className="contact-header-meta">
          <span className="contact-meta-pill contact-meta-status">
            <span className="contact-status-dot" />
            <span>{hero.availability}</span>
          </span>
          {CONTACT_STATS.map((s) => (
            <span key={s.label} className="contact-meta-pill">
              <strong className="contact-meta-value">{s.value}</strong>
              <span className="contact-meta-label">{s.label}</span>
            </span>
          ))}
        </div>
      </header>

      {/* ── TWO-COLUMN LAYOUT ───────────────────── */}
      <div className="contact-layout">

        {/* ── MAIN COLUMN ─────────────────────── */}
        <main className="contact-main">

          {/* Section: Contact channels */}
          <section className="contact-section">
            <h2 className="contact-section-title">
              <FiMessageSquare size={15} className="contact-section-icon" />
              Contact channels
            </h2>

            <div className="contact-card-grid">
              {CONTACT_CHANNELS.map((card) => {
                const Icon = card.icon;
                return (
                  <article
                    key={card.label}
                    className={`contact-card contact-card-${card.accent}`}
                  >
                    <div className="contact-card-header">
                      <span className="contact-card-icon">
                        <Icon size={18} />
                      </span>
                      <span className={`contact-label contact-label-${card.accent}`}>
                        {card.tag}
                      </span>
                    </div>
                    <h3 className="contact-card-title">{card.label}</h3>
                    <p className="contact-card-value">{card.value}</p>
                    <div className="contact-card-footer">
                      <span className={`contact-lang-dot contact-lang-dot-${card.accent}`} />
                      <span className="contact-lang-label">{card.sub}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <div className="contact-divider" />

          {/* Section: Social */}
          <section className="contact-section">
            <h2 className="contact-section-title">
              <FiGlobe size={15} className="contact-section-icon" />
              Follow our journey
            </h2>
            <p className="contact-section-desc">
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
          </section>

        </main>

        {/* ── SIDEBAR ─────────────────────────── */}
        <aside className="contact-sidebar">

          {/* About box */}
          <div className="contact-sidebar-box">
            <h3 className="contact-sidebar-heading">About</h3>
            <p className="contact-sidebar-about">
              HSOCIETY is a hacker-focused learning platform. Reach out for
              partnership inquiries, technical support, or collaboration
              opportunities.
            </p>
            <div className="contact-sidebar-divider" />
            <ul className="contact-sidebar-list">
              <li>
                <FiCheckCircle size={13} className="contact-sidebar-list-icon" />
                24-hour email response
              </li>
              <li>
                <FiCheckCircle size={13} className="contact-sidebar-list-icon" />
                Dedicated support desk
              </li>
              <li>
                <FiCheckCircle size={13} className="contact-sidebar-list-icon" />
                Global team coverage
              </li>
              <li>
                <FiCheckCircle size={13} className="contact-sidebar-list-icon" />
                98 % satisfaction rate
              </li>
            </ul>
          </div>

          {/* SLA status box */}
          <div className="contact-sidebar-box contact-sla-box">
            <div className="contact-sla-row">
              <span className="contact-sla-dot" />
              <span className="contact-sla-label">RESPONSE SLA</span>
            </div>
            <strong className="contact-sla-value">&lt; 4h</strong>
            <div className="contact-sla-track">
              <div className="contact-sla-fill" />
            </div>
            <p className="contact-sla-note">
              Measured across all inbound channels.
            </p>
          </div>

          {/* Topics */}
          <div className="contact-sidebar-box">
            <h3 className="contact-sidebar-heading">Topics</h3>
            <div className="contact-topics">
              {['support', 'partnerships', 'pentesting', 'training', 'offsec', 'community'].map(
                (t) => (
                  <span key={t} className="contact-topic">{t}</span>
                )
              )}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
