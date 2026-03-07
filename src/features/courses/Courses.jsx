import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiClock, FiLayers, FiShield, FiChevronRight } from 'react-icons/fi';
import Button from '../../shared/components/ui/Button';
import { HACKER_PROTOCOL_BOOTCAMP, HACKER_PROTOCOL_PHASES } from '../../data/bootcamps/hackerProtocolData';
import '../../styles/sections/courses/index.css';

const Courses = () => {
  const navigate = useNavigate();

  return (
    <section className="courses-page reveal-on-scroll">

      {/* ── Hero / Dossier header ── */}
      <header className="courses-hero">
        <div className="courses-hero-glow" aria-hidden="true" />
        <div className="courses-hero-grid" aria-hidden="true" />

        <div className="courses-hero-inner">
          <span className="courses-eyebrow">
            <FiShield size={12} />
            Offensive Security Programs
          </span>
          <h1 className="courses-hero-title">Choose Your<br />Protocol</h1>
          <p className="courses-hero-sub">
            Structured courses built for skill progression, identity validation, and real-world deployment.
          </p>
        </div>
      </header>

      {/* ── Featured course card ── */}
      <div
        className="courses-featured-card"
        onClick={() => navigate('/courses/hacker-protocol')}
      >
        {/* Left: emblem window */}
        <div className="courses-featured-emblem-wrap">
          <div className="courses-featured-emblem-glow" aria-hidden="true" />
          <span className="cfc-bracket cfc-bracket--tl" aria-hidden="true" />
          <span className="cfc-bracket cfc-bracket--tr" aria-hidden="true" />
          <span className="cfc-bracket cfc-bracket--bl" aria-hidden="true" />
          <span className="cfc-bracket cfc-bracket--br" aria-hidden="true" />
          <img
            src={HACKER_PROTOCOL_BOOTCAMP.emblem}
            alt="Hacker Protocol emblem"
            className="courses-featured-emblem"
          />
        </div>

        {/* Right: info */}
        <div className="courses-featured-body">
          <span className="courses-featured-tag">Featured Program</span>
          <h2 className="courses-featured-title">{HACKER_PROTOCOL_BOOTCAMP.title}</h2>
          <p className="courses-featured-sub">{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>

          <div className="courses-meta-row">
            <span className="courses-meta-chip">
              <FiClock size={12} />
              {HACKER_PROTOCOL_BOOTCAMP.duration}
            </span>
            <span className="courses-meta-chip">
              <FiLayers size={12} />
              {HACKER_PROTOCOL_BOOTCAMP.phases} phases
            </span>
          </div>

          <Button variant="primary" size="small" onClick={() => navigate('/courses/hacker-protocol')}>
            View Course
            <FiArrowRight size={14} />
          </Button>
        </div>
      </div>

      {/* ── Phases grid ── */}
      <div className="courses-phases-section">
        <div className="courses-phases-header">
          <h2 className="courses-phases-title">Hacker Protocol Phases</h2>
          <p className="courses-phases-sub">Select a phase to inspect operative requirements and room breakdown.</p>
        </div>

        <div className="courses-module-grid">
          {HACKER_PROTOCOL_PHASES.map((module, i) => (
            <button
              key={module.moduleId}
              type="button"
              className="courses-module-card"
              style={{ '--module-color': module.color, '--card-i': i }}
              onClick={() => navigate(`/courses/hacker-protocol/modules/${module.moduleId}`)}
            >
              <div className="cmc-portal">
                <div className="cmc-glow" aria-hidden="true" />
                <span className="cmc-id">P-{String(module.moduleId).padStart(2, '0')}</span>
                <img src={module.emblem} alt={`${module.codename} emblem`} className="cmc-emblem" />
              </div>
              <div className="cmc-info">
                <strong className="cmc-codename">{module.codename}</strong>
                <span className="cmc-role">{module.roleTitle}</span>
                <FiChevronRight className="cmc-arrow" size={14} />
              </div>
            </button>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Courses;
