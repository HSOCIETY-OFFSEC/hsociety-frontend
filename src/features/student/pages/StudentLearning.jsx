import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiExternalLink, FiLock, FiVideo } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import { getStudentCourse } from '../services/course.service';
import { getStudentOverview } from '../../dashboards/student/services/student.service';
import { listNotifications, markNotificationRead } from '../services/notifications.service';
import {
  HACKER_PROTOCOL_BOOTCAMP,
  HACKER_PROTOCOL_PHASES,
} from '../../../data/static/bootcamps/hackerProtocolData';

const StudentLearning = () => {
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [meetingNotification, setMeetingNotification] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadBootcamp = async () => {
      setLoading(true);
      setError('');
      try {
        const [courseResponse, overviewResponse, notificationResponse] = await Promise.all([
          getStudentCourse(),
          getStudentOverview(),
          listNotifications(),
        ]);
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
  }, []);

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

  const pageClassName =
    'min-h-[calc(100vh-60px)] w-full px-[clamp(1rem,4vw,2rem)] pb-16 text-text-primary';
  const shellClassName = 'flex flex-col gap-5';
  const introClassName =
    'relative flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-lg border border-border bg-card p-5 shadow-sm';
  const introOverlayClassName =
    "absolute inset-0 pointer-events-none after:absolute after:inset-0 after:bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(var(--brand-rgb),0.05)_3px,rgba(var(--brand-rgb),0.05)_4px)] after:content-[''] before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-[linear-gradient(180deg,transparent,rgba(var(--brand-rgb),1)_30%,rgba(var(--brand-rgb),1)_70%,transparent)] before:opacity-70";
  const introContentClassName = 'relative z-10 flex flex-1 flex-col gap-2';
  const introTitleClassName = 'text-2xl font-semibold text-text-primary md:text-3xl';
  const introBodyClassName = 'text-sm text-text-secondary';
  const actionsClassName = 'relative z-10 flex flex-wrap items-center gap-2';
  const statusCardClassName = 'border-border bg-card';
  const statusHeaderClassName = 'flex items-center gap-3 border-b border-border pb-3';
  const statusTitleClassName = 'text-sm font-semibold text-text-primary';
  const timelineClassName = 'grid gap-3';
  const timelineItemBase =
    'grid w-full cursor-pointer grid-cols-1 items-center gap-4 rounded-lg border border-border bg-card p-4 text-left transition md:grid-cols-[120px_1fr_auto]';
  const timelinePhaseClassName = 'text-xs font-semibold uppercase tracking-widest text-text-tertiary';
  const timelineTitleClassName = 'text-base font-semibold text-text-primary';
  const timelineBodyClassName = 'text-sm text-text-secondary';
  const timelineStatusClassName = 'flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-secondary';

  return (
    <div className={pageClassName}>
      <div className={shellClassName}>
        <section className={introClassName}>
          <div className={introOverlayClassName} />
          <div className={introContentClassName}>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">
              {HACKER_PROTOCOL_BOOTCAMP.title}
            </p>
            <h1 className={introTitleClassName}>Phase Dashboard</h1>
            <p className={introBodyClassName}>
              Five gated phases. Each validation unlocks the next phase and activates your emblem.
            </p>
          </div>
          <div className={actionsClassName}>
            <Button variant="secondary" size="small" onClick={() => navigate('/student-bootcamps')}>
              Bootcamps
            </Button>
            <Button variant="ghost" size="small" onClick={() => navigate('/student-resources')}>
              Free Resources
            </Button>
          </div>
        </section>

        {meetingNotification && (
          <Card padding="medium" shadow="small" className={statusCardClassName}>
            <div className={statusHeaderClassName}>
              <FiVideo size={20} className="text-text-tertiary" />
              <h3 className={statusTitleClassName}>Live Session Alert</h3>
            </div>
            <p className="text-sm text-text-secondary">{meetingNotification.message}</p>
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
          <Card padding="medium" shadow="small" className={statusCardClassName}>
            <p className="text-sm text-text-secondary">Loading bootcamp phases...</p>
          </Card>
        )}

        {error && (
          <Card padding="medium" shadow="small" className={statusCardClassName}>
            <p className="text-sm text-text-secondary">{error}</p>
          </Card>
        )}

        {statusMessage && (
          <Card padding="medium" shadow="small" className={statusCardClassName}>
            <p className="text-sm text-text-secondary">{statusMessage}</p>
          </Card>
        )}

        <section className={timelineClassName}>
          {phaseCards.map((module, index) => {
            const progress = module.progress || 0;
            const isCompleted = progress >= 100;
            const isCurrent = module.moduleId === currentPhaseId;
            const isLocked = !isCompleted && !isCurrent;
            const stateClassName = isLocked
              ? 'cursor-not-allowed opacity-70'
              : 'hover:-translate-y-0.5 hover:border-brand/40';
            const progressClassName = isCompleted
              ? 'border-status-success/40'
              : isCurrent
                ? 'border-brand/50 bg-brand/5'
                : '';
            return (
              <button
                key={module.moduleId}
                type="button"
                className={`${timelineItemBase} ${stateClassName} ${progressClassName}`}
                onClick={() => {
                  if (isLocked) return;
                  handleModuleClick(module, index);
                }}
                disabled={isLocked}
              >
                <span className={timelinePhaseClassName}>Phase {module.moduleId}</span>
                <div>
                  <h3 className={timelineTitleClassName}>{module.codename || module.title}</h3>
                  <p className={timelineBodyClassName}>{module.roleTitle || module.description || module.ctf || 'Skill building module'}</p>
                </div>
                <div className={timelineStatusClassName}>
                  {isCompleted ? 'Completed' : isCurrent ? 'Current' : 'Locked'}
                  {isLocked && <FiLock size={14} />}
                </div>
              </button>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default StudentLearning;
