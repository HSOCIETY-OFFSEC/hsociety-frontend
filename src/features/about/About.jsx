import React from 'react';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import aboutContent from '../../data/about.json';
import '../../styles/sections/about/index.css';

const About = () => {
  useScrollReveal();

  const { hero, cycle, experience, principle } = aboutContent;

  return (
    <div className="about-page">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="about-hero reveal-on-scroll">
        <div className="about-hero-inner">
          <div className="about-hero-text">
            <p className="about-kicker">
              <span className="about-kicker-line" aria-hidden="true" />
              {hero.kicker}
            </p>
            <h1 className="about-hero-title">{hero.title}</h1>
            <p className="about-hero-desc">{hero.description}</p>
          </div>
          <div className="about-hero-accent" aria-hidden="true">
            <span className="about-hero-index">00</span>
          </div>
        </div>
      </header>

      {/* ── Cycle / Phases ───────────────────────────────────── */}
      <section
        className="about-section about-cycle-section reveal-on-scroll"
        aria-labelledby="cycle-heading"
      >
        <div className="about-section-head">
          <div className="about-section-meta">
            <span className="about-section-num" aria-hidden="true">01</span>
            <span className="about-section-rule" aria-hidden="true" />
          </div>
          <div className="about-section-copy">
            <h2 id="cycle-heading">{cycle.title}</h2>
            <p>{cycle.subtitle}</p>
          </div>
        </div>

        <ol className="about-cycle-list" aria-label="Security cycle phases">
          {cycle.phases.map((phase, index) => (
            <li key={phase} className="about-cycle-item">
              <span className="cycle-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="cycle-title">{phase}</span>
              <span className="cycle-arrow" aria-hidden="true">→</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Experience / Cards ───────────────────────────────── */}
      <section
        className="about-section about-experience-section reveal-on-scroll"
        aria-labelledby="experience-heading"
      >
        <div className="about-section-head">
          <div className="about-section-meta">
            <span className="about-section-num" aria-hidden="true">02</span>
            <span className="about-section-rule" aria-hidden="true" />
          </div>
          <div className="about-section-copy">
            <h2 id="experience-heading">{experience.title}</h2>
            <p>{experience.subtitle}</p>
          </div>
        </div>

        <div className="about-points-grid">
          {experience.cards.map((card, i) => (
            <article
              key={card.title}
              className="about-point-card"
              style={{ '--card-index': i }}
            >
              <span className="about-point-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Principles ───────────────────────────────────────── */}
      <section
        className="about-section about-principle-section reveal-on-scroll"
        aria-labelledby="principle-heading"
      >
        <div className="about-section-head">
          <div className="about-section-meta">
            <span className="about-section-num" aria-hidden="true">03</span>
            <span className="about-section-rule" aria-hidden="true" />
          </div>
          <div className="about-section-copy">
            <h2 id="principle-heading">{principle.title}</h2>
            <p>{principle.subtitle}</p>
          </div>
        </div>

        <ul className="about-principle-list" aria-label="Core principles">
          {principle.bullets.map((item, i) => (
            <li key={item} className="about-principle-item">
              <span className="principle-marker" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="principle-text">{item}</span>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
};

export default About;