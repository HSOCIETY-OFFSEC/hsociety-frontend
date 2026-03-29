import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAward, FiBookOpen, FiCompass, FiFlag, FiLock, FiPlayCircle, FiTarget, FiZap } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Skeleton from '../../../shared/components/ui/Skeleton';
import { getStudentCourse } from '../services/course.service';
import { deriveProfileFromCourseState } from '../services/profile.service';
import { completeLearningRoom, completeLearningCtf } from '../../dashboards/student/services/student.service';
import { QuizPanel } from '../components/QuizPanel';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import { ROUTES } from '../../../app/router/routes';
import { logger } from '../../../core/logging/logger';

/**
 * CourseLearning
 * Main gamified learning experience for students.
 *
 * Data model:
 * Course -> Modules -> Rooms -> CTF (per module)
 */

const createEmptyProgress = (course) => {
  if (!course) return { modules: {} };

  const modules = {};
  course.modules.forEach((module) => {
    const rooms = {};
    module.rooms.forEach((room) => {
      rooms[room.roomId] = false;
    });
    modules[module.moduleId] = {
      rooms,
      ctfCompleted: false
    };
  });

  return { modules };
};

const computeCourseProgress = (course, progressState) => {
  if (!course) {
    return {
      overallPercent: 0,
      totalUnits: 0,
      completedUnits: 0,
      moduleStats: {}
    };
  }

  let totalUnits = 0;
  let completedUnits = 0;
  const moduleStats = {};

  course.modules.forEach((module) => {
    const moduleProgress = progressState.modules[module.moduleId] || {
      rooms: {},
      ctfCompleted: false
    };

    let moduleTotal = module.rooms.length + 1; // +1 for CTF
    let moduleCompleted = 0;

    module.rooms.forEach((room) => {
      totalUnits += 1;
      if (moduleProgress.rooms[room.roomId]) {
        completedUnits += 1;
        moduleCompleted += 1;
      }
    });

    // CTF counts as one unit
    totalUnits += 1;
    if (moduleProgress.ctfCompleted) {
      completedUnits += 1;
      moduleCompleted += 1;
    }

    moduleStats[module.moduleId] = {
      percent: moduleTotal ? Math.round((moduleCompleted / moduleTotal) * 100) : 0,
      totalUnits: moduleTotal,
      completedUnits: moduleCompleted
    };
  });

  const overallPercent = totalUnits ? Math.round((completedUnits / totalUnits) * 100) : 0;

  return {
    overallPercent,
    totalUnits,
    completedUnits,
    moduleStats
  };
};

const getModuleState = (course, progressState, moduleId) => {
  const modules = course?.modules || [];
  const index = modules.findIndex((m) => m.moduleId === moduleId);
  if (index === -1) return 'locked';

  // Find the first module that is not fully completed -> active
  let firstIncompleteIndex = modules.length - 1;

  for (let i = 0; i < modules.length; i++) {
    const module = modules[i];
    const moduleProgress = progressState.modules[module.moduleId] || {
      rooms: {},
      ctfCompleted: false
    };

    const allRoomsCompleted =
      module.rooms.length > 0 &&
      module.rooms.every((room) => moduleProgress.rooms[room.roomId]);

    if (!(allRoomsCompleted && moduleProgress.ctfCompleted)) {
      firstIncompleteIndex = i;
      break;
    }
  }

  if (index < firstIncompleteIndex) return 'completed';
  if (index === firstIncompleteIndex) return 'active';
  return 'locked';
};

