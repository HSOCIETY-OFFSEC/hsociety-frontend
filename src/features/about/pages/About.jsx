import React from 'react';
import aboutContent from '../../../data/static/about.json';
import SocialLinks from '../../../shared/components/common/SocialLinks';
import '../../public/styles/public-landing.css';
import '../styles/about.css';

const About = () => {
  const { hero, cycle, experience, principle } = aboutContent;

  return (
    <div className="landing-page public-page about-page">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero-section public-hero reveal-on-scroll">
        <div className="section-container">
          <div>
            <p className="public-hero-kicker">
              <span className="eyebrow-dot" />
              HSOCIETY / About
            </p>
            <h1 className="public-hero-title">{hero.title}</h1>
            <p className="public-hero-desc">{hero.description}</p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={() => window.location.assign('/services')}>
                Explore services
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => window.location.assign('/contact')}>
                Contact the team
              </button>
            </div>
          </div>
          <div className="public-hero-panel">
            <p className="public-badge">Cycle overview</p>
            <div className="public-list">
              {cycle.phases.slice(0, 4).map((phase) => (
                <div key={phase} className="public-list-item">
                  <span>{phase}</span>
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
              {cycle.title}
            </p>
            <h2 className="section-title">{cycle.title}</h2>
            <p className="section-subtitle">{cycle.subtitle}</p>
          </div>
          <div className="public-card-grid">
            {cycle.phases.map((phase, index) => (
              <article key={phase} className="public-card">
                <div className="public-card-meta">
                  <span className="public-chip">Phase {String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="public-card-title">{phase}</h3>
                <p className="public-card-desc">Operational focus within the HSOCIETY cycle.</p>
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
              {experience.title}
            </p>
            <h2 className="section-title">{experience.title}</h2>
            <p className="section-subtitle">{experience.subtitle}</p>
          </div>
          <div className="public-card-grid">
            {experience.cards.map((card) => (
              <article key={card.title} className="public-card">
                <h3 className="public-card-title">{card.title}</h3>
                <p className="public-card-desc">{card.description}</p>
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
              {principle.title}
            </p>
            <h2 className="section-title">{principle.title}</h2>
            <p className="section-subtitle">{principle.subtitle}</p>
          </div>
          <div className="public-card-grid">
            {principle.bullets.map((item, i) => (
              <article key={item} className="public-card">
                <div className="public-card-meta">
                  <span className="public-chip">Principle {i + 1}</span>
                </div>
                <p className="public-card-desc">{item}</p>
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
              Connect
            </p>
            <h2 className="section-title">Follow the HSOCIETY cycle.</h2>
            <p className="section-subtitle">Training, community, and live engagements — all in one place.</p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={() => window.location.assign('/contact')}>
                Contact us
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => window.location.assign('/services')}>
                View services
              </button>
            </div>
          </div>
          <div className="public-cta-card">
            <h3 className="public-card-title">Stay in the loop</h3>
            <p className="public-card-desc">Follow the latest research and community updates.</p>
            <SocialLinks className="about-social-links" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
