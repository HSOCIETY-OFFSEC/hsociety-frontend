import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthModal from '../../../shared/hooks/useAuthModal';
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiClock,
  FiLayers,
  FiShield,
  FiCheckCircle,
  FiZap,
} from 'react-icons/fi';
import { HACKER_PROTOCOL_BOOTCAMP, HACKER_PROTOCOL_PHASES } from '../../../data/static/bootcamps/hackerProtocolData';
import { useAuth } from '../../../core/auth/AuthContext';
import '../../public/styles/public-landing.css';
import '../styles/courses.css';

const CourseDetails = () => {
  const { bootcampId } = useParams();
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  const { isAuthenticated } = useAuth();

  const handleEnroll = useCallback(() => {
    if (!isAuthenticated) {
      openAuthModal('register', { redirect: '/student-bootcamps' });
      return;
    }
    navigate('/student-bootcamps');
  }, [isAuthenticated, navigate, openAuthModal]);

  if (bootcampId !== 'hacker-protocol') {
    return (
      <div className="public-page public-page-inner crs-page">
        <div className="crs-not-found">Course not found.</div>
      </div>
    );
  }

  return (
    <div className="public-page public-page-inner crs-page">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero-section public-hero reveal-on-scroll">
        <div className="section-container">
          <div>
            <p className="public-hero-kicker">
              <span className="eyebrow-dot" />
              HSOCIETY / Courses / Hacker Protocol
            </p>
            <h1 className="public-hero-title">{HACKER_PROTOCOL_BOOTCAMP.title}</h1>
            <p className="public-hero-desc">{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={handleEnroll}>
                <FiZap size={14} />
                Enroll now
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/courses')}>
                <FiArrowLeft size={14} />
                Back to courses
              </button>
            </div>
            <div className="public-pill-row">
              <span className="public-pill">
                <FiClock size={12} />
                {HACKER_PROTOCOL_BOOTCAMP.duration}
              </span>
              <span className="public-pill">
                <FiLayers size={12} />
                {HACKER_PROTOCOL_BOOTCAMP.phases} phases
              </span>
              <span className="public-pill">
                <FiShield size={12} />
                Operator-led training
              </span>
            </div>
          </div>
          <div className="public-hero-panel">
            <div className="hs-signature" aria-hidden="true" />
            <p className="public-badge">Program highlights</p>
            <div className="public-list">
              {HACKER_PROTOCOL_BOOTCAMP.highlights?.map((item) => (
                <div key={item} className="public-list-item">
                  <FiCheckCircle size={14} />
                  <span>{item}</span>
                </div>
              ))}
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
              Phases
            </p>
            <h2 className="section-title">Bootcamp phases</h2>
            <p className="section-subtitle">Each phase builds toward supervised engagements.</p>
          </div>
          <div className="public-card-grid">
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
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className="public-cta reveal-on-scroll">
        <div className="section-container public-cta-inner">
          <div>
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Ready to enroll
            </p>
            <h2 className="section-title">Step into the Hacker Protocol cycle.</h2>
            <p className="section-subtitle">Get access to live labs, guided missions, and community support.</p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={handleEnroll}>
                Enroll now
                <FiArrowUpRight size={14} />
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/contact')}>
                Talk to us
              </button>
            </div>
          </div>
          <div className="public-cta-card">
            <div className="hs-signature" aria-hidden="true" />
            <h3 className="public-card-title">Bootcamp-ready operators.</h3>
            <p className="public-card-desc">Train with real-world context and supervised execution.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetails;
