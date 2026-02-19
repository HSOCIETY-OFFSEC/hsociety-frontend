import React from 'react';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import '../../styles/features/about.css';

const About = () => {
  useScrollReveal();

  const cyclePhases = [
    'Paid Training Entry',
    'Community Integration',
    'Supervised Real Engagements',
    'Skill Refresh & Specialization',
    'Professional Pentesting',
    'Cycle Repeats'
  ];

  return (
    <div className="about-page">
      <header className="about-hero reveal-on-scroll">
        <div className="about-hero-content">
          <p className="about-kicker">Mission</p>
          <h1>Build offensive security talent and deliver verified penetration testing.</h1>
          <p>
            HSOCIETY is a cycle-based offensive security platform. We train beginners, integrate them into a professional
            community, deploy them into supervised real-world engagements, and convert them into trusted penetration testers.
          </p>
        </div>
      </header>

      <section className="about-section about-cycle-section reveal-on-scroll">
        <div className="about-section-header">
          <h2>The 6-Phase Security Cycle</h2>
          <p>A structured loop that produces both skilled professionals and real security outcomes.</p>
        </div>
        <ol className="about-cycle-list">
          {cyclePhases.map((phase, index) => (
            <li key={phase} className="about-cycle-item">
              <span className="cycle-index">0{index + 1}</span>
              <span className="cycle-title">{phase}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="about-section reveal-on-scroll">
        <div className="about-section-header">
          <h2>Why Real Experience Matters</h2>
          <p>Professional penetration testing is learned by executing real work under supervision, not by theory alone.</p>
        </div>
        <div className="about-points-grid">
          <div className="about-point-card">
            <h3>Operational exposure</h3>
            <p>Students learn scoping, evidence collection, and reporting in real environments.</p>
          </div>
          <div className="about-point-card">
            <h3>Accountable delivery</h3>
            <p>Every engagement is reviewed by senior operators before findings are delivered.</p>
          </div>
          <div className="about-point-card">
            <h3>Career credibility</h3>
            <p>Graduates build professional portfolios tied to verified, supervised outcomes.</p>
          </div>
        </div>
      </section>

      <section className="about-section about-principle-section reveal-on-scroll">
        <div className="about-section-header">
          <h2>Execution Over Marketing</h2>
          <p>We measure impact by outcomes: real skills built, real vulnerabilities found, real fixes delivered.</p>
        </div>
        <ul className="about-principle-list">
          <li>Every engagement is scoped, authorized, and documented with reproducible evidence.</li>
          <li>Training is tied directly to live operational work, not abstract labs.</li>
          <li>Companies receive clear reporting, remediation guidance, and optional retesting.</li>
        </ul>
      </section>
    </div>
  );
};

export default About;
