import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthModal from '../../../shared/hooks/useAuthModal';
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiClock,
  FiLayers,
  FiShield,
  FiCheckCircle,
  FiZap,
} from 'react-icons/fi';
import { HACKER_PROTOCOL_BOOTCAMP, HACKER_PROTOCOL_PHASES } from '../../../data/static/bootcamps/hackerProtocolData';
import { useAuth } from '../../../core/auth/AuthContext';
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
  publicPill,
  publicPillRow,
  publicSection,
  publicButtonBase,
  publicButtonGhost,
  publicButtonSmall,
} from '../../../shared/styles/publicClasses';

const CourseDetails = () => {
  const { bootcampId } = useParams();
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  const { isAuthenticated } = useAuth();

  const handleEnroll = useCallback(() => {
    if (!isAuthenticated) {
      openAuthModal('register', { redirect: '/student-bootcamps' });
      return;
    }
    navigate('/student-bootcamps');
  }, [isAuthenticated, navigate, openAuthModal]);

  if (bootcampId !== 'hacker-protocol') {
    return (
      <div className={`${publicPage} text-text-primary`}>
        <div className="mx-auto max-w-3xl px-6 py-16 text-center text-text-secondary">
          Course not found.
        </div>
      </div>
    );
  }

  return (
    <div className={`${publicPage} text-text-primary`}>
      {/* ── HERO ─────────────────────────────────── */}
      <section className={`hero-section reveal-on-scroll ${publicHeroSection}`}>
        <div className={`section-container ${publicHeroGrid}`}>
          <div>
            <p className={publicHeroKicker}>
              <span className="eyebrow-dot" />
              HSOCIETY OFFSEC / Courses / Hacker Protocol
            </p>
            <h1 className={publicHeroTitle}>{HACKER_PROTOCOL_BOOTCAMP.title}</h1>
            <p className={publicHeroDesc}>{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>
            <div className={publicHeroActions}>
              <Button size="small" onClick={handleEnroll}>
                <FiZap size={14} />
                Enroll now
              </Button>
              <button
                className={`${publicButtonBase} ${publicButtonSmall} ${publicButtonGhost}`}
                onClick={() => navigate('/courses')}
                type="button"
              >
                <FiArrowLeft size={14} />
                Back to courses
              </button>
            </div>
            <div className={publicPillRow}>
              <span className={publicPill}>
                <FiClock size={12} />
                {HACKER_PROTOCOL_BOOTCAMP.duration}
              </span>
              <span className={publicPill}>
                <FiLayers size={12} />
                {HACKER_PROTOCOL_BOOTCAMP.phases} phases
              </span>
              <span className={publicPill}>
                <FiShield size={12} />
                Operator-led training
              </span>
            </div>
          </div>
          <div className={publicHeroPanel}>
            <div className="hs-signature" aria-hidden="true" />
            <p className={publicBadge}>Program highlights</p>
            <div className="grid gap-3">
              {HACKER_PROTOCOL_BOOTCAMP.highlights?.map((item) => (
                <div key={item} className="flex items-start gap-3 text-text-secondary">
                  <FiCheckCircle size={14} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className={publicHeroStats}>
              <span className={publicHeroStat}>
                <strong>{HACKER_PROTOCOL_BOOTCAMP.phases}</strong> phases
              </span>
              <span className={publicHeroStat}>
                <strong>{HACKER_PROTOCOL_BOOTCAMP.duration}</strong>
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
              Phases
            </p>
            <h2 className="section-title">Bootcamp phases</h2>
            <p className="section-subtitle">Each phase builds toward supervised engagements.</p>
          </div>
          <PublicCardGrid>
            {HACKER_PROTOCOL_PHASES.map((phase, index) => (
              <article key={phase.title} className={publicCard}>
                <div className="hs-signature" aria-hidden="true" />
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
              Ready to enroll
            </p>
            <h2 className="section-title">Step into the Hacker Protocol cycle.</h2>
            <p className="section-subtitle">Get access to live labs, guided missions, and community support.</p>
            <div className={publicHeroActions}>
              <Button size="small" onClick={handleEnroll}>
                Enroll now
                <FiArrowUpRight size={14} />
              </Button>
              <button
                className={`${publicButtonBase} ${publicButtonSmall} ${publicButtonGhost}`}
                onClick={() => navigate('/contact')}
                type="button"
              >
                Talk to us
              </button>
            </div>
          </div>
          <div className={publicCtaCard}>
            <div className="hs-signature" aria-hidden="true" />
            <h3 className={publicCardTitle}>Bootcamp-ready operators.</h3>
            <p className={publicCardDesc}>Train with real-world context and supervised execution.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetails;
