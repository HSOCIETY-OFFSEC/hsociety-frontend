/**
 * Careers Page
 * Location: src/features/careers/Careers.jsx
 *
 * GitHub repo-page layout:
 *   page header (breadcrumb + action) → two-column (main + sidebar)
 */

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
import '../../styles/sections/careers/index.css';

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
    <div className="car-page">

      {/* ── PAGE HEADER ─────────────────────────────── */}
      <header className="car-page-header">
        <div className="car-page-header-inner">

          <div className="car-header-left">
            <div className="car-header-icon-wrap">
              <FiBriefcase size={20} className="car-header-icon" />
            </div>
            <div>
              <div className="car-header-breadcrumb">
                <span className="car-breadcrumb-org">HSOCIETY</span>
                <span className="car-breadcrumb-sep">/</span>
                <span className="car-breadcrumb-page">careers</span>
                <span className="car-header-visibility">Public</span>
              </div>
              <p className="car-header-desc">
                We aren't hiring right now — but keep an eye on this page for
                future opportunities.
              </p>
            </div>
          </div>

          <div className="car-header-actions">
            <button
              className="car-btn car-btn-primary"
              onClick={() => navigate('/contact')}
            >
              <FiMessageSquare size={14} />
              Notify me
            </button>
          </div>
        </div>

        {/* Status meta pills */}
        <div className="car-header-meta">
          <span className="car-meta-pill car-meta-pill--paused">
            <span className="car-meta-dot car-meta-dot--paused" />
            <span>Hiring paused</span>
          </span>
          <span className="car-meta-pill">
            <FiClock size={13} className="car-meta-icon" />
            <span className="car-meta-label">Reopening</span>
            <strong className="car-meta-value">2026</strong>
          </span>
          <span className="car-meta-pill">
            <FiUsers size={13} className="car-meta-icon" />
            <span className="car-meta-label">Focus</span>
            <strong className="car-meta-value">Community first</strong>
          </span>
        </div>
      </header>

      {/* ── TWO-COLUMN LAYOUT ───────────────────────── */}
      <div className="car-layout">

        {/* ── MAIN COLUMN ─────────────────────────── */}
        <main className="car-main">

          {/* Status section */}
          <section className="car-section">
            <h2 className="car-section-title">
              <FiBriefcase size={15} className="car-section-icon" />
              Open positions
            </h2>
            <p className="car-section-desc">
              We are pausing hiring while we focus on internal programs and
              training. We'll post all new roles here when the window reopens.
            </p>

            {/* Empty state — GitHub "no results" pattern */}
            <div className="car-empty-state">
              <div className="car-empty-icon-wrap">
                <FiBriefcase size={24} className="car-empty-icon" />
              </div>
              <strong className="car-empty-title">No open roles right now</strong>
              <p className="car-empty-desc">
                We aren't hiring at the moment. Check back in 2026 or leave
                your details via the contact page and we'll reach out.
              </p>
              <button
                className="car-btn car-btn-secondary"
                onClick={() => navigate('/contact')}
              >
                Get notified
                <FiArrowUpRight size={13} />
              </button>
            </div>
          </section>

          <div className="car-divider" />

          {/* Info cards */}
          <section className="car-section">
            <h2 className="car-section-title">
              <FiMessageSquare size={15} className="car-section-icon" />
              Updates
            </h2>

            <div className="car-status-list">
              {STATUS_CARDS.map((card) => (
                <article key={card.title} className="car-status-card">
                  <strong className="car-status-title">{card.title}</strong>
                  <p className="car-status-body">{card.body}</p>
                </article>
              ))}
            </div>
          </section>

        </main>

        {/* ── SIDEBAR ─────────────────────────────── */}
        <aside className="car-sidebar">

          <div className="car-sidebar-box">
            <h3 className="car-sidebar-heading">About</h3>
            <p className="car-sidebar-about">
              HSOCIETY is a hacker-focused learning and security platform. We
              build community before we scale headcount.
            </p>
            <div className="car-sidebar-divider" />
            <ul className="car-sidebar-list">
              <li>
                <FiCheckCircle size={13} className="car-sidebar-icon" />
                Remote-first culture
              </li>
              <li>
                <FiCheckCircle size={13} className="car-sidebar-icon" />
                Operators & builders
              </li>
              <li>
                <FiCheckCircle size={13} className="car-sidebar-icon" />
                Analyst & mentor roles
              </li>
              <li>
                <FiCheckCircle size={13} className="car-sidebar-icon" />
                Community-driven
              </li>
            </ul>
          </div>

          {/* Hiring status box */}
          <div className="car-sidebar-box car-status-box">
            <div className="car-status-row">
              <span className="car-status-dot" />
              <span className="car-status-label">HIRING STATUS</span>
            </div>
            <strong className="car-status-value">PAUSED</strong>
            <div className="car-status-track">
              <div className="car-status-fill" />
            </div>
            <p className="car-status-note">
              Reopening in 2026. Leave your details via contact.
            </p>
          </div>

          <div className="car-sidebar-box">
            <h3 className="car-sidebar-heading">Topics</h3>
            <div className="car-topics">
              {['careers', 'hiring', 'offsec', 'analysts', 'mentors', 'remote'].map(
                (t) => <span key={t} className="car-topic">{t}</span>
              )}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
};

export default Careers;