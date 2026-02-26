import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiArrowRight,
  FiShield,
  FiCheckCircle,
  FiLock,
  FiTerminal
} from 'react-icons/fi';
import {
  FaGithub,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube
} from 'react-icons/fa6';
import Button from '../../../shared/components/ui/Button';
import Logo from '../../../shared/components/common/Logo';
import '../../../styles/features/landing/hero.css';

const SOCIAL_LINKS = [
  { href: '#youtube', label: 'YouTube', icon: FaYoutube },
  { href: '#x', label: 'X', icon: FaXTwitter },
  { href: '#github', label: 'GitHub', icon: FaGithub },
  { href: '#linkedin', label: 'LinkedIn', icon: FaLinkedinIn },
  { href: '#whatsapp', label: 'WhatsApp', icon: FaWhatsapp }
];

const HeroSection = ({ content }) => {
  const navigate = useNavigate();
  const { badge, highlights, ctas, trust, proof } = content;

  return (
    <section className="hero-section">
      {/* Grid overlay */}
      <div className="hero-grid-overlay" aria-hidden="true" />

      <div className="hero-container">

        {/* ── LEFT: Content ── */}
        <div className="hero-content-panel">

          {/* Badge */}
          <div className="hero-badge">
            <span className="badge-dot" />
            {badge}
          </div>

          {/* Kicker */}
          <p className="hero-kicker">
            <FiTerminal size={14} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
            Real Attacks. Real Security.
          </p>

          {/* Title */}
          <h1 className="hero-title">
            Train like A Hacker.<br />
            <span className="hero-title-accent">Prepare</span>{' '}
            for  Hackers
          </h1>

          {/* Description */}
          <p className="hero-description">
            HSOCIETY trains beginners in offensive security and deploys them into
            supervised, real-world penetration tests — building the next generation
            of professional red teamers.
          </p>

          {/* Highlights
          <ul className="hero-highlights">
            {highlights.map((item) => (
              <li key={item} className="hero-highlight">
                <FiCheckCircle size={14} />
                <span>{item}</span>
              </li>
            ))}
          </ul> */}

          {/* CTAs */}
          <div className="hero-cta">
            {ctas.map((cta, index) => (
              <Button
                key={cta.label}
                variant={cta.variant}
                size="large"
                onClick={() => navigate(cta.route)}
              >
                {cta.label}
                {index === 0
                  ? <FiArrowUpRight size={17} />
                  : <FiArrowRight size={17} />}
              </Button>
            ))}
          </div>

          <div className="hero-socials">
            {SOCIAL_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  className="hero-social-link"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>

{/* Removed complimentary components to improve page layout 
====================================================================
*/}
          {/* Proof stats
          {proof?.length > 0 && (
            <div className="hero-proof">
              {proof.map((item) => (
                <div key={item.label} className="hero-proof-item">
                  <span className="proof-value">{item.value}</span>
                  <span className="proof-label">{item.label}</span>
                </div>
              ))}
            </div>
          )} */}

          {/* Trust */}
          {/* <div className="trust-indicators">
            {trust.map((item, index) => (
              <div key={item} className="trust-item">
                <span className="trust-icon">
                  {index === 0 && <FiShield size={14} />}
                  {index === 1 && <FiCheckCircle size={14} />}
                  {index === 2 && <FiLock size={14} />}
                </span>
                <span className="trust-text">{item}</span>
              </div>
            ))}
          </div>
           */}
        </div>

        {/* ── RIGHT: Logo visual ── */}
        <div className="hero-visual-panel">
          <div className="hero-logo-wrap">
            <div className="hero-logo-halo" />
            <Logo size="xlarge" className="hero-logo-minimal" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
