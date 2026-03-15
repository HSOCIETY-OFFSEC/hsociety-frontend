import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiClipboard, FiTarget } from 'react-icons/fi';
import useBootcampAccess from './hooks/useBootcampAccess';
import StudentAccessModal from './components/StudentAccessModal';
import StudentPaymentModal from './components/StudentPaymentModal';
import { useAuth } from '../../core/auth/AuthContext';
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
    <div className="sq-page">
      <header className="sq-page-header">
        <div className="sq-page-header-inner">
          <div className="sq-header-left">
            <div className="sq-header-icon-wrap">
              <FiClipboard size={20} className="sq-header-icon" />
            </div>
            <div>
              <div className="sq-header-breadcrumb">
                <span className="sq-breadcrumb-org">HSOCIETY</span>
                <span className="sq-breadcrumb-sep">/</span>
                <span className="sq-breadcrumb-page">student-quiz-material</span>
                <span className="sq-header-visibility">Private</span>
              </div>
              <p className="sq-header-desc">
                Short quizzes keep you aligned with each module and highlight topics to review.
              </p>
            </div>
          </div>
          <div className="sq-header-actions">
            <button
              type="button"
              className="sq-btn sq-btn-primary"
              onClick={() => (hasAccess ? navigate('/student-bootcamps/overview') : triggerAccessModal())}
            >
              <FiTarget size={16} />
              {hasAccess ? 'Go to Learning Path' : 'Access Denied'}
            </button>
          </div>
        </div>
        <div className="sq-header-meta">
          <span className="sq-meta-pill">
            <FiTarget size={13} className="sq-meta-icon" />
            <span className="sq-meta-label">Access</span>
            <strong className="sq-meta-value">{hasAccess ? 'OPEN' : 'LOCKED'}</strong>
          </span>
          <span className="sq-meta-pill">
            <FiCheckCircle size={13} className="sq-meta-icon" />
            <span className="sq-meta-label">Checks</span>
            <strong className="sq-meta-value">2</strong>
          </span>
        </div>
      </header>

      <div className="sq-layout">
        <main className="sq-main">
          <section className="sq-section">
            <h2 className="sq-section-title">
              <FiClipboard size={15} className="sq-section-icon" />
              Quiz Checkpoints
            </h2>
            <p className="sq-section-desc">Validate understanding before moving into live sessions.</p>
            <div className="sq-item-list">
              <article className="sq-item-row">
                <div className="sq-item-main">
                  <span className="sq-item-title">Module Check-ins</span>
                  <span className="sq-item-subtitle">Quick quizzes mapped to the bootcamp modules.</span>
                </div>
                <div className="sq-item-meta">
                  <button
                    type="button"
                    className="sq-btn sq-btn-secondary"
                    disabled={!hasAccess}
                    onClick={() => (hasAccess ? navigate('/student-bootcamps/overview') : triggerAccessModal())}
                  >
                    {hasAccess ? 'Start check-in' : 'Access Denied'}
                  </button>
                </div>
              </article>
              <article className="sq-item-row">
                <div className="sq-item-main">
                  <span className="sq-item-title">Skill Validation</span>
                  <span className="sq-item-subtitle">Confidence checks after each workshop.</span>
                </div>
                <div className="sq-item-meta">
                  <button
                    type="button"
                    className="sq-btn sq-btn-secondary"
                    disabled={!hasAccess}
                    onClick={() => (hasAccess ? navigate('/student-bootcamps/overview') : triggerAccessModal())}
                  >
                    {hasAccess ? 'Open validation' : 'Access Denied'}
                  </button>
                </div>
              </article>
            </div>
          </section>
        </main>

        <aside className="sq-sidebar">
          <div className="sq-sidebar-box">
            <h3 className="sq-sidebar-heading">About</h3>
            <p className="sq-sidebar-about">
              Quizzes keep you on pace and highlight concepts to revisit before live sessions.
            </p>
            <div className="sq-sidebar-divider" />
            <ul className="sq-sidebar-list">
              <li>Module alignment</li>
              <li>Skill checkpoints</li>
              <li>Progress validation</li>
            </ul>
          </div>

          <div className="sq-sidebar-box sq-status-box">
            <div className="sq-status-row">
              <span className="sq-status-dot" />
              <span className="sq-status-label">QUIZ ACCESS</span>
            </div>
            <strong className="sq-status-value">{hasAccess ? 'ACTIVE' : 'LOCKED'}</strong>
            <div className="sq-status-track"><div className="sq-status-fill" /></div>
            <p className="sq-status-note">{hasAccess ? 'Ready for quizzes.' : 'Complete payment to unlock.'}</p>
          </div>

          <div className="sq-sidebar-box">
            <h3 className="sq-sidebar-heading">Topics</h3>
            <div className="sq-topics">
              <span className="sq-topic">quizzes</span>
              <span className="sq-topic">checkpoints</span>
              <span className="sq-topic">validation</span>
              <span className="sq-topic">bootcamp</span>
            </div>
          </div>
        </aside>
      </div>

      {showRegisterModal && (
        <StudentAccessModal
          title="Bootcamp registration required"
          description="Register for the bootcamp before you can access quizzes."
          primaryLabel="Go to Bootcamps"
          onPrimary={() => navigate('/student-bootcamps')}
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
