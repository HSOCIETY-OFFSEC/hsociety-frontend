import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiClock,
  FiLayers,
  FiShield,
} from 'react-icons/fi';
import { HACKER_PROTOCOL_BOOTCAMP, HACKER_PROTOCOL_PHASES } from '../../../data/static/bootcamps/hackerProtocolData';
import PublicCardGrid from '../../../shared/components/public/PublicCardGrid';
import '../../public/styles/public-landing.css';
import '../styles/courses.css';

const Courses = () => {
  const navigate = useNavigate();

  return (
    <div className="public-page public-page-inner crs-page">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero-section public-hero reveal-on-scroll">
        <div className="section-container">
          <div>
            <p className="public-hero-kicker">
              <span className="eyebrow-dot" />
              HSOCIETY OFFSEC / Courses
            </p>
            <h1 className="public-hero-title">Operator-grade training programs.</h1>
            <p className="public-hero-desc">
              Structured programs built for skill progression, identity validation, and real-world deployment.
            </p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={() => navigate('/courses/hacker-protocol')}>
                View Hacker Protocol
                <FiArrowUpRight size={14} />
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/contact')}>
                Talk to us
              </button>
            </div>
            <div className="public-pill-row">
              <span className="public-pill">
                <FiShield size={12} />
                Programs 1 active
              </span>
              <span className="public-pill">
                <FiLayers size={12} />
                {HACKER_PROTOCOL_BOOTCAMP.phases} phases
              </span>
              <span className="public-pill">
                <FiClock size={12} />
                {HACKER_PROTOCOL_BOOTCAMP.duration}
              </span>
            </div>
          </div>
          <div className="public-hero-panel">
            <div className="hs-signature" aria-hidden="true" />
            <p className="public-badge">Featured program</p>
            <div className="crs-featured-panel">
              <img
                src={HACKER_PROTOCOL_BOOTCAMP.emblem}
                alt="Hacker Protocol emblem"
                className="crs-featured-emblem"
              />
              <div>
                <h3 className="public-card-title">{HACKER_PROTOCOL_BOOTCAMP.title}</h3>
                <p className="public-card-desc">{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>
              </div>
            </div>
            <div className="public-hero-stats">
              <span className="public-hero-stat">
                <strong>{HACKER_PROTOCOL_BOOTCAMP.phases}</strong> phases
              </span>
              <span className="public-hero-stat">
                <strong>{HACKER_PROTOCOL_BOOTCAMP.duration}</strong>
              </span>
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
              Program overview
            </p>
            <h2 className="section-title">{HACKER_PROTOCOL_BOOTCAMP.title}</h2>
            <p className="section-subtitle">{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>
          </div>
          <PublicCardGrid>
            {HACKER_PROTOCOL_PHASES.map((phase, index) => (
              <article key={phase.title} className="public-card">
                <div className="hs-signature" aria-hidden="true" />
                <div className="public-card-meta">
                  <span className="public-chip">Phase {index + 1}</span>
                </div>
                <h3 className="public-card-title">{phase.title}</h3>
                <p className="public-card-desc">{phase.summary}</p>
              </article>
            ))}
          </PublicCardGrid>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className="public-cta reveal-on-scroll">
        <div className="section-container public-cta-inner">
          <div>
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Ready to start
            </p>
            <h2 className="section-title">Start the Hacker Protocol journey.</h2>
            <p className="section-subtitle">Enroll in the bootcamp and move into supervised engagements.</p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={() => navigate('/courses/hacker-protocol')}>
                View curriculum
                <FiArrowUpRight size={14} />
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/student-bootcamps')}>
                Go to bootcamp
              </button>
            </div>
          </div>
          <div className="public-cta-card">
            <div className="hs-signature" aria-hidden="true" />
            <h3 className="public-card-title">Built by operators.</h3>
            <p className="public-card-desc">Learn with live labs, guided missions, and real-world context.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
