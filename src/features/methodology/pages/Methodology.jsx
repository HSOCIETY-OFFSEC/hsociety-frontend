import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiClipboard, FiSearch, FiShield, FiTarget, FiTool } from 'react-icons/fi';
import methodologyContent from '../../../data/static/methodology.json';
import '../../public/styles/public-landing.css';
import '../styles/methodology.css';

const Methodology = () => {
  const navigate = useNavigate();
  const iconMap = useMemo(() => ({
    FiClipboard,
    FiSearch,
    FiTarget,
    FiShield,
    FiTool,
    FiCheckCircle,
  }), []);

  const phases = methodologyContent.phases.map((phase) => ({
    ...phase,
    icon: iconMap[phase.icon],
  }));

  return (
    <div className="landing-page public-page methodology-page">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero-section public-hero reveal-on-scroll">
        <div className="section-container">
          <div>
            <p className="public-hero-kicker">
              <span className="eyebrow-dot" />
              HSOCIETY / Methodology
            </p>
            <h1 className="public-hero-title">{methodologyContent.hero.title}</h1>
            <p className="public-hero-desc">{methodologyContent.hero.subtitle}</p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={() => navigate('/contact')}>
                Start an engagement
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/services')}>
                Explore services
              </button>
            </div>
            <div className="public-pill-row">
              {methodologyContent.hero.chips.map((chip) => (
                <span key={chip} className="public-pill">{chip}</span>
              ))}
            </div>
          </div>
          <div className="public-hero-panel">
            <p className="public-badge">Operator workflow</p>
            <div className="public-list">
              {phases.slice(0, 4).map((phase) => (
                <div key={phase.title} className="public-list-item">
                  {phase.icon && <phase.icon size={14} />}
                  <span>{phase.title}</span>
                </div>
              ))}
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
              Process map
            </p>
            <h2 className="section-title">A repeatable security cycle.</h2>
            <p className="section-subtitle">Every phase is designed to surface risk and ship fixes.</p>
          </div>
          <div className="public-card-grid">
            {phases.map((phase) => (
              <article key={phase.title} className="public-card">
                <div className="public-card-meta">
                  <span className="public-chip">{phase.title}</span>
                </div>
                <h3 className="public-card-title">{phase.title}</h3>
                <p className="public-card-desc">{phase.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className="public-cta reveal-on-scroll">
        <div className="section-container public-cta-inner">
          <div>
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Ready to execute
            </p>
            <h2 className="section-title">Let’s apply this methodology to your stack.</h2>
            <p className="section-subtitle">Scope a pentest or training cycle with the HSOCIETY team.</p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={() => navigate('/contact')}>
                Book a briefing
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/pricing')}>
                View pricing
              </button>
            </div>
          </div>
          <div className="public-cta-card">
            <h3 className="public-card-title">Cycle-based, evidence-first.</h3>
            <p className="public-card-desc">Continuous validation, clear remediation paths, and operator-grade output.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Methodology;