export const CourseLearning = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [progressState, setProgressState] = useState({ modules: {} });
  const [error, setError] = useState('');

  const [activeModuleId, setActiveModuleId] = useState(null);

  const [quizContext, setQuizContext] = useState(null);

  const pageClassName =
    'min-h-[calc(100vh-60px)] w-full px-[clamp(1rem,4vw,2rem)] pb-16 text-text-primary';
  const layoutClassName = 'flex flex-col gap-5';
  const layoutMainClassName = 'flex flex-col gap-5';
  const headerCardClassName = 'border-border bg-card';
  const headerMainClassName = 'flex flex-wrap items-start justify-between gap-6';
  const kickerClassName = 'text-xs font-semibold uppercase tracking-widest text-text-tertiary';
  const titleClassName = 'flex items-center gap-3 text-2xl font-semibold text-text-primary';
  const titleAccentClassName = 'flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-bg-tertiary text-text-primary';
  const subtitleClassName = 'mt-2 max-w-[520px] text-sm text-text-secondary';
  const miniStatsClassName = 'flex flex-col gap-2 rounded-md border border-border bg-bg-secondary px-4 py-3 text-sm text-text-secondary';
  const miniStatRowClassName = 'flex items-center justify-between gap-4';
  const miniStatLabelClassName = 'text-xs font-semibold uppercase tracking-widest text-text-tertiary';
  const miniStatValueClassName = 'font-semibold text-text-primary';
  const headerActionsClassName = 'mt-4';
  const progressRowClassName = 'mt-4';
  const progressLabelClassName = 'flex items-center justify-between text-xs text-text-secondary';
  const progressBarClassName = 'mt-2 h-2 rounded-full bg-bg-tertiary';
  const progressFillClassName = 'h-full rounded-full bg-brand';
  const footerRowClassName = 'mt-4 flex flex-wrap items-center justify-between gap-3';
  const badgesClassName = 'flex flex-wrap gap-2';
  const badgeClassName = 'inline-flex items-center gap-2 rounded-full border border-border bg-bg-secondary px-3 py-1 text-xs text-text-secondary';
  const badgeMutedClassName = 'text-text-tertiary';
  const certificateClassName =
    'inline-flex items-center gap-2 rounded-full border border-border bg-bg-secondary px-3 py-1 text-xs font-semibold text-text-primary';
  const modulesGridClassName = 'grid grid-cols-1 gap-4 lg:grid-cols-2';
  const moduleCardBaseClassName =
    'rounded-lg border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-text-secondary/40 hover:shadow-md';
  const moduleCardActiveClassName = 'border-text-secondary/40';
  const moduleHeaderClassName = 'flex items-start justify-between gap-4';
  const moduleLabelClassName = 'text-xs font-semibold uppercase tracking-widest text-text-tertiary';
  const moduleStatePillBaseClassName = 'inline-flex items-center gap-2 rounded-full border border-border bg-bg-secondary px-2 py-1 text-xs font-semibold';
  const moduleStateCompletedClassName = 'text-text-primary';
  const moduleStateActiveClassName = 'text-text-secondary';
  const moduleStateLockedClassName = 'text-text-tertiary border-dashed';
  const moduleProgressRowClassName = 'mt-4';
  const roomsListClassName = 'mt-4 flex flex-col gap-3';
  const roomRowBaseClassName =
    'flex flex-col gap-3 rounded-md border border-border bg-bg-secondary px-3 py-3 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between';
  const roomRowCompletedClassName = 'border-text-secondary/40';
  const roomRowDisabledClassName = 'border-dashed text-text-tertiary';
  const roomMainClassName = 'flex items-center gap-3';
  const roomDotClassName = 'h-2.5 w-2.5 rounded-full bg-text-tertiary ring-2 ring-border/60';
  const roomDotCompletedClassName = 'bg-text-primary';
  const roomActionsClassName = 'flex flex-wrap gap-2';
  const ctfRowClassName = 'mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-border pt-4';
  const ctfPillBaseClassName = 'inline-flex items-center gap-2 rounded-full border border-border bg-bg-secondary px-2 py-1 text-xs font-semibold';
  const ctfPillUnlockedClassName = 'text-text-primary';
  const ctfPillLockedClassName = 'text-text-tertiary';
  const moduleFooterClassName = 'mt-4 flex flex-wrap items-center justify-between gap-3';
  const moduleBadgeClassName = 'inline-flex items-center gap-2 text-sm text-text-secondary';

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getStudentCourse();
        if (!response.success) {
          throw new Error(getPublicErrorMessage({ action: 'load', response }));
        }

        const normalizedCourse = response.data;
        setCourse(normalizedCourse);
        setProgressState(createEmptyProgress(normalizedCourse));

        // Default active module: first
        if (normalizedCourse.modules.length > 0) {
          setActiveModuleId(normalizedCourse.modules[0].moduleId);
        }
      } catch (err) {
        logger.error('CourseLearning error:', err);
        setError('Unable to load course learning data.');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, []);

  const courseProgress = useMemo(
    () => computeCourseProgress(course, progressState),
    [course, progressState]
  );

  const profileSnapshot = useMemo(
    () => deriveProfileFromCourseState(course, progressState),
    [course, progressState]
  );

  useEffect(() => {
    if (!course) return;
    // Progress updates are persisted via explicit completion endpoints.
  }, [course, progressState, profileSnapshot]);

  const handleContinueLearning = () => {
    if (typeof document === 'undefined') return;
    const activeCard = document.getElementById('active-course-module');
    if (activeCard && typeof activeCard.scrollIntoView === 'function') {
      activeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleToggleRoomComplete = async (moduleId, roomId) => {
    if (!course) return;

    const state = getModuleState(course, progressState, moduleId);
    if (state === 'locked') return;

    const moduleProgress = progressState.modules[moduleId] || { rooms: {}, ctfCompleted: false };
    if (moduleProgress.rooms?.[roomId]) return;

    const response = await completeLearningRoom(moduleId, roomId);
    if (!response.success) return;

    setProgressState((prev) => ({
      modules: {
        ...prev.modules,
        [moduleId]: {
          ...(prev.modules[moduleId] || { rooms: {}, ctfCompleted: false }),
          rooms: {
            ...(prev.modules[moduleId]?.rooms || {}),
            [roomId]: true
          }
        }
      }
    }));
  };

  const handleCtfComplete = async (moduleId) => {
    if (!course) return;

    const module = course.modules.find((m) => m.moduleId === moduleId);
    const moduleProgress = progressState.modules[moduleId] || { rooms: {}, ctfCompleted: false };
    const allRoomsCompleted =
      module.rooms.length > 0 &&
      module.rooms.every((room) => moduleProgress.rooms[room.roomId]);

    if (!allRoomsCompleted) return; // CTF unlock gated by module completion

    const response = await completeLearningCtf(moduleId);
    if (!response.success) return;

    setProgressState((prev) => ({
      modules: {
        ...prev.modules,
        [moduleId]: {
          ...(prev.modules[moduleId] || { rooms: {}, ctfCompleted: false }),
          ctfCompleted: true
        }
      }
    }));
  };

  const handleOpenLesson = (moduleId, roomId) => {
    navigate(ROUTES.STUDENT_LESSON(moduleId, roomId));
  };

  const handleQuizForRoom = (moduleId, roomId) => {
    if (!course) return;
    const module = course.modules.find((m) => m.moduleId === moduleId);
    const room = module?.rooms.find((r) => r.roomId === roomId);
    if (!room) return;

    setQuizContext({
      scope: {
        type: 'room',
        id: roomId,
        moduleId,
        courseId: course.id
      },
      title: room.title
    });
  };

  const handleQuizForModule = (moduleId) => {
    if (!course) return;
    const module = course.modules.find((m) => m.moduleId === moduleId);
    if (!module) return;

    setQuizContext({
      scope: {
        type: 'module',
        id: moduleId,
        courseId: course.id
      },
      title: module.title
    });
  };

  const handleQuizComplete = (result) => {
    // Optional: if quiz is tied to a room, mark that room completed on pass
    if (result?.passed && quizContext?.scope?.type === 'room') {
      const { moduleId, id: roomId } = quizContext.scope;
      handleToggleRoomComplete(moduleId, roomId);
    }
    setQuizContext(null);
  };

  const renderOverallHeader = () => {
    if (!course) return null;

    const { overallPercent } = courseProgress;
    const { xp, levelInfo, unlockedBadges, hasCertificate, certificationName } = profileSnapshot;

    return (
      <Card padding="medium" shadow="small" className={`${headerCardClassName} reveal-on-scroll`}>
        <div className={headerMainClassName}>
          <div>
            <p className={kickerClassName}>Bootcamp Resources</p>
            <h2 className={titleClassName}>
              {course.title}
              <span className={titleAccentClassName}>
                <FiBookOpen size={20} />
              </span>
            </h2>
            <p className={subtitleClassName}>
              Follow the HSOCIETY bootcamp modules and track what you&apos;ve covered during live
              sessions and self-study.
            </p>
          </div>
          <div className={miniStatsClassName}>
            <div className={miniStatRowClassName}>
              <span className={miniStatLabelClassName}>Level</span>
              <span className={miniStatValueClassName}>{levelInfo.level}</span>
            </div>
            <div className={miniStatRowClassName}>
              <span className={miniStatLabelClassName}>XP</span>
              <span className={miniStatValueClassName}>{xp}</span>
            </div>
            <div className={miniStatRowClassName}>
              <span className={miniStatLabelClassName}>Badges</span>
              <span className={miniStatValueClassName}>{unlockedBadges.length}</span>
            </div>
          </div>
        </div>

        <div className={headerActionsClassName}>
          <Button variant="primary" size="large" onClick={handleContinueLearning}>
            <FiCompass size={18} />
            Jump to Resources
          </Button>
        </div>

        <div className={progressRowClassName}>
          <div className={progressLabelClassName}>
            <span>Overall Progress</span>
            <span>{overallPercent}%</span>
          </div>
          <div className={progressBarClassName}>
            <div className={progressFillClassName} style={{ width: `${overallPercent}%` }} />
          </div>
        </div>

        <div className={footerRowClassName}>
          <div className={badgesClassName}>
            {unlockedBadges.length === 0 ? (
              <span className={`${badgeClassName} ${badgeMutedClassName}`}>
                <FiAward size={14} />
                No badges yet – complete modules to unlock them.
              </span>
            ) : (
              unlockedBadges.map((badge) => (
                <span key={badge} className={badgeClassName}>
                  <FiAward size={14} />
                  {badge}
                </span>
              ))
            )}
          </div>

          {hasCertificate && certificationName && (
            <div className={certificateClassName}>
              <FiFlag size={14} />
              {certificationName} unlocked
            </div>
          )}
        </div>
      </Card>
    );
  };

  const renderModules = () => {
    if (!course) return null;

    return (
      <div className={modulesGridClassName}>
        {course.modules.map((module) => {
          const state = getModuleState(course, progressState, module.moduleId);
          const stats = courseProgress.moduleStats[module.moduleId] || {
            percent: 0,
            totalUnits: module.rooms.length + 1,
            completedUnits: 0
          };

          const moduleProgress = progressState.modules[module.moduleId] || {
            rooms: {},
            ctfCompleted: false
          };

          const allRoomsCompleted =
            module.rooms.length > 0 &&
            module.rooms.every((room) => moduleProgress.rooms[room.roomId]);

          return (
            <Card
              key={module.moduleId}
              id={state === 'active' ? 'active-course-module' : undefined}
              padding="medium"
              shadow="small"
              className={`${moduleCardBaseClassName} reveal-on-scroll${activeModuleId === module.moduleId ? ` ${moduleCardActiveClassName}` : ''}`}
              onClick={() => setActiveModuleId(module.moduleId)}
            >
              <div className={moduleHeaderClassName}>
                <div>
                  <span className={moduleLabelClassName}>Module {module.moduleId}</span>
                  <h3 className="text-lg font-semibold text-text-primary">{module.title}</h3>
                </div>
                <div
                  className={`${moduleStatePillBaseClassName} ${
                    state === 'completed'
                      ? moduleStateCompletedClassName
                      : state === 'active'
                        ? moduleStateActiveClassName
                        : moduleStateLockedClassName
                  }`}
                >
                  {state === 'completed' && (
                    <>
                      <FiZap size={14} />
                      Completed
                    </>
                  )}
                  {state === 'active' && (
                    <>
                      <FiTarget size={14} />
                      Active
                    </>
                  )}
                  {state === 'locked' && (
                    <>
                      <FiLock size={14} />
                      Locked
                    </>
                  )}
                </div>
              </div>

              <div className={moduleProgressRowClassName}>
                <div className={progressLabelClassName}>
                  <span>Module progress</span>
                  <span>{stats.percent}%</span>
                </div>
                <div className={progressBarClassName}>
                  <div className={progressFillClassName} style={{ width: `${stats.percent}%` }} />
                </div>
              </div>

              <div className={roomsListClassName}>
                {module.rooms.map((room) => {
                  const completed = !!moduleProgress.rooms[room.roomId];
                  const disabled = state === 'locked';
                  const rowClassName = [
                    roomRowBaseClassName,
                    completed ? roomRowCompletedClassName : '',
                    disabled ? roomRowDisabledClassName : ''
                  ].filter(Boolean).join(' ');

                  return (
                    <div
                      key={room.roomId}
                      className={rowClassName}
                    >
                      <div className={roomMainClassName}>
                        <span className={`${roomDotClassName}${completed ? ` ${roomDotCompletedClassName}` : ''}`} />
                        <div>
                          <h4 className="text-sm font-semibold text-text-primary">{room.title}</h4>
                          <span className="text-xs text-text-tertiary">Room #{room.roomId}</span>
                        </div>
                      </div>
                      <div className={roomActionsClassName}>
                        <Button
                          variant="primary"
                          size="small"
                          disabled={disabled}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenLesson(module.moduleId, room.roomId);
                          }}
                        >
                          <FiPlayCircle size={14} />
                          View resources
                        </Button>
                        <Button
                          variant="ghost"
                          size="small"
                          disabled={disabled}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuizForRoom(module.moduleId, room.roomId);
                          }}
                        >
                          Quiz
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={ctfRowClassName}>
                <div className="flex flex-col gap-2">
                  <span className={`${ctfPillBaseClassName} ${allRoomsCompleted ? ctfPillUnlockedClassName : ctfPillLockedClassName}`}>
                    {allRoomsCompleted ? (
                    <>
                      <FiTarget size={14} />
                      Practical exercise unlocked
                    </>
                  ) : (
                    <>
                      <FiLock size={14} />
                      Complete rooms to unlock exercise
                    </>
                  )}
                </span>
                  <h4 className="text-sm font-semibold text-text-primary">{module.ctf}</h4>
                </div>
                <Button
                  variant={moduleProgress.ctfCompleted ? 'secondary' : 'primary'}
                  size="small"
                  disabled={!allRoomsCompleted}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCtfComplete(module.moduleId);
                  }}
                >
                  {moduleProgress.ctfCompleted
                    ? 'Exercise Completed'
                    : 'Start Exercise'}
                </Button>
              </div>

              <div className={moduleFooterClassName}>
                <span className={moduleBadgeClassName}>
                  <FiAward size={14} />
                  Badge: {module.badge}
                </span>
                <Button
                  variant="ghost"
                  size="small"
                  disabled={false}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuizForModule(module.moduleId);
                  }}
                >
                  Module Check-in
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={pageClassName}>
        <div className={layoutClassName}>
          <div className={layoutMainClassName}>
            <Card padding="medium" className={headerCardClassName}>
              <Skeleton className="h-3 rounded-full" style={{ width: '40%' }} />
              <Skeleton className="h-3 rounded-full" style={{ width: '65%', marginTop: '0.75rem' }} />
              <Skeleton className="h-4 rounded-full" style={{ width: '100%', marginTop: '1.5rem' }} />
            </Card>
            <div className={modulesGridClassName}>
              {[1, 2].map((key) => (
                <Card key={key} padding="medium" className={moduleCardBaseClassName}>
                  <Skeleton className="h-3 rounded-full" style={{ width: '60%' }} />
                  <Skeleton className="h-3 rounded-full" style={{ width: '100%', marginTop: '1rem' }} />
                  <Skeleton className="h-3 rounded-full" style={{ width: '90%', marginTop: '0.5rem' }} />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={pageClassName}>
        <div className={layoutClassName}>
          <div className={layoutMainClassName}>
            <Card padding="medium" className={headerCardClassName}>
              <p className="text-sm text-text-secondary">{error}</p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={pageClassName}>
      <div className={layoutClassName}>
        <div className={layoutMainClassName}>
          {renderOverallHeader()}
          {renderModules()}
        </div>
      </div>

      {quizContext && (
        <QuizPanel
          scope={quizContext.scope}
          title={quizContext.title}
          onClose={() => setQuizContext(null)}
          onComplete={handleQuizComplete}
        />
      )}
    </div>
  );
};

export default CourseLearning;
