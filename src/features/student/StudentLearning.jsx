import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import { CourseLearning } from './courses/CourseLearning';
import { getStudentCourse } from './courses/course.service';
import { getStudentOverview } from '../dashboards/student/student.service';
import { useAuth } from '../../core/auth/AuthContext';
import useBootcampAccess from './hooks/useBootcampAccess';
import StudentAccessModal from './components/StudentAccessModal';
import StudentPaymentModal from './components/StudentPaymentModal';
import '../../styles/features/student-learning.css';

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

  useEffect(() => {
    let isMounted = true;
    const loadBootcamp = async () => {
      setLoading(true);
      setError('');
      try {
        const [courseResponse, overviewResponse] = await Promise.all([
          getStudentCourse(),
          getStudentOverview()
        ]);

        if (!isMounted) return;
        if (courseResponse.success) setCourse(courseResponse.data);
        if (overviewResponse.success) setOverview(overviewResponse.data);
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

  const handleModuleClick = (module, index) => {
    if (!isRegistered) {
      setShowRegisterModal(true);
      return;
    }

    if (!hasAccess) {
      setShowPaymentModal(true);
      setStatusMessage('Bootcamp payment unlocks the rooms and guided resources.');
      return;
    }

    const previousModule = course?.modules?.[index - 1];
    const previousProgress = previousModule
      ? moduleProgressMap[Number(previousModule.moduleId)] || 0
      : 100;

    if (previousModule && previousProgress < 100) {
      setStatusMessage(`Complete ${previousModule.title} before jumping to this module.`);
      return;
    }

    const firstRoom = module?.rooms?.[0];
    if (!firstRoom) {
      setStatusMessage('Rooms are being prepared for this module.');
      return;
    }

    setStatusMessage('');
    navigate(`/student-learning/module/${module.moduleId}/room/${firstRoom.roomId}`);
  };

  const moduleCards = useMemo(() => {
    if (!course?.modules) return [];
    return course.modules.map((module, index) => ({
      ...module,
      progress: moduleProgressMap[Number(module.moduleId)] || 0,
      index
    }));
  }, [course, moduleProgressMap]);

  return (
    <div className="student-page bootcamp-page">
      <div className="bootcamp-shell">
        <section className="bootcamp-intro">
          <div>
            <p className="bootcamp-kicker">Bootcamp</p>
            <h1>Bootcamp Modules</h1>
            <p>
              Each module bundles the rooms, labs, and checkpoints you need to complete the HSOCIETY
              learning path.
            </p>
          </div>
          <div className="bootcamp-actions">
            <Button
              variant="secondary"
              size="small"
              onClick={() => navigate('/student-payments')}
            >
              Manage Payment
            </Button>
            <Button variant="ghost" size="small" onClick={() => navigate('/student-bootcamp')}>
              Bootcamp Overview
            </Button>
          </div>
        </section>

        {loading && (
          <Card padding="medium" className="bootcamp-status-card">
            <p>Loading bootcamp modules…</p>
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
              <h3>Registration required</h3>
            </div>
            <p>Register for the bootcamp to unlock the modules and rooms.</p>
            <Button variant="primary" size="small" onClick={() => setShowRegisterModal(true)}>
              Register for Bootcamp
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

            <section className="bootcamp-modules-grid">
              {moduleCards.map((module) => (
                <Card
                  key={module.moduleId}
                  padding="medium"
                  className="bootcamp-module-card"
                  onClick={() => handleModuleClick(module, module.index)}
                >
                  <div className="module-card-image" aria-hidden="true">
                    <span>Module {module.moduleId}</span>
                  </div>
                  <div className="module-card-body">
                    <h3>{module.title}</h3>
                    <p>{module.ctf || 'Skill building module'}</p>
                    <div className="module-card-progress">
                      <div style={{ width: `${module.progress}%` }} />
                    </div>
                    <span className="module-card-footer">{module.progress}% complete</span>
                  </div>
                </Card>
              ))}
            </section>

            {hasAccess ? (
              <CourseLearning />
            ) : (
              <Card padding="medium" className="bootcamp-status-card">
                <h3>Access Denied</h3>
                <p>Complete payment before opening the learning rooms.</p>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => setShowPaymentModal(true)}
                >
                  Pay for Bootcamp
                </Button>
              </Card>
            )}
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
          description="Complete registration before accessing the rooms."
          primaryLabel="Register now"
          onPrimary={() => {
            setShowRegisterModal(false);
            navigate('/student-bootcamp');
          }}
          onClose={() => setShowRegisterModal(false)}
        />
      )}
    </div>
  );
};

export default StudentLearning;
