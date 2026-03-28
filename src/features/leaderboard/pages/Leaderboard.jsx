import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBarChart2,
  FiCheckCircle,
  FiUsers,
  FiZap,
  FiTrendingUp,
  FiArrowUpRight,
} from 'react-icons/fi';
import Button from '../../../shared/components/ui/Button';
import LeaderboardTable from '../components/LeaderboardTable';
import { getLeaderboard } from '../services/leaderboard.service';
import { extractLeaderboardEntries } from '../services/leaderboard.utils';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import {
  publicBadge,
  publicBadgePulse,
  publicCtaCard,
  publicCtaInner,
  publicCtaSection,
  publicCardDesc,
  publicCardTitle,
  publicHeroActions,
  publicHeroDesc,
  publicHeroGrid,
  publicHeroKicker,
  publicHeroPanel,
  publicHeroSection,
  publicHeroStat,
  publicHeroStats,
  publicHeroTitle,
  publicList,
  publicListItem,
  publicPage,
  publicPill,
  publicPillRow,
  publicSection,
  publicSurface,
} from '../../../shared/styles/publicClasses';

const Leaderboard = () => {
  const navigate = useNavigate();
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

  const skeletonRows = Array.from({ length: 6 });

  const totalEntries = entries.length;
  const topStreak = entries[0]?.streakDays ?? '—';
  const topCp = entries[0]?.totalXp ?? '—';

  return (
    <div className={`${publicPage} text-text-primary`}>
      {/* ── HERO ─────────────────────────────────── */}
      <section className={`hero-section reveal-on-scroll ${publicHeroSection}`}>
        <div className={`section-container ${publicHeroGrid}`}>
          <div>
            <p className={publicHeroKicker}>
              <span className="eyebrow-dot" />
              HSOCIETY OFFSEC / Leaderboard
            </p>
            <h1 className={publicHeroTitle}>Top operators in the community.</h1>
            <p className={publicHeroDesc}>
              Rankings based on Compromised Points, streaks, and verified learning milestones.
            </p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/community')}
              >
                Join the community
                <FiArrowUpRight size={14} />
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="bg-transparent px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/cp-points')}
              >
                Learn about CP points
              </Button>
            </div>
            <div className={publicPillRow}>
              <span className={publicPill}>
                <FiUsers size={12} />
                {totalEntries} operators
              </span>
              <span className={publicPill}>
                <FiTrendingUp size={12} />
                Top streak {topStreak}
              </span>
              <span className={publicPill}>
                <FiZap size={12} />
                Top CP {topCp}
              </span>
            </div>
          </div>
          <div className={publicHeroPanel}>
            <div className="hs-signature" aria-hidden="true" />
            <p className={`${publicBadge} ${publicBadgePulse}`}>Leaderboard live</p>
            <div className={publicList}>
              <div className={publicListItem}>
                <FiCheckCircle size={14} />
                <span>Verified mission completions.</span>
              </div>
              <div className={publicListItem}>
                <FiCheckCircle size={14} />
                <span>Daily streak multipliers.</span>
              </div>
              <div className={publicListItem}>
                <FiCheckCircle size={14} />
                <span>Community contribution weight.</span>
              </div>
            </div>
            <div className={publicHeroStats}>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">{totalEntries}</strong> operators
              </span>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">{topStreak}</strong> top streak
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CARDS ────────────────────────────────── */}
      <section className={`reveal-on-scroll ${publicSection}`}>
        <div className="section-container">
          <div className="section-header">
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Rankings
            </p>
            <h2 className="section-title">Current operator leaderboard.</h2>
            <p className="section-subtitle">Updated with every verified mission and streak.</p>
          </div>
          <div className={publicSurface}>
            <div className="hs-signature" aria-hidden="true" />
            {loading ? (
              <div className="grid gap-3" aria-label="Loading leaderboard">
                {skeletonRows.map((_, idx) => (
                  <div
                    key={idx}
                    className="h-[42px] rounded-sm bg-[linear-gradient(90deg,var(--bg-tertiary),var(--bg-secondary),var(--bg-tertiary))] bg-[length:200px_100%] animate-table-shimmer"
                  />
                ))}
              </div>
            ) : statusMessage ? (
              <p className="text-text-secondary">{statusMessage}</p>
            ) : (
              <LeaderboardTable entries={entries} />
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className={`reveal-on-scroll ${publicCtaSection}`}>
        <div className={`section-container ${publicCtaInner}`}>
          <div>
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Rank up
            </p>
            <h2 className="section-title">Start earning Compromised Points.</h2>
            <p className="section-subtitle">Complete labs, ship reports, and build streak momentum.</p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/courses')}
              >
                View programs
                <FiArrowUpRight size={14} />
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="bg-transparent px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/cp-points')}
              >
                CP Points guide
              </Button>
            </div>
          </div>
          <div className={publicCtaCard}>
            <div className="hs-signature" aria-hidden="true" />
            <h3 className={publicCardTitle}>Operators only.</h3>
            <p className={publicCardDesc}>
              Train, execute, and earn your position on the board.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Leaderboard;
