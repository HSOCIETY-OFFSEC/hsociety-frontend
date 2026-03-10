import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCompass } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Skeleton from '../../../shared/components/ui/Skeleton';
import { getStudentOverview } from './student.service';
import { listNotifications } from '../../student/services/notifications.service';
import StudentXpSummaryCard from './components/StudentXpSummaryCard';
import StudentRecentNotificationsCard from './components/StudentRecentNotificationsCard';
import { getPublicErrorMessage } from '../../../shared/utils/publicError';
import ContinueLearningCard from './components/ContinueLearningCard';
import BootcampStatusCard from './components/BootcampStatusCard';
import SkillProgressCard from './components/SkillProgressCard';
import DailyMissionCard from './components/DailyMissionCard';
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

  const bootcampState = useMemo(() => {
    if (data.bootcampStatus === 'completed') return 'completed';
    if (data.bootcampStatus === 'enrolled' && data.bootcampPaymentStatus !== 'paid') return 'enrolled_but_unpaid';
    if (data.bootcampStatus === 'enrolled') return 'enrolled';
    return 'not_enrolled';
  }, [data.bootcampStatus, data.bootcampPaymentStatus]);

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
              onClick={() => navigate('/student-learning')}
            >
              <FiCompass size={18} />
              Continue Learning
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
                {/* 1. Action section */}
                <section className="student-section">
                  <ContinueLearningCard
                    moduleTitle={continueModule?.title || 'No active module yet'}
                    progress={continueModule?.progress || 0}
                    hasModule={Boolean(continueModule)}
                    onContinue={() => navigate('/student-learning')}
                  />
                </section>

                {/* 2. Bootcamp status + 4. Daily mission */}
                <section className="student-section student-section-grid">
                  <BootcampStatusCard
                    status={bootcampState}
                    onNavigate={(route) => navigate(route)}
                  />
                  <DailyMissionCard onStart={() => navigate('/student-learning')} />
                </section>

                {/* 3. Progress */}
                <section className="student-section student-section-grid">
                  <StudentXpSummaryCard xpSummary={data.xpSummary} />
                  <SkillProgressCard pillars={skillPillars} />
                </section>

                {/* 5. Awareness */}
                <section className="student-section">
                  <StudentRecentNotificationsCard notifications={notifications} />
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
