import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiTrendingUp,
  FiTarget,
  FiShield,
  FiZap,
  FiCheckCircle,
  FiBarChart2,
} from 'react-icons/fi';
import cpIcon from '../../../assets/icons/CP/cp-icon.webp';
import PublicCardGrid from '../../../shared/components/public/PublicCardGrid';
import '../../public/styles/public-landing.css';
import '../styles/cp-points.css';

const CPPoints = () => {
  const navigate = useNavigate();

  const actions = useMemo(
    () => [
      {
        title: 'Complete mission labs',
        description:
          'Finish guided strike labs and earn stacked CP boosts with every verified objective.',
        icon: <FiTarget size={16} />,
        badge: '+250 CP',
      },
      {
        title: 'Ship real pentest wins',
        description:
          'Deliver findings, document remediations, and stack multipliers for high-impact reports.',
        icon: <FiShield size={16} />,
        badge: '+500 CP',
      },
      {
        title: 'Stay on streak',
        description:
          'Daily progress unlocks streak bonuses that amplify every point you collect.',
        icon: <FiTrendingUp size={16} />,
        badge: '2× boost',
      },
    ],
    []
  );

  const stats = [
    { label: 'Momentum Score', value: 'Adaptive', icon: <FiBarChart2 size={14} /> },
    { label: 'Streak Boost', value: 'Live', icon: <FiZap size={14} /> },
    { label: 'Rank Signal', value: 'Verified', icon: <FiCheckCircle size={14} /> },
  ];

  return (
    <div className="public-page public-page-inner cp-page">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero-section public-hero reveal-on-scroll">
        <div className="section-container">
          <div>
            <p className="public-hero-kicker">
              <span className="eyebrow-dot" />
              HSOCIETY OFFSEC / CP Points
            </p>
            <h1 className="public-hero-title">Your operator reputation score.</h1>
            <p className="public-hero-desc">
              Every lab, report, and streak compounds your presence. CP Points are the signal.
            </p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={() => navigate('/courses')}>
                Start a program
                <FiArrowUpRight size={14} />
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/leaderboard')}>
                View leaderboard
              </button>
            </div>
            <div className="public-pill-row">
              {stats.map((stat) => (
                <span key={stat.label} className="public-pill">
                  {stat.icon}
                  {stat.label}: {stat.value}
                </span>
              ))}
            </div>
          </div>
          <div className="public-hero-panel">
            
            <p className="public-badge">CP icon</p>
            <img src={cpIcon} alt="CP" className="cp-hero-icon" />
            <div className="public-hero-stats">
              <span className="public-hero-stat">
                <strong>Daily</strong> streaks
              </span>
              <span className="public-hero-stat">
                <strong>Live</strong> leaderboard
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
              Earn CP
            </p>
            <h2 className="section-title">Ways to stack Compromised Points.</h2>
            <p className="section-subtitle">Each action compounds your operator signal.</p>
          </div>
          <PublicCardGrid>
            {actions.map((action) => (
              <article key={action.title} className="public-card">
                <div className="hs-signature" aria-hidden="true" />
                <div className="public-card-meta">
                  <span className="public-chip">{action.badge}</span>
                </div>
                <h3 className="public-card-title">{action.title}</h3>
                <p className="public-card-desc">{action.description}</p>
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
              Ready to rank up
            </p>
            <h2 className="section-title">Start collecting CP Points today.</h2>
            <p className="section-subtitle">Join a bootcamp or run live missions to stack your signal.</p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={() => navigate('/courses')}>
                View programs
                <FiArrowUpRight size={14} />
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/contact')}>
                Talk to us
              </button>
            </div>
          </div>
          <div className="public-cta-card">
            <div className="hs-signature" aria-hidden="true" />
            <h3 className="public-card-title">Operators earn, operators rise.</h3>
            <p className="public-card-desc">Every verified mission pushes your ranking forward.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CPPoints;
