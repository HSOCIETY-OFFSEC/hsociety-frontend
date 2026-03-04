import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiClock, FiLayers } from 'react-icons/fi';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import { HACKER_PROTOCOL_BOOTCAMP, HACKER_PROTOCOL_PHASES } from '../../data/bootcamps/hackerProtocolData';
import '../../styles/sections/courses/index.css';

const Courses = () => {
  const navigate = useNavigate();

  return (
    <section className="courses-page reveal-on-scroll">
      <header className="courses-hero">
        <p>Courses</p>
        <h1>Offensive Security Programs</h1>
        <p>
          Explore structured courses designed for skill progression, validation, and deployment.
        </p>
      </header>

      <div className="courses-grid">
        <Card padding="medium" className="courses-card">
          <div className="courses-card-cover">
            <img src={HACKER_PROTOCOL_BOOTCAMP.emblem} alt="Hacker Protocol emblem" />
          </div>
          <div className="courses-card-body">
            <h3>{HACKER_PROTOCOL_BOOTCAMP.title}</h3>
            <p>{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>
            <div className="courses-meta">
              <span><FiClock size={14} />{HACKER_PROTOCOL_BOOTCAMP.duration}</span>
              <span><FiLayers size={14} />{HACKER_PROTOCOL_BOOTCAMP.phases} phases</span>
            </div>
            <Button
              variant="primary"
              size="small"
              onClick={() => navigate('/courses/hacker-protocol')}
            >
              View Course
              <FiArrowRight size={15} />
            </Button>
          </div>
        </Card>
      </div>

      <section className="courses-modules-preview">
        <h2>Hacker Protocol Phases</h2>
        <div className="courses-module-grid">
          {HACKER_PROTOCOL_PHASES.map((module) => (
            <button
              key={module.moduleId}
              type="button"
              className="courses-module-card"
              style={{ '--module-color': module.color }}
              onClick={() => navigate(`/courses/hacker-protocol/modules/${module.moduleId}`)}
            >
              <img src={module.emblem} alt={`${module.codename} emblem`} />
              <strong>{module.codename}</strong>
              <span>{module.title}</span>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
};

export default Courses;
