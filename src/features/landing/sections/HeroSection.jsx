import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiArrowRight,
  FiTerminal
} from 'react-icons/fi';
import { getSocialLinks } from '../../../config/social.config';
import Button from '../../../shared/components/ui/Button';
import Logo from '../../../shared/components/common/Logo';
import useRequestPentest from '../../../shared/hooks/useRequestPentest';
import '../../../styles/landing/hero.css';

/**
 * Splits a string into individual animated word spans.
 * Each word gets a .title-word wrapper and .title-word-inner child
 * so CSS can do a clip + slide-up reveal per word.
 */
const AnimatedWords = ({ text, className = '' }) =>
  text.split(' ').map((word, i) => {
    const clean = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const highlight = clean === 'hacker' || clean === 'hackers';
    return (
      <span key={i} className="title-word">
        <span className={`title-word-inner ${className} ${highlight ? 'hero-word-accent' : ''}`}>
          {word}
        </span>
        {/* preserve whitespace between words */}
        {i < text.split(' ').length - 1 && '\u00A0'}
      </span>
    );
  });

const HeroSection = ({ content }) => {
  const navigate = useNavigate();
  const { requestPentest, requestPentestModal } = useRequestPentest();
  const { badge, ctas, title, description } = content;
  const defaultTitles = [
    'Train like a Hacker.|Prepare for Hackers',
    'Train like a Hacker.|Become a Hacker'
  ];
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const hasOverride = Boolean(title && String(title).trim());
    if (hasOverride) return undefined;
    const timer = window.setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % defaultTitles.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [title]);

  const resolvedTitle = useMemo(() => {
    if (title && String(title).trim()) return title;
    return defaultTitles[titleIndex];
  }, [title, titleIndex]);

  const [titleLine1, titleLine2] = String(resolvedTitle || '').split('|');

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
            <AnimatedWords text={titleLine1 || title || 'Train like a Hacker.'} />
            {titleLine2 && (
              <>
                <br />
                <AnimatedWords text={titleLine2} />
              </>
            )}
          </h1>

          {/* Description */}
          <p className="hero-description">
            {description ||
              'HSOCIETY trains beginners in offensive security and deploys them into supervised, real-world penetration tests — building the next generation of professional red teamers.'}
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
            {getSocialLinks().map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.key}
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
