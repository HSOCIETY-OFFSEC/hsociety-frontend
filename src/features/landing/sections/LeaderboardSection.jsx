import React, { useEffect, useMemo, useState } from 'react';
import { FiBarChart2, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import LeaderboardTable from '../../leaderboard/components/LeaderboardTable';
import { getLeaderboard } from '../../leaderboard/leaderboard.service';
import { extractLeaderboardEntries } from '../../leaderboard/leaderboard.utils';
import { getPublicErrorMessage } from '../../../shared/utils/publicError';
import '../../../styles/leaderboard/leaderboard.css';

const LeaderboardSection = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadLeaderboard = async () => {
      const response = await getLeaderboard(8);
      if (!mounted) return;
      if (!response.success) {
        setError(getPublicErrorMessage({ action: 'load', response }));
        setHasLoaded(true);
        return;
      }

      const payload = response.data?.leaderboard || response.data;
      const extracted = extractLeaderboardEntries(payload);
      setEntries(extracted);
      setHasLoaded(true);
    };

    loadLeaderboard();
    return () => {
      mounted = false;
    };
  }, []);

  const statusMessage = useMemo(() => {
    if (!hasLoaded) return 'Loading leaderboard...';
    if (error) return error;
    return null;
  }, [hasLoaded, error]);

  return (
    <section className="leaderboard-section reveal-on-scroll" id="leaderboard">
      <div className="section-container">
        <div className="section-header-center">
          <div className="section-eyebrow">
            <FiBarChart2 size={14} />
            <span>Leaderboard</span>
          </div>
          <h2 className="section-title-large">Top Operators This Cycle</h2>
          <p className="section-subtitle-large">
            Ranked by Compromised Points and learning streaks across the HSOCIETY community.
          </p>
        </div>

        <LeaderboardTable
          entries={entries}
          limit={6}
          emptyMessage={statusMessage || 'No leaderboard data yet.'}
          loading={false}
        />

        <div className="leaderboard-cta">
          <Button variant="secondary" size="medium" onClick={() => navigate('/leaderboard')}>
            View Full Leaderboard
            <FiArrowRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSection;
