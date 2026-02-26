import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiBookOpen, FiClock } from 'react-icons/fi';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import Skeleton from '../../shared/components/ui/Skeleton';
import { getStudentCourse } from './courses/course.service';
import useBootcampAccess from './hooks/useBootcampAccess';
import StudentAccessModal from './components/StudentAccessModal';
import StudentPaymentModal from './components/StudentPaymentModal';
import { useAuth } from '../../core/auth/AuthContext';
import '../../styles/features/student.css';
import '../../styles/features/student-lesson.css';

/**
 * StudentLesson
 * Route: /student-learning/module/:moduleId/room/:roomId
 *
 * Dedicated content page where students read, watch, and learn
 * for a specific room within a module.
 */


const StudentLesson = () => {
  useScrollReveal();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const { isRegistered, isPaid, hasAccess } = useBootcampAccess();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { moduleId: moduleIdParam, roomId: roomIdParam } = useParams();

  const moduleId = Number(moduleIdParam);
  const roomId = Number(roomIdParam);

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isRegistered) {
      setShowRegisterModal(true);
      setShowPaymentModal(false);
      return;
    }
    if (!isPaid) {
      setShowPaymentModal(true);
      setShowRegisterModal(false);
      return;
    }
    setShowRegisterModal(false);
    setShowPaymentModal(false);
  }, [isRegistered, isPaid]);

  useEffect(() => {
    if (!hasAccess) {
      setLoading(false);
      return;
    }
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getStudentCourse();
        if (!response.success) {
          throw new Error(response.error || 'Failed to load course content');
        }
        setCourse(response.data);
      } catch (err) {
        console.error('StudentLesson error:', err);
        setError('Unable to load lesson content.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [hasAccess]);

  const handleBack = () => {
    navigate('/student-learning');
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
            <p>We couldn&apos;t load this lesson. Please try again or go back.</p>
          </div>
          <Button variant="primary" size="large" onClick={handleBack}>
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

  const module = course.modules.find((m) => m.moduleId === moduleId);
  const room = module?.rooms.find((r) => r.roomId === roomId);

  if (!module || !room) {
    return (
      <div className="student-page lesson-page">
        <header className="student-hero reveal-on-scroll">
          <div>
            <p className="student-kicker">Learning Path</p>
            <h1>Lesson not found.</h1>
            <p>The requested module or room doesn&apos;t exist in this course.</p>
          </div>
          <Button variant="primary" size="large" onClick={handleBack}>
            <FiArrowLeft size={18} />
            Back to Learning Path
          </Button>
        </header>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="student-page lesson-page">
        <header className="student-hero reveal-on-scroll">
          <div>
            <p className="student-kicker">Learning Path</p>
            <h1>Access denied.</h1>
            <p>Complete bootcamp registration and payment to unlock this lesson.</p>
          </div>
          <Button variant="primary" size="large" onClick={() => navigate('/student-bootcamp')}>
            Register for Bootcamp
          </Button>
        </header>

        {showRegisterModal && (
          <StudentAccessModal
            title="Bootcamp registration required"
            description="Register for the bootcamp before you can access course materials."
            primaryLabel="Go to Bootcamp"
            onPrimary={() => navigate('/student-bootcamp')}
            onClose={() => setShowRegisterModal(false)}
          />
        )}

        {showPaymentModal && !showRegisterModal && (
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
  }

  return (
    <div className="student-page lesson-page">
      <header className="student-hero reveal-on-scroll">
        <div>
          <p className="student-kicker">Module {module.moduleId} · Room {room.roomId}</p>
          <h1>{room.title}</h1>
          <p>
            From: <strong>{module.title}</strong> · Track: <strong>{course.title}</strong>
          </p>
        </div>
        <Button variant="secondary" size="large" onClick={handleBack}>
          <FiArrowLeft size={18} />
          Back to Learning Path
        </Button>
      </header>

      <section className="lesson-layout">
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
              <h2>What you&apos;ll cover</h2>
              <p>
                This room provides structured resources for <strong>{room.title}</strong> within{' '}
                <strong>{module.title}</strong>. We use these materials during live cohort sessions
                and guided workshops rather than teaching directly on the platform.
              </p>

              <h3>Resource track</h3>
              <ul>
                <li>
                  Core reading list and notes shared by the instructors for this room.
                </li>
                <li>
                  Practical walkthrough outlines used during live cohort calls.
                </li>
                <li>
                  External references, tools, and cheat sheets for self-study.
                </li>
              </ul>

              <h3>Hands-on prep</h3>
              <p>
                Before the live session, review the notes and prepare questions. During the call we
                walk through the applied workflow together.
              </p>
              <ul>
                <li>Identify the tools and environments needed for the workshop.</li>
                <li>What would be the attacker&apos;s first move here?</li>
                <li>What evidence would a defender look for?</li>
              </ul>

              <h3>Next actions</h3>
              <p>
                Mark this room as complete after your live session or once you finish the provided
                resources.
              </p>

              <Button
                variant="primary"
                size="large"
                className="lesson-cta-button"
                onClick={handleBack}
              >
                Back to modules &amp; resources
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {showRegisterModal && (
        <StudentAccessModal
          title="Bootcamp registration required"
          description="Register for the bootcamp before you can access course materials."
          primaryLabel="Go to Bootcamp"
          onPrimary={() => navigate('/student-bootcamp')}
          onClose={() => setShowRegisterModal(false)}
        />
      )}

      {showPaymentModal && !showRegisterModal && (
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
