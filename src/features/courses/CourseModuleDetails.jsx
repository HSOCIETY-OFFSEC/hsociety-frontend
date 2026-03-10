import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useAuthModal from '../../shared/hooks/useAuthModal';
import { FiArrowLeft, FiCheckCircle, FiTerminal, FiArrowRight, FiChevronRight } from 'react-icons/fi';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import { getHackerProtocolModule } from '../../data/bootcamps/hackerProtocolData';
import '../../styles/sections/courses/index.css';

const CourseModuleDetails = () => {
  const { bootcampId, moduleId } = useParams();
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  const module = getHackerProtocolModule(Number(moduleId));

  if (bootcampId !== 'hacker-protocol' || !module) {
    return (
      <section className="courses-page reveal-on-scroll">
        <Card padding="medium"><h2>Module not found</h2></Card>
      </section>
    );
  }

  return (
    <section className="courses-page reveal-on-scroll">

      {/* ── Module hero ── */}
      <header
        className="courses-hero courses-hero--module"
        style={{ '--module-color': module.color }}
      >
        <div className="courses-hero-glow" aria-hidden="true" />
        <div className="courses-hero-grid" aria-hidden="true" />

        <div className="courses-module-hero-layout">
          <div className="courses-hero-inner">
            <span
              className="courses-eyebrow"
              style={{
                color: module.color,
                borderColor: `color-mix(in srgb, ${module.color} 35%, transparent)`,
                background: `color-mix(in srgb, ${module.color} 10%, transparent)`,
              }}
            >
              <FiTerminal size={12} />
              {module.codename} · {module.roleTitle}
            </span>
            <h1 className="courses-hero-title">{module.title}</h1>
            <p className="courses-hero-sub">{module.description}</p>
            <div className="courses-actions">
              <Button variant="ghost" size="small" onClick={() => navigate('/courses/hacker-protocol')}>
                <FiArrowLeft size={14} />
                Back to Course
              </Button>
              <Button variant="primary" size="small" onClick={() => openAuthModal('register')}>
                Enroll Now
                <FiArrowRight size={14} />
              </Button>
            </div>
          </div>

          <div className="courses-module-hero-emblem-wrap">
            <div className="courses-module-hero-emblem-glow" aria-hidden="true" />
            <span className="cfc-bracket cfc-bracket--tl" aria-hidden="true" />
            <span className="cfc-bracket cfc-bracket--tr" aria-hidden="true" />
            <span className="cfc-bracket cfc-bracket--bl" aria-hidden="true" />
            <span className="cfc-bracket cfc-bracket--br" aria-hidden="true" />
            <img
              src={module.emblem}
              alt={`${module.codename} emblem`}
              className="courses-module-hero-emblem"
            />
          </div>
        </div>
      </header>

      {/* ── Debrief two-panel layout ── */}
      <div className="courses-debrief-grid">

        {/* Left: Room list */}
        <div className="courses-debrief-panel">
          <div className="courses-debrief-panel-header">
            <FiCheckCircle size={15} style={{ color: 'var(--primary-color)' }} />
            <h3>Room Breakdown</h3>
            <span className="courses-debrief-count">{module.rooms.length} rooms</span>
          </div>
          <div className="courses-room-list">
            {module.rooms.map((room, i) => (
              <Link
                key={room.roomId}
                className="courses-room-item"
                to={`/courses/hacker-protocol/modules/${module.moduleId}/rooms/${room.roomId}`}
              >
                <span className="courses-room-index">{String(i + 1).padStart(2, '0')}</span>
                <div className="courses-room-item-text">
                  <strong>Room {room.roomId}</strong>
                  <small>{room.title}</small>
                </div>
                <FiChevronRight size={13} className="courses-room-arrow" />
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Objectives */}
        <div className="courses-debrief-panel courses-debrief-panel--objectives">
          <div className="courses-debrief-panel-header">
            <FiTerminal size={15} style={{ color: 'var(--primary-color)' }} />
            <h3>What You Will Learn</h3>
          </div>
          <div className="courses-objectives-list">
            {(module.rooms || []).map((room) => (
              <div key={room.roomId} className="courses-room-objective">
                <strong className="courses-obj-title">{room.title}</strong>
                <p className="courses-obj-desc">{room.overview}</p>
                {room.bullets?.length > 0 && (
                  <ul className="courses-obj-bullets">
                    {room.bullets.map((bullet) => (
                      <li key={bullet}>
                        <FiCheckCircle size={11} />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default CourseModuleDetails;
