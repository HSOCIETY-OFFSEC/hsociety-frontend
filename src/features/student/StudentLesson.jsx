import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
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
import './base.css';
import './components.css';
import './lesson.css';
import {
  getHackerProtocolModule,
  getHackerProtocolRoom,
} from '../../data/bootcamps/hackerProtocolData';

const StudentLesson = () => {
  const navigate = useNavigate();
  const { moduleId: moduleIdParam, roomId: roomIdParam } = useParams();
  const { updateUser } = useAuth();
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
  const [canAdvance, setCanAdvance] = useState(false);

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

  useEffect(() => {
    setCanAdvance(false);
  }, [moduleId, roomId]);

  const moduleMeta = getHackerProtocolModule(moduleId);
  const roomMeta = getHackerProtocolRoom(moduleId, roomId);
  const objectivesCount = roomMeta?.bullets?.length || 0;

  const module = course?.modules?.find((m) => m.moduleId === moduleId);
  const room = module?.rooms.find((r) => r.roomId === roomId);

  const currentRoomIndex = module?.rooms?.findIndex((candidate) => candidate.roomId === roomId) ?? -1;
  const previousRoom = currentRoomIndex > 0 ? module?.rooms?.[currentRoomIndex - 1] : null;
  const nextRoom = currentRoomIndex >= 0 ? module?.rooms?.[currentRoomIndex + 1] : null;

  if (loading) {
    return (
      <div className="student-page lesson-page">
        <header className="student-hero reveal-on-scroll">
          <div>
            <p className="student-kicker">Loading lesson</p>
            <h1>Preparing your lesson...</h1>
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
            onClick={() => navigate('/student-bootcamps/overview')}
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
            onClick={() => navigate('/student-bootcamps/overview')}
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
      <header className="lesson-topbar">
        <div>
          <p className="lesson-topbar-kicker">Phase {module.moduleId} · Room {room.roomId}</p>
          <h1>{room.title}</h1>
        </div>
        <div className="lesson-topbar-meta">
          <span>Progress {moduleProgressMap[String(module.moduleId)] || 0}%</span>
          <span>{objectivesCount} objectives</span>
          <Button
            variant="ghost"
            size="small"
            onClick={() => setShowNotes((prev) => !prev)}
          >
            {showNotes ? 'Hide Notes' : 'Open Notes'}
          </Button>
        </div>
      </header>

      <section className="lesson-body">
        <Card padding="large" className="lesson-content-card">
          <div className="lesson-content">
            <h2>Lesson overview</h2>
            <p>{roomMeta.overview}</p>

            <h3>Objectives</h3>
            <ul>
              {(roomMeta.bullets || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Card>

        {showNotes && (
          <Card padding="medium" className="lesson-notes-card">
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

        {statusMessage && (
          <Card padding="medium" className="lesson-status-card">
            <p>{statusMessage}</p>
          </Card>
        )}
      </section>

      <div className="lesson-action-row">
        <Button
          variant="ghost"
          size="large"
          onClick={() => {
            if (!previousRoom) return;
            navigate(`/student-bootcamps/modules/${module.moduleId}/rooms/${previousRoom.roomId}`);
          }}
          disabled={!previousRoom}
        >
          Previous Room
        </Button>
        <Button
          variant="primary"
          size="large"
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
          variant="secondary"
          size="large"
          onClick={() => {
            if (canAdvance && nextRoom) {
              navigate(`/student-bootcamps/modules/${module.moduleId}/rooms/${nextRoom.roomId}`);
              return;
            }
            setStatusMessage('Complete the quiz to unlock the next room.');
          }}
        >
          Mark Completed
        </Button>
      </div>

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
            if (result?.passed) {
              setCanAdvance(true);
              setStatusMessage('Quiz passed. Next room unlocked.');
            } else {
              setStatusMessage('Quiz submitted. Review and retry.');
            }
            setQuizContext(null);
          }}
        />
      )}
    </div>
  );
};

export default StudentLesson;
