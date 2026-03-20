/**
 * Courses Page
 * Location: src/features/courses/Courses.jsx
 *
 * GitHub repo-page layout:
 *   page header (breadcrumb + actions) → two-column (main + sidebar)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiClock,
  FiLayers,
  FiShield,
  FiChevronRight,
  FiCheckCircle,
  FiBook,
} from 'react-icons/fi';
import { HACKER_PROTOCOL_BOOTCAMP, HACKER_PROTOCOL_PHASES } from '../../../data/static/bootcamps/hackerProtocolData';
import '../styles/courses.css';

const Courses = () => {
  const navigate = useNavigate();

  return (
    <div className="crs-page">

      {/* ── PAGE HEADER ─────────────────────────────── */}
      <header className="crs-page-header">
        <div className="crs-page-header-inner">
          <div className="crs-header-left">
            <div className="crs-header-icon-wrap">
              <FiBook size={20} className="crs-header-icon" />
            </div>
            <div>
              <div className="crs-header-breadcrumb">
                <span className="crs-breadcrumb-org">HSOCIETY</span>
                <span className="crs-breadcrumb-sep">/</span>
                <span className="crs-breadcrumb-page">courses</span>
                <span className="crs-header-visibility">Public</span>
              </div>
              <p className="crs-header-desc">
                Structured programs built for skill progression, identity validation,
                and real-world deployment.
              </p>
            </div>
          </div>
        </div>

        {/* Meta pills */}
        <div className="crs-header-meta">
          <span className="crs-meta-pill">
            <FiShield size={13} className="crs-meta-icon" />
            <span className="crs-meta-label">Programs</span>
            <strong className="crs-meta-value">1 active</strong>
          </span>
          <span className="crs-meta-pill">
            <FiLayers size={13} className="crs-meta-icon" />
            <span className="crs-meta-label">Phases</span>
            <strong className="crs-meta-value">{HACKER_PROTOCOL_BOOTCAMP.phases}</strong>
          </span>
          <span className="crs-meta-pill">
            <FiClock size={13} className="crs-meta-icon" />
            <span className="crs-meta-label">Duration</span>
            <strong className="crs-meta-value">{HACKER_PROTOCOL_BOOTCAMP.duration}</strong>
          </span>
        </div>
      </header>

      {/* ── TWO-COLUMN LAYOUT ───────────────────────── */}
      <div className="crs-layout">

        {/* ── MAIN COLUMN ─────────────────────────── */}
        <main className="crs-main">

          {/* Featured program */}
          <section className="crs-section">
            <h2 className="crs-section-title">
              <FiShield size={15} className="crs-section-icon" />
              Featured program
            </h2>

            <article
              className="crs-featured-card"
              onClick={() => navigate('/courses/hacker-protocol')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/courses/hacker-protocol');
                }
              }}
            >
              {/* Emblem */}
              <div className="crs-featured-emblem-col">
                <img
                  src={HACKER_PROTOCOL_BOOTCAMP.emblem}
                  alt="Hacker Protocol emblem"
                  className="crs-featured-emblem"
                />
              </div>

              {/* Body */}
              <div className="crs-featured-body">
                <div className="crs-featured-header-row">
                  <span className="crs-label crs-label-alpha">Featured Program</span>
                  <FiArrowUpRight size={14} className="crs-featured-arrow" />
                </div>
                <h3 className="crs-featured-title">{HACKER_PROTOCOL_BOOTCAMP.title}</h3>
                <p className="crs-featured-sub">{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>
                <div className="crs-chip-row">
                  <span className="crs-chip">
                    <FiClock size={12} />
                    {HACKER_PROTOCOL_BOOTCAMP.duration}
                  </span>
                  <span className="crs-chip">
                    <FiLayers size={12} />
                    {HACKER_PROTOCOL_BOOTCAMP.phases} phases
                  </span>
                </div>
              </div>
            </article>
          </section>

          <div className="crs-divider" />

          {/* Phases list */}
          <section className="crs-section">
            <h2 className="crs-section-title">
              <FiLayers size={15} className="crs-section-icon" />
              Hacker Protocol phases
            </h2>
            <p className="crs-section-desc">
              Select a phase to inspect operative requirements and room breakdown.
            </p>

            <div className="crs-phase-list">
              {HACKER_PROTOCOL_PHASES.map((phase, i) => (
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
                      <span className="crs-phase-id">
                        P-{String(phase.moduleId).padStart(2, '0')}
                      </span>
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

        {/* ── SIDEBAR ─────────────────────────────── */}
        <aside className="crs-sidebar">

          <div className="crs-sidebar-box">
            <h3 className="crs-sidebar-heading">About</h3>
            <p className="crs-sidebar-about">
              {HACKER_PROTOCOL_BOOTCAMP.overview}
            </p>
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
            <p className="crs-status-note">
              Accepting new students. Self-paced delivery.
            </p>
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

export default Courses;