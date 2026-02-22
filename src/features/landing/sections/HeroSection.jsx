import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiArrowRight, FiShield, FiCheckCircle, FiLock, FiTerminal } from 'react-icons/fi';
import Button from '../../../shared/components/ui/Button';
import Logo from '../../../shared/components/common/Logo';
import '../../../styles/features/landing/hero.css';

/* Animated terminal lines for the visual panel */
const TERMINAL_LINES = [
  { delay: 0,    text: '$ nmap -sV --script vuln target.hsociety.io' },
  { delay: 800,  text: '[+] Port 443/tcp  open  ssl/https' },
  { delay: 1400, text: '[+] CVE-2024-1337 — RCE vector confirmed' },
  { delay: 2200, text: '$ sqlmap -u "https://target/api/v1/login"' },
  { delay: 3000, text: '[!] Injectable parameter: email (POST)' },
  { delay: 3800, text: '[+] Payload delivered. Dumping schema…' },
  { delay: 4800, text: '$ report --severity critical --evidence ./poc' },
  { delay: 5600, text: '[✓] Report signed. Remediation pushed.' },
];

function TerminalPanel() {
  const linesRef = useRef([]);

  useEffect(() => {
    linesRef.current.forEach((el, i) => {
      if (!el) return;
      const { delay } = TERMINAL_LINES[i];
      el.style.opacity = '0';
      el.style.transform = 'translateY(4px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, delay + 400);
    });
  }, []);

  return (
    <div className="hero-terminal" aria-hidden="true">
      <div className="terminal-topbar">
        <span className="terminal-dot red" />
        <span className="terminal-dot yellow" />
        <span className="terminal-dot green" />
        <span className="terminal-title">hsociety — zsh</span>
      </div>
      <div className="terminal-body">
        {TERMINAL_LINES.map((line, i) => (
          <div
            key={i}
            ref={el => (linesRef.current[i] = el)}
            className={`terminal-line ${line.text.startsWith('$') ? 'cmd' : line.text.startsWith('[+]') ? 'ok' : line.text.startsWith('[!]') ? 'warn' : line.text.startsWith('[✓]') ? 'success' : 'info'}`}
          >
            {line.text}
          </div>
        ))}
        <div className="terminal-cursor" />
      </div>
    </div>
  );
}

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

        {/* ── LEFT: Logo visual panel ── */}
        <div className="hero-visual-panel">
          <div className="hero-logo-wrap">
            <div className="hero-logo-halo" />
            <Logo size="xlarge" className="hero-logo-minimal" />
          </div>
          <TerminalPanel />
        </div>

        {/* ── RIGHT: Content panel ── */}
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
      </div>
    </section>
  );
};

export default HeroSection;