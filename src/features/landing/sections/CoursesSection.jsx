import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiLayers } from 'react-icons/fi';
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
            <FiLayers size={14} />
            <span>Courses</span>
          </div>
          <h2 className="section-title-large">Explore Hacker Protocol</h2>
          <p className="section-subtitle-large">
            Phase-based offensive security training with identity emblems and gated progression.
          </p>
        </div>

        <div className="landing-courses-card" onClick={() => navigate('/courses/hacker-protocol')}>
          <div className="landing-courses-cover">
            <img src={HACKER_PROTOCOL_BOOTCAMP.emblem} alt="Hacker Protocol emblem" />
          </div>
          <div className="landing-courses-body">
            <h3>{HACKER_PROTOCOL_BOOTCAMP.title}</h3>
            <p>{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>
            <div className="landing-courses-modules">
              {HACKER_PROTOCOL_PHASES.map((module) => (
                <button
                  type="button"
                  key={module.moduleId}
                  className="landing-courses-module-pill"
                  style={{ '--module-color': module.color }}
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/courses/hacker-protocol/modules/${module.moduleId}`);
                  }}
                >
                  <img src={module.emblem} alt={`${module.codename} emblem`} />
                  <span>{module.codename}</span>
                </button>
              ))}
            </div>
            <Button variant="secondary" size="small" onClick={() => navigate('/courses')}>
              Browse Courses
              <FiArrowRight size={15} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
