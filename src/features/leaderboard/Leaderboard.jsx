import React, { useEffect, useMemo, useState } from 'react';
import { FiBarChart2 } from 'react-icons/fi';
import LeaderboardTable from './components/LeaderboardTable';
import { getLeaderboard } from './leaderboard.service';
import { extractLeaderboardEntries } from './leaderboard.utils';
import { getPublicErrorMessage } from '../../shared/utils/publicError';
import '../../styles/leaderboard/leaderboard.css';

const Leaderboard = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadLeaderboard = async () => {
      const response = await getLeaderboard(50);
      if (!mounted) return;
      if (!response.success) {
        setError(getPublicErrorMessage({ action: 'load', response }));
        setLoading(false);
        return;
      }

      const payload = response.data?.leaderboard || response.data;
      const extracted = extractLeaderboardEntries(payload);
      setEntries(extracted);
      setLoading(false);
    };

    loadLeaderboard();
    return () => {
      mounted = false;
    };
  }, []);

  const statusMessage = useMemo(() => {
    if (loading) return 'Loading leaderboard...';
    if (error) return error;
    return null;
  }, [loading, error]);

  return (
    <section className="leaderboard-page reveal-on-scroll">
      <header className="leaderboard-hero">
        <div className="leaderboard-hero-eyebrow">
          <FiBarChart2 size={16} />
          <span>Leaderboard</span>
        </div>
        <h1>CP + Streak Rankings</h1>
        <p>Track the top HSOCIETY operators ranked by Compromised Points and learning streaks.</p>
      </header>

      <div className="leaderboard-body">
        <LeaderboardTable
          entries={entries}
          emptyMessage={statusMessage || 'No leaderboard data yet.'}
          loading={loading}
        />
      </div>
    </section>
  );
};

export default Leaderboard;
