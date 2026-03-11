import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiCompass, FiLock, FiMessageSquare } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Skeleton from '../../../shared/components/ui/Skeleton';
import { getStudentOverview } from './student.service';
import { listNotifications } from '../../student/services/notifications.service';
import StudentXpSummaryCard from './components/StudentXpSummaryCard';
import StudentRecentNotificationsCard from './components/StudentRecentNotificationsCard';
import { getPublicErrorMessage } from '../../../shared/utils/publicError';
import SkillProgressCard from './components/SkillProgressCard';
import { getHackerProtocolModule, HACKER_PROTOCOL_PHASES } from '../../../data/bootcamps/hackerProtocolData';
import '../../../styles/student/components.css';
import '../../../styles/dashboards/student/index.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    learningPath: [],
    modules: [],
    snapshot: [],
    bootcampStatus: 'not_enrolled',
    bootcampPaymentStatus: 'unpaid'
  });
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState([]);
  const loadStudentData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getStudentOverview();
      if (!response.success) {
        throw new Error(getPublicErrorMessage({ action: 'load', response }));
      }
      setData(response.data);
      const notificationsResponse = await listNotifications();
      if (notificationsResponse.success) {
        setNotifications(notificationsResponse.data || []);
      }
    } catch (err) {
      console.error('Student dashboard error:', err);
      setError('Unable to load student dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudentData();
  }, [loadStudentData]);

  // Backend registration remains handled in the bootcamp flow.

  const continueModule = useMemo(() => {
    if (data.learningPath?.length) {
      return data.learningPath.find((item) => item.status === 'current')
        || data.learningPath.find((item) => item.status === 'next')
        || data.learningPath[0];
    }
    if (data.modules?.length) {
      return data.modules.find((item) => (Number(item.progress) || 0) < 100) || data.modules[0];
    }
    return null;
  }, [data.learningPath, data.modules]);

  const continueModuleMeta = useMemo(() => {
    if (!continueModule?.id) return null;
    return getHackerProtocolModule(Number(continueModule.id));
  }, [continueModule?.id]);

  const continueRoomMeta = useMemo(() => {
    if (!continueModuleMeta) return null;
    const roomsTotal = continueModule?.roomsTotal || continueModuleMeta.rooms.length || 0;
    const roomsCompleted = continueModule?.roomsCompleted || 0;
    const roomIndex = Math.min(Math.max(roomsCompleted, 0), Math.max(roomsTotal - 1, 0));
    return continueModuleMeta.rooms?.[roomIndex] || null;
  }, [continueModule, continueModuleMeta]);

  const handleResumeLesson = () => {
    if (!continueModuleMeta || !continueRoomMeta) {
      navigate('/student-bootcamps/overview');
      return;
    }
    navigate(`/student-bootcamps/modules/${continueModuleMeta.moduleId}/rooms/${continueRoomMeta.roomId}`);
  };

  const skillPillars = useMemo(() => {
    const parsePercent = (value) => {
      const raw = String(value || '').replace(/[^\d.]/g, '');
      return Math.max(0, Math.min(100, Math.round(Number(raw) || 0)));
    };

    const getSnapshotValue = (keyword) => {
      const match = data.snapshot?.find((item) =>
        item.label?.toLowerCase().includes(keyword)
      );
      return match ? parsePercent(match.value) : null;
    };

    const avgModuleProgress = (keywords) => {
      const matches = (data.modules || []).filter((module) =>
        keywords.some((keyword) => module.title?.toLowerCase().includes(keyword))
      );
      if (!matches.length) return null;
      const avg = matches.reduce((sum, item) => sum + (Number(item.progress) || 0), 0) / matches.length;
      return Math.round(avg);
    };

    const fallbackValue = (keywords) =>
      avgModuleProgress(keywords) ?? getSnapshotValue(keywords[0]) ?? 0;

    return [
      { key: 'linux', label: 'Linux', progress: fallbackValue(['linux', 'terminal']) },
      { key: 'networking', label: 'Networking', progress: fallbackValue(['network', 'tcp']) },
      { key: 'web', label: 'Web Hacking', progress: fallbackValue(['web', 'http']) },
      { key: 'priv-esc', label: 'Privilege Escalation', progress: fallbackValue(['privilege', 'escalation', 'privesc']) }
    ];
  }, [data.modules, data.snapshot]);

  const bootcampProgressMap = useMemo(() => {
    return (data.modules || []).reduce((acc, module) => {
      acc[Number(module.id)] = Number(module.progress) || 0;
      return acc;
    }, {});
  }, [data.modules]);

  const currentPhaseId = useMemo(() => {
    const firstIncomplete = HACKER_PROTOCOL_PHASES.find(
      (phase) => (bootcampProgressMap[Number(phase.moduleId)] || 0) < 100
    );
    return firstIncomplete?.moduleId || HACKER_PROTOCOL_PHASES[HACKER_PROTOCOL_PHASES.length - 1]?.moduleId;
  }, [bootcampProgressMap]);

  return (
    <div className="student-page">
      <div className="dashboard-shell">
        <header className="student-hero dashboard-shell-header reveal-on-scroll">
          <div>
            <p className="student-kicker dashboard-shell-kicker">Student Dashboard</p>
            <h1 className="dashboard-shell-title">Your training command center</h1>
            <p className="dashboard-shell-subtitle">Action first. Progress always visible.</p>
          </div>
          <div className="dashboard-shell-actions">
            <Button
              variant="primary"
              size="large"
              onClick={handleResumeLesson}
            >
              <FiCompass size={18} />
              Resume Lesson
            </Button>
          </div>
        </header>

        {loading && (
          <div className="student-loading-text">Loading your training data...</div>
        )}

        {error && (
          <Card padding="medium" className="student-card student-error-card">
            <h3>Something went wrong</h3>
            <p>We couldn't load your training dashboard.</p>
            <Button
              variant="secondary"
              size="small"
              onClick={loadStudentData}
            >
              Reload Dashboard
            </Button>
          </Card>
        )}

        {!error && (
          <>
            {loading ? (
              <div className="student-dashboard-grid">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Card key={`sk-${index}`} padding="medium" className="student-card">
                    <Skeleton className="skeleton-line" style={{ width: '45%' }} />
                    <Skeleton className="skeleton-line" style={{ width: '80%', marginTop: '0.75rem' }} />
                    <Skeleton className="skeleton-line" style={{ width: '60%', marginTop: '0.75rem' }} />
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {/* 1. Continue Learning */}
                <section className="student-section">
                  <Card padding="large" className="student-card continue-learning-card">
                    <div className="continue-learning-header">
                      <p className="continue-learning-kicker">Continue Learning</p>
                      <h2>{continueModuleMeta?.title || continueModule?.title || 'Start your bootcamp'}</h2>
                      <p className="continue-learning-module">
                        Phase: {continueModuleMeta?.codename || 'Hacker Protocol'}
                        {continueRoomMeta ? ` · Room ${continueRoomMeta.roomId}: ${continueRoomMeta.title}` : ''}
                      </p>
                      <span className="continue-learning-progress-pill">
                        Progress {Math.round(continueModule?.progress || 0)}%
                      </span>
                    </div>
                    <Button
                      variant="primary"
                      size="large"
                      className="continue-learning-button"
                      onClick={handleResumeLesson}
                    >
                      Resume Lesson <FiArrowRight size={16} />
                    </Button>
                  </Card>
                </section>

                {/* 2. Bootcamp Progress */}
                <section className="student-section">
                  <Card padding="large" className="student-card bootcamp-progress-card">
                    <div className="bootcamp-progress-header">
                      <h3>Bootcamp Progress</h3>
                      <span className="bootcamp-progress-subtitle">Phase-by-phase completion</span>
                    </div>
                    <div className="bootcamp-progress-list">
                      {HACKER_PROTOCOL_PHASES.map((phase) => {
                        const progress = bootcampProgressMap[Number(phase.moduleId)] || 0;
                        const isCompleted = progress >= 100;
                        const isCurrent = !isCompleted && phase.moduleId === currentPhaseId;
                        return (
                          <div key={phase.moduleId} className={`bootcamp-progress-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                            <span className="bootcamp-progress-phase">Phase {phase.moduleId}</span>
                            <span className="bootcamp-progress-title">{phase.codename}</span>
                            <span className="bootcamp-progress-status">
                              {isCompleted ? (
                                <>
                                  <FiCheckCircle size={14} />
                                  Completed
                                </>
                              ) : isCurrent ? (
                                <>
                                  <FiArrowRight size={14} />
                                  Current
                                </>
                              ) : (
                                <>
                                  <FiLock size={14} />
                                  Locked
                                </>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </section>

                {/* 3. Progress */}
                <section className="student-section student-section-grid">
                  <StudentXpSummaryCard xpSummary={data.xpSummary} />
                  <SkillProgressCard pillars={skillPillars} />
                </section>

                {/* 4. Notifications */}
                <section className="student-section student-section-grid">
                  <StudentRecentNotificationsCard notifications={notifications} />
                  <Card padding="medium" className="student-card">
                    <div className="student-card-header">
                      <FiMessageSquare size={20} />
                      <h3>Community</h3>
                    </div>
                    <p>Join the HSOCIETY community to share wins, get feedback, and learn together.</p>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => navigate('/community')}
                    >
                      Open Community
                    </Button>
                  </Card>
                </section>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
