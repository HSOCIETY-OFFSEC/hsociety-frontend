import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { FiArrowLeft, FiChevronLeft, FiChevronRight, FiLock } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Skeleton from '../../../shared/components/ui/Skeleton';
import { getStudentCourse } from '../courses/course.service';
import { getStudentOverview } from '../../dashboards/student/student.service';
import { listNotifications } from '../services/notifications.service';
import { QuizPanel } from '../quizzes/QuizPanel';
import { getHackerProtocolModule, getHackerProtocolRoom } from '../../../data/bootcamps/hackerProtocolData';
import BootcampAccessGate from './components/BootcampAccessGate';
import BootcampRightPanel from './components/BootcampRightPanel';
import LiveClassCard from './components/LiveClassCard';

const BootcampRoom = () => {
  const { moduleId: moduleIdParam, roomId: roomIdParam } = useParams();
  const navigate = useNavigate();
  const { setRightPanel } = useOutletContext() || {};

  const moduleId = Number(moduleIdParam);
  const roomId = Number(roomIdParam);

  const [course, setCourse] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quizContext, setQuizContext] = useState(null);
  const [quizPassed, setQuizPassed] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [courseResponse, overviewResponse, notificationsResponse] = await Promise.all([
          getStudentCourse(),
          getStudentOverview(),
          listNotifications()
        ]);
        if (!mounted) return;
        if (courseResponse.success) setCourse(courseResponse.data);
        if (overviewResponse.success) setOverview(overviewResponse.data);
        if (notificationsResponse.success) setNotifications(notificationsResponse.data || []);
      } catch (err) {
        if (mounted) setError('Unable to load this room.');
      } finally {
        if (mounted) setLoading(false);
      }
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

  useEffect(() => {
    setQuizPassed(false);
    setStatusMessage('');
  }, [moduleId, roomId]);

  const moduleMeta = getHackerProtocolModule(moduleId);
  const roomMeta = getHackerProtocolRoom(moduleId, roomId);

  const module = course?.modules?.find((item) => item.moduleId === moduleId);
  const room = module?.rooms?.find((item) => item.roomId === roomId);

  const moduleProgress = overview?.modules?.find((item) => Number(item.id) === moduleId);
  const roomsCompleted = Number(moduleProgress?.roomsCompleted) || 0;

  const currentRoomIndex = module?.rooms?.findIndex((item) => item.roomId === roomId) ?? -1;
  const previousRoom = currentRoomIndex > 0 ? module?.rooms?.[currentRoomIndex - 1] : null;
  const nextRoom = currentRoomIndex >= 0 ? module?.rooms?.[currentRoomIndex + 1] : null;

  const isLocked = currentRoomIndex > roomsCompleted;
  const isCompleted = currentRoomIndex >= 0 && currentRoomIndex < roomsCompleted;
  const canAdvance = isCompleted || quizPassed;

  const liveClassNotification = useMemo(() => {
    const match = notifications.find((item) => {
      if (item.type !== 'bootcamp_meeting') return false;
      const meta = item.metadata || {};
      return Number(meta.moduleId) === moduleId && Number(meta.roomId) === roomId;
    });
    return match || null;
  }, [notifications, moduleId, roomId]);

  const liveClass = useMemo(() => {
    const meta = liveClassNotification?.metadata || {};
    return {
      title: meta.title || room?.liveClass?.title || roomMeta?.liveClass?.title,
      instructor: meta.instructor || room?.liveClass?.instructor || roomMeta?.liveClass?.instructor,
      time: meta.time || room?.liveClass?.time || roomMeta?.liveClass?.time,
      link: meta.meetUrl || room?.liveClass?.link || roomMeta?.liveClass?.link
    };
  }, [liveClassNotification, room, roomMeta]);

  if (loading) {
    return (
      <section className="bootcamp-page">
        <Card padding="large" className="bootcamp-status-card">
          <Skeleton className="skeleton-line" style={{ width: '40%' }} />
          <Skeleton className="skeleton-line" style={{ width: '80%', marginTop: '0.75rem' }} />
        </Card>
      </section>
    );
  }

  if (error || !module || !room || !moduleMeta || !roomMeta) {
    return (
      <section className="bootcamp-page">
        <Card padding="large" className="bootcamp-status-card">
          <h2>Room unavailable</h2>
          <p>{error || 'We could not load this lesson.'}</p>
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
        <header className="bootcamp-room-header">
          <div>
            <p className="bootcamp-kicker">Phase {moduleMeta.moduleId} · Room {room.roomId}</p>
            <h1>{room.title}</h1>
            <p>{roomMeta.overview}</p>
          </div>
          <div className="bootcamp-room-header-actions">
            <Button variant="ghost" size="small" onClick={() => navigate(`/student-bootcamps/modules/${moduleId}`)}>
              <FiArrowLeft size={14} />
              Back to Module
            </Button>
          </div>
        </header>

        {isLocked && (
          <Card padding="medium" className="bootcamp-status-card">
            <FiLock size={16} />
            <p>Complete the previous room quiz to unlock this lesson.</p>
          </Card>
        )}

        {statusMessage && (
          <Card padding="medium" className="bootcamp-status-card">
            <p>{statusMessage}</p>
          </Card>
        )}

        <div className="bootcamp-room-grid">
          <div className="bootcamp-room-main">
            <LiveClassCard
              title={liveClass?.title || `Today's class session`}
              instructor={liveClass?.instructor || 'Admin'}
              time={liveClass?.time}
              link={liveClass?.link}
            />

            <Card padding="large" className="bootcamp-room-card">
              <h2>Lesson Content</h2>
              <p>{roomMeta.overview}</p>
              <h3>Reading materials & guides</h3>
              <ul>
                {(roomMeta.bullets || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="bootcamp-room-tools">
                <strong>Tools & playbooks</strong>
                <p>Check the Resources tab for playbooks, tooling, and walkthroughs.</p>
              </div>
            </Card>

            <Card padding="medium" className="bootcamp-room-card">
              <h2>Quiz</h2>
              <p>Quizzes validate progression and unlock the next room.</p>
              <Button
                variant="primary"
                size="small"
                onClick={() => setQuizContext({
                  scope: {
                    type: 'room',
                    id: room.roomId,
                    moduleId: module.moduleId,
                    courseId: course.id
                  },
                  title: room.title
                })}
                disabled={isLocked}
              >
                Start Quiz
              </Button>
            </Card>
          </div>
        </div>

        <div className="bootcamp-room-nav">
          <Button
            variant="ghost"
            size="small"
            onClick={() => {
              if (!previousRoom) return;
              navigate(`/student-bootcamps/modules/${module.moduleId}/rooms/${previousRoom.roomId}`);
            }}
            disabled={!previousRoom}
          >
            <FiChevronLeft size={14} />
            Previous Room
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() => {
              if (!nextRoom) return;
              if (!canAdvance) {
                setStatusMessage('Complete the room quiz to unlock the next lesson.');
                return;
              }
              navigate(`/student-bootcamps/modules/${module.moduleId}/rooms/${nextRoom.roomId}`);
            }}
            disabled={!nextRoom}
          >
            Next Room
            <FiChevronRight size={14} />
          </Button>
        </div>

        {quizContext && (
          <QuizPanel
            scope={quizContext.scope}
            title={quizContext.title}
            onClose={() => setQuizContext(null)}
            onComplete={(result) => {
              if (result?.passed) {
                setQuizPassed(true);
                setStatusMessage('Quiz passed. Next room unlocked.');
              } else {
                setStatusMessage('Quiz submitted. Review and retry.');
              }
            }}
          />
        )}
      </BootcampAccessGate>
    </section>
  );
};

export default BootcampRoom;
