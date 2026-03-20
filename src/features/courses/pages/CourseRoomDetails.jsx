/**
 * Course Room Details Page
 * Location: src/features/courses/CourseRoomDetails.jsx
 */

import React, { useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useAuthModal from '../../../shared/hooks/useAuthModal';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiTerminal,
  FiChevronRight,
  FiZap,
  FiList,
} from 'react-icons/fi';
import { getHackerProtocolModule, getHackerProtocolRoom } from '../../../data/static/bootcamps/hackerProtocolData';
import { useAuth } from '../../../core/auth/AuthContext';
import '../styles/courses.css';

const CourseRoomDetails = () => {
  const { bootcampId, moduleId, roomId } = useParams();
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  const { isAuthenticated } = useAuth();
  const module = getHackerProtocolModule(Number(moduleId));
  const room   = getHackerProtocolRoom(Number(moduleId), Number(roomId));

  const handleEnroll = useCallback(() => {
    if (!isAuthenticated) {
      openAuthModal('register', { redirect: '/student-bootcamps' });
      return;
    }
    navigate('/student-bootcamps');
  }, [isAuthenticated, navigate, openAuthModal]);

  if (bootcampId !== 'hacker-protocol' || !module || !room) {
    return (
      <div className="crs-page">
        <div className="crs-not-found">Room not found.</div>
      </div>
    );
  }

  return (
    <div className="crs-page">

      {/* ── PAGE HEADER ─────────────────────────────── */}
      <header className="crs-page-header">
        <div className="crs-page-header-inner">
          <div className="crs-header-left">
            <div className="crs-header-icon-wrap">
              <img src={module.emblem} alt={module.codename} className="crs-header-emblem" />
            </div>
            <div>
              <div className="crs-header-breadcrumb">
                <button className="crs-breadcrumb-link" onClick={() => navigate('/courses')}>
                  courses
                </button>
                <span className="crs-breadcrumb-sep">/</span>
                <button
                  className="crs-breadcrumb-link"
                  onClick={() => navigate('/courses/hacker-protocol')}
                >
                  hacker-protocol
                </button>
                <span className="crs-breadcrumb-sep">/</span>
                <button
                  className="crs-breadcrumb-link"
                  onClick={() => navigate(`/courses/hacker-protocol/modules/${module.moduleId}`)}
                >
                  {module.codename.toLowerCase()}
                </button>
                <span className="crs-breadcrumb-sep">/</span>
                <span className="crs-breadcrumb-page">room-{room.roomId}</span>
              </div>
              <p className="crs-header-desc">{room.overview}</p>
            </div>
          </div>

          <div className="crs-header-actions">
            <button
              className="crs-btn crs-btn-secondary"
              onClick={() => navigate(`/courses/hacker-protocol/modules/${module.moduleId}`)}
            >
              <FiArrowLeft size={14} />
              Back to module
            </button>
            <button className="crs-btn crs-btn-primary" onClick={handleEnroll}>
              <FiZap size={14} />
              Enroll now
            </button>
          </div>
        </div>

        <div className="crs-header-meta">
          <span className="crs-meta-pill">
            <FiTerminal size={13} className="crs-meta-icon" />
            <span className="crs-meta-label">Phase</span>
            <strong className="crs-meta-value">{module.codename}</strong>
          </span>
          <span className="crs-meta-pill">
            <span className="crs-meta-dot" />
            <span>Room {room.roomId}</span>
          </span>
        </div>
      </header>

      {/* ── TWO-COLUMN LAYOUT ───────────────────────── */}
      <div className="crs-layout">
        <main className="crs-main">

          {/* Objectives */}
          <section className="crs-section">
            <h2 className="crs-section-title">
              <FiCheckCircle size={15} className="crs-section-icon" />
              Room objectives
            </h2>

            <div className="crs-objectives-list">
              <div className="crs-objective-item">
                <strong className="crs-obj-title">{room.title}</strong>
                <p className="crs-obj-desc">{room.overview}</p>
                {room.bullets?.length > 0 && (
                  <ul className="crs-obj-bullets">
                    {room.bullets.map((bullet) => (
                      <li key={bullet}>
                        <FiCheckCircle size={11} className="crs-obj-bullet-icon" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          <div className="crs-divider" />

          {/* Other rooms in module */}
          <section className="crs-section">
            <h2 className="crs-section-title">
              <FiList size={15} className="crs-section-icon" />
              Other rooms in this module
            </h2>

            <div className="crs-room-list">
              {module.rooms.map((r, i) => (
                <Link
                  key={r.roomId}
                  className={`crs-room-row${r.roomId === room.roomId ? ' is-active' : ''}`}
                  to={`/courses/hacker-protocol/modules/${module.moduleId}/rooms/${r.roomId}`}
                >
                  <span className="crs-room-num">{String(i + 1).padStart(2, '0')}</span>
                  <FiCheckCircle size={13} className="crs-room-check" />
                  <div className="crs-room-text">
                    <strong className="crs-room-title">Room {r.roomId} · {r.title}</strong>
                  </div>
                  <FiChevronRight size={13} className="crs-room-arrow" />
                </Link>
              ))}
            </div>
          </section>

        </main>

        <aside className="crs-sidebar">
          <div className="crs-sidebar-box">
            <h3 className="crs-sidebar-heading">About this room</h3>
            <p className="crs-sidebar-about">{room.overview}</p>
            <div className="crs-sidebar-divider" />
            <ul className="crs-sidebar-list">
              <li>
                <FiCheckCircle size={13} className="crs-sidebar-icon" />
                Part of {module.codename}
              </li>
              {room.bullets?.slice(0, 3).map((b) => (
                <li key={b}>
                  <FiCheckCircle size={13} className="crs-sidebar-icon" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="crs-sidebar-box crs-status-box">
            <div className="crs-status-row">
              <span className="crs-status-dot" />
              <span className="crs-status-label">ROOM STATUS</span>
            </div>
            <strong className="crs-status-value">READY</strong>
            <div className="crs-status-track">
              <div className="crs-status-fill" />
            </div>
            <p className="crs-status-note">Enroll to unlock this room.</p>
          </div>

          <div className="crs-sidebar-box">
            <h3 className="crs-sidebar-heading">Topics</h3>
            <div className="crs-topics">
              {['pentesting', 'offsec', module.codename.toLowerCase(), 'room'].map(
                (t) => <span key={t} className="crs-topic">{t}</span>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseRoomDetails;