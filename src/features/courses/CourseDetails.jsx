/**
 * Course Details Page
 * Location: src/features/courses/CourseDetails.jsx
 */

import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthModal from '../../shared/hooks/useAuthModal';
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiClock,
  FiLayers,
  FiShield,
  FiChevronRight,
  FiCheckCircle,
  FiBook,
  FiZap,
} from 'react-icons/fi';
import { HACKER_PROTOCOL_BOOTCAMP, HACKER_PROTOCOL_PHASES } from '../../data/bootcamps/hackerProtocolData';
import { useAuth } from '../../core/auth/AuthContext';
import './courses.css';

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
      <div className="crs-page">
        <div className="crs-not-found">Course not found.</div>
      </div>
    );
  }

  return (
    <div className="crs-page">

      {/* ── PAGE HEADER ─────────────────────────────── */}
      <header className="crs-page-header">
        <div className="crs-page-header-inner">
          <div className="crs-header-left">
            <div className="crs-header-icon-wrap">
              <FiShield size={20} className="crs-header-icon" />
            </div>
            <div>
              <div className="crs-header-breadcrumb">
                <button className="crs-breadcrumb-link" onClick={() => navigate('/courses')}>
                  courses
                </button>
                <span className="crs-breadcrumb-sep">/</span>
                <span className="crs-breadcrumb-page">hacker-protocol</span>
              </div>
              <p className="crs-header-desc">{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>
            </div>
          </div>

          <div className="crs-header-actions">
            <button className="crs-btn crs-btn-secondary" onClick={() => navigate('/courses')}>
              <FiArrowLeft size={14} />
              Back
            </button>
            <button className="crs-btn crs-btn-primary" onClick={handleEnroll}>
              <FiZap size={14} />
              Enroll now
            </button>
          </div>
        </div>

        <div className="crs-header-meta">
          <span className="crs-meta-pill">
            <FiClock size={13} className="crs-meta-icon" />
            <span className="crs-meta-label">Duration</span>
            <strong className="crs-meta-value">{HACKER_PROTOCOL_BOOTCAMP.duration}</strong>
          </span>
          <span className="crs-meta-pill">
            <FiLayers size={13} className="crs-meta-icon" />
            <span className="crs-meta-label">Phases</span>
            <strong className="crs-meta-value">{HACKER_PROTOCOL_BOOTCAMP.phases}</strong>
          </span>
        </div>
      </header>

      {/* ── TWO-COLUMN LAYOUT ───────────────────────── */}
      <div className="crs-layout">
        <main className="crs-main">

          <section className="crs-section">
            <h2 className="crs-section-title">
              <FiLayers size={15} className="crs-section-icon" />
              Select your phase
            </h2>
            <p className="crs-section-desc">
              Each phase unlocks a new operative identity and skill tier.
            </p>

            <div className="crs-phase-list">
              {HACKER_PROTOCOL_PHASES.map((phase) => (
                <article
                  key={phase.moduleId}
                  className="crs-phase-row"
                  onClick={() => navigate(`/courses/hacker-protocol/modules/${phase.moduleId}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/courses/hacker-protocol/modules/${phase.moduleId}`);
                    }
                  }}
                >
                  <div className="crs-phase-emblem-wrap">
                    <img src={phase.emblem} alt={phase.codename} className="crs-phase-emblem" />
                  </div>
                  <div className="crs-phase-text">
                    <div className="crs-phase-meta-row">
                      <span className="crs-phase-id">P-{String(phase.moduleId).padStart(2, '0')}</span>
                      <span className="crs-label crs-label-alpha">{phase.roleTitle}</span>
                    </div>
                    <strong className="crs-phase-codename">{phase.codename}</strong>
                  </div>
                  <FiChevronRight size={14} className="crs-phase-arrow" />
                </article>
              ))}
            </div>
          </section>

        </main>

        <aside className="crs-sidebar">
          <div className="crs-sidebar-box">
            <h3 className="crs-sidebar-heading">About</h3>
            <p className="crs-sidebar-about">{HACKER_PROTOCOL_BOOTCAMP.overview}</p>
            <div className="crs-sidebar-divider" />
            <ul className="crs-sidebar-list">
              <li><FiCheckCircle size={13} className="crs-sidebar-icon" />Structured phase progression</li>
              <li><FiCheckCircle size={13} className="crs-sidebar-icon" />Real-world pentest rooms</li>
              <li><FiCheckCircle size={13} className="crs-sidebar-icon" />Verified operative identity</li>
              <li><FiCheckCircle size={13} className="crs-sidebar-icon" />CP points on completion</li>
            </ul>
          </div>

          <div className="crs-sidebar-box crs-status-box">
            <div className="crs-status-row">
              <span className="crs-status-dot" />
              <span className="crs-status-label">ENROLLMENT</span>
            </div>
            <strong className="crs-status-value">OPEN</strong>
            <div className="crs-status-track">
              <div className="crs-status-fill" />
            </div>
            <p className="crs-status-note">Accepting new students. Self-paced.</p>
          </div>

          <div className="crs-sidebar-box">
            <h3 className="crs-sidebar-heading">Topics</h3>
            <div className="crs-topics">
              {['pentesting', 'offsec', 'red-team', 'training', 'labs', 'hsociety'].map(
                (t) => <span key={t} className="crs-topic">{t}</span>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseDetails;