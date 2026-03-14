/**
 * LeaderboardTable
 * Location: src/features/leaderboard/components/LeaderboardTable.jsx
 *
 * GitHub-style bordered table list.
 * Top-3 rows get data-rank="1/2/3" for medal styling via CSS only.
 */

import React, { useMemo } from 'react';
import { IoFlameOutline } from 'react-icons/io5';
import { getGithubAvatarDataUri } from '../../../shared/utils/avatar';
import Skeleton from '../../../shared/components/ui/Skeleton';
import cpIcon from '../../../assets/icons/CP/cp-icon.webp';
import { buildLeaderboard } from '../leaderboard.utils';
import '../../../styles/leaderboard/leaderboard.css';

const LeaderboardTable = ({
  entries = [],
  limit = null,
  emptyMessage = 'Leaderboard data is loading.',
  loading = false,
}) => {
  const rows = useMemo(() => {
    const sorted = buildLeaderboard(entries || []);
    return limit ? sorted.slice(0, limit) : sorted;
  }, [entries, limit]);

  /* ── Skeleton state ── */
  if (loading) {
    const count = limit || 6;
    return (
      <div className="lb-table" role="table" aria-label="Leaderboard">

        {/* Header */}
        <div className="lb-table-header" role="row">
          <div className="lb-col lb-col-pos"   role="columnheader">#</div>
          <div className="lb-col lb-col-user"  role="columnheader">Operator</div>
          <div className="lb-col lb-col-rank"  role="columnheader">Rank</div>
          <div className="lb-col lb-col-score" role="columnheader">CP · Streak</div>
        </div>

        {Array.from({ length: count }).map((_, i) => (
          <div key={`sk-${i}`} className="lb-row lb-row-skeleton" role="row">
            <div className="lb-col lb-col-pos" role="cell">
              <Skeleton className="lb-sk-num" />
            </div>
            <div className="lb-col lb-col-user" role="cell">
              <Skeleton variant="circle" className="lb-sk-avatar" />
              <div className="lb-sk-text">
                <Skeleton className="lb-sk-line" />
                <Skeleton className="lb-sk-line lb-sk-short" />
              </div>
            </div>
            <div className="lb-col lb-col-rank" role="cell">
              <Skeleton className="lb-sk-line" />
            </div>
            <div className="lb-col lb-col-score" role="cell">
              <Skeleton className="lb-sk-chip" />
              <Skeleton className="lb-sk-chip lb-sk-short" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ── Empty state ── */
  if (!rows.length) {
    return (
      <div className="lb-empty" role="status">
        {emptyMessage}
      </div>
    );
  }

  /* ── Data rows ── */
  return (
    <div className="lb-table" role="table" aria-label="Leaderboard">

      {/* Header */}
      <div className="lb-table-header" role="row">
        <div className="lb-col lb-col-pos"   role="columnheader">#</div>
        <div className="lb-col lb-col-user"  role="columnheader">Operator</div>
        <div className="lb-col lb-col-rank"  role="columnheader">Rank</div>
        <div className="lb-col lb-col-score" role="columnheader">CP · Streak</div>
      </div>

      {rows.map((entry) => {
        const avatarFallback = getGithubAvatarDataUri(entry.handle || entry.name || 'member');
        const handle = entry.handle ? `@${entry.handle}` : '—';
        const rankAttr = entry.position <= 3 ? String(entry.position) : undefined;

        return (
          <div
            key={entry.id || entry.position}
            className="lb-row"
            data-rank={rankAttr}
            role="row"
          >
            {/* Position */}
            <div className="lb-col lb-col-pos" role="cell">
              <span className="lb-pos-value">#{entry.position}</span>
            </div>

            {/* Profile */}
            <div className="lb-col lb-col-user" role="cell">
              <div className="lb-avatar">
                <img
                  src={entry.avatarUrl || avatarFallback}
                  alt={entry.name}
                  onError={(e) => {
                    if (e.currentTarget.src !== avatarFallback) {
                      e.currentTarget.src = avatarFallback;
                    }
                  }}
                />
              </div>
              <div className="lb-user-text">
                <span className="lb-name">{entry.name || 'Unknown'}</span>
                <span className="lb-handle">{handle}</span>
              </div>
            </div>

            {/* Rank title */}
            <div className="lb-col lb-col-rank" role="cell">
              <span className="lb-rank-title">{entry.rankTitle || '—'}</span>
            </div>

            {/* Metrics */}
            <div className="lb-col lb-col-score" role="cell">
              <span className="lb-chip lb-chip-cp">
                <img src={cpIcon} alt="CP" className="lb-cp-icon" />
                <span>{entry.totalXp ?? '—'}</span>
              </span>
              <span className="lb-chip">
                <IoFlameOutline size={14} />
                <span>{entry.streakDays ?? '—'}d</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaderboardTable;