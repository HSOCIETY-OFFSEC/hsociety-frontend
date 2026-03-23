import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiFileText,
  FiLayers,
  FiLock,
  FiMessageSquare,
  FiTarget,
  FiDownload
} from 'react-icons/fi';
import { getStudentCourse } from '../../services/course.service';
import { getStudentOverview } from '../../../dashboards/student/services/student.service';
import { listNotifications } from '../../services/notifications.service';
import { getBootcampResources } from '../../services/learn.service';
import { QuizPanel } from '../../components/QuizPanel';
import { getHackerProtocolModule, getHackerProtocolRoom } from '../../../../data/static/bootcamps/hackerProtocolData';
import LiveClassCard from '../../components/bootcamp/LiveClassCard';

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

const BootcampRoom = () => {
  const { moduleId: moduleIdParam, roomId: roomIdParam } = useParams();
  const navigate = useNavigate();

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
  const [roomResources, setRoomResources] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [courseResponse, overviewResponse, notificationsResponse, resourcesResponse] = await Promise.all([
          getStudentCourse(),
          getStudentOverview(),
          listNotifications(),
          getBootcampResources(moduleId, roomId),
        ]);
        if (!mounted) return;
        if (courseResponse.success) setCourse(courseResponse.data);
        if (overviewResponse.success) setOverview(overviewResponse.data);
        if (notificationsResponse.success) setNotifications(notificationsResponse.data || []);
        if (resourcesResponse.success) {
          const resources = resourcesResponse.data?.items || [];
          const match = resources.find((item) =>
            Number(item.moduleId) === moduleId && Number(item.roomId) === roomId
          );
          setRoomResources(match?.resources || []);
        } else {
          setRoomResources([]);
        }
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
  }, [moduleId, roomId]);

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

  const statusMeta = useMemo(() => buildStatusMeta(overview), [overview]);

  if (loading) {
    return (
      <div className="bc-page">
        <div className="bc-panel">
          <div className="bc-skeleton" style={{ width: '40%' }} />
          <div className="bc-skeleton" style={{ width: '80%' }} />
        </div>
      </div>
    );
  }

  if (error || !module || !room || !moduleMeta || !roomMeta) {
    return (
      <div className="bc-page">
        <div className="bc-panel bc-alert">
          <h3 className="bc-panel-title">Room unavailable</h3>
          <p>{error || 'We could not load this lesson.'}</p>
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
    );
  }

  return (
    <>
      <div className="bc-page">
        <header className="bc-page-header">
          <div className="bc-page-header-inner">
            <div className="bc-header-left">
              <div className="bc-header-icon-wrap">
                <FiFileText size={20} className="bc-header-icon" />
              </div>
              <div>
                <div className="bc-header-breadcrumb">
                  <span className="bc-breadcrumb-org">HSOCIETY</span>
                  <span className="bc-breadcrumb-sep">/</span>
                  <span className="bc-breadcrumb-page">phase-{moduleMeta.moduleId}-room-{room.roomId}</span>
                  <span className="bc-header-visibility">Private</span>
                </div>
                <p className="bc-header-desc">{roomMeta.overview}</p>
              </div>
            </div>
            <div className="bc-header-actions">
              <button
                type="button"
                className="bc-btn bc-btn-secondary"
                onClick={() => navigate(`/student-bootcamps/modules/${moduleId}`)}
              >
                <FiArrowLeft size={14} />
                Back to Module
              </button>
            </div>
          </div>
          <div className="bc-header-meta">
            <span className="bc-meta-pill">
              <FiLayers size={13} className="bc-meta-icon" />
              <span className="bc-meta-label">Phase</span>
              <strong className="bc-meta-value">{moduleMeta.moduleId}</strong>
            </span>
            <span className="bc-meta-pill">
              <FiTarget size={13} className="bc-meta-icon" />
              <span className="bc-meta-label">Room</span>
              <strong className="bc-meta-value">{room.roomId}</strong>
            </span>
          </div>
        </header>

        <div className="bc-layout">
          <main className="bc-main">
            {isLocked && (
              <div className="bc-panel bc-alert">
                <FiLock size={16} />
                <p>Complete the previous room quiz to unlock this lesson.</p>
              </div>
            )}

            {statusMessage && (
              <div className="bc-panel bc-alert">
                <p>{statusMessage}</p>
              </div>
            )}

            <section className="bc-section">
              <h2 className="bc-section-title">
                <FiMessageSquare size={15} className="bc-section-icon" />
                Live Class
              </h2>
              <p className="bc-section-desc">Join instructor-led sessions tied to this room.</p>
              <LiveClassCard
                title={liveClass?.title || `Today's class session`}
                instructor={liveClass?.instructor || 'Admin'}
                time={liveClass?.time}
                link={liveClass?.link}
              />
            </section>
            <div className="bc-divider" />

            <section className="bc-section">
              <h2 className="bc-section-title">
                <FiFileText size={15} className="bc-section-icon" />
                Lesson Content
              </h2>
              <p className="bc-section-desc">Review the core material before attempting the quiz.</p>
              <div className="bc-panel">
                <h3 className="bc-panel-title">Overview</h3>
                <p>{roomMeta.overview}</p>
                <div className="bc-panel-divider" />
                <h4 className="bc-panel-subtitle">Reading materials & guides</h4>
                <ul className="bc-list">
                  {(roomMeta.bullets || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="bc-panel-divider" />
                <strong>Tools & playbooks</strong>
                <p>Check the Resources tab for playbooks, tooling, and walkthroughs.</p>
              </div>
            </section>
            <div className="bc-divider" />

            <section className="bc-section">
              <h2 className="bc-section-title">
                <FiDownload size={15} className="bc-section-icon" />
                Downloads
              </h2>
              <p className="bc-section-desc">Download slides, labs, and supporting files for this room.</p>
              <div className="bc-card">
                {roomResources.length === 0 ? (
                  <p className="bc-muted">No downloads published yet for this room.</p>
                ) : (
                  <div className="bc-card-actions">
                    {roomResources.map((resource) => (
                      <button
                        key={resource.url || resource.title}
                        type="button"
                        className="bc-btn bc-btn-secondary"
                        onClick={() => resource.url && window.open(resource.url, '_blank', 'noopener,noreferrer')}
                        disabled={!resource.url}
                      >
                        <FiDownload size={14} />
                        {resource.title || 'Download'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>
            <div className="bc-divider" />

            <section className="bc-section">
              <h2 className="bc-section-title">
                <FiCheckCircle size={15} className="bc-section-icon" />
                Quiz
              </h2>
              <p className="bc-section-desc">Quizzes validate progression and unlock the next room.</p>
              <div className="bc-panel">
                <p>Submit the quiz to unlock the next lesson.</p>
                <button
                  type="button"
                  className="bc-btn bc-btn-primary"
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
                </button>
              </div>
            </section>

            <div className="bc-room-nav">
              <button
                type="button"
                className="bc-btn bc-btn-secondary"
                onClick={() => {
                  if (!previousRoom) return;
                  navigate(`/student-bootcamps/modules/${module.moduleId}/rooms/${previousRoom.roomId}`);
                }}
                disabled={!previousRoom}
              >
                <FiChevronLeft size={14} />
                Previous Room
              </button>
              <button
                type="button"
                className="bc-btn bc-btn-primary"
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
              </button>
            </div>
          </main>
        </div>
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
    </>
  );
};

export default BootcampRoom;
