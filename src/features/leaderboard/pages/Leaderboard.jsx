import React, { useEffect, useMemo, useState } from 'react';
import {
  FiBarChart2,
  FiCheckCircle,
  FiUsers,
  FiZap,
  FiTrendingUp,
  FiArrowUpRight,
} from 'react-icons/fi';
import LeaderboardTable from '../components/LeaderboardTable';
import { getLeaderboard } from '../services/leaderboard.service';
import { extractLeaderboardEntries } from '../services/leaderboard.utils';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import '../../public/styles/public-landing.css';
import '../styles/leaderboard.css';

const Leaderboard = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const response = await getLeaderboard(50);
      if (!mounted) return;
      if (!response.success) {
        setError(getPublicErrorMessage({ action: 'load', response }));
        setLoading(false);
        return;
      }
      const payload = response.data?.leaderboard || response.data;
      setEntries(extractLeaderboardEntries(payload));
      setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  const statusMessage = useMemo(() => {
    if (loading) return 'Loading leaderboard...';
    if (error) return error;
    return null;
  }, [loading, error]);

  const totalEntries = entries.length;
  const topStreak = entries[0]?.streakDays ?? '—';
  const topCp = entries[0]?.totalXp ?? '—';

  return (
    <div className="landing-page public-page lb-page">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero-section public-hero reveal-on-scroll">
        <div className="section-container">
          <div>
            <p className="public-hero-kicker">
              <span className="eyebrow-dot" />
              HSOCIETY / Leaderboard
            </p>
            <h1 className="public-hero-title">Top operators in the community.</h1>
            <p className="public-hero-desc">
              Rankings based on Compromised Points, streaks, and verified learning milestones.
            </p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={() => window.location.assign('/community')}>
                Join the community
                <FiArrowUpRight size={14} />
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => window.location.assign('/cp-points')}>
                Learn about CP points
              </button>
            </div>
            <div className="public-pill-row">
              <span className="public-pill">
                <FiUsers size={12} />
                {totalEntries} operators
              </span>
              <span className="public-pill">
                <FiTrendingUp size={12} />
                Top streak {topStreak}
              </span>
              <span className="public-pill">
                <FiZap size={12} />
                Top CP {topCp}
              </span>
            </div>
          </div>
          <div className="public-hero-panel">
            <p className="public-badge">Leaderboard signals</p>
            <div className="public-list">
              <div className="public-list-item">
                <FiCheckCircle size={14} />
                <span>Verified mission completions.</span>
              </div>
              <div className="public-list-item">
                <FiCheckCircle size={14} />
                <span>Daily streak multipliers.</span>
              </div>
              <div className="public-list-item">
                <FiCheckCircle size={14} />
                <span>Community contribution weight.</span>
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
              Rankings
            </p>
            <h2 className="section-title">Current operator leaderboard.</h2>
            <p className="section-subtitle">Updated with every verified mission and streak.</p>
          </div>
          <div className="public-surface">
            {statusMessage ? (
              <p className="lb-status">{statusMessage}</p>
            ) : (
              <LeaderboardTable entries={entries} />
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className="public-cta reveal-on-scroll">
        <div className="section-container public-cta-inner">
          <div>
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Rank up
            </p>
            <h2 className="section-title">Start earning Compromised Points.</h2>
            <p className="section-subtitle">Complete labs, ship reports, and build streak momentum.</p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={() => window.location.assign('/courses')}>
                View programs
                <FiArrowUpRight size={14} />
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => window.location.assign('/cp-points')}>
                CP Points guide
              </button>
            </div>
          </div>
          <div className="public-cta-card">
            <h3 className="public-card-title">Operators only.</h3>
            <p className="public-card-desc">Train, execute, and earn your position on the board.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Leaderboard;
