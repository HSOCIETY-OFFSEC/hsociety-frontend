import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiArrowRight, FiShield, FiCheckCircle, FiLock, FiTerminal } from 'react-icons/fi';
import Button from '../../../shared/components/ui/Button';
import Logo from '../../../shared/components/common/Logo';
import '../../../styles/features/landing/hero.css';

const HeroSection = ({ content }) => {
  const navigate = useNavigate();
  const { badge, highlights, ctas, trust, proof } = content;

  return (
    <section className="hero-section">
      {/* Background layers */}
      <div className="hero-video-bg" aria-hidden="true">
        <span className="hero-bg-layer layer-1" />
        <span className="hero-bg-layer layer-2" />
        <span className="hero-bg-layer layer-3" />
      </div>

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
            Train Offensive.<br />
            <span className="hero-title-accent">Deliver Real</span>{' '}
            Pentests.
          </h1>

          {/* Description */}
          <p className="hero-description">
            HSOCIETY trains beginners in offensive security and deploys them into
            supervised, real-world penetration tests — building the next generation
            of professional red teamers.
          </p>

          {/* Highlights */}
          <ul className="hero-highlights">
            {highlights.map((item) => (
              <li key={item} className="hero-highlight">
                <FiCheckCircle size={14} />
                <span>{item}</span>
              </li>
            ))}
          </ul>

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

          {/* Proof stats */}
          {proof?.length > 0 && (
            <div className="hero-proof">
              {proof.map((item) => (
                <div key={item.label} className="hero-proof-item">
                  <span className="proof-value">{item.value}</span>
                  <span className="proof-label">{item.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Trust */}
          <div className="trust-indicators">
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