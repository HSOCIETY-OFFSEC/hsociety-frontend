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
import '../../public/styles/public-landing.css';
import '../styles/courses.css';

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
      <div className="public-page public-page-inner crs-page">
        <div className="crs-not-found">Module not found.</div>
      </div>
    );
  }

  return (
    <div className="public-page public-page-inner crs-page">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero-section public-hero reveal-on-scroll">
        <div className="section-container">
          <div>
            <p className="public-hero-kicker">
              <span className="eyebrow-dot" />
              HSOCIETY / Courses / {module.codename}
            </p>
            <h1 className="public-hero-title">{module.codename}</h1>
            <p className="public-hero-desc">{module.description}</p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={handleEnroll}>
                <FiZap size={14} />
                Enroll now
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/courses/hacker-protocol')}>
                <FiArrowLeft size={14} />
                Back to program
              </button>
            </div>
            <div className="public-pill-row">
              <span className="public-pill">
                <FiTerminal size={12} />
                {module.roleTitle}
              </span>
              <span className="public-pill">
                <FiList size={12} />
                {module.rooms.length} rooms
              </span>
            </div>
          </div>
          <div className="public-hero-panel">
            <p className="public-badge">Phase overview</p>
            <div className="public-list">
              <div className="public-list-item">
                <FiCheckCircle size={14} />
                <span>{module.rooms.length} rooms in this phase.</span>
              </div>
              <div className="public-list-item">
                <FiCheckCircle size={14} />
                <span>{module.roleTitle} identity unlock.</span>
              </div>
              <div className="public-list-item">
                <FiCheckCircle size={14} />
                <span>Evidence-based assessment.</span>
              </div>
            </div>
            <div className="public-hero-stats">
              <span className="public-hero-stat">
                <strong>{module.rooms.length}</strong> rooms
              </span>
              <span className="public-hero-stat">
                <strong>{module.roleTitle}</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CARDS ────────────────────────────────── */}
      <section className="public-section reveal-on-scroll">
        <div className="section-container">
          <div className="section-header">
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Room breakdown
            </p>
            <h2 className="section-title">Rooms in this phase</h2>
            <p className="section-subtitle">Jump into any room to preview the content.</p>
          </div>
          <div className="public-card-grid">
            {module.rooms.map((room, index) => {
              const difficulty = index < 2 ? 'Core' : index < 4 ? 'Advanced' : 'Expert';
              return (
              <Link
                key={room.roomId}
                className="public-card crs-room-card interactive-card"
                to={`/courses/hacker-protocol/modules/${module.moduleId}/rooms/${room.roomId}`}
              >
                <div className="public-card-meta">
                  <span className="public-chip">Room {room.roomId}</span>
                  <span className="public-chip">Difficulty: {difficulty}</span>
                </div>
                <h3 className="public-card-title">{room.title}</h3>
                {room.overview && <p className="public-card-desc">{room.overview}</p>}
                <div className="public-card-meta">
                  <span>View room</span>
                  <FiChevronRight size={14} />
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CARDS ────────────────────────────────── */}
      <section className="public-section reveal-on-scroll">
        <div className="section-container">
          <div className="section-header">
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Objectives
            </p>
            <h2 className="section-title">What you will learn</h2>
            <p className="section-subtitle">Skills covered across each room in this phase.</p>
          </div>
          <div className="public-card-grid">
            {module.rooms.map((room) => (
              <article key={room.roomId} className="public-card">
                <h3 className="public-card-title">{room.title}</h3>
                <p className="public-card-desc">{room.overview}</p>
                {room.bullets?.length > 0 && (
                  <ul className="crs-obj-bullets">
                    {room.bullets.map((bullet) => (
                      <li key={bullet}>
                        <FiCheckCircle size={11} />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className="public-cta reveal-on-scroll">
        <div className="section-container public-cta-inner">
          <div>
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Ready to start
            </p>
            <h2 className="section-title">Enroll to unlock this phase.</h2>
            <p className="section-subtitle">Join the bootcamp to access labs and guided missions.</p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={handleEnroll}>
                Enroll now
                <FiArrowUpRight size={14} />
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/courses')}>
                Back to courses
              </button>
            </div>
          </div>
          <div className="public-cta-card">
            <h3 className="public-card-title">Operator path unlocked.</h3>
            <p className="public-card-desc">Progress through phases and earn identity badges.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseModuleDetails;
