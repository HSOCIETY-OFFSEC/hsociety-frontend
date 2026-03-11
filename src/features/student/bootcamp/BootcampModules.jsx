import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import { getStudentCourse } from '../courses/course.service';
import { getStudentOverview } from '../../dashboards/student/student.service';
import { HACKER_PROTOCOL_PHASES } from '../../../data/bootcamps/hackerProtocolData';
import BootcampAccessGate from './components/BootcampAccessGate';
import BootcampRightPanel from './components/BootcampRightPanel';

const BootcampModules = () => {
  const navigate = useNavigate();
  const { setRightPanel } = useOutletContext() || {};
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

  useEffect(() => {
    if (!setRightPanel) return undefined;
    setRightPanel(<BootcampRightPanel overview={overview} />);
    return () => setRightPanel(null);
  }, [overview, setRightPanel]);

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

  return (
    <section className="bootcamp-page">
      <BootcampAccessGate>
        <header className="bootcamp-page-header">
          <div>
            <h1>Modules</h1>
            <p>Follow the guided progression. Each module unlocks after the previous quiz path is complete.</p>
          </div>
        </header>

        {statusMessage && (
          <Card padding="medium" className="bootcamp-status-card">
            <p>{statusMessage}</p>
          </Card>
        )}

        <div className="bootcamp-modules-grid">
          {modules.map((module) => (
            <button
              key={module.moduleId}
              type="button"
              className={`bootcamp-module-card ${module.locked ? 'locked' : ''}`}
              style={{ '--module-color': module.meta?.color || '#1f2937' }}
              onClick={() => {
                if (module.locked) {
                  setStatusMessage('Complete the previous module to unlock this phase.');
                  return;
                }
                setStatusMessage('');
                navigate(`/student-bootcamps/modules/${module.moduleId}`);
              }}
            >
              <div className="bootcamp-module-header">
                <h3>{module.meta?.title || module.title}</h3>
                {module.locked && <FiLock size={14} />}
              </div>
              <p className="bootcamp-module-subtitle">Phase {module.moduleId} · {module.meta?.codename}</p>
              <div className="bootcamp-module-progress">
                <span>Progress: {module.progress}%</span>
                <span>Rooms: {module.roomsCompleted} / {module.roomsTotal}</span>
              </div>
            </button>
          ))}
        </div>
      </BootcampAccessGate>
    </section>
  );
};

export default BootcampModules;
