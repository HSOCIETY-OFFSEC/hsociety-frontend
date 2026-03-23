import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiActivity, FiCheckCircle, FiLayers, FiLock, FiTarget } from 'react-icons/fi';
import { getStudentCourse } from '../../services/course.service';
import { getStudentOverview } from '../../../dashboards/student/services/student.service';
import { HACKER_PROTOCOL_PHASES } from '../../../../data/static/bootcamps/hackerProtocolData';

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

const BootcampModules = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [course, setCourse] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

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

  const modules = useMemo(() => {
    const progressMap = (overview?.modules || []).reduce((acc, module) => {
      acc[Number(module.id)] = module;
      return acc;
    }, {});

    return (course?.modules || []).map((module, index) => {
      const meta = HACKER_PROTOCOL_PHASES.find((phase) => phase.moduleId === module.moduleId);
      const progress = Number(progressMap[module.moduleId]?.progress) || 0;
      const roomsCompleted = Number(progressMap[module.moduleId]?.roomsCompleted) || 0;
      const roomsTotal = Number(progressMap[module.moduleId]?.roomsTotal) || module.rooms.length || 0;
      const previousModule = course?.modules?.[index - 1];
      const previousProgress = previousModule
        ? Number(progressMap[previousModule.moduleId]?.progress) || 0
        : 100;

      return {
        ...module,
        meta,
        progress,
        roomsCompleted,
        roomsTotal,
        locked: previousProgress < 100
      };
    });
  }, [course, overview]);

  const statusMeta = useMemo(() => buildStatusMeta(overview), [overview]);

  return (
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
                  <span className="bc-breadcrumb-page">bootcamp-modules</span>
                  <span className="bc-header-visibility">Private</span>
                </div>
                <p className="bc-header-desc">
                  Follow the guided progression. Each module unlocks after the previous quiz path is complete.
                </p>
              </div>
            </div>
          </div>
          <div className="bc-header-meta">
            <span className="bc-meta-pill">
              <FiLayers size={13} className="bc-meta-icon" />
              <span className="bc-meta-label">Modules</span>
              <strong className="bc-meta-value">{modules.length}</strong>
            </span>
            <span className="bc-meta-pill">
              <FiTarget size={13} className="bc-meta-icon" />
              <span className="bc-meta-label">Completion</span>
              <strong className="bc-meta-value">{statusMeta.progress}%</strong>
            </span>
            <span className="bc-meta-pill">
              <FiActivity size={13} className="bc-meta-icon" />
              <span className="bc-meta-label">Status</span>
              <strong className="bc-meta-value">{statusMeta.value}</strong>
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
                Modules
              </h2>
              <p className="bc-section-desc">Select a phase to view lessons and rooms.</p>
              <div className="bc-item-list">
                {modules.map((module) => (
                  <button
                    key={module.moduleId}
                    type="button"
                    className={`bc-item-row bc-item-action ${module.locked ? 'bc-item-locked' : ''}`}
                    onClick={() => {
                      if (module.locked) {
                        setStatusMessage('Complete the previous module to unlock this phase.');
                        return;
                      }
                      setStatusMessage('');
                      navigate(`/student-bootcamps/modules/${module.moduleId}`);
                    }}
                  >
                    <div className="bc-item-main">
                      <span className="bc-item-title">Phase {module.moduleId}: {module.meta?.title || module.title}</span>
                      <span className="bc-item-subtitle">{module.meta?.codename || 'Bootcamp phase'}</span>
                    </div>
                    <div className="bc-item-meta">
                      <span className="bc-item-progress">{module.roomsCompleted}/{module.roomsTotal} rooms</span>
                      <span className={`bc-label ${module.locked ? 'bc-label-gamma' : 'bc-label-alpha'}`}>
                        {module.locked ? (
                          <>
                            <FiLock size={12} />
                            Locked
                          </>
                        ) : (
                          <>
                            <FiCheckCircle size={12} />
                            Open
                          </>
                        )}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </main>
        </div>
    </div>
  );
};

export default BootcampModules;
