import React, { useEffect, useState } from 'react';
import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiCode,
  FiCompass,
  FiFlag,
  FiLock,
  FiMessageSquare,
  FiShield,
  FiTarget
} from 'react-icons/fi';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import Skeleton from '../../shared/components/ui/Skeleton';
import { getStudentOverview } from './student.service';
import { CourseLearning } from './courses/CourseLearning';
import '../../styles/features/student.css';

const StudentDashboard = () => {
  useScrollReveal();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    learningPath: [],
    challenges: [],
    mentors: [],
    snapshot: []
  });
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('learning'); // 'overview' | 'learning'

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
    target: FiTarget,
    shield: FiShield,
    flag: FiFlag,
    check: FiCheckCircle,
    clock: FiClock,
    lock: FiLock,
    code: FiCode
  };

  const mentorAvatars = [
    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  ];

  return (
    <div className="student-page">
        <header className="student-hero reveal-on-scroll">
          <div>
            <p className="student-kicker">Student Dashboard</p>
            <h1>Build skills with real-world practice.</h1>
            <p>Track your learning path, complete labs, and connect with mentors.</p>
          </div>
          <div className="student-hero-actions">
            <div className="student-tabs">
              <button
                type="button"
                className={`student-tab ${activeView === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveView('overview')}
              >
                Overview
              </button>
              <button
                type="button"
                className={`student-tab ${activeView === 'learning' ? 'active' : ''}`}
                onClick={() => setActiveView('learning')}
              >
                Learning Path
              </button>
            </div>
            <Button
              variant="primary"
              size="large"
              onClick={() => setActiveView('learning')}
            >
              <FiCompass size={18} />
              Start Learning
            </Button>
          </div>
        </header>

        {error && (
          <Card padding="large" className="student-card reveal-on-scroll">
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{error}</p>
          </Card>
        )}

        {activeView === 'overview' && (
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
                    <FiTarget size={20} />
                    <h3>Practice Labs</h3>
                  </div>
                  <div className="student-labs">
                    {data.challenges.map((challenge) => {
                      const Icon = iconMap[challenge.icon] || FiTarget;
                      return (
                        <div key={challenge.id} className="lab-item">
                          <div className="lab-icon">
                            <Icon size={20} />
                          </div>
                          <div>
                            <h4>{challenge.title}</h4>
                            <span>
                              {challenge.level} · {challenge.time}
                            </span>
                          </div>
                          <Button variant="ghost" size="small">
                            Launch
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card padding="large" className="student-card reveal-on-scroll">
                  <div className="student-card-header">
                    <FiMessageSquare size={20} />
                    <h3>Mentor Support</h3>
                  </div>
                  <div className="mentor-list">
                    {data.mentors.map((mentor, index) => (
                      <div key={mentor.id} className="mentor-row">
                        <div className="mentor-avatar">
                          <img
                            src={mentorAvatars[index % mentorAvatars.length]}
                            alt={mentor.name}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.opacity = '0';
                            }}
                          />
                          <div className="mentor-fallback" aria-hidden="true"></div>
                        </div>
                        <div>
                          <h4>{mentor.name}</h4>
                          <span>{mentor.focus}</span>
                        </div>
                        <span
                          className={`mentor-status ${
                            mentor.status === 'Available' ? 'online' : 'busy'
                          }`}
                        >
                          {mentor.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button variant="secondary" size="small">
                    Book a Session
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
        )}

        {activeView === 'learning' && <CourseLearning />}
    </div>
  );
};

export default StudentDashboard;
