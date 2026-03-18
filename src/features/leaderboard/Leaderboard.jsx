/**
 * Leaderboard Page
 * Location: src/features/leaderboard/Leaderboard.jsx
 *
 * GitHub repo-page layout:
 *   page header (breadcrumb + meta pills) → two-column (main + sidebar)
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  FiBarChart2,
  FiCheckCircle,
  FiUsers,
  FiZap,
  FiTrendingUp,
} from 'react-icons/fi';
import LeaderboardTable from './components/LeaderboardTable';
import { getLeaderboard } from './leaderboard.service';
import { extractLeaderboardEntries } from './leaderboard.utils';
import { getPublicErrorMessage } from '../../shared/utils/errors/publicError';
import './leaderboard.css';

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
    <div className="lb-page">

      {/* ── PAGE HEADER ─────────────────────────────── */}
      <header className="lb-page-header">
        <div className="lb-page-header-inner">

          <div className="lb-header-left">
            <div className="lb-header-icon-wrap">
              <FiBarChart2 size={20} className="lb-header-icon" />
            </div>
            <div>
              <div className="lb-header-breadcrumb">
                <span className="lb-breadcrumb-org">HSOCIETY</span>
                <span className="lb-breadcrumb-sep">/</span>
                <span className="lb-breadcrumb-page">leaderboard</span>
                <span className="lb-header-visibility">Public</span>
              </div>
              <p className="lb-header-desc">
                Top operators ranked by Compromised Points and learning streaks.
              </p>
            </div>
          </div>

          {/* No action buttons — read-only page */}
        </div>

        {/* Meta pills */}
        <div className="lb-header-meta">
          <span className="lb-meta-pill">
            <FiUsers size={13} className="lb-meta-icon" />
            <span className="lb-meta-label">Operators ranked</span>
            <strong className="lb-meta-value">
              {loading ? '—' : totalEntries}
            </strong>
          </span>
          <span className="lb-meta-pill">
            <FiZap size={13} className="lb-meta-icon" />
            <span className="lb-meta-label">Top streak</span>
            <strong className="lb-meta-value">
              {loading ? '—' : `${topStreak}d`}
            </strong>
          </span>
          <span className="lb-meta-pill">
            <FiTrendingUp size={13} className="lb-meta-icon" />
            <span className="lb-meta-label">Top CP</span>
            <strong className="lb-meta-value">
              {loading ? '—' : topCp}
            </strong>
          </span>
        </div>
      </header>

      {/* ── TWO-COLUMN LAYOUT ───────────────────────── */}
      <div className="lb-layout">

        {/* ── MAIN COLUMN ─────────────────────────── */}
        <main className="lb-main">
          <section className="lb-section">
            <h2 className="lb-section-title">
              <FiBarChart2 size={15} className="lb-section-icon" />
              CP + Streak Rankings
            </h2>
            <p className="lb-section-desc">
              Live rankings across all registered operators. Updated on each
              completed lab, report submission, and streak milestone.
            </p>

            <LeaderboardTable
              entries={entries}
              emptyMessage={statusMessage || 'No leaderboard data yet.'}
              loading={loading}
            />
          </section>
        </main>

        {/* ── SIDEBAR ─────────────────────────────── */}
        <aside className="lb-sidebar">

          {/* About */}
          <div className="lb-sidebar-box">
            <h3 className="lb-sidebar-heading">About</h3>
            <p className="lb-sidebar-about">
              Rankings are calculated from Compromised Points (CP) earned through
              labs, pentest reports, and daily learning streaks.
            </p>
            <div className="lb-sidebar-divider" />
            <ul className="lb-sidebar-list">
              <li>
                <FiCheckCircle size={13} className="lb-sidebar-icon" />
                Updated in real-time
              </li>
              <li>
                <FiCheckCircle size={13} className="lb-sidebar-icon" />
                Top 50 operators shown
              </li>
              <li>
                <FiCheckCircle size={13} className="lb-sidebar-icon" />
                Streak multipliers included
              </li>
              <li>
                <FiCheckCircle size={13} className="lb-sidebar-icon" />
                Verified rank titles
              </li>
            </ul>
          </div>

          {/* Status box */}
          <div className="lb-sidebar-box lb-status-box">
            <div className="lb-status-row">
              <span className="lb-status-dot" />
              <span className="lb-status-label">RANKINGS</span>
            </div>
            <strong className="lb-status-value">LIVE</strong>
            <div className="lb-status-track">
              <div className="lb-status-fill" />
            </div>
            <p className="lb-status-note">
              Rankings refresh on every CP transaction.
            </p>
          </div>

          {/* Topics */}
          <div className="lb-sidebar-box">
            <h3 className="lb-sidebar-heading">Topics</h3>
            <div className="lb-topics">
              {['rankings', 'cp-points', 'streaks', 'offsec', 'operators', 'hsociety'].map(
                (t) => <span key={t} className="lb-topic">{t}</span>
              )}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
};

export default Leaderboard;
