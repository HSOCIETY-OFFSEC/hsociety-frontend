import React from 'react';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import aboutContent from '../../data/about.json';
import SocialLinks from '../../shared/components/common/SocialLinks';
import '../../styles/sections/about/index.css';

const About = () => {
  useScrollReveal();

  const { hero, cycle, experience, principle } = aboutContent;

  return (
    <div className="about-page">

      {/* ── Hero ─────────────────────────────────────────── */}
      <header className="about-hero reveal-on-scroll">
        <div className="about-hero-inner">

          {/* Top bar */}
          <div className="about-hero-topbar">
            <span className="about-tag">HSOCIETY // ABOUT</span>
            <span className="about-tag about-tag--dim">EST. 2024</span>
          </div>

          {/* Title block */}
          <div className="about-hero-body">
            <div className="about-hero-left">
              <p className="about-kicker">
                <span className="about-kicker-glyph" aria-hidden="true">◈</span>
                {hero.kicker}
              </p>
              <h1 className="about-hero-title">{hero.title}</h1>
              <p className="about-hero-desc">{hero.description}</p>
            </div>

            <aside className="about-hero-right" aria-hidden="true">
              <div className="about-stat-block">
                <span className="about-stat-num">06</span>
                <span className="about-stat-label">CYCLE<br/>PHASES</span>
              </div>
              <div className="about-stat-divider" />
              <div className="about-stat-block">
                <span className="about-stat-num">∞</span>
                <span className="about-stat-label">CONTINUOUS<br/>PIPELINE</span>
              </div>
            </aside>
          </div>

          {/* Bottom strip */}
          <div className="about-hero-strip">
            <span>TRAIN</span>
            <span className="strip-dot" aria-hidden="true" />
            <span>DEPLOY</span>
            <span className="strip-dot" aria-hidden="true" />
            <span>EXECUTE</span>
            <span className="strip-dot" aria-hidden="true" />
            <span>REPEAT</span>
          </div>
        </div>
      </header>

      {/* ── Cycle / Phases ───────────────────────────────── */}
      <section
        className="about-section about-cycle-section reveal-on-scroll"
        aria-labelledby="cycle-heading"
      >
        <div className="about-section-label">
          <span className="section-code" aria-hidden="true">SYS::01</span>
          <span className="section-rule" aria-hidden="true" />
        </div>

        <div className="about-section-body">
          <div className="about-section-intro">
            <h2 id="cycle-heading">{cycle.title}</h2>
            <p>{cycle.subtitle}</p>
          </div>

          <ol className="about-cycle-list" aria-label="Security cycle phases">
            {cycle.phases.map((phase, index) => (
              <li key={phase} className="about-cycle-item">
                <div className="cycle-connector" aria-hidden="true">
                  <span className="cycle-node" />
                  {index < cycle.phases.length - 1 && (
                    <span className="cycle-line" />
                  )}
                </div>
                <div className="cycle-content">
                  <span className="cycle-index" aria-hidden="true">
                    PHASE_{String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="cycle-title">{phase}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Experience / Cards ───────────────────────────── */}
      <section
        className="about-section about-experience-section reveal-on-scroll"
        aria-labelledby="experience-heading"
      >
        <div className="about-section-label">
          <span className="section-code" aria-hidden="true">SYS::02</span>
          <span className="section-rule" aria-hidden="true" />
        </div>

        <div className="about-section-body">
          <div className="about-section-intro">
            <h2 id="experience-heading">{experience.title}</h2>
            <p>{experience.subtitle}</p>
          </div>

          <div className="about-points-grid">
            {experience.cards.map((card, i) => (
              <article
                key={card.title}
                className="about-point-card"
                style={{ '--card-index': i }}
              >
                <div className="card-header">
                  <span className="card-index" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="card-corner" aria-hidden="true" />
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Principles ───────────────────────────────────── */}
      <section
        className="about-section about-principle-section reveal-on-scroll"
        aria-labelledby="principle-heading"
      >
        <div className="about-section-label">
          <span className="section-code" aria-hidden="true">SYS::03</span>
          <span className="section-rule" aria-hidden="true" />
        </div>

        <div className="about-section-body">
          <div className="about-section-intro">
            <h2 id="principle-heading">{principle.title}</h2>
            <p>{principle.subtitle}</p>
          </div>

          <ul className="about-principle-list" aria-label="Core principles">
            {principle.bullets.map((item, i) => (
              <li key={item} className="about-principle-item">
                <span className="principle-index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="principle-text">{item}</span>
                <span className="principle-arrow" aria-hidden="true">→</span>
              </li>
            ))}
          </ul>

          {/* Core doctrine callout */}
          <blockquote className="about-doctrine">
            <span className="doctrine-marker" aria-hidden="true">[ DOCTRINE ]</span>
            <p>Execution over marketing.<br />Real experience over theory.</p>
          </blockquote>
        </div>
      </section>

      <section className="about-section about-social-section reveal-on-scroll" aria-label="Social links">
        <div className="about-section-label">
          <span className="section-code" aria-hidden="true">SYS::04</span>
          <span className="section-rule" aria-hidden="true" />
        </div>
        <div className="about-section-body">
          <div className="about-section-intro">
            <h2>Connect with HSOCIETY</h2>
            <p>Follow the latest research, community updates, and training launches.</p>
          </div>
          <SocialLinks className="about-social-links" />
        </div>
      </section>

    </div>
  );
};

export default About;
