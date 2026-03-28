import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiTrendingUp,
  FiTarget,
  FiShield,
  FiZap,
  FiCheckCircle,
  FiBarChart2,
} from 'react-icons/fi';
import cpIcon from '../../../assets/icons/CP/cp-icon.webp';
import PublicCardGrid from '../../../shared/components/public/PublicCardGrid';
import Button from '../../../shared/components/ui/Button';
import { getPublicCardMedia } from '../../../shared/data/publicCardMedia';
import {
  publicCard,
  publicCardDesc,
  publicCardMeta,
  publicCardTitle,
  publicChip,
  publicCtaCard,
  publicCtaInner,
  publicCtaSection,
  publicHeroActions,
  publicHeroDesc,
  publicHeroGrid,
  publicHeroKicker,
  publicHeroSection,
  publicHeroStat,
  publicHeroStats,
  publicHeroTitle,
  publicPage,
  publicPill,
  publicPillRow,
  publicSection,
} from '../../../shared/styles/publicClasses';

const CPPoints = () => {
  const navigate = useNavigate();

  const actions = useMemo(
    () => [
      {
        title: 'Complete mission labs',
        description:
          'Finish guided strike labs and earn stacked CP boosts with every verified objective.',
        icon: <FiTarget size={16} />,
        badge: '+250 CP',
      },
      {
        title: 'Ship real pentest wins',
        description:
          'Deliver findings, document remediations, and stack multipliers for high-impact reports.',
        icon: <FiShield size={16} />,
        badge: '+500 CP',
      },
      {
        title: 'Stay on streak',
        description:
          'Daily progress unlocks streak bonuses that amplify every point you collect.',
        icon: <FiTrendingUp size={16} />,
        badge: '2× boost',
      },
    ],
    []
  );

  const stats = [
    { label: 'Momentum Score', value: 'Adaptive', icon: <FiBarChart2 size={14} /> },
    { label: 'Streak Boost', value: 'Live', icon: <FiZap size={14} /> },
    { label: 'Rank Signal', value: 'Verified', icon: <FiCheckCircle size={14} /> },
  ];

  return (
    <div className={`${publicPage} text-text-primary`}>
      {/* ── HERO ─────────────────────────────────── */}
      <section className={`hero-section reveal-on-scroll ${publicHeroSection}`}>
        <div className={`section-container ${publicHeroGrid}`}>
          <div>
            <p className={publicHeroKicker}>
              <span className="eyebrow-dot" />
              HSOCIETY OFFSEC / CP Points
            </p>
            <h1 className={publicHeroTitle}>Your operator reputation score.</h1>
            <p className={publicHeroDesc}>
              Every lab, report, and streak compounds your presence. CP Points are the signal.
            </p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/courses')}
              >
                Start a program
                <FiArrowUpRight size={14} />
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="bg-transparent px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/leaderboard')}
              >
                View leaderboard
              </Button>
            </div>
            <div className={publicPillRow}>
              {stats.map((stat) => (
                <span key={stat.label} className={publicPill}>
                  {stat.icon}
                  {stat.label}: {stat.value}
                </span>
              ))}
            </div>
          </div>
          <div className="p-0">
            <img src={cpIcon} alt="CP" className="mx-auto h-auto w-[min(420px,92vw)]" />
            <div className={`${publicHeroStats} justify-center`}>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">Daily</strong> streaks
              </span>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">Live</strong> leaderboard
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
              Earn CP
            </p>
            <h2 className="section-title">Ways to stack Compromised Points.</h2>
            <p className="section-subtitle">Each action compounds your operator signal.</p>
          </div>
          <PublicCardGrid>
            {actions.map((action, index) => (
              <article
                key={action.title}
                className={publicCard}
                style={{ '--public-card-media': `url(${getPublicCardMedia(index)})` }}
              >
                <div className="hs-signature" aria-hidden="true" />
                <div className={publicCardMeta}>
                  <span className={publicChip}>{action.badge}</span>
                </div>
                <h3 className={publicCardTitle}>{action.title}</h3>
                <p className={publicCardDesc}>{action.description}</p>
              </article>
            ))}
          </PublicCardGrid>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className={`reveal-on-scroll ${publicCtaSection}`}>
        <div className={`section-container ${publicCtaInner}`}>
          <div>
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Ready to rank up
            </p>
            <h2 className="section-title">Start collecting CP Points today.</h2>
            <p className="section-subtitle">Join a bootcamp or run live missions to stack your signal.</p>
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
                onClick={() => navigate('/contact')}
              >
                Talk to us
              </Button>
            </div>
          </div>
          <div className={publicCtaCard}>
            <div className="hs-signature" aria-hidden="true" />
            <h3 className={publicCardTitle}>Operators earn, operators rise.</h3>
            <p className={publicCardDesc}>Every verified mission pushes your ranking forward.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CPPoints;
