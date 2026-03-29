import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiMessageSquare,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiArrowUpRight,
} from 'react-icons/fi';
import PublicCardGrid from '../../../shared/components/public/PublicCardGrid';
import Button from '../../../shared/components/ui/Button';
import { getPublicCardMedia } from '../../../shared/data/publicCardMedia';
import {
  publicBadge,
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
  publicHeroPanel,
  publicHeroSection,
  publicHeroStat,
  publicHeroStats,
  publicHeroTitle,
  publicList,
  publicListItem,
  publicPage,
  publicSection,
} from '../../../shared/styles/publicClasses';

const STATUS_CARDS = [
  {
    title: "What's next?",
    body: "We are enhancing bootcamp programming and internal delivery before opening new roles. Follow our updates or revisit this page later in 2026 to review new openings.",
  },
  {
    title: 'Want to stay informed?',
    body: "The next batch of roles will include analysts, builders, and mentors. Drop us a note today and we will reach out when the hiring window reopens.",
  },
];

const Careers = () => {
  const navigate = useNavigate();

  return (
    <div className={`${publicPage} text-text-primary`}>
      {/* ── HERO ─────────────────────────────────── */}
      <section className={`hero-section reveal-on-scroll ${publicHeroSection}`}>
        <div className={`section-container ${publicHeroGrid}`}>
          <div>
            <p className={publicHeroKicker}>
              <span className="eyebrow-dot" />
              HSOCIETY OFFSEC / Careers
            </p>
            <h1 className={publicHeroTitle}>We’re pausing hiring to scale the platform.</h1>
            <p className={publicHeroDesc}>
              We aren’t hiring right now — but keep an eye on this page for future opportunities.
            </p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/contact')}
              >
                <FiMessageSquare size={14} />
                Notify me
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="bg-transparent px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/team')}
              >
                Meet the team
                <FiArrowUpRight size={14} />
              </Button>
            </div>
          </div>
          <div className={publicHeroPanel}>
            <p className={publicBadge}>Status</p>
            <div className={publicList}>
              <div className={publicListItem}>
                <FiBriefcase size={14} />
                <span>No open roles right now.</span>
              </div>
              <div className={publicListItem}>
                <FiCheckCircle size={14} />
                <span>Updates announced via email.</span>
              </div>
              <div className={publicListItem}>
                <FiMessageSquare size={14} />
                <span>Reach out for future openings.</span>
              </div>
            </div>
            <div className={publicHeroStats}>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">Remote</strong> first
              </span>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">Global</strong> team
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
              Hiring update
            </p>
            <h2 className="section-title">What we’re focused on now.</h2>
            <p className="section-subtitle">We’re refining internal delivery and training before the next hiring wave.</p>
          </div>
          <PublicCardGrid>
            {STATUS_CARDS.map((card, index) => (
              <article
                key={card.title}
                className={publicCard}
                style={{ '--public-card-media': `url(${getPublicCardMedia(index)})` }}
              >
                <div className={publicCardMeta}>
                  <span className={publicChip}>Status</span>
                </div>
                <h3 className={publicCardTitle}>{card.title}</h3>
                <p className={publicCardDesc}>{card.body}</p>
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
              Stay close
            </p>
            <h2 className="section-title">Want to be first in line?</h2>
            <p className="section-subtitle">We’ll notify you when new roles are posted.</p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/contact')}
              >
                Join the list
                <FiArrowUpRight size={14} />
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="bg-transparent px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/community')}
              >
                Join the community
              </Button>
            </div>
          </div>
          <div className={publicCtaCard}>
            <h3 className={publicCardTitle}>Roles include analysts, builders, mentors.</h3>
            <p className={publicCardDesc}>We hire operators with real-world engagement experience.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
