import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiCode,
  FiCompass,
  FiFlag,
  FiMessageSquare,
  FiShield
} from 'react-icons/fi';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import Skeleton from '../../shared/components/ui/Skeleton';
import { getStudentOverview, registerBootcamp } from './student.service';
import '../../styles/features/student.css';

const StudentDashboard = () => {
  useScrollReveal();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    learningPath: [],
    modules: [],
    snapshot: [],
    bootcampStatus: 'not_enrolled',
    communityStats: { questions: 0, answered: 0, channels: 0 }
  });
  const [error, setError] = useState('');
  const [bootcampSaving, setBootcampSaving] = useState(false);

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
    const response = await registerBootcamp();
    if (response.success) {
      setData((prev) => ({
        ...prev,
        bootcampStatus: response.data?.bootcampStatus || 'enrolled'
      }));
    } else {
      setError(response.error || 'Failed to register for bootcamp.');
    }
    setBootcampSaving(false);
  };

  return (
    <div className="student-page">
        <header className="student-hero reveal-on-scroll">
          <div>
            <p className="student-kicker">Student Dashboard</p>
            <h1>Build skills with real-world practice.</h1>
            <p>Track your learning path, complete course rooms, and level up module by module.</p>
          </div>
          <Button
            variant="primary"
            size="large"
            onClick={() => navigate('/student-learning')}
          >
            <FiCompass size={18} />
            Go to Learning Path
          </Button>
        </header>

        {error && (
          <Card padding="large" className="student-card reveal-on-scroll">
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{error}</p>
          </Card>
        )}

        <>
            {loading ? (
              <div className="student-grid">
                {[1, 2, 3].map((item) => (
                  <Card key={item} padding="large" className="student-card">
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
                <Card padding="large" className="student-card reveal-on-scroll">
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
                      onClick={handleBootcampRegister}
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

                <Card padding="large" className="student-card reveal-on-scroll">
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

                <Card padding="large" className="student-card reveal-on-scroll">
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

                <Card padding="large" className="student-card reveal-on-scroll">
                  <div className="student-card-header">
                    <FiMessageSquare size={20} />
                    <h3>Community Pulse</h3>
                  </div>
                  <div className="community-stats">
                    <div className="community-stat">
                      <span className="label">Questions</span>
                      <strong>{data.communityStats.questions}</strong>
                    </div>
                    <div className="community-stat">
                      <span className="label">Answered</span>
                      <strong>{data.communityStats.answered}</strong>
                    </div>
                    <div className="community-stat">
                      <span className="label">Channels</span>
                      <strong>{data.communityStats.channels}</strong>
                    </div>
                  </div>
                  <Button variant="secondary" size="small" onClick={() => navigate('/community')}>
                    Open Community
                  </Button>
                </Card>
              </div>
            )}

            <section className="student-bottom reveal-on-scroll">
              <Card padding="large" className="student-card">
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
    </div>
  );
};

export default StudentDashboard;
