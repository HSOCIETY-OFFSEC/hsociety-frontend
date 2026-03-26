import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiActivity,
  FiArrowRight,
  FiBell,
  FiBookOpen,
  FiCheckCircle,
  FiCompass,
  FiLock,
  FiMessageSquare,
  FiShield,
  FiTarget
} from 'react-icons/fi';
import { getStudentOverview } from '../services/student.service';
import { listNotifications } from '../../../student/services/notifications.service';
import useBootcampAccess from '../../../student/hooks/useBootcampAccess';
import StudentXpSummaryCard from '../components/StudentXpSummaryCard';
import StudentRecentNotificationsCard from '../components/StudentRecentNotificationsCard';
import { getPublicErrorMessage } from '../../../../shared/utils/errors/publicError';
import SkillProgressCard from '../components/SkillProgressCard';
import Skeleton from '../../../../shared/components/ui/Skeleton';
import reportRum from '../../../../shared/utils/perf/rum';
import { logger } from '../../../../core/logging/logger';
import { envConfig } from '../../../../config/app/env.config';
import '../styles/student-dashboard.css';

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
  const { isRegistered, isPaid, accessRevoked } = useBootcampAccess();
  const bootcampComingSoon = envConfig.features.bootcampComingSoon;
  const rumSentRef = useRef(false);
  const loadStartRef = useRef(performance.now());
  const loadStudentData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [response, notificationsResponse] = await Promise.all([
        getStudentOverview(),
        listNotifications(),
      ]);
      if (!response.success) {
        throw new Error(getPublicErrorMessage({ action: 'load', response }));
      }
      setData(response.data);
      if (notificationsResponse.success) {
        setNotifications(notificationsResponse.data || []);
      }
    } catch (err) {
      logger.error('Student dashboard error:', err);
      setError('Unable to load student dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudentData();
  }, [loadStudentData]);

  useEffect(() => {
    if (loading || rumSentRef.current) return;
    rumSentRef.current = true;
    const duration = Math.round(performance.now() - loadStartRef.current);
    reportRum({
      metric: 'dashboard_load',
      value: duration,
      tags: { dashboard: 'student', status: error ? 'error' : 'success' }
    });
  }, [loading, error]);

  const continueModule = useMemo(() => {
    if (data.learningPath?.length) {
      return data.learningPath.find((item) => item.status === 'in-progress' || item.status === 'current')
        || data.learningPath.find((item) => item.status === 'next')
        || data.learningPath[0];
    }
    if (data.modules?.length) {
      return data.modules.find((item) => (Number(item.progress) || 0) < 100) || data.modules[0];
    }
    return null;
  }, [data.learningPath, data.modules]);

  const primaryAction = useMemo(
    () => ({ label: 'Explore Free Resources', onClick: () => navigate('/student-resources') }),
    [navigate]
  );

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

  const bootcampProgressItems = useMemo(() => {
    const source = (data.learningPath && data.learningPath.length)
      ? data.learningPath
      : (data.modules || []);

    return (source || []).map((item, index) => ({
      ...item,
      phaseNumber: Number(item.id) || index + 1,
      status: item.status || (Number(item.progress) >= 100 ? 'done' : index === 0 ? 'in-progress' : 'next')
    }));
  }, [data.learningPath, data.modules]);

  const xpTotal = Number(data.xpSummary?.totalXp || 0);
  const moduleCount = data.learningPath?.length || data.modules?.length || 0;
  const showData = !loading && !error;
  const onboardingComplete = Boolean(data.onboarding?.completed);

  const renderMetaValue = (value, width = 36) => {
    if (loading) {
      return <Skeleton className="sd-meta-skeleton" style={{ width }} />;
    }
    if (error) return '—';
    return value;
  };

  const statusMeta = useMemo(() => {
    if (bootcampComingSoon) {
      return {
        label: 'BOOTCAMP STATUS',
        value: 'COMING SOON',
        note: 'Bootcamp access opens soon. Explore free resources and join the community.',
        fill: 10,
        paused: true
      };
    }
    if (accessRevoked) {
      return {
        label: 'BOOTCAMP STATUS',
        value: 'REVOKED',
        note: 'Access was revoked. Contact support to resolve.',
        fill: 20,
        paused: true
      };
    }
    if (!isRegistered) {
      return {
        label: 'BOOTCAMP STATUS',
        value: 'NOT ENROLLED',
        note: 'Register to unlock bootcamp phases.',
        fill: 20,
        paused: true
      };
    }
    if (!isPaid) {
      return {
        label: 'BOOTCAMP STATUS',
        value: 'PAYMENT DUE',
        note: 'Complete payment to unlock phases.',
        fill: 20,
        paused: true
      };
    }
    const hasActive = bootcampProgressItems.some((item) => {
      const status = String(item.status || '').toLowerCase();
      return status === 'in-progress' || status === 'current';
    });
    const avgProgress = bootcampProgressItems.length
      ? Math.round(bootcampProgressItems.reduce((sum, item) => sum + (Number(item.progress) || 0), 0) / bootcampProgressItems.length)
      : 0;

    if (avgProgress >= 100) {
      return {
        label: 'BOOTCAMP STATUS',
        value: 'COMPLETE',
        note: 'All phases completed. Ready for advanced tracks.',
        fill: 100,
        paused: false
      };
    }

    return {
      label: 'BOOTCAMP STATUS',
      value: hasActive ? 'ACTIVE' : 'OPEN',
      note: hasActive ? 'Current phase in progress.' : 'Choose a phase to begin.',
      fill: hasActive ? 70 : 40,
      paused: false
    };
  }, [accessRevoked, bootcampProgressItems, isPaid, isRegistered]);

  return (
    <div className="sd-page">
      <header className="sd-page-header">
        <div className="sd-page-header-inner">
          <div className="sd-header-left">
            <div className="sd-header-icon-wrap">
              <FiCompass size={20} className="sd-header-icon" />
            </div>
            <div>
              <div className="sd-header-breadcrumb">
                <span className="sd-breadcrumb-org">HSOCIETY</span>
                <span className="sd-breadcrumb-sep">/</span>
                <span className="sd-breadcrumb-page">student-dashboard</span>
                <span className="sd-header-visibility">Private</span>
              </div>
            </div>
          </div>
        <div className="sd-header-actions">
          <button
            type="button"
            className="sd-btn sd-btn-secondary"
            onClick={() => navigate('/student-resources')}
            disabled={loading}
          >
            <FiBookOpen size={16} />
            Free Resources
          </button>
          <button
            type="button"
            className="sd-btn sd-btn-primary"
            onClick={() => navigate('/community')}
            disabled={loading}
          >
            <FiMessageSquare size={16} />
            Join Community
          </button>
        </div>
        </div>
        <div className="sd-header-meta">
          <span className="sd-meta-pill">
            <FiTarget size={13} className="sd-meta-icon" />
            <span className="sd-meta-label">XP</span>
            <strong className="sd-meta-value">{renderMetaValue(xpTotal, 34)}</strong>
          </span>
          <span className="sd-meta-pill">
            <FiBookOpen size={13} className="sd-meta-icon" />
            <span className="sd-meta-label">Modules</span>
            <strong className="sd-meta-value">{renderMetaValue(moduleCount, 28)}</strong>
          </span>
          <span className="sd-meta-pill">
            <FiBell size={13} className="sd-meta-icon" />
            <span className="sd-meta-label">Alerts</span>
            <strong className="sd-meta-value">{renderMetaValue(notifications.length, 24)}</strong>
          </span>
          <span className="sd-meta-pill">
            <FiActivity size={13} className="sd-meta-icon" />
            <span className="sd-meta-label">Bootcamp</span>
            <strong className="sd-meta-value">{renderMetaValue(statusMeta.value, 54)}</strong>
          </span>
        </div>
      </header>

      <div className="sd-layout">
        <main className="sd-main">
          {!onboardingComplete && (
            <div className="sd-panel sd-alert">
              <p>Complete onboarding to unlock your full HSOCIETY experience.</p>
              <button
                type="button"
                className="sd-btn sd-btn-secondary"
                onClick={() => navigate('/student-onboarding')}
              >
                Go to Onboarding <FiArrowRight size={14} />
              </button>
            </div>
          )}
          {loading && (
            <div className="sd-loading">
              <p>Loading your training data...</p>
              <div className="sd-loading-list">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={`sd-load-${index}`} className="sd-loading-item" />
                ))}
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="sd-panel sd-error">
              <div className="sd-panel-header">
                <FiShield size={18} />
                <h3>Something went wrong</h3>
              </div>
              <p>We couldn&apos;t load your training dashboard.</p>
              <button
                type="button"
                className="sd-btn sd-btn-secondary"
                onClick={loadStudentData}
              >
                Reload Dashboard
              </button>
            </div>
          )}

          {!error && !loading && (
            <>
              <div className="sd-panel sd-alert">
                <div className="sd-panel-header">
                  <FiBookOpen size={18} />
                  <h3>Start With Free Resources</h3>
                </div>
                <p>Bootcamp modules are opening soon. In the meantime, dive into curated free learning and connect with the community.</p>
                <div className="sd-panel-actions">
                  <button
                    type="button"
                    className="sd-btn sd-btn-secondary"
                    onClick={() => navigate('/student-resources')}
                  >
                    Browse Free Resources <FiArrowRight size={14} />
                  </button>
                  <button
                    type="button"
                    className="sd-btn sd-btn-primary"
                    onClick={() => navigate('/community')}
                  >
                    Open Community <FiArrowRight size={14} />
                  </button>
                </div>
              </div>
              <section className="sd-section">
                <h2 className="sd-section-title">
                  <FiCompass size={15} className="sd-section-icon" />
                  Continue Learning
                </h2>
                <div className="sd-panel sd-continue-panel">
                  <div className="sd-continue-main">
                    <h3 className="sd-continue-title">{continueModule?.title || 'Start your bootcamp'}</h3>
                    <p className="sd-continue-meta">
                      Phase {continueModule?.id || '1'}
                      {continueModule?.roomsTotal
                        ? ` · Rooms ${continueModule?.roomsCompleted || 0}/${continueModule?.roomsTotal}`
                        : ''}
                    </p>
                    <div className="sd-progress-bar" role="presentation">
                      <span
                        className="sd-progress-fill"
                        style={{ width: `${Math.round(continueModule?.progress || 0)}%` }}
                      />
                    </div>
                    <span className="sd-progress-note">
                      Progress {Math.round(continueModule?.progress || 0)}%
                    </span>
                  </div>
                  <button
                    type="button"
                    className="sd-btn sd-btn-primary"
                    onClick={primaryAction.onClick}
                  >
                    {primaryAction.label} <FiArrowRight size={14} />
                  </button>
                </div>
              </section>
              <section className="sd-section">
                <h2 className="sd-section-title">
                  <FiTarget size={15} className="sd-section-icon" />
                  Current Phase & Role
                </h2>
                <div className="sd-panel sd-continue-panel">
                  <div className="sd-continue-main">
                    <h3 className="sd-continue-title">
                      {data.progressMeta?.currentPhase?.title || 'Phase 1'}
                    </h3>
                    <p className="sd-continue-meta">
                      Role: {data.progressMeta?.earned?.roleTitle || 'Candidate'}
                    </p>
                    <span className="sd-progress-note">
                      Badge: {data.progressMeta?.earned?.badge || 'Complete phases to unlock badges.'}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="sd-btn sd-btn-secondary"
                    onClick={() => navigate('/student-bootcamps/overview')}
                  >
                    View Bootcamp <FiArrowRight size={14} />
                  </button>
                </div>
              </section>
              <div className="sd-divider" />

              <section className="sd-section">
                <h2 className="sd-section-title">
                  <FiBookOpen size={15} className="sd-section-icon" />
                  Bootcamp Progress
                </h2>
                <div className="sd-item-list">
                  {bootcampProgressItems.length === 0 ? (
                    <div className="sd-empty">No bootcamp phases yet.</div>
                  ) : (
                    bootcampProgressItems.map((phase) => {
                      const progress = Number(phase.progress) || 0;
                      const status = String(phase.status || '').toLowerCase();
                      const isCompleted = status === 'done' || progress >= 100;
                      const isCurrent = status === 'in-progress' || status === 'current';
                      const labelClass = isCompleted
                        ? 'sd-label-beta'
                        : isCurrent
                          ? 'sd-label-alpha'
                          : 'sd-label-gamma';

                      return (
                        <article key={phase.id} className="sd-item-row">
                          <div className="sd-item-main">
                            <span className="sd-item-title">Phase {phase.phaseNumber}</span>
                            <span className="sd-item-subtitle">{phase.title}</span>
                          </div>
                          <div className="sd-item-meta">
                            <span className={`sd-label ${labelClass}`}>
                              {isCompleted ? (
                                <>
                                  <FiCheckCircle size={12} />
                                  Completed
                                </>
                              ) : isCurrent ? (
                                <>
                                  <FiArrowRight size={12} />
                                  Current
                                </>
                              ) : (
                                <>
                                  <FiLock size={12} />
                                  Locked
                                </>
                              )}
                            </span>
                            <span className="sd-item-progress">{progress}%</span>
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
              </section>
              <div className="sd-divider" />

              <section className="sd-section">
                <h2 className="sd-section-title">
                  <FiActivity size={15} className="sd-section-icon" />
                  Progress Overview
                </h2>
                <div className="sd-section-grid">
                  <StudentXpSummaryCard xpSummary={data.xpSummary} />
                  <SkillProgressCard pillars={skillPillars} />
                </div>
              </section>
              <div className="sd-divider" />

              <section className="sd-section">
                <h2 className="sd-section-title">
                  <FiMessageSquare size={15} className="sd-section-icon" />
                  Community & Updates
                </h2>
                <div className="sd-section-grid">
                  <StudentRecentNotificationsCard notifications={notifications} />
                  <div className="sd-panel sd-community-panel">
                    <div className="sd-panel-header">
                      <FiMessageSquare size={18} />
                      <h3>Community</h3>
                    </div>
                    <button
                      type="button"
                      className="sd-btn sd-btn-secondary"
                      onClick={() => navigate('/community')}
                    >
                      Open Community
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
