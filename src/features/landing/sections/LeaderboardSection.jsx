import React from 'react';
import { useNavigate } from 'react-router-dom';
import { resolveProfileAvatar } from '../../../shared/utils/display/profileAvatar';
import './leaderboard.css';

const SkeletonRow = () => (
  <div className="leaderboard-row leaderboard-row--skeleton" role="row" aria-hidden="true">
    <span className="lb-skel lb-skel--rank" />
    <span className="lb-skel-user">
      <span className="lb-skel lb-skel--avatar" />
      <span className="lb-skel-user-text">
        <span className="lb-skel lb-skel--name" />
        <span className="lb-skel lb-skel--handle" />
      </span>
    </span>
    <span className="lb-skel lb-skel--score" />
    <span className="lb-skel lb-skel--badge" />
  </div>
);

const LeaderboardSection = ({ entries = [], loading = false }) => {
  const navigate = useNavigate();

  // Still loading — show skeleton
  if (loading) {
    return (
      <section className="leaderboard-section reveal-on-scroll" id="leaderboard" aria-busy="true" aria-label="Leaderboard loading">
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
            {Array.from({ length: 5 }, (_, i) => <SkeletonRow key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  const top = entries.slice(0, 5);
  // No data after load — hide section entirely
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
