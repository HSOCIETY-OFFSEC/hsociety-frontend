/**
 * LeaderboardTable
 * Location: src/features/leaderboard/components/LeaderboardTable.jsx
 *
 * GitHub-style bordered table list.
 * Top-3 rows get data-rank="1/2/3" for medal styling via CSS only.
 */

import React, { useMemo } from 'react';
import { IoFlameOutline } from 'react-icons/io5';
import { resolveProfileAvatar } from '../../../shared/utils/display/profileAvatar';
import Skeleton from '../../../shared/components/ui/Skeleton';
import cpIcon from '../../../assets/icons/CP/cp-icon.webp';
import { buildLeaderboard } from '../services/leaderboard.utils';

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
      <div className="overflow-hidden rounded-md border border-border bg-bg-secondary" role="table" aria-label="Leaderboard">
        {/* Header */}
        <div
          className="grid grid-cols-[60px_minmax(0,1fr)_140px_180px] items-center border-b border-border bg-bg-tertiary px-4 py-3 text-[0.7rem] uppercase tracking-[0.2em] text-text-tertiary max-md:grid-cols-1 max-md:gap-2"
          role="row"
        >
          <div role="columnheader">#</div>
          <div role="columnheader">Operator</div>
          <div role="columnheader">Rank</div>
          <div role="columnheader">CP · Streak</div>
        </div>

        {Array.from({ length: count }).map((_, i) => (
          <div
            key={`sk-${i}`}
            className="grid grid-cols-[60px_minmax(0,1fr)_140px_180px] items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 max-md:grid-cols-1"
            role="row"
          >
            <div role="cell">
              <Skeleton className="h-4 w-8 rounded-full" />
            </div>
            <div className="flex items-center gap-3" role="cell">
              <Skeleton variant="circle" className="h-10 w-10" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3 w-32 rounded-full" />
                <Skeleton className="h-3 w-20 rounded-full" />
              </div>
            </div>
            <div role="cell">
              <Skeleton className="h-3 w-24 rounded-full" />
            </div>
            <div className="flex flex-wrap items-center gap-2" role="cell">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
  );
  }

  /* ── Empty state ── */
  if (!rows.length) {
    return (
      <div className="rounded-md border border-border bg-bg-secondary px-4 py-3 text-sm text-text-secondary" role="status">
        {emptyMessage}
      </div>
    );
  }

  /* ── Data rows ── */
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-secondary" role="table" aria-label="Leaderboard">
      {/* Header */}
      <div
        className="grid grid-cols-[60px_minmax(0,1fr)_140px_180px] items-center border-b border-border bg-bg-tertiary px-4 py-3 text-[0.7rem] uppercase tracking-[0.2em] text-text-tertiary max-md:grid-cols-1 max-md:gap-2"
        role="row"
      >
        <div role="columnheader">#</div>
        <div role="columnheader">Operator</div>
        <div role="columnheader">Rank</div>
        <div role="columnheader">CP · Streak</div>
      </div>

      {rows.map((entry) => {
        const { src: avatarSrc, fallback: avatarFallback } = resolveProfileAvatar(entry);
        const handle = entry.handle ? `@${entry.handle}` : '—';
        const rankAttr = entry.position <= 3 ? String(entry.position) : undefined;

        return (
          <div
            key={entry.id || entry.position}
            className='grid grid-cols-[60px_minmax(0,1fr)_140px_180px] items-center gap-3 border-b border-border px-4 py-3 text-sm text-text-secondary transition hover:bg-bg-tertiary data-[rank="1"]:bg-[color-mix(in_srgb,var(--primary-color)_12%,var(--bg-secondary))] data-[rank="1"]:text-text-primary data-[rank="2"]:bg-[color-mix(in_srgb,var(--primary-color)_6%,var(--bg-secondary))] data-[rank="3"]:bg-[color-mix(in_srgb,var(--primary-color)_4%,var(--bg-secondary))] last:border-b-0 max-md:grid-cols-1'
            data-rank={rankAttr}
            role="row"
          >
            {/* Position */}
            <div role="cell">
              <span className="font-mono text-sm text-text-primary">#{entry.position}</span>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3" role="cell">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-border bg-bg-tertiary">
                <img
                  src={avatarSrc}
                  alt={entry.name}
                  onError={(e) => {
                    if (e.currentTarget.src !== avatarFallback) {
                      e.currentTarget.src = avatarFallback;
                    }
                  }}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-semibold text-text-primary">{entry.name || 'Unknown'}</span>
                <span className="truncate text-xs text-text-tertiary">{handle}</span>
              </div>
            </div>

            {/* Rank title */}
            <div role="cell">
              <span className="text-sm text-text-secondary">{entry.rankTitle || '—'}</span>
            </div>

            {/* Metrics */}
            <div className="flex flex-wrap items-center gap-2" role="cell">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-tertiary px-3 py-1 text-xs text-text-secondary">
                <img src={cpIcon} alt="CP" className="h-4 w-4 object-contain" />
                <span>{entry.totalCp ?? '—'}</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-tertiary px-3 py-1 text-xs text-text-secondary">
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
