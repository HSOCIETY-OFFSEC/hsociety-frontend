import React from 'react';
import { useNavigate } from 'react-router-dom';
import { resolveProfileAvatar } from '../../../shared/utils/display/profileAvatar';
import './leaderboard.css';

const LeaderboardSection = ({ entries = [] }) => {
  const navigate = useNavigate();
  const top = entries.slice(0, 5);
  if (!top.length) return null;

  return (
    <section className="leaderboard-section reveal-on-scroll" id="leaderboard">
      <div className="section-container">
        <header className="section-header">
          <p className="section-eyebrow"><span className="eyebrow-dot" />Leaderboard</p>
          <h2 className="section-title">Top operators right now.</h2>
          <p className="section-subtitle">Proof of progress from the HSOCIETY community.</p>
        </header>

        <div className="leaderboard-table" role="table">
          <div className="leaderboard-row leaderboard-head" role="row">
            <span role="columnheader">Rank</span>
            <span role="columnheader">Operator</span>
            <span role="columnheader">Score</span>
            <span role="columnheader">Badge</span>
          </div>
          {top.map((entry, index) => (
            <div key={entry.id} className="leaderboard-row" role="row">
              <span className={`leaderboard-rank${index === 0 ? ' is-top' : ''}`} role="cell">
                #{index + 1}
              </span>
              <span className="leaderboard-user" role="cell">
                {(() => {
                  const { src } = resolveProfileAvatar(entry);
                  return (
                    <img
                      src={src}
                      alt={entry.name || 'Community member'}
                      width={32}
                      height={32}
                      loading="lazy"
                    />
                  );
                })()}
                <span>
                  {entry.name || 'Community member'}
                  <em>@{entry.handle || 'operator'}</em>
                </span>
              </span>
              <span role="cell">{entry.totalXp.toLocaleString()} XP</span>
              <span className="leaderboard-badge" role="cell">{entry.rank}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="leaderboard-link"
          onClick={() => navigate('/leaderboard')}
        >
          View Full Leaderboard &rarr;
        </button>
      </div>
    </section>
  );
};

export default LeaderboardSection;
