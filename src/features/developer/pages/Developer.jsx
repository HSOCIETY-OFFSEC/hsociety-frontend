import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCode, FiCpu, FiGitBranch, FiGithub, FiShield, FiTool, FiArrowUpRight } from 'react-icons/fi';
import developerContent from '../../../data/static/developer.json';
import '../../public/styles/public-landing.css';
import '../styles/developer.css';

const Developer = () => {
  const navigate = useNavigate();

  const iconMap = useMemo(() => ({
    FiCode,
    FiTool,
    FiShield,
    FiCpu,
    FiGitBranch,
    FiGithub,
  }), []);

  const stack = developerContent.stack.items.map((item) => ({
    ...item,
    icon: iconMap[item.icon],
  }));

  const contributions = developerContent.contributions.items.map((item) => ({
    ...item,
    icon: iconMap[item.icon],
  }));

  return (
    <div className="public-page public-page-inner developer-page">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero-section public-hero reveal-on-scroll">
        <div className="section-container">
          <div>
            <p className="public-hero-kicker">
              <span className="eyebrow-dot" />
              HSOCIETY OFFSEC / Developers
            </p>
            <h1 className="public-hero-title">{developerContent.hero.title}</h1>
            <p className="public-hero-desc">{developerContent.hero.subtitle}</p>
            <div className="public-hero-actions">
              <button
                className="public-btn public-btn--primary"
                onClick={() => navigate(developerContent.hero.route)}
              >
                {developerContent.hero.button}
                <FiArrowUpRight size={14} />
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/services')}>
                Explore services
              </button>
            </div>
            <div className="public-pill-row">
              <span className="public-pill">Open source</span>
              <span className="public-pill">Operator tooling</span>
              <span className="public-pill">Community build</span>
            </div>
          </div>
          <div className="public-hero-panel">
            <div className="hs-signature" aria-hidden="true" />
            <p className="public-badge">Dev focus</p>
            <div className="public-list">
              <div className="public-list-item">
                <FiCode size={14} />
                <span>Open-source security tooling.</span>
              </div>
              <div className="public-list-item">
                <FiGitBranch size={14} />
                <span>Contributor-friendly workflows.</span>
              </div>
              <div className="public-list-item">
                <FiGithub size={14} />
                <span>Ship code with the operator community.</span>
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
              Stack focus
            </p>
            <h2 className="section-title">{developerContent.stack.title}</h2>
            <p className="section-subtitle">{developerContent.stack.subtitle}</p>
          </div>
          <div className="public-card-grid">
            {stack.map((item) => (
              <article key={item.title} className="public-card">
                <div className="hs-signature" aria-hidden="true" />
                <div className="public-card-meta">
                  <span className="public-chip">{item.title}</span>
                </div>
                <h3 className="public-card-title">{item.title}</h3>
                <p className="public-card-desc">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CARDS ────────────────────────────────── */}
      <section className="public-section reveal-on-scroll">
        <div className="section-container">
          <div className="section-header">
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Contributions
            </p>
            <h2 className="section-title">{developerContent.contributions.title}</h2>
            <p className="section-subtitle">{developerContent.contributions.subtitle}</p>
          </div>
          <div className="public-card-grid">
            {contributions.map((item) => (
              <article key={item.title} className="public-card">
                <div className="hs-signature" aria-hidden="true" />
                <div className="public-card-meta">
                  <span className="public-chip">{item.title}</span>
                </div>
                <h3 className="public-card-title">{item.title}</h3>
                <p className="public-card-desc">{item.detail}</p>
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
              Build with HSOCIETY OFFSEC
            </p>
            <h2 className="section-title">Ship tools with the operator community.</h2>
            <p className="section-subtitle">Partner with us on research, tooling, and platform development.</p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={() => navigate('/contact')}>
                Talk to us
                <FiArrowUpRight size={14} />
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/careers')}>
                See careers
              </button>
            </div>
          </div>
          <div className="public-cta-card">
            <div className="hs-signature" aria-hidden="true" />
            <h3 className="public-card-title">Open-source alignment.</h3>
            <p className="public-card-desc">We ship with transparency, mentorship, and real-world operator feedback.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Developer;
