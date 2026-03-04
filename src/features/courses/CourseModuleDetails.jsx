import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import { getHackerProtocolModule } from '../../data/bootcamps/hackerProtocolData';
import '../../styles/sections/courses/index.css';

const CourseModuleDetails = () => {
  const { bootcampId, moduleId } = useParams();
  const navigate = useNavigate();

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
      <header className="courses-hero" style={{ '--module-color': module.color }}>
        <p>{module.codename} · {module.roleTitle}</p>
        <h1>{module.title}</h1>
        <p>{module.description}</p>
        <Button variant="ghost" size="small" onClick={() => navigate('/courses/hacker-protocol')}>
          <FiArrowLeft size={15} />
          Back to Course
        </Button>
      </header>

      <div className="courses-module-detail-grid">
        <Card padding="medium" className="courses-module-detail-card">
          <img src={module.emblem} alt={`${module.codename} emblem`} className="courses-module-detail-emblem" />
          <h3>Room Breakdown</h3>
          <div className="courses-room-list">
            {module.rooms.map((room) => (
              <div key={room.roomId} className="courses-room-item">
                <FiCheckCircle size={15} />
                <span>
                  <strong>Room {room.roomId}</strong>
                  <small>{room.title}</small>
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="medium" className="courses-module-detail-card">
          <h3>What You Will Learn</h3>
          {(module.rooms || []).map((room) => (
            <div key={room.roomId} className="courses-room-objective">
              <strong>{room.title}</strong>
              <p>{room.overview}</p>
              <ul>
                {(room.bullets || []).map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </Card>
      </div>
    </section>
  );
};

export default CourseModuleDetails;
