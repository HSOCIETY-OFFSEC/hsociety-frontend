import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiBookOpen, FiClock, FiPlayCircle } from 'react-icons/fi';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import Skeleton from '../../shared/components/ui/Skeleton';
import { getStudentCourse } from './courses/course.service';
import '../../styles/features/student.css';
import '../../styles/features/student-lesson.css';

/**
 * StudentLesson
 * Route: /student-learning/module/:moduleId/room/:roomId
 *
 * Dedicated content page where students read, watch, and learn
 * for a specific room within a module.
 */

const LESSON_VIDEOS = {
  1: 'https://www.youtube.com/embed/2Tofun0j0d0', // The Hacker Mindset
  2: 'https://www.youtube.com/embed/9s8E0Q5p8vU', // How to Learn Hacking Effectively
  3: 'https://www.youtube.com/embed/qiQR5rTSshw', // Networking Basics
  4: 'https://www.youtube.com/embed/WwyKkFZ2s6M',
  5: 'https://www.youtube.com/embed/3QhU9jd03a0',
  6: 'https://www.youtube.com/embed/IVquJh3DXUA', // Linux Basics
  7: 'https://www.youtube.com/embed/4RPtJ9UyHS0',
  8: 'https://www.youtube.com/embed/6YbBmqUnoQM',
  9: 'https://www.youtube.com/embed/KnQ5Ew9-IhU',
  10: 'https://www.youtube.com/embed/zN8YNNHcaZc',
  11: 'https://www.youtube.com/embed/lncZgZ2tyDU',
  12: 'https://www.youtube.com/embed/ENrzD9HAZK4',
  13: 'https://www.youtube.com/embed/HXV3zeQKqGY',
  14: 'https://www.youtube.com/embed/Pb3opF6lC7E',
  15: 'https://www.youtube.com/embed/gwQgSN8M4Pc',
  16: 'https://www.youtube.com/embed/Pg5j7zGZmRk',
  17: 'https://www.youtube.com/embed/2-btG-1fIrM',
  18: 'https://www.youtube.com/embed/PsUhAh_N4rE'
};

const StudentLesson = () => {
  useScrollReveal();
  const navigate = useNavigate();
  const { moduleId: moduleIdParam, roomId: roomIdParam } = useParams();

  const moduleId = Number(moduleIdParam);
  const roomId = Number(roomIdParam);

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
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
  }, []);

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

  const videoUrl = LESSON_VIDEOS[room.roomId] || LESSON_VIDEOS[module.moduleId] || null;

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
                Theory + Practical Focus
              </span>
              <span className="lesson-meta-chip subtle">
                <FiClock size={14} />
                ~25–40 minutes
              </span>
            </div>

            {videoUrl && (
              <div className="lesson-video-wrapper">
                <div className="lesson-video-aspect">
                  <iframe
                    src={videoUrl}
                    title={room.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            <div className="lesson-content">
              <h2>What you&apos;ll learn</h2>
              <p>
                This lesson is designed to give you a clear, practitioner-level understanding of{' '}
                <strong>{room.title}</strong> within the context of{' '}
                <strong>{module.title}</strong>. You&apos;ll move from high-level concepts to
                concrete attacker and defender workflows, using the same mindset HSOCIETY uses in
                real-world operations.
              </p>

              <h3>Reading track</h3>
              <ul>
                <li>
                  Core concepts and terminology you must know before attempting any labs or CTFs.
                </li>
                <li>
                  Realistic attacker workflows: how an adversary would apply <strong>{room.title}</strong> during a kill-chain.
                </li>
                <li>
                  Defender perspective: signals, logs, and controls that detect or block these techniques.
                </li>
              </ul>

              <h3>Hands-on mental models</h3>
              <p>
                As you read, pause to map every idea to a mental model. Ask yourself:
              </p>
              <ul>
                <li>Where does this live in the OSI model / system stack?</li>
                <li>What assumptions does the target system make that an attacker can break?</li>
                <li>How would I explain this concept to a non-technical teammate?</li>
              </ul>

              <h3>Next steps</h3>
              <p>
                Once you&apos;ve watched the video and worked through the reading, go back to the{' '}
                <strong>Learning Path</strong> and:
              </p>
              <ol>
                <li>Mark this room as completed when you can explain the concepts without notes.</li>
                <li>Attempt the quiz for this room.</li>
                <li>Use the CTF attached to this module to pressure-test your understanding.</li>
              </ol>

              <Button
                variant="primary"
                size="large"
                className="lesson-cta-button"
                onClick={handleBack}
              >
                <FiPlayCircle size={18} />
                Back to modules &amp; quizzes
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default StudentLesson;

