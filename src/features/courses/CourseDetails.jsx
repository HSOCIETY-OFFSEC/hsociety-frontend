import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthModal from '../../shared/hooks/useAuthModal';
import { FiArrowLeft, FiArrowRight, FiClock, FiLayers, FiShield, FiChevronRight } from 'react-icons/fi';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import { HACKER_PROTOCOL_BOOTCAMP, HACKER_PROTOCOL_PHASES } from '../../data/bootcamps/hackerProtocolData';
import '../../styles/sections/courses/index.css';

const CourseDetails = () => {
  const { bootcampId } = useParams();
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();

  if (bootcampId !== 'hacker-protocol') {
    return (
      <section className="courses-page reveal-on-scroll">
        <Card padding="medium"><h2>Course not found</h2></Card>
      </section>
    );
  }

  return (
    <section className="courses-page reveal-on-scroll">

      {/* ── Hero ── */}
      <header className="courses-hero courses-hero--detail">
        <div className="courses-hero-glow" aria-hidden="true" />
        <div className="courses-hero-grid" aria-hidden="true" />

        <div className="courses-hero-inner">
          <span className="courses-eyebrow">
            <FiShield size={12} />
            {HACKER_PROTOCOL_BOOTCAMP.subtitle}
          </span>
          <h1 className="courses-hero-title">{HACKER_PROTOCOL_BOOTCAMP.title}</h1>
          <p className="courses-hero-sub">{HACKER_PROTOCOL_BOOTCAMP.overview}</p>

          <div className="courses-meta-row">
            <span className="courses-meta-chip">
              <FiClock size={12} />{HACKER_PROTOCOL_BOOTCAMP.duration}
            </span>
            <span className="courses-meta-chip">
              <FiLayers size={12} />{HACKER_PROTOCOL_BOOTCAMP.phases} phases
            </span>
          </div>

          <div className="courses-actions">
            <Button variant="ghost" size="small" onClick={() => navigate('/courses')}>
              <FiArrowLeft size={14} />
              Back
            </Button>
            <Button variant="primary" size="small" onClick={() => openAuthModal('register')}>
              Enroll Now
              <FiArrowRight size={14} />
            </Button>
          </div>
        </div>
      </header>

      {/* ── Phases grid ── */}
      <div className="courses-phases-section">
        <div className="courses-phases-header">
          <h2 className="courses-phases-title">Select Your Phase</h2>
          <p className="courses-phases-sub">Each phase unlocks a new operative identity and skill tier.</p>
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

export default CourseDetails;
