import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAward, FiBookOpen, FiCompass, FiFlag, FiLock, FiPlayCircle, FiTarget, FiZap } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Skeleton from '../../../shared/components/ui/Skeleton';
import useScrollReveal from '../../../shared/hooks/useScrollReveal';
import { getStudentCourse } from './course.service';
import { deriveProfileFromCourseState, syncProfileProgress } from '../profile/profile.service';
import { QuizPanel } from '../quizzes/QuizPanel';
import '../../../styles/features/student-learning.css';

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
  useScrollReveal();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [progressState, setProgressState] = useState({ modules: {} });
  const [error, setError] = useState('');

  const [activeModuleId, setActiveModuleId] = useState(null);

  const [quizContext, setQuizContext] = useState(null);

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getStudentCourse();
        if (!response.success) {
          throw new Error(response.error || 'Failed to load course');
        }

        const normalizedCourse = response.data;
        setCourse(normalizedCourse);
        setProgressState(createEmptyProgress(normalizedCourse));

        // Default active module: first
        if (normalizedCourse.modules.length > 0) {
          setActiveModuleId(normalizedCourse.modules[0].moduleId);
        }
      } catch (err) {
        console.error('CourseLearning error:', err);
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
    syncProfileProgress({
      courseId: course.id,
      progressState,
      derived: profileSnapshot,
      updatedAt: new Date().toISOString(),
    });
  }, [course, progressState, profileSnapshot]);

  const handleContinueLearning = () => {
    if (typeof document === 'undefined') return;
    const activeCard = document.getElementById('active-course-module');
    if (activeCard && typeof activeCard.scrollIntoView === 'function') {
      activeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleToggleRoomComplete = (moduleId, roomId) => {
    if (!course) return;

    const state = getModuleState(course, progressState, moduleId);
    if (state === 'locked') return;

    setProgressState((prev) => {
      const moduleProgress = prev.modules[moduleId] || { rooms: {}, ctfCompleted: false };
      const current = !!moduleProgress.rooms[roomId];

      return {
        modules: {
          ...prev.modules,
          [moduleId]: {
            ...moduleProgress,
            rooms: {
              ...moduleProgress.rooms,
              [roomId]: !current
            }
          }
        }
      };
    });
  };

  const handleCtfComplete = (moduleId) => {
    if (!course) return;

    const module = course.modules.find((m) => m.moduleId === moduleId);
    const moduleProgress = progressState.modules[moduleId] || { rooms: {}, ctfCompleted: false };
    const allRoomsCompleted =
      module.rooms.length > 0 &&
      module.rooms.every((room) => moduleProgress.rooms[room.roomId]);

    if (!allRoomsCompleted) return; // CTF unlock gated by module completion

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
    navigate(`/student-learning/module/${moduleId}/room/${roomId}`);
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
      <Card padding="large" className="course-header-card reveal-on-scroll">
        <div className="course-header-main">
          <div>
            <p className="course-kicker">Learning Path · Gamified</p>
            <h2 className="course-title">
              {course.title}
              <span className="course-title-accent">
                <FiBookOpen size={20} />
              </span>
            </h2>
            <p className="course-subtitle">
              Track your progress across modules, unlock CTFs, earn badges, and level up as a
              hacker.
            </p>
          </div>
          <div className="course-mini-stats">
            <div className="course-mini-stat">
              <span className="label">Level</span>
              <span className="value">{levelInfo.level}</span>
            </div>
            <div className="course-mini-stat">
              <span className="label">XP</span>
              <span className="value">{xp}</span>
            </div>
            <div className="course-mini-stat">
              <span className="label">Badges</span>
              <span className="value">{unlockedBadges.length}</span>
            </div>
          </div>
        </div>

        <div className="course-header-actions">
          <Button variant="primary" size="large" onClick={handleContinueLearning}>
            <FiCompass size={18} />
            Continue Learning
          </Button>
        </div>

        <div className="course-progress-row">
          <div className="course-progress-label">
            <span>Overall Progress</span>
            <span>{overallPercent}%</span>
          </div>
          <div className="course-progress-bar">
            <div style={{ width: `${overallPercent}%` }} />
          </div>
        </div>

        <div className="course-footer-row">
          <div className="course-badges">
            {unlockedBadges.length === 0 ? (
              <span className="badge-pill badge-pill-muted">
                <FiAward size={14} />
                No badges yet – complete modules to unlock them.
              </span>
            ) : (
              unlockedBadges.map((badge) => (
                <span key={badge} className="badge-pill">
                  <FiAward size={14} />
                  {badge}
                </span>
              ))
            )}
          </div>

          {hasCertificate && certificationName && (
            <div className="course-certificate-pill">
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
      <div className="course-modules-grid">
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
              padding="large"
              className={`course-module-card reveal-on-scroll state-${state} ${
                activeModuleId === module.moduleId ? 'is-active' : ''
              }`}
              onClick={() => setActiveModuleId(module.moduleId)}
            >
              <div className="course-module-header">
                <div className="course-module-meta">
                  <span className="course-module-label">Module {module.moduleId}</span>
                  <h3>{module.title}</h3>
                </div>
                <div className="course-module-state-pill">
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

              <div className="course-module-progress-row">
                <div className="course-progress-label">
                  <span>Module progress</span>
                  <span>{stats.percent}%</span>
                </div>
                <div className="course-progress-bar module">
                  <div style={{ width: `${stats.percent}%` }} />
                </div>
              </div>

              <div className="course-rooms-list">
                {module.rooms.map((room) => {
                  const completed = !!moduleProgress.rooms[room.roomId];
                  const disabled = state === 'locked';

                  return (
                    <div
                      key={room.roomId}
                      className={`course-room-row ${completed ? 'completed' : ''} ${
                        disabled ? 'disabled' : ''
                      }`}
                    >
                      <div className="course-room-main">
                        <span className="course-room-dot" />
                        <div>
                          <h4>{room.title}</h4>
                          <span>Room #{room.roomId}</span>
                        </div>
                      </div>
                      <div className="course-room-actions">
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
                          Open lesson
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

              <div className="course-ctf-row">
                <div className="course-ctf-main">
                  <span className={`course-ctf-pill ${allRoomsCompleted ? 'unlocked' : 'locked'}`}>
                    {allRoomsCompleted ? (
                      <>
                        <FiTarget size={14} />
                        CTF unlocked
                      </>
                    ) : (
                      <>
                        <FiLock size={14} />
                        Complete rooms to unlock CTF
                      </>
                    )}
                  </span>
                  <h4>{module.ctf}</h4>
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
                  {moduleProgress.ctfCompleted ? 'CTF Completed' : 'Launch CTF'}
                </Button>
              </div>

              <div className="course-module-footer">
                <span className="course-module-badge">
                  <FiAward size={14} />
                  Badge: {module.badge}
                </span>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuizForModule(module.moduleId);
                  }}
                >
                  Module Quiz
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
      <div className="course-learning">
        <div className="course-layout">
          <div className="course-layout-main">
            <Card padding="large" className="course-header-card">
              <Skeleton className="skeleton-line" style={{ width: '40%' }} />
              <Skeleton className="skeleton-line" style={{ width: '65%', marginTop: '0.75rem' }} />
              <Skeleton
                className="skeleton-line"
                style={{ width: '100%', height: '16px', marginTop: '1.5rem' }}
              />
            </Card>
            <div className="course-modules-grid">
              {[1, 2].map((key) => (
                <Card key={key} padding="large" className="course-module-card">
                  <Skeleton className="skeleton-line" style={{ width: '60%' }} />
                  <Skeleton
                    className="skeleton-line"
                    style={{ width: '100%', height: '12px', marginTop: '1rem' }}
                  />
                  <Skeleton
                    className="skeleton-line"
                    style={{ width: '90%', height: '12px', marginTop: '0.5rem' }}
                  />
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
      <div className="course-learning">
        <div className="course-layout">
          <div className="course-layout-main">
            <Card padding="large" className="course-header-card">
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{error}</p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="course-learning">
      <div className="course-layout">
        <div className="course-layout-main">
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
