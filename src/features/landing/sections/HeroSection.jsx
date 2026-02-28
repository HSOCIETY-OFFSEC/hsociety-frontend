import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiArrowRight,
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
import useRequestPentest from '../../../shared/hooks/useRequestPentest';
import '../../../styles/landing/hero.css';

const SOCIAL_LINKS = [
  { href: '#youtube', label: 'YouTube', icon: FaYoutube },
  { href: '#x', label: 'X', icon: FaXTwitter },
  { href: '#github', label: 'GitHub', icon: FaGithub },
  { href: '#linkedin', label: 'LinkedIn', icon: FaLinkedinIn },
  { href: '#whatsapp', label: 'WhatsApp', icon: FaWhatsapp }
];

/**
 * Splits a string into individual animated word spans.
 * Each word gets a .title-word wrapper and .title-word-inner child
 * so CSS can do a clip + slide-up reveal per word.
 */
const AnimatedWords = ({ text, className = '' }) =>
  text.split(' ').map((word, i) => (
    <span key={i} className="title-word">
      <span className={`title-word-inner ${className}`}>{word}</span>
      {/* preserve whitespace between words */}
      {i < text.split(' ').length - 1 && '\u00A0'}
    </span>
  ));

const HeroSection = ({ content }) => {
  const navigate = useNavigate();
  const { requestPentest, requestPentestModal } = useRequestPentest();
  const { badge, ctas } = content;

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

          {/* Title — word-by-word animated reveal */}
          <h1 className="hero-title">
            {/* Line 1: "Train like A Hacker." */}
            <AnimatedWords text="Train like A Hacker." />
            <br />
            {/* Line 2: "Prepare" (accent) + " for Hackers" */}
            <span className="title-word">
              <span className="title-word-inner">
                <span className="hero-title-accent">Prepare</span>
              </span>
            </span>
            {'\u00A0'}
            <AnimatedWords text="for  Hackers" />
          </h1>

          {/* Description */}
          <p className="hero-description">
            HSOCIETY trains beginners in offensive security and deploys them into
            supervised, real-world penetration tests — building the next generation
            of professional red teamers.
          </p>

          {/* CTAs */}
          <div className="hero-cta">
            {ctas.map((cta, index) => (
              <Button
                key={cta.label}
                variant={cta.variant}
                size="large"
                onClick={() => {
                  if (cta.route === '/corporate/pentest') {
                    requestPentest();
                    return;
                  }
                  navigate(cta.route);
                }}
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

        </div>

        {/* ── RIGHT: Logo visual ── */}
        <div className="hero-visual-panel">
          <div className="hero-logo-wrap">
            <div className="hero-logo-halo" />
            <Logo size="xlarge" className="hero-logo-minimal" />
          </div>
        </div>
      </div>
      {requestPentestModal}
    </section>
  );
};

export default HeroSection;
