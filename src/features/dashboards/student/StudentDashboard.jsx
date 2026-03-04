import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiCode,
  FiCompass,
  FiFlag,
  FiShield,
} from 'react-icons/fi';
import useScrollReveal from '../../../shared/hooks/useScrollReveal';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Skeleton from '../../../shared/components/ui/Skeleton';
import { getStudentOverview, registerBootcamp } from './student.service';
import { useAuth } from '../../../core/auth/AuthContext';
import { listNotifications } from '../../student/services/notifications.service';
import { STUDENT_DASHBOARD_UI } from '../../../data/student/studentDashboardUiData';
import StudentXpSummaryCard from './components/StudentXpSummaryCard';
import StudentRecentNotificationsCard from './components/StudentRecentNotificationsCard';
import '../../../styles/student/components.css';
import '../../../styles/dashboards/student/index.css';

const StudentDashboard = () => {
  useScrollReveal();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
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
  const [bootcampSaving, setBootcampSaving] = useState(false);
  const [showBootcampModal, setShowBootcampModal] = useState(false);
  const [bootcampForm, setBootcampForm] = useState({
    experienceLevel: 'beginner',
    goal: '',
    availability: '3-5',
  });

  useEffect(() => {
    const loadStudentData = async () => {
      setLoading(true);
      try {
        const response = await getStudentOverview();
        if (!response.success) {
          throw new Error(response.error || STUDENT_DASHBOARD_UI.page.loadError);
        }
        setData(response.data);
        const notificationsResponse = await listNotifications();
        if (notificationsResponse.success) {
          setNotifications(notificationsResponse.data || []);
        }
      } catch (err) {
        console.error('Student dashboard error:', err);
        setError(STUDENT_DASHBOARD_UI.page.loadError);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, []);

  const iconMap = {
    shield: FiShield,
    flag: FiFlag,
    check: FiCheckCircle,
    clock: FiClock,
    code: FiCode
  };

  const bootcampLabels = STUDENT_DASHBOARD_UI.bootcampStatusLabels;

  const handleBootcampRegister = async () => {
    setBootcampSaving(true);
    const response = await registerBootcamp({
      experienceLevel: bootcampForm.experienceLevel,
      goal: bootcampForm.goal,
      availability: bootcampForm.availability,
    });
    if (response.success) {
      setData((prev) => ({
        ...prev,
        bootcampStatus: response.data?.bootcampStatus || 'enrolled'
      }));
      updateUser({
        bootcampRegistered: true,
        bootcampStatus: response.data?.bootcampStatus || 'enrolled',
        bootcampPaymentStatus: response.data?.bootcampPaymentStatus || 'unpaid'
      });
      setShowBootcampModal(false);
      setBootcampForm((prev) => ({ ...prev, goal: '' }));
    } else {
      setError(response.error || STUDENT_DASHBOARD_UI.page.registerError);
    }
    setBootcampSaving(false);
  };

  const hasBootcamp = data.bootcampStatus !== 'not_enrolled';
  const hasPaidAccess = data.bootcampPaymentStatus === 'paid';

  return (
    <div className="student-page">
      <div className="dashboard-shell">
        <header className="student-hero dashboard-shell-header reveal-on-scroll">
          <div>
            <p className="student-kicker dashboard-shell-kicker">{STUDENT_DASHBOARD_UI.page.kicker}</p>
            <h1 className="dashboard-shell-title">{STUDENT_DASHBOARD_UI.page.title}</h1>
            <p className="dashboard-shell-subtitle">
              {STUDENT_DASHBOARD_UI.page.subtitle}
            </p>
          </div>
          <div className="dashboard-shell-actions">
            <Button
              variant="primary"
              size="large"
              onClick={() => navigate('/student-learning')}
            >
              <FiCompass size={18} />
              {STUDENT_DASHBOARD_UI.actions.learningPath}
            </Button>
          </div>
        </header>

        {error && (
          <Card padding="medium" className="student-card reveal-on-scroll">
            <p className="student-muted-text">{error}</p>
          </Card>
        )}

        <>
            {loading ? (
              <div className="student-grid">
                {[1, 2, 3].map((item) => (
                  <Card key={item} padding="medium" className="student-card">
                    <Skeleton className="skeleton-line" style={{ width: '40%' }} />
                    <Skeleton
                      className="skeleton-line"
                      style={{ width: '80%', marginTop: '0.75rem' }}
                    />
                    <Skeleton
                      className="skeleton-line"
                      style={{ width: '60%', marginTop: '0.75rem' }}
                    />
                  </Card>
                ))}
              </div>
            ) : (
              <div className="student-grid">
                <Card padding="medium" className="student-card reveal-on-scroll">
                  <div className="student-card-header">
                    <FiBookOpen size={20} />
                    <h3>{STUDENT_DASHBOARD_UI.cards.bootcampStatusTitle}</h3>
                  </div>
                  <div className="bootcamp-status">
                    <span className={`bootcamp-pill status-${data.bootcampStatus}`}>
                      {bootcampLabels[data.bootcampStatus] || 'Not enrolled'}
                    </span>
                    <p>
                      {STUDENT_DASHBOARD_UI.body.bootcampInvite}
                    </p>
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => navigate('/student-bootcamps')}
                      disabled={bootcampSaving || data.bootcampStatus !== 'not_enrolled'}
                    >
                      {data.bootcampStatus === 'completed'
                        ? STUDENT_DASHBOARD_UI.buttonStates.completed
                        : data.bootcampStatus === 'enrolled'
                        ? STUDENT_DASHBOARD_UI.buttonStates.enrolled
                        : bootcampSaving
                        ? STUDENT_DASHBOARD_UI.buttonStates.registering
                        : STUDENT_DASHBOARD_UI.buttonStates.defaultRegister}
                    </Button>
                  </div>
                </Card>

                {hasBootcamp ? (
                  <>
                    {hasBootcamp && !hasPaidAccess && (
                      <Card padding="medium" className="student-card reveal-on-scroll">
                        <div className="student-card-header">
                          <FiShield size={20} />
                          <h3>{STUDENT_DASHBOARD_UI.cards.accessDeniedTitle}</h3>
                        </div>
                        <p>{STUDENT_DASHBOARD_UI.body.bootcampPaymentRequired}</p>
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => navigate('/student-payments')}
                        >
                          {STUDENT_DASHBOARD_UI.actions.completePayment}
                        </Button>
                      </Card>
                    )}
                  </>
                ) : (
                  <Card padding="medium" className="student-card reveal-on-scroll">
                    <div className="student-card-header">
                      <FiBookOpen size={20} />
                      <h3>{STUDENT_DASHBOARD_UI.cards.bootcampRequiredTitle}</h3>
                    </div>
                    <p>{STUDENT_DASHBOARD_UI.body.bootcampRequired}</p>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => navigate('/student-bootcamps')}
                    >
                      {STUDENT_DASHBOARD_UI.actions.registerBootcamp}
                    </Button>
                  </Card>
                )}

                <StudentXpSummaryCard xpSummary={data.xpSummary} />

              </div>
            )}

            <section className="student-bottom reveal-on-scroll">
              <Card padding="medium" className="student-card">
                <div className="student-card-header">
                  <FiShield size={20} />
                  <h3>{STUDENT_DASHBOARD_UI.cards.progressSnapshotTitle}</h3>
                </div>
                <div className="snapshot-grid">
                  {loading
                    ? [1, 2, 3, 4].map((item) => (
                        <div key={item} className="snapshot-item">
                          <Skeleton className="skeleton-line" style={{ width: '50%' }} />
                        </div>
                      ))
                    : data.snapshot.map((item) => {
                        const Icon = iconMap[item.icon] || FiCheckCircle;
                        return (
                          <div key={item.id} className="snapshot-item">
                            <Icon size={18} />
                            <div>
                              <h4>{item.value}</h4>
                              <span>{item.label}</span>
                            </div>
                          </div>
                        );
                      })}
                </div>
              </Card>

              <StudentRecentNotificationsCard notifications={notifications} />
            </section>
        </>

        {showBootcampModal && (
          <div className="student-modal-backdrop" role="dialog" aria-modal="true">
            <div className="student-modal-card">
              <div className="student-modal-header">
                <h3>Bootcamp Registration</h3>
                <button
                  type="button"
                  className="student-modal-close"
                  onClick={() => setShowBootcampModal(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <p className="student-modal-subtitle">
                Share a few details so we can place you in the right cohort.
              </p>
              <div className="student-modal-form">
                <label className="student-modal-field">
                  <span>Experience level</span>
                  <select
                    value={bootcampForm.experienceLevel}
                    onChange={(e) =>
                      setBootcampForm((prev) => ({ ...prev, experienceLevel: e.target.value }))
                    }
                  >
                    <option value="beginner">Beginner</option>
                    <option value="some">Some experience</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </label>
                <label className="student-modal-field">
                  <span>Weekly availability</span>
                  <select
                    value={bootcampForm.availability}
                    onChange={(e) =>
                      setBootcampForm((prev) => ({ ...prev, availability: e.target.value }))
                    }
                  >
                    <option value="3-5">3-5 hours</option>
                    <option value="6-10">6-10 hours</option>
                    <option value="10+">10+ hours</option>
                  </select>
                </label>
                <label className="student-modal-field">
                  <span>Primary goal</span>
                  <textarea
                    rows="3"
                    placeholder="What do you want to achieve in this bootcamp?"
                    value={bootcampForm.goal}
                    onChange={(e) =>
                      setBootcampForm((prev) => ({ ...prev, goal: e.target.value }))
                    }
                  />
                </label>
              </div>
              <div className="student-modal-actions">
                <Button variant="ghost" size="small" onClick={() => setShowBootcampModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleBootcampRegister}
                  disabled={bootcampSaving || !bootcampForm.goal.trim()}
                >
                  {bootcampSaving ? 'Registering...' : 'Submit Registration'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
