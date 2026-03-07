import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiBookOpen, FiClock, FiShield } from 'react-icons/fi';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import Skeleton from '../../shared/components/ui/Skeleton';
import { getStudentCourse } from './courses/course.service';
import { getStudentOverview } from '../dashboards/student/student.service';
import useBootcampAccess from './hooks/useBootcampAccess';
import StudentAccessModal from './components/StudentAccessModal';
import StudentPaymentModal from './components/StudentPaymentModal';
import { useAuth } from '../../core/auth/AuthContext';
import { QuizPanel } from './quizzes/QuizPanel';
import {
  getHackerProtocolModule,
  getHackerProtocolRoom,
} from '../../data/bootcamps/hackerProtocolData';
import '../../styles/student/base.css';
import '../../styles/student/components.css';
import '../../styles/student/pages/lesson.css';

const StudentLesson = () => {
  const navigate = useNavigate();
  const { moduleId: moduleIdParam, roomId: roomIdParam } = useParams();
  const { user, updateUser } = useAuth();
  const { isRegistered, hasAccess } = useBootcampAccess();

  const moduleId = Number(moduleIdParam);
  const roomId = Number(roomIdParam);

  const [course, setCourse] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [quizContext, setQuizContext] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');

  const moduleProgressMap = useMemo(() => {
    if (!overview?.modules) return {};
    return overview.modules.reduce((acc, item) => {
      acc[String(item.id)] = item.progress || 0;
      return acc;
    }, {});
  }, [overview]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [courseResponse, overviewResponse] = await Promise.all([
          getStudentCourse(),
          getStudentOverview(),
        ]);

        if (!courseResponse.success) {
          throw new Error(courseResponse.error || 'Failed to load course content');
        }
        setCourse(courseResponse.data);

        if (overviewResponse.success) {
          setOverview(overviewResponse.data);
        }
      } catch (err) {
        setError('Unable to load lesson content.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!isRegistered) {
      setShowRegisterModal(true);
      setShowPaymentModal(false);
      return;
    }
    if (!hasAccess) {
      setShowPaymentModal(true);
      setShowRegisterModal(false);
      return;
    }
    setShowPaymentModal(false);
    setShowRegisterModal(false);
  }, [isRegistered, hasAccess]);

  const moduleMeta = getHackerProtocolModule(moduleId);
  const roomMeta = getHackerProtocolRoom(moduleId, roomId);
  const objectivesCount = roomMeta?.bullets?.length || 0;

  const module = course?.modules?.find((m) => m.moduleId === moduleId);
  const room = module?.rooms.find((r) => r.roomId === roomId);

  const handleModuleNav = (targetModule, index) => {
    if (!hasAccess) {
      setStatusMessage('Complete bootcamp payment to access this phase.');
      setShowPaymentModal(true);
      return;
    }

    const previousModule = course?.modules?.[index - 1];
    const previousProgress = previousModule
      ? moduleProgressMap[String(previousModule.moduleId)] || 0
      : 100;

    if (previousModule && previousProgress < 100) {
      setStatusMessage(`Finish ${previousModule.title} before opening this phase.`);
      return;
    }

    const firstRoom = targetModule.rooms?.[0];
    if (!firstRoom) {
      setStatusMessage('This phase is being prepared for your cohort.');
      return;
    }

    setStatusMessage('');
    navigate(`/student-bootcamps/hacker-protocol/module/${targetModule.moduleId}/room/${firstRoom.roomId}`);
  };

  const handleRoomNav = (roomToOpen) => {
    if (!hasAccess) {
      setShowPaymentModal(true);
      return;
    }
    navigate(`/student-bootcamps/hacker-protocol/module/${moduleId}/room/${roomToOpen.roomId}`);
  };

  if (loading) {
    return (
      <div className="student-page lesson-page">
        <header className="student-hero reveal-on-scroll">
          <div>
            <p className="student-kicker">Loading lesson</p>
            <h1>Preparing your workspace...</h1>
          </div>
        </header>
        <section className="lesson-layout">
          <Card padding="large" className="lesson-main-card">
            <Skeleton className="skeleton-line" style={{ width: '50%' }} />
            <Skeleton className="skeleton-line" style={{ width: '80%', marginTop: '0.75rem' }} />
          </Card>
        </section>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="student-page lesson-page">
        <header className="student-hero reveal-on-scroll">
          <div>
            <p className="student-kicker">Learning Path</p>
            <h1>Lesson unavailable.</h1>
            <p>We could not load this lesson. Please try again or go back.</p>
          </div>
          <Button
            variant="primary"
            size="large"
            onClick={() => navigate('/student-bootcamps/hacker-protocol/dashboard')}
          >
            <FiArrowLeft size={18} />
            Back to Dashboard
          </Button>
        </header>
        <section className="lesson-layout">
          <Card padding="large" className="lesson-main-card">
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{error}</p>
          </Card>
        </section>
      </div>
    );
  }

  if (!module || !room || !moduleMeta || !roomMeta) {
    return (
      <div className="student-page lesson-page">
        <header className="student-hero reveal-on-scroll">
          <div>
            <p className="student-kicker">Learning Path</p>
            <h1>Lesson not found.</h1>
            <p>The requested phase or room does not exist.</p>
          </div>
          <Button
            variant="primary"
            size="large"
            onClick={() => navigate('/student-bootcamps/hacker-protocol/dashboard')}
          >
            <FiArrowLeft size={18} />
            Back to Dashboard
          </Button>
        </header>
      </div>
    );
  }

  return (
    <div className="student-page lesson-page">
      <header className="lesson-appbar">
        <div className="lesson-appbar-left">
          <span className="lesson-appbar-chip">{moduleMeta.codename}</span>
          <div>
            <p className="lesson-appbar-kicker">Room {room.roomId}</p>
            <h1>{room.title}</h1>
          </div>
        </div>
        <div className="lesson-appbar-actions">
          <div className="lesson-utility">
            <span className="lesson-utility-chip">
              Progress {moduleProgressMap[String(module.moduleId)] || 0}%
            </span>
            <span className="lesson-utility-chip">
              Room {room.roomId} of {module.rooms.length}
            </span>
            <span className="lesson-utility-chip">
              {objectivesCount} objectives
            </span>
          </div>
          <Button
            variant="ghost"
            size="small"
            onClick={() => navigate(`/student-bootcamps/hacker-protocol/modules/${module.moduleId}`)}
          >
            <FiArrowLeft size={16} />
            Phase Overview
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={() => setShowNotes((prev) => !prev)}
          >
            {showNotes ? 'Hide Notes' : 'Open Notes'}
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() => navigate('/student-bootcamps/hacker-protocol/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </header>

      <section className="lesson-shell">
        <aside className="lesson-rail">
          <div className="lesson-profile-card">
            <p>Signed in as</p>
            <strong>{user?.name || user?.email}</strong>
            <span className="lesson-role-pill">{user?.role}</span>
          </div>

          <div className="lesson-rail-block">
            <p className="lesson-rail-label">Phase {module.moduleId}</p>
            <h3>{moduleMeta.title}</h3>
            <p>{moduleMeta.roleTitle}</p>
            <div className="lesson-module-progress">
              <div style={{ width: `${moduleProgressMap[String(module.moduleId)] || 0}%` }} />
            </div>
            <span className="module-module-progress-label">
              {moduleProgressMap[String(module.moduleId)] || 0}% complete
            </span>
          </div>

          <nav className="lesson-module-nav">
            <h4>Phases</h4>
            {course.modules.map((mod, index) => {
              const isActive = mod.moduleId === module.moduleId;
              return (
                <button
                  key={mod.moduleId}
                  type="button"
                  className={`lesson-module-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleModuleNav(mod, index)}
                >
                  {mod.title}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="lesson-center">
          <div className="lesson-content-header">
            <div>
              <p className="lesson-kicker">
                Phase {module.moduleId}: <strong>{moduleMeta.title}</strong>
              </p>
              <p className="lesson-subtitle">
                Role: <strong>{moduleMeta.roleTitle}</strong>
              </p>
            </div>
            <div className="lesson-meta">
              <span className="lesson-meta-chip">
                <FiBookOpen size={14} />
                Theory Module
              </span>
              <span className="lesson-meta-chip subtle">
                <FiClock size={14} />
                Validated progression
              </span>
            </div>
          </div>

          <div className="lesson-workspace">
            <Card padding="large" className="lesson-main-card reveal-on-scroll">
              <div className="lesson-content">
                <h2>What you will cover</h2>
                <p>{roomMeta.overview}</p>

                <h3>Key objectives</h3>
                <ul>
                  {(roomMeta.bullets || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <h3>Room nav</h3>
                <div className="lesson-room-nav">
                  {module.rooms.map((roomCandidate) => (
                    <button
                      key={roomCandidate.roomId}
                      type="button"
                      className={`lesson-room-nav-item ${
                        roomCandidate.roomId === room.roomId ? 'active' : ''
                      }`}
                      onClick={() => handleRoomNav(roomCandidate)}
                    >
                      Room {roomCandidate.roomId}: {roomCandidate.title}
                    </button>
                  ))}
                </div>

                <div className="lesson-cta-row">
                  <Button
                    variant="primary"
                    size="large"
                    className="lesson-cta-button"
                    onClick={() => setQuizContext({
                      scope: {
                        type: 'room',
                        id: room.roomId,
                        moduleId: module.moduleId,
                        courseId: course.id,
                      },
                      title: room.title,
                    })}
                  >
                    Take Quiz
                  </Button>
                  <Button
                    variant="ghost"
                    size="large"
                    onClick={() => setStatusMessage('Room completion saved locally for now.')}
                  >
                    Mark Room Completed
                  </Button>
                </div>
              </div>
            </Card>

            {statusMessage && (
              <Card padding="medium" className="lesson-status-card">
                <p>{statusMessage}</p>
              </Card>
            )}
          </div>
        </div>

        <aside className="lesson-rightbar">
          <Card padding="medium" className="lesson-right-card">
            <div className="student-card-header">
              <FiShield size={18} />
              <h3>Phase Identity</h3>
            </div>
            <div className="lesson-phase-identity">
              <img src={moduleMeta.emblem} alt={`${moduleMeta.codename} emblem`} />
              <div>
                <strong>{moduleMeta.codename}</strong>
                <span>{moduleMeta.roleTitle}</span>
              </div>
            </div>
            <p>{moduleMeta.description}</p>
          </Card>

          <Card padding="medium" className="lesson-right-card">
            <h3>Validation Rule</h3>
            <p>
              Progression is gated. Pass quiz + validation interview to unlock the next phase emblem.
            </p>
          </Card>

          {showNotes && (
            <Card padding="medium" className="lesson-right-card lesson-notes-card">
              <h3>Quick Notes</h3>
              <p className="lesson-notes-help">Personal notes are stored locally in this session.</p>
              <textarea
                className="lesson-notes-input"
                placeholder="Capture key takeaways, questions, and next steps..."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={6}
              />
            </Card>
          )}
        </aside>
      </section>

      {showRegisterModal && (
        <StudentAccessModal
          title="Bootcamp registration required"
          description="Register for the bootcamp before you can access course materials."
          primaryLabel="Go to Bootcamps"
          onPrimary={() => {
            setShowRegisterModal(false);
            navigate('/student-bootcamps');
          }}
          onClose={() => setShowRegisterModal(false)}
        />
      )}

      {showPaymentModal && (
        <StudentPaymentModal
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            updateUser({ bootcampPaymentStatus: 'pending', bootcampStatus: 'enrolled' });
            setShowPaymentModal(false);
          }}
        />
      )}

      {quizContext && (
        <QuizPanel
          scope={quizContext.scope}
          title={quizContext.title}
          onClose={() => setQuizContext(null)}
          onComplete={(result) => {
            setStatusMessage(result?.passed ? 'Quiz passed. Validation ready.' : 'Quiz submitted. Review and retry.');
            setQuizContext(null);
          }}
        />
      )}
    </div>
  );
};

export default StudentLesson;
