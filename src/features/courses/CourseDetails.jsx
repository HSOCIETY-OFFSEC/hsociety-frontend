import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiClock, FiLayers } from 'react-icons/fi';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import { HACKER_PROTOCOL_BOOTCAMP, HACKER_PROTOCOL_PHASES } from '../../data/bootcamps/hackerProtocolData';
import '../../styles/sections/courses/index.css';

const CourseDetails = () => {
  const { bootcampId } = useParams();
  const navigate = useNavigate();

  if (bootcampId !== 'hacker-protocol') {
    return (
      <section className="courses-page reveal-on-scroll">
        <Card padding="medium"><h2>Course not found</h2></Card>
      </section>
    );
  }

  return (
    <section className="courses-page reveal-on-scroll">
      <header className="courses-hero">
        <p>{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>
        <h1>{HACKER_PROTOCOL_BOOTCAMP.title}</h1>
        <p>{HACKER_PROTOCOL_BOOTCAMP.overview}</p>
        <div className="courses-meta">
          <span><FiClock size={14} />{HACKER_PROTOCOL_BOOTCAMP.duration}</span>
          <span><FiLayers size={14} />{HACKER_PROTOCOL_BOOTCAMP.phases} phases</span>
        </div>
        <div className="courses-actions">
          <Button variant="ghost" size="small" onClick={() => navigate('/courses')}>
            <FiArrowLeft size={15} />
            Back to Courses
          </Button>
          <Button variant="primary" size="small" onClick={() => navigate('/register')}>
            Enroll as Student
            <FiArrowRight size={15} />
          </Button>
        </div>
      </header>

      <section className="courses-module-grid">
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
            <span>{module.roleTitle}</span>
          </button>
        ))}
      </section>
    </section>
  );
};

export default CourseDetails;
