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
import '../../public/styles/public-landing.css';
import '../styles/courses.css';

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
      <div className="public-page public-page-inner crs-page">
        <div className="crs-not-found">Room not found.</div>
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
              HSOCIETY / {module.codename} / Room {room.roomId}
            </p>
            <h1 className="public-hero-title">{room.title}</h1>
            <p className="public-hero-desc">{room.overview}</p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={handleEnroll}>
                <FiZap size={14} />
                Enroll now
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate(`/courses/hacker-protocol/modules/${module.moduleId}`)}>
                <FiArrowLeft size={14} />
                Back to phase
              </button>
            </div>
            <div className="public-pill-row">
              <span className="public-pill">
                <FiTerminal size={12} />
                {module.roleTitle}
              </span>
              <span className="public-pill">
                <FiList size={12} />
                Room {room.roomId}
              </span>
              <span className="public-pill">Est. 2h</span>
            </div>
          </div>
          <div className="public-hero-panel">
            <p className="public-badge">Room objectives</p>
            <div className="public-list">
              {room.bullets?.slice(0, 3).map((bullet) => (
                <div key={bullet} className="public-list-item">
                  <FiCheckCircle size={14} />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
            <div className="public-hero-stats">
              <span className="public-hero-stat">
                <strong>Room</strong> {room.roomId}
              </span>
              <span className="public-hero-stat">
                <strong>Est.</strong> 2h
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
              Room detail
            </p>
            <h2 className="section-title">What you will cover</h2>
            <p className="section-subtitle">Focus areas for this room.</p>
          </div>
          <div className="public-card-grid">
            {room.bullets?.map((bullet) => (
              <article key={bullet} className="public-card">
                <h3 className="public-card-title">Objective</h3>
                <p className="public-card-desc">{bullet}</p>
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
              Ready to begin
            </p>
            <h2 className="section-title">Unlock this room in the bootcamp.</h2>
            <p className="section-subtitle">Join the Hacker Protocol program to access the full lab.</p>
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
            <h3 className="public-card-title">Operator training, real missions.</h3>
            <p className="public-card-desc">Every room is built with real-world context and skills.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseRoomDetails;
