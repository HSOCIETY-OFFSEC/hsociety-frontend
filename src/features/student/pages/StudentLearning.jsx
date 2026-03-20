import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiExternalLink, FiLock, FiVideo } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import { getStudentCourse } from '../services/course.service';
import { getStudentOverview } from '../../dashboards/student/services/student.service';
import { listNotifications, markNotificationRead } from '../services/notifications.service';
import { useAuth } from '../../../core/auth/AuthContext';
import useBootcampAccess from '../hooks/useBootcampAccess';
import StudentAccessModal from '../components/StudentAccessModal';
import StudentPaymentModal from '../components/StudentPaymentModal';
import '../styles/learning.css';
import {
  HACKER_PROTOCOL_BOOTCAMP,
  HACKER_PROTOCOL_PHASES,
} from '../../../data/static/bootcamps/hackerProtocolData';

const StudentLearning = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const { isRegistered, hasAccess } = useBootcampAccess();
  const [course, setCourse] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [meetingNotification, setMeetingNotification] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadBootcamp = async () => {
      setLoading(true);
      setError('');
      try {
        const requests = [
          getStudentOverview(),
          listNotifications(),
        ];
        if (hasAccess) {
          requests.unshift(getStudentCourse());
        }
        const responses = await Promise.all(requests);
        const [courseResponse, overviewResponse, notificationResponse] = hasAccess
          ? responses
          : [null, responses[0], responses[1]];

        if (!isMounted) return;
        if (courseResponse?.success) setCourse(courseResponse.data);
        if (overviewResponse.success) setOverview(overviewResponse.data);

        if (notificationResponse?.success) {
          const meeting = (notificationResponse.data || []).find(
            (item) => item.type === 'bootcamp_meeting' && item.metadata?.meetUrl
          );
          setMeetingNotification(meeting || null);
        }
      } catch (err) {
        if (!isMounted) return;
        setError('Unable to load bootcamp overview.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBootcamp();
    return () => {
      isMounted = false;
    };
  }, [hasAccess]);

  const moduleProgressMap = useMemo(() => {
    if (!overview?.modules) return {};
    return overview.modules.reduce((acc, module) => {
      acc[Number(module.id)] = module.progress || 0;
      return acc;
    }, {});
  }, [overview]);

  const phaseCards = useMemo(() => {
    const modules = course?.modules || [];
    if (!modules.length) return [];

    return modules.map((module, index) => {
      const phaseMeta = HACKER_PROTOCOL_PHASES.find((phase) => phase.moduleId === module.moduleId);
      return {
        ...module,
        ...phaseMeta,
        progress: moduleProgressMap[Number(module.moduleId)] || 0,
        index,
      };
    });
  }, [course, moduleProgressMap]);

  const handleModuleClick = (module, index) => {
    if (!isRegistered) {
      setShowRegisterModal(true);
      return;
    }

    if (!hasAccess) {
      setShowPaymentModal(true);
      setStatusMessage('Bootcamp payment unlocks the phase rooms and guided resources.');
      return;
    }

    const previousModule = phaseCards[index - 1];
    const previousProgress = previousModule ? previousModule.progress : 100;

    if (previousModule && previousProgress < 100) {
      setStatusMessage(`Complete ${previousModule.title} before unlocking this phase.`);
      return;
    }

    setStatusMessage('');
    navigate(`/student-bootcamps/modules/${module.moduleId}`);
  };

  const currentPhaseId = useMemo(() => {
    const firstIncomplete = phaseCards.find((module) => (module.progress || 0) < 100);
    return firstIncomplete?.moduleId || phaseCards[phaseCards.length - 1]?.moduleId;
  }, [phaseCards]);

  return (
    <div className="student-page bootcamp-page">
      <div className="bootcamp-shell">
        <section className="bootcamp-intro">
          <div>
            <p className="bootcamp-kicker">{HACKER_PROTOCOL_BOOTCAMP.title}</p>
            <h1>Phase Dashboard</h1>
            <p>
              Five gated phases. Each validation unlocks the next phase and activates your emblem.
            </p>
          </div>
          <div className="bootcamp-actions">
            <Button variant="secondary" size="small" onClick={() => navigate('/student-bootcamps')}>
              Bootcamps
            </Button>
            <Button variant="ghost" size="small" onClick={() => navigate('/student-resources')}>
              Free Resources
            </Button>
          </div>
        </section>

        {meetingNotification && (
          <Card padding="medium" className="bootcamp-status-card">
            <div className="bootcamp-status-card-header">
              <FiVideo size={20} />
              <h3>Live Session Alert</h3>
            </div>
            <p style={{ marginTop: 0 }}>{meetingNotification.message}</p>
            <Button
              variant="primary"
              size="small"
              onClick={async () => {
                await markNotificationRead(meetingNotification.id);
                window.open(meetingNotification.metadata.meetUrl, '_blank', 'noopener,noreferrer');
              }}
            >
              <FiExternalLink size={14} />
              Join Google Meet
            </Button>
          </Card>
        )}

        {loading && (
          <Card padding="medium" className="bootcamp-status-card">
            <p>Loading bootcamp phases...</p>
          </Card>
        )}

        {error && (
          <Card padding="medium" className="bootcamp-status-card">
            <p>{error}</p>
          </Card>
        )}

        {!isRegistered && !loading && (
          <Card padding="medium" className="bootcamp-status-card">
            <div className="bootcamp-status-card-header">
              <FiLock size={20} />
              <h3>Enrollment required</h3>
            </div>
            <p>Enroll in Hacker Protocol to unlock the phase dashboard.</p>
            <Button variant="primary" size="small" onClick={() => navigate('/student-bootcamps')}>
              Go to Bootcamps
            </Button>
          </Card>
        )}

        {isRegistered && (
          <>
            {statusMessage && (
              <Card padding="medium" className="bootcamp-status-card">
                <p>{statusMessage}</p>
              </Card>
            )}

            <section className="bootcamp-timeline">
              {phaseCards.map((module, index) => {
                const progress = module.progress || 0;
                const isCompleted = progress >= 100;
                const isCurrent = module.moduleId === currentPhaseId;
                const isLocked = !isCompleted && !isCurrent;
                return (
                  <button
                    key={module.moduleId}
                    type="button"
                    className={`bootcamp-timeline-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}`}
                    onClick={() => {
                      if (isLocked) return;
                      handleModuleClick(module, index);
                    }}
                    disabled={isLocked}
                  >
                    <span className="bootcamp-timeline-phase">Phase {module.moduleId}</span>
                    <div className="bootcamp-timeline-body">
                      <h3>{module.codename || module.title}</h3>
                      <p>{module.roleTitle || module.description || module.ctf || 'Skill building module'}</p>
                    </div>
                    <div className="bootcamp-timeline-status">
                      {isCompleted ? 'Completed' : isCurrent ? 'Current' : 'Locked'}
                      {isLocked && <FiLock size={14} />}
                    </div>
                  </button>
                );
              })}
            </section>
          </>
        )}
      </div>

      {showPaymentModal && (
        <StudentPaymentModal
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            updateUser({ bootcampPaymentStatus: 'pending', bootcampStatus: 'enrolled' });
            setShowPaymentModal(false);
          }}
        />
      )}

      {showRegisterModal && (
        <StudentAccessModal
          title="Bootcamp registration"
          description="Complete registration before accessing the phase rooms."
          primaryLabel="Go to Bootcamps"
          onPrimary={() => {
            setShowRegisterModal(false);
            navigate('/student-bootcamps');
          }}
          onClose={() => setShowRegisterModal(false)}
        />
      )}
    </div>
  );
};

export default StudentLearning;
