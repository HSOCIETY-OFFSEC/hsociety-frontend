import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiLayers,
  FiLock,
  FiPlayCircle,
  FiTarget
} from 'react-icons/fi';
import { getStudentOverview } from '../../../dashboards/student/services/student.service';
import { getStudentCourse } from '../../services/course.service';
import { getHackerProtocolModule } from '../../../../data/static/bootcamps/hackerProtocolData';
import BootcampAccessGate from '../../components/bootcamp/BootcampAccessGate';

const buildStatusMeta = (overview) => {
  const modules = overview?.modules || [];
  const totalRooms = modules.reduce((sum, module) => sum + (Number(module.roomsTotal) || 0), 0);
  const completedRooms = modules.reduce((sum, module) => sum + (Number(module.roomsCompleted) || 0), 0);
  const progress = totalRooms ? Math.round((completedRooms / totalRooms) * 100) : 0;
  const isPaused = overview?.bootcampStatus === 'not_enrolled'
    || overview?.bootcampPaymentStatus === 'unpaid';

  if (isPaused) {
    return {
      label: 'BOOTCAMP STATUS',
      value: 'PAUSED',
      note: 'Complete enrollment to unlock phases.',
      fill: 20,
      paused: true,
      progress,
      completedRooms,
      totalRooms
    };
  }

  if (progress >= 100 && totalRooms) {
    return {
      label: 'BOOTCAMP STATUS',
      value: 'COMPLETE',
      note: 'All phases completed. Ready for advanced tracks.',
      fill: 100,
      paused: false,
      progress,
      completedRooms,
      totalRooms
    };
  }

  return {
    label: 'BOOTCAMP STATUS',
    value: progress > 0 ? 'ACTIVE' : 'OPEN',
    note: progress > 0 ? 'Current phase in progress.' : 'Choose a phase to begin.',
    fill: progress > 0 ? 70 : 40,
    paused: false,
    progress,
    completedRooms,
    totalRooms
  };
};

const BootcampModule = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const id = Number(moduleId);
  const [overview, setOverview] = useState(null);
  const [course, setCourse] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const moduleMeta = getHackerProtocolModule(id);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const [overviewResponse, courseResponse] = await Promise.all([
        getStudentOverview(),
        getStudentCourse()
      ]);
      if (!mounted) return;
      if (overviewResponse.success) setOverview(overviewResponse.data);
      if (courseResponse.success) setCourse(courseResponse.data);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const module = useMemo(() =>
    course?.modules?.find((item) => item.moduleId === id),
  [course, id]);

  const moduleProgress = useMemo(() =>
    overview?.modules?.find((item) => Number(item.id) === id),
  [overview, id]);

  const roomsCompleted = Number(moduleProgress?.roomsCompleted) || 0;
  const roomsTotal = Number(moduleProgress?.roomsTotal) || module?.rooms?.length || 0;

  const statusMeta = useMemo(() => buildStatusMeta(overview), [overview]);

  if (!module || !moduleMeta) {
    return (
      <BootcampAccessGate>
        <div className="bc-page">
          <div className="bc-panel bc-alert">
            <h3 className="bc-panel-title">Module not found</h3>
            <button
              type="button"
              className="bc-btn bc-btn-secondary"
              onClick={() => navigate('/student-bootcamps/modules')}
            >
              <FiArrowLeft size={14} />
              Back to Modules
            </button>
          </div>
        </div>
      </BootcampAccessGate>
    );
  }

  return (
    <BootcampAccessGate>
      <div className="bc-page">
        <header className="bc-page-header">
          <div className="bc-page-header-inner">
            <div className="bc-header-left">
              <div className="bc-header-icon-wrap">
                <FiLayers size={20} className="bc-header-icon" />
              </div>
              <div>
                <div className="bc-header-breadcrumb">
                  <span className="bc-breadcrumb-org">HSOCIETY</span>
                  <span className="bc-breadcrumb-sep">/</span>
                  <span className="bc-breadcrumb-page">phase-{module.moduleId}</span>
                  <span className="bc-header-visibility">Private</span>
                </div>
                <p className="bc-header-desc">{moduleMeta.description}</p>
              </div>
            </div>
            <div className="bc-header-actions">
              <button
                type="button"
                className="bc-btn bc-btn-primary"
                onClick={() => {
                  const nextRoom = module.rooms?.[roomsCompleted] || module.rooms?.[0];
                  if (!nextRoom) return;
                  navigate(`/student-bootcamps/modules/${module.moduleId}/rooms/${nextRoom.roomId}`);
                }}
              >
                <FiPlayCircle size={14} />
                Continue Module
              </button>
              <button
                type="button"
                className="bc-btn bc-btn-secondary"
                onClick={() => navigate('/student-bootcamps/modules')}
              >
                <FiArrowLeft size={14} />
                Back to Modules
              </button>
            </div>
          </div>
          <div className="bc-header-meta">
            <span className="bc-meta-pill">
              <FiTarget size={13} className="bc-meta-icon" />
              <span className="bc-meta-label">Progress</span>
              <strong className="bc-meta-value">{roomsCompleted}/{roomsTotal}</strong>
            </span>
            <span className="bc-meta-pill">
              <FiLayers size={13} className="bc-meta-icon" />
              <span className="bc-meta-label">Phase</span>
              <strong className="bc-meta-value">{module.moduleId}</strong>
            </span>
          </div>
        </header>

        <div className="bc-layout">
          <main className="bc-main">
            {statusMessage && (
              <div className="bc-panel bc-alert">
                <p>{statusMessage}</p>
              </div>
            )}

            <section className="bc-section">
              <h2 className="bc-section-title">
                <FiLayers size={15} className="bc-section-icon" />
                Rooms
              </h2>
              <p className="bc-section-desc">Complete room quizzes in order to unlock the next lesson.</p>
              <div className="bc-item-list">
                {(module.rooms || []).map((room, index) => {
                  const isCompleted = index < roomsCompleted;
                  const isCurrent = index === roomsCompleted;
                  const isLocked = index > roomsCompleted;
                  const labelClass = isCompleted
                    ? 'bc-label-beta'
                    : isCurrent
                      ? 'bc-label-alpha'
                      : 'bc-label-gamma';

                  return (
                    <button
                      key={room.roomId}
                      type="button"
                      className={`bc-item-row bc-item-action ${isLocked ? 'bc-item-locked' : ''}`}
                      onClick={() => {
                        if (isLocked) {
                          setStatusMessage('Complete the previous room quiz to unlock this lesson.');
                          return;
                        }
                        setStatusMessage('');
                        navigate(`/student-bootcamps/modules/${module.moduleId}/rooms/${room.roomId}`);
                      }}
                    >
                      <div className="bc-item-main">
                        <span className="bc-item-title">Room {room.roomId}: {room.title}</span>
                        <span className="bc-item-subtitle">
                          {isCompleted ? 'Completed' : isCurrent ? 'Next up' : 'Locked'}
                        </span>
                      </div>
                      <div className="bc-item-meta">
                        <span className={`bc-label ${labelClass}`}>
                          {isCompleted ? (
                            <>
                              <FiCheckCircle size={12} />
                              Completed
                            </>
                          ) : isCurrent ? (
                            'Current'
                          ) : (
                            <>
                              <FiLock size={12} />
                              Locked
                            </>
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </main>
        </div>
      </div>
    </BootcampAccessGate>
  );
};

export default BootcampModule;
