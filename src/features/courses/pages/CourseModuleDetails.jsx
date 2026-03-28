import React, { useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useAuthModal from '../../../shared/hooks/useAuthModal';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiTerminal,
  FiArrowUpRight,
  FiChevronRight,
  FiZap,
  FiList,
} from 'react-icons/fi';
import { getHackerProtocolModule } from '../../../data/static/bootcamps/hackerProtocolData';
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

const CourseModuleDetails = () => {
  const { bootcampId, moduleId } = useParams();
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  const { isAuthenticated } = useAuth();
  const module = getHackerProtocolModule(Number(moduleId));

  const handleEnroll = useCallback(() => {
    if (!isAuthenticated) {
      openAuthModal('register', { redirect: '/student-bootcamps' });
      return;
    }
    navigate('/student-bootcamps');
  }, [isAuthenticated, navigate, openAuthModal]);

  if (bootcampId !== 'hacker-protocol' || !module) {
    return (
      <div className={`${publicPage} text-text-primary`}>
        <div className="mx-auto max-w-3xl px-6 py-16 text-center text-text-secondary">
          Module not found.
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
              HSOCIETY OFFSEC / Courses / {module.codename}
            </p>
            <h1 className={publicHeroTitle}>{module.codename}</h1>
            <p className={publicHeroDesc}>{module.description}</p>
            <div className={publicHeroActions}>
              <Button size="small" onClick={handleEnroll}>
                <FiZap size={14} />
                Enroll now
              </Button>
              <button
                className={`${publicButtonBase} ${publicButtonSmall} ${publicButtonGhost}`}
                onClick={() => navigate('/courses/hacker-protocol')}
                type="button"
              >
                <FiArrowLeft size={14} />
                Back to program
              </button>
            </div>
            <div className={publicPillRow}>
              <span className={publicPill}>
                <FiTerminal size={12} />
                {module.roleTitle}
              </span>
              <span className={publicPill}>
                <FiList size={12} />
                {module.rooms.length} rooms
              </span>
            </div>
          </div>
          <div className={publicHeroPanel}>
            <div className="hs-signature" aria-hidden="true" />
            <p className={publicBadge}>Phase overview</p>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 text-text-secondary">
                <FiCheckCircle size={14} />
                <span>{module.rooms.length} rooms in this phase.</span>
              </div>
              <div className="flex items-start gap-3 text-text-secondary">
                <FiCheckCircle size={14} />
                <span>{module.roleTitle} identity unlock.</span>
              </div>
              <div className="flex items-start gap-3 text-text-secondary">
                <FiCheckCircle size={14} />
                <span>Evidence-based assessment.</span>
              </div>
            </div>
            <div className={publicHeroStats}>
              <span className={publicHeroStat}>
                <strong>{module.rooms.length}</strong> rooms
              </span>
              <span className={publicHeroStat}>
                <strong>{module.roleTitle}</strong>
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
              Room breakdown
            </p>
            <h2 className="section-title">Rooms in this phase</h2>
            <p className="section-subtitle">Jump into any room to preview the content.</p>
          </div>
          <PublicCardGrid>
            {module.rooms.map((room, index) => {
              const difficulty = index < 2 ? 'Core' : index < 4 ? 'Advanced' : 'Expert';
              return (
              <Link
                key={room.roomId}
                className={`${publicCard} cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand`}
                to={`/courses/hacker-protocol/modules/${module.moduleId}/rooms/${room.roomId}`}
              >
                <div className="hs-signature" aria-hidden="true" />
                <div className={publicCardMeta}>
                  <span className={publicChip}>Room {room.roomId}</span>
                  <span className={publicChip}>Difficulty: {difficulty}</span>
                </div>
                <h3 className={publicCardTitle}>{room.title}</h3>
                {room.overview && <p className={publicCardDesc}>{room.overview}</p>}
                <div className={publicCardMeta}>
                  <span>View room</span>
                  <FiChevronRight size={14} />
                </div>
              </Link>
              );
            })}
          </PublicCardGrid>
        </div>
      </section>

      {/* ── CARDS ────────────────────────────────── */}
      <section className={`reveal-on-scroll ${publicSection}`}>
        <div className="section-container">
          <div className="section-header">
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Objectives
            </p>
            <h2 className="section-title">What you will learn</h2>
            <p className="section-subtitle">Skills covered across each room in this phase.</p>
          </div>
          <PublicCardGrid>
            {module.rooms.map((room) => (
              <article key={room.roomId} className={publicCard}>
                <div className="hs-signature" aria-hidden="true" />
                <h3 className={publicCardTitle}>{room.title}</h3>
                <p className={publicCardDesc}>{room.overview}</p>
                {room.bullets?.length > 0 && (
                  <ul className="grid gap-2 text-sm text-text-secondary">
                    {room.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <FiCheckCircle size={11} className="mt-0.5 text-brand" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
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
            <h2 className="section-title">Enroll to unlock this phase.</h2>
            <p className="section-subtitle">Join the bootcamp to access labs and guided missions.</p>
            <div className={publicHeroActions}>
              <Button size="small" onClick={handleEnroll}>
                Enroll now
                <FiArrowUpRight size={14} />
              </Button>
              <button
                className={`${publicButtonBase} ${publicButtonSmall} ${publicButtonGhost}`}
                onClick={() => navigate('/courses')}
                type="button"
              >
                Back to courses
              </button>
            </div>
          </div>
          <div className={publicCtaCard}>
            <div className="hs-signature" aria-hidden="true" />
            <h3 className={publicCardTitle}>Operator path unlocked.</h3>
            <p className={publicCardDesc}>Progress through phases and earn identity badges.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseModuleDetails;
