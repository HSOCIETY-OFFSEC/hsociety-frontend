import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthModal from '../../../shared/hooks/useAuthModal';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiTerminal,
  FiZap,
  FiList,
  FiArrowUpRight,
} from 'react-icons/fi';
import { getHackerProtocolModule, getHackerProtocolRoom } from '../../../data/static/bootcamps/hackerProtocolData';
import { useAuth } from '../../../core/auth/AuthContext';
import PublicCardGrid from '../../../shared/components/public/PublicCardGrid';
import Button from '../../../shared/components/ui/Button';
import {
  publicBadge,
  publicCard,
  publicCardDesc,
  publicCardTitle,
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
  publicButtonBase,
  publicButtonGhost,
  publicButtonSmall,
} from '../../../shared/styles/publicClasses';

const CourseRoomDetails = () => {
  const { bootcampId, moduleId, roomId } = useParams();
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  const { isAuthenticated } = useAuth();
  const module = getHackerProtocolModule(Number(moduleId));
  const room = getHackerProtocolRoom(Number(moduleId), Number(roomId));

  const handleEnroll = useCallback(() => {
    if (!isAuthenticated) {
      openAuthModal('register', { redirect: '/student-bootcamps' });
      return;
    }
    navigate('/student-bootcamps');
  }, [isAuthenticated, navigate, openAuthModal]);

  if (bootcampId !== 'hacker-protocol' || !module || !room) {
    return (
      <div className={`${publicPage} text-text-primary`}>
        <div className="mx-auto max-w-3xl px-6 py-16 text-center text-text-secondary">
          Room not found.
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
              HSOCIETY OFFSEC / {module.codename} / Room {room.roomId}
            </p>
            <h1 className={publicHeroTitle}>{room.title}</h1>
            <p className={publicHeroDesc}>{room.overview}</p>
            <div className={publicHeroActions}>
              <Button size="small" onClick={handleEnroll}>
                <FiZap size={14} />
                Enroll now
              </Button>
              <button
                className={`${publicButtonBase} ${publicButtonSmall} ${publicButtonGhost}`}
                onClick={() => navigate(`/courses/hacker-protocol/modules/${module.moduleId}`)}
                type="button"
              >
                <FiArrowLeft size={14} />
                Back to phase
              </button>
            </div>
          </div>
          <div className={publicHeroPanel}>
            <p className={publicBadge}>Room objectives</p>
            <div className="grid gap-3">
              {room.bullets?.slice(0, 3).map((bullet) => (
                <div key={bullet} className="flex items-start gap-3 text-text-secondary">
                  <FiCheckCircle size={14} />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
            <div className={publicHeroStats}>
              <span className={publicHeroStat}>
                <strong>Room</strong> {room.roomId}
              </span>
              <span className={publicHeroStat}>
                <strong>Est.</strong> 2h
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
              Room detail
            </p>
            <h2 className="section-title">What you will cover</h2>
            <p className="section-subtitle">Focus areas for this room.</p>
          </div>
          <PublicCardGrid>
            {room.bullets?.map((bullet) => (
              <article key={bullet} className={publicCard}>
                <h3 className={publicCardTitle}>Objective</h3>
                <p className={publicCardDesc}>{bullet}</p>
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
              Ready to begin
            </p>
            <h2 className="section-title">Unlock this room in the bootcamp.</h2>
            <p className="section-subtitle">Join the Hacker Protocol program to access the full lab.</p>
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
            <h3 className={publicCardTitle}>Operator training, real missions.</h3>
            <p className={publicCardDesc}>Every room is built with real-world context and skills.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseRoomDetails;
