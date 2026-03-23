import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiMessageSquare,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiArrowUpRight,
} from 'react-icons/fi';
import '../../public/styles/public-landing.css';
import '../styles/careers.css';

const STATUS_CARDS = [
  {
    title: "What's next?",
    body: "We are enhancing bootcamp programming and internal delivery before opening new roles. Follow our updates or revisit this page later in 2026 to review new openings.",
  },
  {
    title: 'Want to stay informed?',
    body: "The next batch of roles will include analysts, builders, and mentors. Drop us a note today and we will reach out when the hiring window reopens.",
  },
];

const Careers = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page public-page car-page">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero-section public-hero reveal-on-scroll">
        <div className="section-container">
          <div>
            <p className="public-hero-kicker">
              <span className="eyebrow-dot" />
              HSOCIETY / Careers
            </p>
            <h1 className="public-hero-title">We’re pausing hiring to scale the platform.</h1>
            <p className="public-hero-desc">
              We aren’t hiring right now — but keep an eye on this page for future opportunities.
            </p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={() => navigate('/contact')}>
                <FiMessageSquare size={14} />
                Notify me
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/team')}>
                Meet the team
                <FiArrowUpRight size={14} />
              </button>
            </div>
            <div className="public-pill-row">
              <span className="public-pill">
                <FiClock size={12} />
                Hiring paused
              </span>
              <span className="public-pill">
                <FiUsers size={12} />
                Community first
              </span>
              <span className="public-pill">Reopening 2026</span>
            </div>
          </div>
          <div className="public-hero-panel">
            <p className="public-badge">Status</p>
            <div className="public-list">
              <div className="public-list-item">
                <FiBriefcase size={14} />
                <span>No open roles right now.</span>
              </div>
              <div className="public-list-item">
                <FiCheckCircle size={14} />
                <span>Updates announced via email.</span>
              </div>
              <div className="public-list-item">
                <FiMessageSquare size={14} />
                <span>Reach out for future openings.</span>
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
              Hiring update
            </p>
            <h2 className="section-title">What we’re focused on now.</h2>
            <p className="section-subtitle">We’re refining internal delivery and training before the next hiring wave.</p>
          </div>
          <div className="public-card-grid">
            {STATUS_CARDS.map((card) => (
              <article key={card.title} className="public-card">
                <div className="public-card-meta">
                  <span className="public-chip">Status</span>
                </div>
                <h3 className="public-card-title">{card.title}</h3>
                <p className="public-card-desc">{card.body}</p>
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
              Stay close
            </p>
            <h2 className="section-title">Want to be first in line?</h2>
            <p className="section-subtitle">We’ll notify you when new roles are posted.</p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={() => navigate('/contact')}>
                Join the list
                <FiArrowUpRight size={14} />
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/community')}>
                Join the community
              </button>
            </div>
          </div>
          <div className="public-cta-card">
            <h3 className="public-card-title">Roles include analysts, builders, mentors.</h3>
            <p className="public-card-desc">We hire operators with real-world engagement experience.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
