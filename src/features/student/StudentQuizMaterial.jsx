import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiClipboard, FiTarget } from 'react-icons/fi';
import useBootcampAccess from './hooks/useBootcampAccess';
import StudentAccessModal from './components/StudentAccessModal';
import StudentPaymentModal from './components/StudentPaymentModal';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import { useAuth } from '../../core/auth/AuthContext';
import '../../styles/student/base.css';
import '../../styles/student/components.css';
import '../../styles/student/pages/quiz-material.css';

const StudentQuizMaterial = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const { isRegistered, isPaid, hasAccess } = useBootcampAccess();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const triggerAccessModal = () => {
    if (!isRegistered) {
      setShowRegisterModal(true);
      return;
    }
    setShowPaymentModal(true);
  };

  useEffect(() => {
    if (!isRegistered) {
      setShowRegisterModal(true);
      setShowPaymentModal(false);
      return;
    }
    if (!isPaid) {
      setShowPaymentModal(true);
      setShowRegisterModal(false);
      return;
    }
    setShowRegisterModal(false);
    setShowPaymentModal(false);
  }, [isRegistered, isPaid]);

  return (
    <div className="student-page">
      <div className="dashboard-shell">
        <header className="student-hero dashboard-shell-header reveal-on-scroll">
          <div>
            <p className="student-kicker dashboard-shell-kicker">Quiz Material</p>
            <h1 className="dashboard-shell-title">Checkpoints before live sessions.</h1>
            <p className="dashboard-shell-subtitle">
              Short quizzes keep you aligned with each module and highlight topics to review.
            </p>
          </div>
          <div className="dashboard-shell-actions">
            <Button
              variant="primary"
              size="large"
              onClick={() => (hasAccess ? navigate('/student-learning') : triggerAccessModal())}
            >
              <FiTarget size={18} />
              {hasAccess ? 'Go to Learning Path' : 'Access Denied'}
            </Button>
          </div>
        </header>

        <div className="student-grid">
          <Card padding="medium" className="student-card reveal-on-scroll">
            <div className="student-card-header">
              <FiClipboard size={20} />
              <h3>Module Check-ins</h3>
            </div>
            <p>Quick quizzes mapped to the bootcamp modules and live walkthroughs.</p>
            <Button variant="secondary" size="small" disabled={!hasAccess}>
              {hasAccess ? 'Start check-in' : 'Access Denied'}
            </Button>
          </Card>
          <Card padding="medium" className="student-card reveal-on-scroll">
            <div className="student-card-header">
              <FiCheckCircle size={20} />
              <h3>Skill Validation</h3>
            </div>
            <p>Confidence checks after each workshop to confirm the critical steps.</p>
            <Button variant="secondary" size="small" disabled={!hasAccess}>
              {hasAccess ? 'Open validation' : 'Access Denied'}
            </Button>
          </Card>
        </div>
      </div>

      {showRegisterModal && (
        <StudentAccessModal
          title="Bootcamp registration required"
          description="Register for the bootcamp before you can access quizzes."
          primaryLabel="Go to Bootcamp"
          onPrimary={() => navigate('/student-bootcamp')}
          onClose={() => setShowRegisterModal(false)}
        />
      )}

      {showPaymentModal && !showRegisterModal && (
        <StudentPaymentModal
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            updateUser({ bootcampPaymentStatus: 'pending', bootcampStatus: 'enrolled' });
            setShowPaymentModal(false);
          }}
        />
      )}
    </div>
  );
};

export default StudentQuizMaterial;
