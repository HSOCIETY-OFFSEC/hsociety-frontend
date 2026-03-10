/**
 * Contact Page Component — Elevated UI
 * Location: src/pages/ContactPage.jsx
 *
 * Usage: drop-in replacement for the existing ContactPage.
 * Requires: contact.css (updated), common.css, layout.css
 * Icons: react-icons (Feather set)
 */

import { useEffect, useRef } from 'react';
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
  FiArrowRight,
  FiCalendar,
} from 'react-icons/fi';

/* ─── data ─────────────────────────────────────────────── */

const CONTACT_CARDS = [
  {
    icon: <FiMail size={20} />,
    label: 'Email',
    value: 'hello@yourcompany.com',
    sub: 'We reply within 24 hours',
  },
  {
    icon: <FiPhone size={20} />,
    label: 'Phone',
    value: '+1 (555) 000-0000',
    sub: 'Mon – Fri, 9 am – 6 pm EST',
  },
  {
    icon: <FiMapPin size={20} />,
    label: 'Office',
    value: '123 Innovation Drive',
    sub: 'San Francisco, CA 94105',
  },
  {
    icon: <FiClock size={20} />,
    label: 'Response time',
    value: '< 4 hours',
    sub: 'Average first-reply SLA',
  },
];

const STATS = [
  { value: '< 4h',  label: 'Avg. response' },
  { value: '98%',   label: 'Satisfaction' },
  { value: '24/7',  label: 'Support desk' },
  { value: '50+',   label: 'Countries served' },
];

const SOCIAL_LINKS = [
  { icon: <FiTwitter size={15} />,  label: 'Twitter',  href: '#' },
  { icon: <FiGithub  size={15} />,  label: 'GitHub',   href: '#' },
  { icon: <FiLinkedin size={15} />, label: 'LinkedIn', href: '#' },
  { icon: <FiGlobe   size={15} />,  label: 'Website',  href: '#' },
];

/* ─── scroll-reveal hook ────────────────────────────────── */

function useRevealOnScroll(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const els = el.querySelectorAll('.reveal-on-scroll');

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
}

/* ─── component ─────────────────────────────────────────── */

export default function ContactPage() {
  const pageRef = useRef(null);
  useRevealOnScroll(pageRef);

  return (
    <div className="contact-page" ref={pageRef}>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="contact-hero">
        <div className="contact-hero-inner">

          {/* Left: text */}
          <div className="contact-hero-text reveal-on-scroll">
            <p className="contact-kicker">Get in touch</p>

            <h1 className="contact-title">
              Let's build something{' '}
              <span className="contact-title-accent">great together</span>
            </h1>

            <p className="contact-subtitle">
              Have a question, idea, or project in mind? We'd love to hear from
              you. Reach out through any channel below — our team responds fast.
            </p>

            <div className="contact-actions">
              <a
                href="mailto:hello@yourcompany.com"
                className="button button--primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <FiMail size={16} />
                Send us an email
              </a>

              <a
                href="#schedule"
                className="button button--ghost"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <FiCalendar size={16} />
                Book a call
                <FiArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Right: decorative mark */}
          <div className="contact-hero-mark reveal-on-scroll" style={{ '--reveal-delay': '120ms' }}>
            <div className="contact-hero-visual">
              <FiMessageSquare
                className="contact-hero-icon"
                size={72}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ────────────────────────────────────── */}
      <div
        className="contact-stats reveal-on-scroll"
        style={{ '--reveal-delay': '60ms' }}
      >
        {STATS.map((s) => (
          <div className="contact-stat" key={s.label}>
            <span className="contact-stat-value">{s.value}</span>
            <span className="contact-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── AVAILABILITY BANNER ────────────────────────────── */}
      <div className="contact-availability reveal-on-scroll" style={{ '--reveal-delay': '80ms' }}>
        <div className="contact-availability-inner">
          <div className="contact-availability-status">
            <span className="contact-availability-dot" />
            Available now — team is online
          </div>
          <span className="contact-availability-note">
            Typical first reply in under 4 hours
          </span>
        </div>
      </div>

      {/* ── CONTACT CARDS ──────────────────────────────────── */}
      <div className="contact-grid" style={{ marginTop: '2.5rem' }}>
        {CONTACT_CARDS.map((card, i) => (
          <div
            className="contact-card reveal-on-scroll"
            key={card.label}
            style={{ '--reveal-delay': `${i * 60}ms` }}
          >
            <div className="contact-card-icon">{card.icon}</div>
            <h3>{card.label}</h3>
            <p>{card.value}</p>
            <span>{card.sub}</span>
          </div>
        ))}
      </div>

      {/* ── DIVIDER ────────────────────────────────────────── */}
      <div className="contact-divider reveal-on-scroll" style={{ '--reveal-delay': '60ms' }}>
        <span>Connect with us</span>
      </div>

      {/* ── SOCIAL ─────────────────────────────────────────── */}
      <div className="contact-social reveal-on-scroll" style={{ '--reveal-delay': '80ms' }}>
        <div className="contact-social-inner">
          <h3>Follow our journey</h3>
          <p>
            Stay up to date with product updates, behind-the-scenes stories,
            and industry insights.
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
              </a>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
