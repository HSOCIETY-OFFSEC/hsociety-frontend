/**
 * Contact Page Component — GitHub UI
 * Location: src/features/contact/Contact.jsx
 *
 * Layout mirrors CP Points: page header (breadcrumb + actions)
 * then two-column main + sidebar — pure site token variables.
 */

import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiMessageSquare,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiGlobe,
  FiArrowUpRight,
  FiCheckCircle,
  FiCalendar,
  FiSend,
} from 'react-icons/fi';
import '../../styles/sections/contact/index.css';

/* ─── static data ─────────────────────────────────────── */

const CONTACT_CARDS = [
  {
    icon: <FiMail size={16} />,
    label: 'Email',
    value: 'hello@hsociety.io',
    sub: 'We reply within 24 hours',
    accent: 'alpha',
    tag: 'Primary',
  },
  {
    icon: <FiPhone size={16} />,
    label: 'Phone',
    value: '+1 (555) 000-0000',
    sub: 'Mon – Fri, 9 am – 6 pm EST',
    accent: 'beta',
    tag: 'Voice',
  },
  {
    icon: <FiMapPin size={16} />,
    label: 'Office',
    value: '123 Innovation Drive',
    sub: 'San Francisco, CA 94105',
    accent: 'gamma',
    tag: 'HQ',
  },
  {
    icon: <FiClock size={16} />,
    label: 'Response SLA',
    value: '< 4 hours',
    sub: 'Average first-reply time',
    accent: 'delta',
    tag: 'SLA',
  },
];

const STATS = [
  { value: '< 4h', label: 'Avg. response' },
  { value: '98%',  label: 'Satisfaction'  },
  { value: '24/7', label: 'Support desk'  },
  { value: '50+',  label: 'Countries'     },
];

const SOCIAL_LINKS = [
  { icon: <FiTwitter  size={14} />, label: 'Twitter',  href: '#' },
  { icon: <FiGithub   size={14} />, label: 'GitHub',   href: '#' },
  { icon: <FiLinkedin size={14} />, label: 'LinkedIn', href: '#' },
  { icon: <FiGlobe    size={14} />, label: 'Website',  href: '#' },
];

/* ─── component ─────────────────────────────────────── */

export default function Contact() {
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
              <p className="contact-header-desc">
                Have a question, idea, or project in mind? Our team responds fast.
              </p>
            </div>
          </div>

          {/* Right: CTAs */}
          <div className="contact-header-actions">
            <a
              href="#schedule"
              className="contact-btn contact-btn-secondary"
            >
              <FiCalendar size={14} />
              Book a call
            </a>
            <a
              href="mailto:hello@hsociety.io"
              className="contact-btn contact-btn-primary"
            >
              <FiSend size={14} />
              Send email
            </a>
          </div>
        </div>

        {/* Meta pill row — availability + stats */}
        <div className="contact-header-meta">
          <span className="contact-meta-pill contact-meta-status">
            <span className="contact-status-dot" />
            <span>Team online</span>
            <strong>Available now</strong>
          </span>
          {STATS.map((s) => (
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
              {CONTACT_CARDS.map((card) => (
                <article
                  key={card.label}
                  className={`contact-card contact-card-${card.accent}`}
                >
                  <div className="contact-card-header">
                    <span className="contact-card-icon">{card.icon}</span>
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
              ))}
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
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="contact-social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.icon}
                  {link.label}
                  <FiArrowUpRight size={12} className="contact-social-arrow" />
                </a>
              ))}
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