import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { FiArrowLeft, FiLock, FiPlayCircle } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import { getStudentOverview } from '../../dashboards/student/student.service';
import { getStudentCourse } from '../courses/course.service';
import { getHackerProtocolModule } from '../../../data/bootcamps/hackerProtocolData';
import BootcampAccessGate from './components/BootcampAccessGate';
import BootcampRightPanel from './components/BootcampRightPanel';

const BootcampModule = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { setRightPanel } = useOutletContext() || {};
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

  useEffect(() => {
    if (!setRightPanel) return undefined;
    setRightPanel(<BootcampRightPanel overview={overview} />);
    return () => setRightPanel(null);
  }, [overview, setRightPanel]);

  const module = useMemo(() =>
    course?.modules?.find((item) => item.moduleId === id),
  [course, id]);

  const moduleProgress = useMemo(() =>
    overview?.modules?.find((item) => Number(item.id) === id),
  [overview, id]);

  const roomsCompleted = Number(moduleProgress?.roomsCompleted) || 0;
  const roomsTotal = Number(moduleProgress?.roomsTotal) || module?.rooms?.length || 0;

  if (!module || !moduleMeta) {
    return (
      <section className="bootcamp-page">
        <Card padding="large" className="bootcamp-status-card">
          <h2>Module not found</h2>
          <Button variant="ghost" size="small" onClick={() => navigate('/student-bootcamps/modules')}>
            <FiArrowLeft size={14} />
            Back to Modules
          </Button>
        </Card>
      </section>
    );
  }

  return (
    <section className="bootcamp-page">
      <BootcampAccessGate>
        <header className="bootcamp-page-header">
          <div>
            <p className="bootcamp-kicker">Phase {module.moduleId} · {moduleMeta.codename}</p>
            <h1>{moduleMeta.title}</h1>
            <p>{moduleMeta.description}</p>
          </div>
          <div className="bootcamp-page-actions">
            <Button
              variant="primary"
              size="small"
              onClick={() => {
                const nextRoom = module.rooms?.[roomsCompleted] || module.rooms?.[0];
                if (!nextRoom) return;
                navigate(`/student-bootcamps/modules/${module.moduleId}/rooms/${nextRoom.roomId}`);
              }}
            >
              <FiPlayCircle size={14} />
              Continue Module
            </Button>
            <Button variant="ghost" size="small" onClick={() => navigate('/student-bootcamps/modules')}>
              <FiArrowLeft size={14} />
              Back to Modules
            </Button>
          </div>
        </header>

        {statusMessage && (
          <Card padding="medium" className="bootcamp-status-card">
            <p>{statusMessage}</p>
          </Card>
        )}

        <Card padding="medium" className="bootcamp-status-card">
          <strong>Progress</strong>
          <p>{roomsCompleted} / {roomsTotal} rooms completed</p>
        </Card>

        <div className="bootcamp-room-list">
          {(module.rooms || []).map((room, index) => {
            const isCompleted = index < roomsCompleted;
            const isCurrent = index === roomsCompleted;
            const isLocked = index > roomsCompleted;

            return (
              <button
                key={room.roomId}
                type="button"
                className={`bootcamp-room-card ${isLocked ? 'locked' : ''}`}
                onClick={() => {
                  if (isLocked) {
                    setStatusMessage('Complete the previous room quiz to unlock this lesson.');
                    return;
                  }
                  setStatusMessage('');
                  navigate(`/student-bootcamps/modules/${module.moduleId}/rooms/${room.roomId}`);
                }}
              >
                <div>
                  <h3>Room {room.roomId}: {room.title}</h3>
                  <p>{isCompleted ? 'Completed' : isCurrent ? 'Next up' : 'Locked'}</p>
                </div>
                {isLocked && <FiLock size={16} />}
              </button>
            );
          })}
        </div>
      </BootcampAccessGate>
    </section>
  );
};

export default BootcampModule;
