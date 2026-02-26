import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiCode,
  FiCompass,
  FiFlag,
  FiShield
} from 'react-icons/fi';
import useScrollReveal from '../../../shared/hooks/useScrollReveal';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Skeleton from '../../../shared/components/ui/Skeleton';
import { getStudentOverview, registerBootcamp } from './student.service';
import { useAuth } from '../../../core/auth/AuthContext';
import '../../../styles/student/base.css';
import '../../../styles/student/components.css';
import '../../../styles/dashboards/student/student-dashboard.css';

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
          throw new Error(response.error || 'Failed to load student dashboard');
        }
        setData(response.data);
      } catch (err) {
        console.error('Student dashboard error:', err);
        setError('Unable to load student dashboard data.');
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

  const bootcampLabels = {
    not_enrolled: 'Not enrolled',
    enrolled: 'Enrolled',
    completed: 'Completed'
  };

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
      setError(response.error || 'Failed to register for bootcamp.');
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
            <p className="student-kicker dashboard-shell-kicker">Student Dashboard</p>
            <h1 className="dashboard-shell-title">Build skills with real-world practice.</h1>
            <p className="dashboard-shell-subtitle">
              Track your learning path, complete course rooms, and level up module by module.
            </p>
          </div>
          <div className="dashboard-shell-actions">
            <Button
              variant="primary"
              size="large"
              onClick={() => navigate('/student-learning')}
            >
              <FiCompass size={18} />
              Go to Learning Path
            </Button>
          </div>
        </header>

        {error && (
          <Card padding="medium" className="student-card reveal-on-scroll">
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{error}</p>
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
                    <h3>Bootcamp Status</h3>
                  </div>
                  <div className="bootcamp-status">
                    <span className={`bootcamp-pill status-${data.bootcampStatus}`}>
                      {bootcampLabels[data.bootcampStatus] || 'Not enrolled'}
                    </span>
                    <p>
                      Enroll in the Ethical Hacking Bootcamp to access the HSOCIETY learning
                      resources and join cohort sessions.
                    </p>
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => setShowBootcampModal(true)}
                      disabled={bootcampSaving || data.bootcampStatus !== 'not_enrolled'}
                    >
                      {data.bootcampStatus === 'completed'
                        ? 'Bootcamp Completed'
                        : data.bootcampStatus === 'enrolled'
                        ? 'Enrolled'
                        : bootcampSaving
                        ? 'Registering...'
                        : 'Register for Bootcamp'}
                    </Button>
                  </div>
                </Card>

                {hasBootcamp ? (
                  <>
                    <Card padding="medium" className="student-card reveal-on-scroll">
                      <div className="student-card-header">
                        <FiBookOpen size={20} />
                        <h3>Learning Path Overview</h3>
                      </div>
                      <div className="student-path">
                        {data.learningPath.map((item) => (
                          <div key={item.id} className="path-item">
                            <div className="path-info">
                              <span>{item.title}</span>
                              <span className={`path-status ${item.status}`}>
                                {item.status === 'done'
                                  ? 'Completed'
                                  : item.status === 'in-progress'
                                  ? 'In Progress'
                                  : 'Next Up'}
                              </span>
                            </div>
                            <div className="path-bar">
                              <div style={{ width: `${item.progress}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card padding="medium" className="student-card reveal-on-scroll">
                      <div className="student-card-header">
                        <FiShield size={20} />
                        <h3>Modules & Rooms</h3>
                      </div>
                      <div className="student-modules">
                        {data.modules.map((module) => (
                          <div key={module.id} className="module-item">
                            <div className="module-info">
                              <h4>{module.title}</h4>
                              <span>
                                {module.roomsCompleted}/{module.roomsTotal} rooms · {module.progress}%
                              </span>
                            </div>
                            <div className="module-progress">
                              <div style={{ width: `${module.progress}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                    {hasBootcamp && !hasPaidAccess && (
                      <Card padding="medium" className="student-card reveal-on-scroll">
                        <div className="student-card-header">
                          <FiShield size={20} />
                          <h3>Access Denied</h3>
                        </div>
                        <p>
                          Bootcamp payment is required before you can read learning materials and
                          resources.
                        </p>
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => navigate('/student-payments')}
                        >
                          Complete Payment
                        </Button>
                      </Card>
                    )}
                  </>
                ) : (
                  <Card padding="medium" className="student-card reveal-on-scroll">
                    <div className="student-card-header">
                      <FiBookOpen size={20} />
                      <h3>Bootcamp Required</h3>
                    </div>
                    <p>
                      Register for the HSOCIETY Bootcamp to unlock the learning path and modules.
                    </p>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => navigate('/student-bootcamp')}
                    >
                      Register for Bootcamp
                    </Button>
                  </Card>
                )}

                <Card padding="medium" className="student-card reveal-on-scroll">
                  <div className="student-card-header">
                    <FiBookOpen size={20} />
                    <h3>Resources Hub</h3>
                  </div>
                  <p>
                    Access curated reading bundles, lab tooling, and the bootcamp resource pack.
                  </p>
                  <Button variant="secondary" size="small" onClick={() => navigate('/student-resources')}>
                    Open Resources
                  </Button>
                </Card>

              </div>
            )}

            <section className="student-bottom reveal-on-scroll">
              <Card padding="medium" className="student-card">
                <div className="student-card-header">
                  <FiShield size={20} />
                  <h3>Progress Snapshot</h3>
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
