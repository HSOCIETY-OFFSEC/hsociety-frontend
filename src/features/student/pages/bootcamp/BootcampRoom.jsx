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
import { getStudentOverview, completeLearningRoom } from '../../../dashboards/student/services/student.service';
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

  const reloadOverview = async () => {
    const response = await getStudentOverview();
    if (response.success) setOverview(response.data);
  };

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

  const roomOverview = room?.overview || roomMeta?.overview || '';
  const roomBullets = Array.isArray(room?.bullets) && room.bullets.length
    ? room.bullets
    : (roomMeta?.bullets || []);

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
  const pageClassName =
    'min-h-[calc(100vh-60px)] w-full px-[clamp(1rem,4vw,2rem)] pb-16 text-text-primary';
  const headerClassName = 'mb-6 flex flex-col gap-4';
  const headerInnerClassName = 'flex flex-wrap items-center justify-between gap-6';
  const headerLeftClassName = 'flex items-center gap-4';
  const iconWrapClassName = 'flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-bg-secondary text-brand';
  const breadcrumbClassName = 'flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-text-tertiary';
  const breadcrumbStrongClassName = 'font-semibold text-text-secondary';
  const visibilityClassName =
    'rounded-full border border-border bg-bg-secondary px-2 py-0.5 text-xs font-semibold uppercase tracking-widest text-text-secondary';
  const headerDescClassName = 'mt-1 text-sm text-text-secondary';
  const headerActionsClassName = 'flex flex-wrap gap-2';
  const buttonPrimaryClassName =
    'inline-flex items-center gap-2 rounded-xs border border-brand bg-brand px-3 py-2 text-xs font-semibold text-ink-onBrand transition hover:bg-brand/90';
  const buttonSecondaryClassName =
    'inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-2 text-xs font-semibold text-text-primary transition hover:bg-bg-tertiary';
  const metaRowClassName = 'flex flex-wrap gap-3';
  const metaPillClassName =
    'inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-1 text-xs text-text-secondary';
  const metaValueClassName = 'font-semibold text-text-primary';
  const panelClassName = 'rounded-lg border border-border bg-bg-secondary p-5 text-sm text-text-secondary';
  const alertClassName = 'flex items-start gap-2';
  const sectionClassName = 'flex flex-col gap-4';
  const sectionTitleClassName = 'text-lg font-semibold text-text-primary';
  const sectionDescClassName = 'text-sm text-text-secondary';
  const dividerClassName = 'h-px bg-border';
  const cardClassName = 'rounded-lg border border-border bg-bg-secondary p-5';
  const cardActionsClassName = 'flex flex-wrap gap-2';
  const mutedClassName = 'text-sm text-text-tertiary';
  const listClassName = 'list-disc space-y-1 pl-5 text-sm text-text-secondary';
  const roomNavClassName = 'flex flex-wrap gap-3 pt-4';

  if (loading) {
    return (
      <div className={pageClassName}>
        <div className={panelClassName}>
          <div className="h-3 rounded-xs bg-bg-tertiary" style={{ width: '40%' }} />
          <div className="mt-2 h-3 rounded-xs bg-bg-tertiary" style={{ width: '80%' }} />
        </div>
      </div>
    );
  }

  if (error || !module || !room || !moduleMeta || !roomMeta) {
    return (
      <div className={pageClassName}>
        <div className={panelClassName}>
          <h3 className="text-base font-semibold text-text-primary">Room unavailable</h3>
          <p className="text-sm text-text-secondary">{error || 'We could not load this lesson.'}</p>
          <button
            type="button"
            className={buttonSecondaryClassName}
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
      <div className={pageClassName}>
        <header className={headerClassName}>
          <div className={headerInnerClassName}>
            <div className={headerLeftClassName}>
              <div className={iconWrapClassName}>
                <FiFileText size={20} />
              </div>
              <div>
                <div className={breadcrumbClassName}>
                  <span className={breadcrumbStrongClassName}>HSOCIETY</span>
                  <span>/</span>
                  <span className={breadcrumbStrongClassName}>phase-{moduleMeta.moduleId}-room-{room.roomId}</span>
                  <span className={visibilityClassName}>Private</span>
                </div>
                <p className={headerDescClassName}>{roomOverview}</p>
              </div>
            </div>
            <div className={headerActionsClassName}>
              <button
                type="button"
                className={buttonSecondaryClassName}
                onClick={() => navigate(`/student-bootcamps/modules/${moduleId}`)}
              >
                <FiArrowLeft size={14} />
                Back to Module
              </button>
            </div>
          </div>
          <div className={metaRowClassName}>
            <span className={metaPillClassName}>
              <FiLayers size={13} className="text-text-tertiary" />
              <span>Phase</span>
              <strong className={metaValueClassName}>{moduleMeta.moduleId}</strong>
            </span>
            <span className={metaPillClassName}>
              <FiTarget size={13} className="text-text-tertiary" />
              <span>Room</span>
              <strong className={metaValueClassName}>{room.roomId}</strong>
            </span>
          </div>
        </header>

        <div className="grid gap-6">
          <main>
            {isLocked && (
              <div className={`${panelClassName} ${alertClassName}`}>
                <FiLock size={16} className="text-text-tertiary" />
                <p className="text-sm text-text-secondary">Complete the previous room quiz to unlock this lesson.</p>
              </div>
            )}

            {statusMessage && (
              <div className={panelClassName}>
                <p className="text-sm text-text-secondary">{statusMessage}</p>
              </div>
            )}

            <section className={sectionClassName}>
              <h2 className={sectionTitleClassName}>
                <FiMessageSquare size={15} className="mr-2 inline-block text-brand" />
                Live Class
              </h2>
              <p className={sectionDescClassName}>Join instructor-led sessions tied to this room.</p>
              <LiveClassCard
                title={liveClass?.title || `Today's class session`}
                instructor={liveClass?.instructor || 'Admin'}
                time={liveClass?.time}
                link={liveClass?.link}
              />
            </section>
            <div className={dividerClassName} />

            <section className={sectionClassName}>
              <h2 className={sectionTitleClassName}>
                <FiFileText size={15} className="mr-2 inline-block text-brand" />
                Lesson Content
              </h2>
              <p className={sectionDescClassName}>Review the core material before attempting the quiz.</p>
              <div className={panelClassName}>
                <h3 className="text-base font-semibold text-text-primary">Overview</h3>
                <p className="text-sm text-text-secondary">{roomOverview}</p>
                <div className={dividerClassName} />
                <h4 className="text-sm font-semibold text-text-primary">Reading materials & guides</h4>
                <ul className={listClassName}>
                  {(roomBullets || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className={dividerClassName} />
                <strong className="text-sm text-text-primary">Tools & playbooks</strong>
                <p className="text-sm text-text-secondary">Check the Resources tab for playbooks, tooling, and walkthroughs.</p>
              </div>
            </section>
            <div className={dividerClassName} />

            <section className={sectionClassName}>
              <h2 className={sectionTitleClassName}>
                <FiDownload size={15} className="mr-2 inline-block text-brand" />
                Downloads
              </h2>
              <p className={sectionDescClassName}>Download slides, labs, and supporting files for this room.</p>
              <div className={cardClassName}>
                {roomResources.length === 0 ? (
                  <p className={mutedClassName}>No downloads published yet for this room.</p>
                ) : (
                  <div className={cardActionsClassName}>
                    {roomResources.map((resource) => (
                      <button
                        key={resource.url || resource.title}
                        type="button"
                        className={buttonSecondaryClassName}
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
            <div className={dividerClassName} />

            <section className={sectionClassName}>
              <h2 className={sectionTitleClassName}>
                <FiCheckCircle size={15} className="mr-2 inline-block text-brand" />
                Quiz
              </h2>
              <p className={sectionDescClassName}>Quizzes validate progression and unlock the next room.</p>
              <div className={panelClassName}>
                <p className="text-sm text-text-secondary">Submit the quiz to unlock the next lesson.</p>
                <button
                  type="button"
                  className={buttonPrimaryClassName}
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

            <div className={roomNavClassName}>
              <button
                type="button"
                className={buttonSecondaryClassName}
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
                className={buttonPrimaryClassName}
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
          onComplete={async (result) => {
            if (result?.passed) {
              setQuizPassed(true);
              setStatusMessage('Quiz passed. Next room unlocked.');
              await completeLearningRoom(moduleId, roomId);
              await reloadOverview();
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
