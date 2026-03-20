import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiPlayCircle } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import StudentPaymentModal from '../components/StudentPaymentModal';
import StudentAccessModal from '../components/StudentAccessModal';
import useBootcampAccess from '../hooks/useBootcampAccess';
import { useAuth } from '../../../core/auth/AuthContext';
import { getStudentOverview } from '../../dashboards/student/services/student.service';
import '../styles/module-details.css';
import {
  getHackerProtocolModule,
  HACKER_PROTOCOL_BOOTCAMP,
} from '../../../data/static/bootcamps/hackerProtocolData';

const StudentModuleDetails = () => {
  const { moduleId } = useParams();
  const id = Number(moduleId);
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const { isRegistered, hasAccess } = useBootcampAccess();

  const [overview, setOverview] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const module = getHackerProtocolModule(id);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const overviewResponse = await getStudentOverview();
      if (!mounted) return;
      if (overviewResponse.success) setOverview(overviewResponse.data);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const currentOverviewModule = useMemo(
    () => overview?.modules?.find((item) => Number(item.id) === id),
    [overview, id]
  );

  const roomsTotal = currentOverviewModule?.roomsTotal || module?.rooms?.length || 0;
  const roomsCompleted = currentOverviewModule?.roomsCompleted || 0;
  const nextRoom = module?.rooms?.[Math.min(roomsCompleted, Math.max(roomsTotal - 1, 0))];

  if (!module) {
    return (
      <div className="student-page module-details-page">
        <Card padding="large" className="module-details-card">
          <h1>Module not found</h1>
          <Button variant="secondary" size="small" onClick={() => navigate('/student-bootcamps/overview')}>
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
            <div className="module-details-progress">
              <span>Progress</span>
              <strong>{roomsCompleted} / {roomsTotal} rooms completed</strong>
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
                  if (!nextRoom) return;
                  navigate(`/student-bootcamps/modules/${module.moduleId}/rooms/${nextRoom.roomId}`);
                }}
              >
                <FiPlayCircle size={15} />
                Continue Phase
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={() => navigate('/student-bootcamps/overview')}
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

        <section className="module-details-list">
          <Card padding="medium" className="module-details-card">
            <h3>Room Progression</h3>
            <div className="module-room-list">
              {(module.rooms || []).map((room, index) => {
                const isDone = index < roomsCompleted;
                const isCurrent = index === roomsCompleted;
                const isLocked = index > roomsCompleted;
                return (
                  <div
                    key={room.roomId}
                    className={`module-room-item ${isDone ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}`}
                  >
                    <FiCheckCircle size={15} />
                    <span>
                      <strong>Room {room.roomId} — {room.title}</strong>
                      <small>{isDone ? 'Completed' : isCurrent ? 'Next up' : 'Locked'}</small>
                    </span>
                  </div>
                );
              })}
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
