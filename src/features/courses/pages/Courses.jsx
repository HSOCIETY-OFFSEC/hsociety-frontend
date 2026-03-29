import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiClock,
  FiLayers,
  FiShield,
} from 'react-icons/fi';
import { HACKER_PROTOCOL_BOOTCAMP, HACKER_PROTOCOL_PHASES } from '../../../data/static/bootcamps/hackerProtocolData';
import PublicCardGrid from '../../../shared/components/public/PublicCardGrid';
import Button from '../../../shared/components/ui/Button';
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
  publicPage,
  publicSection,
} from '../../../shared/styles/publicClasses';

const Courses = () => {
  const navigate = useNavigate();

  return (
    <div className={`${publicPage} text-text-primary`}>
      {/* ── HERO ─────────────────────────────────── */}
      <section className={`hero-section reveal-on-scroll ${publicHeroSection}`}>
        <div className={`section-container ${publicHeroGrid}`}>
          <div>
            <p className={publicHeroKicker}>
              <span className="eyebrow-dot" />
              HSOCIETY OFFSEC / Courses
            </p>
            <h1 className={publicHeroTitle}>Operator-grade training programs.</h1>
            <p className={publicHeroDesc}>
              Structured programs built for skill progression, identity validation, and real-world deployment.
            </p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/courses/hacker-protocol')}
              >
                View Hacker Protocol
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
          <div className={publicHeroPanel}>
            <p className={publicBadge}>Featured program</p>
            <div className="flex items-center gap-4">
              <img
                src={HACKER_PROTOCOL_BOOTCAMP.emblem}
                alt="Hacker Protocol emblem"
                className="h-16 w-16 object-contain"
              />
              <div>
                <h3 className={publicCardTitle}>{HACKER_PROTOCOL_BOOTCAMP.title}</h3>
                <p className={publicCardDesc}>{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>
              </div>
            </div>
            <div className={publicHeroStats}>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">{HACKER_PROTOCOL_BOOTCAMP.phases}</strong> phases
              </span>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">{HACKER_PROTOCOL_BOOTCAMP.duration}</strong>
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
              Program overview
            </p>
            <h2 className="section-title">{HACKER_PROTOCOL_BOOTCAMP.title}</h2>
            <p className="section-subtitle">{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>
          </div>
          <PublicCardGrid>
            {HACKER_PROTOCOL_PHASES.map((phase, index) => (
              <article
                key={phase.title}
                className={`${publicCard} before:bg-contain before:bg-no-repeat before:bg-center`}
                style={{ '--public-card-media': `url(${phase.emblem})` }}
              >
                <div className={publicCardMeta}>
                  <span className={publicChip}>Phase {index + 1}</span>
                </div>
                <h3 className={publicCardTitle}>{phase.title}</h3>
                <p className={publicCardDesc}>{phase.summary}</p>
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
              Ready to start
            </p>
            <h2 className="section-title">Start the Hacker Protocol journey.</h2>
            <p className="section-subtitle">Enroll in the bootcamp and move into supervised engagements.</p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/courses/hacker-protocol')}
              >
                View curriculum
                <FiArrowUpRight size={14} />
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="bg-transparent px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/student-bootcamps')}
              >
                Go to bootcamp
              </Button>
            </div>
          </div>
          <div className={publicCtaCard}>
            <h3 className={publicCardTitle}>Built by operators.</h3>
            <p className={publicCardDesc}>Learn with live labs, guided missions, and real-world context.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
