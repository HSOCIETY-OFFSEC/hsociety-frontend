import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiBookOpen, FiClock } from 'react-icons/fi';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import Skeleton from '../../shared/components/ui/Skeleton';
import { getStudentCourse } from './courses/course.service';
import { getStudentOverview } from '../dashboards/student/student.service';
import useBootcampAccess from './hooks/useBootcampAccess';
import StudentAccessModal from './components/StudentAccessModal';
import StudentPaymentModal from './components/StudentPaymentModal';
import { useAuth } from '../../core/auth/AuthContext';
import '../../styles/student/base.css';
import '../../styles/student/components.css';
import '../../styles/student/pages/lesson.css';

const StudentLesson = () => {
  useScrollReveal();
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

  const moduleProgressMap = useMemo(() => {
    if (!overview?.modules) return {};
    return overview.modules.reduce((acc, module) => {
      acc[String(module.id)] = module.progress || 0;
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
          getStudentOverview()
        ]);

        if (!courseResponse.success) {
          throw new Error(courseResponse.error || 'Failed to load course content');
        }
        setCourse(courseResponse.data);

        if (overviewResponse.success) {
          setOverview(overviewResponse.data);
        }
      } catch (err) {
        console.error('StudentLesson error:', err);
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

  const module = course?.modules?.find((m) => m.moduleId === moduleId);
  const room = module?.rooms.find((r) => r.roomId === roomId);

  const handleModuleNav = (targetModule, index) => {
    if (!hasAccess) {
      setStatusMessage('Complete bootcamp payment to access this module.');
      setShowPaymentModal(true);
      return;
    }
    const previousModule = course?.modules?.[index - 1];
    const previousProgress = previousModule
      ? moduleProgressMap[String(previousModule.moduleId)] || 0
      : 100;

    if (previousModule && previousProgress < 100) {
      setStatusMessage(`Finish ${previousModule.title} before opening this module.`);
      return;
    }

    const firstRoom = targetModule.rooms?.[0];
    if (!firstRoom) {
      setStatusMessage('This module is being prepared for your cohort.');
      return;
    }

    setStatusMessage('');
    navigate(`/student-learning/module/${targetModule.moduleId}/room/${firstRoom.roomId}`);
  };

  const handleRoomNav = (roomToOpen) => {
    if (!hasAccess) {
      setShowPaymentModal(true);
      return;
    }
    navigate(`/student-learning/module/${moduleId}/room/${roomToOpen.roomId}`);
  };

  if (loading) {
    return (
      <div className="student-page lesson-page">
        <header className="student-hero reveal-on-scroll">
          <div>
            <p className="student-kicker">Loading lesson</p>
            <h1>Preparing your workspace…</h1>
            <p>Fetching the content and video for this room.</p>
          </div>
        </header>
        <section className="lesson-layout">
          <Card padding="large" className="lesson-main-card">
            <Skeleton className="skeleton-line" style={{ width: '50%' }} />
            <Skeleton className="skeleton-line" style={{ width: '80%', marginTop: '0.75rem' }} />
            <Skeleton
              className="skeleton-line"
              style={{ width: '100%', height: '220px', marginTop: '1.5rem' }}
            />
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
            <p>We couldn't load this lesson. Please try again or go back.</p>
          </div>
          <Button variant="primary" size="large" onClick={() => navigate('/student-learning')}>
            <FiArrowLeft size={18} />
            Back to Learning Path
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

  if (!module || !room) {
    return (
      <div className="student-page lesson-page">
        <header className="student-hero reveal-on-scroll">
          <div>
            <p className="student-kicker">Learning Path</p>
            <h1>Lesson not found.</h1>
            <p>The requested module or room doesn't exist in this course.</p>
          </div>
          <Button variant="primary" size="large" onClick={() => navigate('/student-learning')}>
            <FiArrowLeft size={18} />
            Back to Learning Path
          </Button>
        </header>
      </div>
    );
  }

  return (
    <div className="student-page lesson-page">
      <header className="student-hero reveal-on-scroll">
        <div>
          <p className="student-kicker">
            Module {module.moduleId} · Room {room.roomId}
          </p>
          <h1>{room.title}</h1>
          <p>
            From: <strong>{module.title}</strong> · Track: <strong>{course.title}</strong>
          </p>
        </div>
        <Button variant="secondary" size="large" onClick={() => navigate('/student-learning')}>
          <FiArrowLeft size={18} />
          Back to Learning Path
        </Button>
      </header>

      <section className="lesson-layout lesson-layout-enhanced">
        <aside className="lesson-sidebar">
          <div className="lesson-profile-card">
            <p>Signed in as</p>
            <strong>{user?.name || user?.email}</strong>
            <span className="lesson-role-pill">{user?.role}</span>
          </div>

          <div className="lesson-module-summary">
            <h3>{module.title}</h3>
            <p>Module {module.moduleId}</p>
            <div className="lesson-module-progress">
              <div style={{ width: `${moduleProgressMap[String(module.moduleId)] || 0}%` }} />
            </div>
            <span className="module-module-progress-label">
              {moduleProgressMap[String(module.moduleId)] || 0}% complete
            </span>
          </div>

          <nav className="lesson-module-nav">
            <h4>Other Modules</h4>
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

        <div className="lesson-main">
          <Card padding="large" className="lesson-main-card reveal-on-scroll">
            <div className="lesson-meta">
              <span className="lesson-meta-chip">
                <FiBookOpen size={14} />
                Resource Pack
              </span>
              <span className="lesson-meta-chip subtle">
                <FiClock size={14} />
                Live session guided
              </span>
            </div>

            <div className="lesson-content">
              <h2>What you'll cover</h2>
              <p>
                This room provides structured resources for <strong>{room.title}</strong> within{' '}
                <strong>{module.title}</strong>. We use these materials during live cohort sessions
                and guided workshops rather than teaching directly on the platform.
              </p>

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

              <h3>Next actions</h3>
              <p>
                Mark this room as complete after your live session or once you finish the provided
                resources.
              </p>

              <Button
                variant="primary"
                size="large"
                className="lesson-cta-button"
                onClick={() => {
                  setStatusMessage('Room marked as complete (local).');
                }}
              >
                I've completed this room
              </Button>
            </div>
          </Card>

          {statusMessage && (
            <Card padding="medium" className="lesson-status-card">
              <p>{statusMessage}</p>
            </Card>
          )}
        </div>
      </section>

      {showRegisterModal && (
        <StudentAccessModal
          title="Bootcamp registration required"
          description="Register for the bootcamp before you can access course materials."
          primaryLabel="Register for Bootcamp"
          onPrimary={() => {
            setShowRegisterModal(false);
            navigate('/student-bootcamp');
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
    </div>
  );
};

export default StudentLesson;
