import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiTrendingUp,
  FiTarget,
  FiShield,
  FiZap,
  FiAward,
  FiCheckCircle,
  FiBarChart2,
} from 'react-icons/fi';
import Button from '../../shared/components/ui/Button';
import cpIcon from '../../assets/icons/CP/cp-icon.webp';
import '../../styles/cp-points/cp-points.css';

const CPPoints = () => {
  const navigate = useNavigate();

  const actions = useMemo(
    () => [
      {
        title: 'Complete mission labs',
        description:
          'Finish guided strike labs and earn stacked CP boosts with every verified objective.',
        icon: <FiTarget size={16} />,
        accent: 'alpha',
        badge: '+250 CP',
        tag: 'Labs',
      },
      {
        title: 'Ship real pentest wins',
        description:
          'Deliver findings, document remediations, and stack multipliers for high-impact reports.',
        icon: <FiShield size={16} />,
        accent: 'beta',
        badge: '+500 CP',
        tag: 'Reports',
      },
      {
        title: 'Stay on streak',
        description:
          'Daily progress unlocks streak bonuses that amplify every point you collect.',
        icon: <FiTrendingUp size={16} />,
        accent: 'gamma',
        badge: '2× boost',
        tag: 'Streak',
      },
    ],
    []
  );

  const stats = [
    { label: 'Momentum Score', value: 'Adaptive', icon: <FiBarChart2 size={14} /> },
    { label: 'Streak Boost',   value: 'Live',     icon: <FiZap size={14} /> },
    { label: 'Rank Signal',    value: 'Verified', icon: <FiCheckCircle size={14} /> },
  ];

  return (
    <div className="cp-page">

      {/* ── PAGE HEADER ─────────────────────────────── */}
      <header className="cp-page-header">
        <div className="cp-page-header-inner">
          <div className="cp-header-left">
            <img src={cpIcon} alt="CP" className="cp-header-icon" />
            <div>
              <div className="cp-header-breadcrumb">
                <span className="cp-breadcrumb-org">HSOCIETY</span>
                <span className="cp-breadcrumb-sep">/</span>
                <span className="cp-breadcrumb-repo">cp-points</span>
                <span className="cp-header-visibility">Public</span>
              </div>
              <p className="cp-header-desc">
                Your live reputation score. Every lab, report, and streak compounds
                your presence.
              </p>
            </div>
          </div>
          <div className="cp-header-actions">
            <button
              className="cp-btn cp-btn-secondary"
              onClick={() => navigate('/leaderboard')}
            >
              <FiAward size={14} />
              Leaderboard
            </button>
            <button
              className="cp-btn cp-btn-primary"
              onClick={() => navigate('/register')}
            >
              <FiZap size={14} />
              Start earning CP
            </button>
          </div>
        </div>

        {/* Stat row — GitHub repo meta row */}
        <div className="cp-header-meta">
          {stats.map((s) => (
            <span key={s.label} className="cp-meta-pill">
              {s.icon}
              <span className="cp-meta-label">{s.label}</span>
              <strong className="cp-meta-value">{s.value}</strong>
            </span>
          ))}
        </div>
      </header>

      {/* ── MAIN LAYOUT ─────────────────────────────── */}
      <div className="cp-layout">

        {/* ── LEFT / CONTENT COLUMN ─────────────────── */}
        <main className="cp-main">

          {/* Section: How CP works */}
          <section className="cp-section">
            <h2 className="cp-section-title">
              <FiZap size={16} className="cp-section-icon" />
              How CP works
            </h2>
            <div className="cp-action-grid">
              {actions.map((action) => (
                <article
                  key={action.title}
                  className={`cp-card cp-card-${action.accent}`}
                >
                  <div className="cp-card-header">
                    <span className="cp-card-icon">{action.icon}</span>
                    <span className={`cp-label cp-label-${action.accent}`}>
                      {action.badge}
                    </span>
                  </div>
                  <h3 className="cp-card-title">{action.title}</h3>
                  <p className="cp-card-desc">{action.description}</p>
                  <div className="cp-card-footer">
                    <span className={`cp-lang-dot cp-lang-dot-${action.accent}`} />
                    <span className="cp-lang-label">{action.tag}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="cp-divider" />

          {/* Section: Callout */}
          <section className="cp-section cp-callout-section">
            <div className="cp-callout-body">
              <p className="cp-callout-eyebrow">
                <FiAward size={13} />
                Why it matters
              </p>
              <h2 className="cp-callout-title">
                Turn every win into visible proof.
              </h2>
              <p className="cp-callout-desc">
                CP points feed your public profile, unlock priority community
                access, and open higher-stakes missions. Keep your streak active
                and your points will multiply.
              </p>
              <button
                className="cp-btn cp-btn-primary"
                onClick={() => navigate('/student-bootcamps')}
              >
                Jump into a mission
                <FiArrowUpRight size={14} />
              </button>
            </div>
          </section>

        </main>

        {/* ── RIGHT / SIDEBAR ───────────────────────── */}
        <aside className="cp-sidebar">

          {/* About box — GitHub repo sidebar */}
          <div className="cp-sidebar-box">
            <h3 className="cp-sidebar-heading">About</h3>
            <p className="cp-sidebar-about">
              CP is your operator reputation score on HSOCIETY — earned through
              labs, pentests, and daily streaks.
            </p>
            <div className="cp-sidebar-divider" />
            <ul className="cp-sidebar-list">
              <li>
                <FiCheckCircle size={14} className="cp-sidebar-list-icon" />
                Adaptive momentum scoring
              </li>
              <li>
                <FiCheckCircle size={14} className="cp-sidebar-list-icon" />
                Verified rank signals
              </li>
              <li>
                <FiCheckCircle size={14} className="cp-sidebar-list-icon" />
                Live streak multipliers
              </li>
              <li>
                <FiCheckCircle size={14} className="cp-sidebar-list-icon" />
                Public profile integration
              </li>
            </ul>
          </div>

          {/* Signal status box — GitHub Actions run */}
          <div className="cp-sidebar-box cp-signal-box">
            <div className="cp-signal-row">
              <span className="cp-signal-dot" />
              <span className="cp-signal-label">CP SIGNAL</span>
            </div>
            <strong className="cp-signal-value">ACTIVE</strong>
            <div className="cp-signal-track">
              <div className="cp-signal-fill" />
            </div>
            <p className="cp-signal-note">
              Every action is logged. Every point is traceable.
            </p>
          </div>

          {/* Topics — GitHub topic tags */}
          <div className="cp-sidebar-box">
            <h3 className="cp-sidebar-heading">Topics</h3>
            <div className="cp-topics">
              {['pentesting', 'gamification', 'reputation', 'offsec', 'streaks', 'labs'].map(
                (t) => (
                  <span key={t} className="cp-topic">{t}</span>
                )
              )}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
};

export default CPPoints;