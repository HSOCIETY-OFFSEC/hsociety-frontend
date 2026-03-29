import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Skeleton from '../../../shared/components/ui/Skeleton';
import { getStudentCourse } from '../services/course.service';
import { getStudentOverview } from '../../dashboards/student/services/student.service';
import { QuizPanel } from '../components/QuizPanel';
import {
  getHackerProtocolModule,
  getHackerProtocolRoom,
} from '../../../data/static/bootcamps/hackerProtocolData';

const StudentLesson = () => {
  const navigate = useNavigate();
  const { moduleId: moduleIdParam, roomId: roomIdParam } = useParams();

  const moduleId = Number(moduleIdParam);
  const roomId = Number(roomIdParam);

  const [course, setCourse] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
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

  const pageClassName =
    'min-h-[calc(100vh-60px)] w-full px-[clamp(1rem,4vw,2rem)] pb-16 text-text-primary';
  const topbarClassName =
    'mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-5';
  const topbarKickerClassName = 'text-xs font-semibold uppercase tracking-widest text-text-tertiary';
  const topbarMetaClassName = 'flex flex-wrap items-center gap-3 text-sm text-text-secondary';
  const bodyClassName = 'grid gap-4 px-4';
  const layoutClassName = 'mt-4 grid gap-4 px-4';
  const actionRowClassName = 'mt-6 flex flex-wrap gap-3 px-4';
  const actionButtonClassName = 'flex-1 min-w-[180px] justify-center';
  const contentCardClassName = 'rounded-lg shadow-lg';
  const notesCardClassName = 'border-dashed';
  const statusCardClassName = 'bg-bg-secondary';
  const notesInputClassName =
    'mt-3 w-full rounded-md border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-text-primary transition focus:border-brand/40 focus:ring-2 focus:ring-brand/20';

  const pageStyle = {
    background: 'radial-gradient(circle at top left, rgba(var(--brand-rgb), 0.14), transparent 45%),\
      radial-gradient(circle at 20% 80%, rgba(var(--brand-rgb), 0.1), transparent 50%),\
      var(--bg-primary)'
  };

  if (loading) {
    return (
      <div className={pageClassName} style={pageStyle}>
        <header className="reveal-on-scroll rounded-lg border border-border bg-card p-5">
          <div>
            <p className={topbarKickerClassName}>Loading lesson</p>
            <h1 className="text-2xl font-semibold text-text-primary">Preparing your lesson...</h1>
          </div>
        </header>
        <section className={layoutClassName}>
          <Card padding="large" shadow="large" className={contentCardClassName}>
            <Skeleton className="h-3 rounded-full" style={{ width: '50%' }} />
            <Skeleton className="h-3 rounded-full" style={{ width: '80%', marginTop: '0.75rem' }} />
          </Card>
        </section>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className={pageClassName} style={pageStyle}>
        <header className="reveal-on-scroll rounded-lg border border-border bg-card p-5">
          <div>
            <p className={topbarKickerClassName}>Learning Path</p>
            <h1 className="text-2xl font-semibold text-text-primary">Lesson unavailable.</h1>
            <p className="mt-2 text-sm text-text-secondary">We could not load this lesson. Please try again or go back.</p>
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
        <section className={layoutClassName}>
          <Card padding="large" shadow="large" className={contentCardClassName}>
            <p className="text-sm text-text-secondary">{error}</p>
          </Card>
        </section>
      </div>
    );
  }

  if (!module || !room || !moduleMeta || !roomMeta) {
    return (
      <div className={pageClassName} style={pageStyle}>
        <header className="reveal-on-scroll rounded-lg border border-border bg-card p-5">
          <div>
            <p className={topbarKickerClassName}>Learning Path</p>
            <h1 className="text-2xl font-semibold text-text-primary">Lesson not found.</h1>
            <p className="mt-2 text-sm text-text-secondary">The requested phase or room does not exist.</p>
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
    <div className={pageClassName} style={pageStyle}>
      <header className={topbarClassName}>
        <div>
          <p className={topbarKickerClassName}>Phase {module.moduleId} · Room {room.roomId}</p>
          <h1 className="text-2xl font-semibold text-text-primary">{room.title}</h1>
        </div>
        <div className={topbarMetaClassName}>
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

      <section className={bodyClassName}>
        <Card padding="large" shadow="large" className={contentCardClassName}>
          <div className="space-y-4 text-sm text-text-secondary">
            <h2 className="text-base font-semibold text-text-primary">Lesson overview</h2>
            <p>{roomMeta.overview}</p>

            <h3 className="text-sm font-semibold text-text-primary">Objectives</h3>
            <ul className="list-disc space-y-1 pl-5 text-text-secondary">
              {(roomMeta.bullets || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Card>

        {showNotes && (
          <Card padding="medium" shadow="small" className={notesCardClassName}>
            <h3 className="text-sm font-semibold text-text-primary">Quick Notes</h3>
            <p className="text-xs text-text-tertiary">Personal notes are stored locally in this session.</p>
            <textarea
              className={notesInputClassName}
              placeholder="Capture key takeaways, questions, and next steps..."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={6}
            />
          </Card>
        )}

        {statusMessage && (
          <Card padding="medium" shadow="small" className={statusCardClassName}>
            <p className="text-sm text-text-secondary">{statusMessage}</p>
          </Card>
        )}
      </section>

      <div className={actionRowClassName}>
        <Button
          variant="ghost"
          size="large"
          onClick={() => {
            if (!previousRoom) return;
            navigate(`/student-bootcamps/modules/${module.moduleId}/rooms/${previousRoom.roomId}`);
          }}
          disabled={!previousRoom}
          className={actionButtonClassName}
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
          className={actionButtonClassName}
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
          className={actionButtonClassName}
        >
          Mark Completed
        </Button>
      </div>

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
