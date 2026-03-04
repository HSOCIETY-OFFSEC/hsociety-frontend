import React, { useMemo } from 'react';
import { IoFlameOutline } from 'react-icons/io5';
import { getGithubAvatarDataUri } from '../../../shared/utils/avatar';
import cpIcon from '../../../assets/icons/CP/cp-icon.png';
import { buildLeaderboard } from '../leaderboard.utils';
import '../../../styles/leaderboard/leaderboard.css';

const LeaderboardTable = ({ entries = [], limit = null, emptyMessage = 'Leaderboard data is loading.' }) => {
  const rows = useMemo(() => {
    const sorted = buildLeaderboard(entries || []);
    if (limit) return sorted.slice(0, limit);
    return sorted;
  }, [entries, limit]);

  if (!rows.length) {
    return <div className="leaderboard-empty">{emptyMessage}</div>;
  }

  return (
    <div className="leaderboard-table" role="table" aria-label="Leaderboard">
      <div className="leaderboard-row leaderboard-header" role="row">
        <div className="leaderboard-col leaderboard-position" role="columnheader">#</div>
        <div className="leaderboard-col leaderboard-profile" role="columnheader">Hacker</div>
        <div className="leaderboard-col leaderboard-rank" role="columnheader">Rank</div>
        <div className="leaderboard-col leaderboard-metrics" role="columnheader">CP + Streak</div>
      </div>

      {rows.map((entry) => {
        const avatarFallback = getGithubAvatarDataUri(entry.handle || entry.name || 'member');
        const handle = entry.handle ? `@${entry.handle}` : '';
        const highlightClass = entry.position <= 3 ? 'is-top' : '';

        return (
          <div
            key={entry.id || entry.position}
            className={`leaderboard-row ${highlightClass}`}
            role="row"
          >
            <div className="leaderboard-col leaderboard-position" role="cell">
              <span className="leaderboard-position-value">#{entry.position}</span>
              <span className="leaderboard-position-label">Position</span>
            </div>

            <div className="leaderboard-col leaderboard-profile" role="cell">
              <div className="leaderboard-avatar">
                <img
                  src={entry.avatarUrl || avatarFallback}
                  alt={entry.name}
                  onError={(event) => {
                    if (event.currentTarget.src !== avatarFallback) {
                      event.currentTarget.src = avatarFallback;
                    }
                  }}
                />
              </div>
              <div className="leaderboard-profile-text">
                <p className="leaderboard-handle">{handle || 'Anonymous'}</p>
                <h4>{entry.name}</h4>
              </div>
            </div>

            <div className="leaderboard-col leaderboard-rank" role="cell">
              <span className="leaderboard-rank-label">Rank</span>
              <strong>{entry.rankTitle}</strong>
            </div>

            <div className="leaderboard-col leaderboard-metrics" role="cell">
              <div className="leaderboard-metric">
                <img src={cpIcon} alt="CP" />
                <span>{entry.totalXp} CP</span>
              </div>
              <div className="leaderboard-metric">
                <IoFlameOutline size={16} />
                <span>{entry.streakDays} Streak</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaderboardTable;
