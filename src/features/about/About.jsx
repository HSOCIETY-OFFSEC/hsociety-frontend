import React from 'react';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import aboutContent from '../../data/about.json';
import '../../styles/features/about.css';

const About = () => {
  useScrollReveal();

  const { hero, cycle, experience, principle } = aboutContent;

  return (
    <div className="about-page">
      <header className="about-hero reveal-on-scroll">
        <div className="about-hero-content">
          <p className="about-kicker">{hero.kicker}</p>
          <h1>{hero.title}</h1>
          <p>{hero.description}</p>
        </div>
      </header>

      <section className="about-section about-cycle-section reveal-on-scroll">
        <div className="about-section-header">
          <h2>{cycle.title}</h2>
          <p>{cycle.subtitle}</p>
        </div>
        <ol className="about-cycle-list">
          {cycle.phases.map((phase, index) => (
            <li key={phase} className="about-cycle-item">
              <span className="cycle-index">0{index + 1}</span>
              <span className="cycle-title">{phase}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="about-section reveal-on-scroll">
        <div className="about-section-header">
          <h2>{experience.title}</h2>
          <p>{experience.subtitle}</p>
        </div>
        <div className="about-points-grid">
          {experience.cards.map((card) => (
            <div key={card.title} className="about-point-card">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section about-principle-section reveal-on-scroll">
        <div className="about-section-header">
          <h2>{principle.title}</h2>
          <p>{principle.subtitle}</p>
        </div>
        <ul className="about-principle-list">
          {principle.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default About;
