import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiLayers, FiChevronRight } from 'react-icons/fi';
import Button from '../../../shared/components/ui/Button';
import { HACKER_PROTOCOL_BOOTCAMP, HACKER_PROTOCOL_PHASES } from '../../../data/bootcamps/hackerProtocolData';
import '../../../styles/landing/courses-section.css';

const CoursesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="landing-courses reveal-on-scroll">
      <div className="section-container">

        <div className="section-header-center">
          <div className="section-eyebrow">
            <FiLayers size={13} />
            <span>Courses</span>
          </div>
          <h2 className="section-title-large">Explore Hacker Protocol</h2>
          <p className="section-subtitle-large">
            Phase-based offensive security training with identity emblems and gated progression.
          </p>
        </div>

        <div
          className="landing-courses-card"
          onClick={() => navigate('/courses/hacker-protocol')}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              navigate('/courses/hacker-protocol');
            }
          }}
          aria-label="Open Hacker Protocol course details"
        >
          {/* ── Cover panel ── */}
          <div className="landing-courses-cover">
            <div className="landing-courses-cover-inner">
              <img
                src={HACKER_PROTOCOL_BOOTCAMP.emblem}
                alt="Hacker Protocol emblem"
                className="landing-courses-cover-img"
              />
              <div className="landing-courses-cover-overlay" />
              <span className="landing-courses-cover-badge">
                {HACKER_PROTOCOL_PHASES.length} Phases
              </span>
            </div>
          </div>

          {/* ── Body panel ── */}
          <div className="landing-courses-body">
            <div className="landing-courses-meta">
              <span className="landing-courses-tag">Offensive Security</span>
            </div>

            <div className="landing-courses-title-row">
              <h3 className="landing-courses-title">{HACKER_PROTOCOL_BOOTCAMP.title}</h3>
              <FiChevronRight className="landing-courses-title-arrow" size={22} />
            </div>

            <p className="landing-courses-desc">{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>

            <div className="landing-courses-divider" />

            <p className="landing-courses-phases-label">Included Phases</p>

            <div className="landing-courses-modules">
              {HACKER_PROTOCOL_PHASES.map((module) => (
                <button
                  type="button"
                  key={module.moduleId}
                  className="landing-courses-module-pill"
                  style={{ '--module-color': module.color }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/courses/hacker-protocol/modules/${module.moduleId}`);
                  }}
                >
                  <span className="pill-emblem-wrap">
                    <img src={module.emblem} alt={`${module.codename} emblem`} />
                  </span>
                  <span className="pill-label">{module.codename}</span>
                  <FiArrowRight className="pill-arrow" size={12} />
                </button>
              ))}
            </div>

            <div className="landing-courses-footer">
              <Button
                variant="secondary"
                size="small"
                onClick={(e) => { e.stopPropagation(); navigate('/courses'); }}
              >
                Browse All Courses
                <FiArrowRight size={14} />
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CoursesSection;
