import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiLock, FiPlayCircle } from 'react-icons/fi';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import StudentPaymentModal from './components/StudentPaymentModal';
import StudentAccessModal from './components/StudentAccessModal';
import useBootcampAccess from './hooks/useBootcampAccess';
import { useAuth } from '../../core/auth/AuthContext';
import { getStudentCourse } from './courses/course.service';
import {
  getHackerProtocolModule,
  HACKER_PROTOCOL_BOOTCAMP,
  HACKER_PROTOCOL_PHASES,
} from '../../data/bootcamps/hackerProtocolData';
import '../../styles/student/pages/module-details.css';

const StudentModuleDetails = () => {
  const { moduleId } = useParams();
  const id = Number(moduleId);
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const { isRegistered, hasAccess } = useBootcampAccess();

  const [course, setCourse] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const module = getHackerProtocolModule(id);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const response = await getStudentCourse();
      if (!mounted || !response.success) return;
      setCourse(response.data);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const currentCourseModule = useMemo(
    () => course?.modules?.find((item) => Number(item.moduleId) === id),
    [course, id]
  );

  if (!module) {
    return (
      <div className="student-page module-details-page">
        <Card padding="large" className="module-details-card">
          <h1>Module not found</h1>
          <Button variant="secondary" size="small" onClick={() => navigate('/student-bootcamps/hacker-protocol/dashboard')}>
            <FiArrowLeft size={16} />
            Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="student-page module-details-page">
      <div className="module-details-shell">
        <header className="module-details-hero" style={{ '--module-color': module.color }}>
          <div className="module-details-hero-left">
            <p>{HACKER_PROTOCOL_BOOTCAMP.title} · Phase {module.moduleId}</p>
            <h1>{module.title}</h1>
            <p>{module.description}</p>
            <div className="module-details-tags">
              <span>{module.codename}</span>
              <span>{module.roleTitle}</span>
            </div>
            <div className="module-details-actions">
              <Button
                variant="primary"
                size="small"
                onClick={() => {
                  if (!isRegistered) {
                    setShowRegisterModal(true);
                    return;
                  }
                  if (!hasAccess) {
                    setShowPaymentModal(true);
                    return;
                  }
                  const firstRoom = currentCourseModule?.rooms?.[0] || module.rooms?.[0];
                  if (!firstRoom) return;
                  navigate(`/student-bootcamps/hacker-protocol/module/${module.moduleId}/room/${firstRoom.roomId}`);
                }}
              >
                <FiPlayCircle size={15} />
                Start Phase
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={() => navigate('/student-bootcamps/hacker-protocol/dashboard')}
              >
                <FiArrowLeft size={15} />
                Back to Dashboard
              </Button>
            </div>
          </div>
          <div className="module-details-hero-right">
            <img src={module.emblem} alt={`${module.codename} emblem`} />
          </div>
        </header>

        <section className="module-details-grid">
          <Card padding="medium" className="module-details-card">
            <h3>Rooms</h3>
            <div className="module-room-list">
              {(module.rooms || []).map((room) => (
                <button
                  key={room.roomId}
                  type="button"
                  className="module-room-item"
                  onClick={() => navigate(`/student-bootcamps/hacker-protocol/module/${module.moduleId}/room/${room.roomId}`)}
                >
                  <FiCheckCircle size={15} />
                  <span>
                    <strong>Room {room.roomId}</strong>
                    <small>{room.title}</small>
                  </span>
                </button>
              ))}
            </div>
          </Card>

          <Card padding="medium" className="module-details-card">
            <h3>Progression Rule</h3>
            <p>
              Each phase is locked behind validation. Complete quiz + interview to unlock the next phase.
            </p>
            <h4>All Phases</h4>
            <div className="module-phase-list">
              {HACKER_PROTOCOL_PHASES.map((phase) => (
                <button
                  type="button"
                  key={phase.moduleId}
                  className={`module-phase-item ${phase.moduleId === module.moduleId ? 'active' : ''}`}
                  style={{ '--phase-color': phase.color }}
                  onClick={() => navigate(`/student-bootcamps/hacker-protocol/modules/${phase.moduleId}`)}
                >
                  <img src={phase.emblem} alt={`${phase.codename} emblem`} />
                  <span>{phase.codename}</span>
                </button>
              ))}
            </div>
          </Card>
        </section>
      </div>

      {showPaymentModal && (
        <StudentPaymentModal
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            updateUser({ bootcampPaymentStatus: 'pending', bootcampStatus: 'enrolled' });
            setShowPaymentModal(false);
          }}
        />
      )}

      {showRegisterModal && (
        <StudentAccessModal
          title="Bootcamp registration required"
          description="Register in bootcamps before opening a phase."
          primaryLabel="Go to Bootcamps"
          onPrimary={() => navigate('/student-bootcamps')}
          onClose={() => setShowRegisterModal(false)}
        />
      )}
    </div>
  );
};

export default StudentModuleDetails;
