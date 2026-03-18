import React, { useEffect, useState } from 'react';
import { FiCreditCard, FiShield } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';
import useBootcampAccess from './hooks/useBootcampAccess';
import StudentAccessModal from './components/StudentAccessModal';
import StudentPaymentModal from './components/StudentPaymentModal';
import '../../styles/student/components.css';
import '../../styles/student/pages/payments.css';
import { verifyBootcampPayment } from '../dashboards/student/student.service';
import { getPublicErrorMessage } from '../../shared/utils/errors/publicError';

const StudentPayments = () => {
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isRegistered, isPaid } = useBootcampAccess();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleOpenPayment = () => {
    if (!isRegistered) {
      setShowRegisterModal(true);
      return;
    }
    setShowPaymentModal(true);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reference = params.get('reference');
    const status = params.get('status');
    if (!reference) return;

    const verify = async () => {
      setStatusMessage('Verifying payment...');
      const response = await verifyBootcampPayment(reference);
      if (!response.success) {
        setStatusMessage(getPublicErrorMessage({ action: 'payment', response }));
        return;
      }
      updateUser({
        bootcampPaymentStatus: response.data?.bootcampPaymentStatus || 'paid',
        bootcampStatus: response.data?.bootcampStatus || 'enrolled',
        bootcampPaidAt: response.data?.bootcampPaidAt,
      });
      setStatusMessage(
        status === 'success' ? 'Payment verified. Access unlocked.' : 'Payment verified.'
      );
    };

    verify();
  }, [location.search, updateUser]);

  return (
    <div className="sp-page">
      <header className="sp-page-header">
        <div className="sp-page-header-inner">
          <div className="sp-header-left">
            <div className="sp-header-icon-wrap">
              <FiCreditCard size={20} className="sp-header-icon" />
            </div>
            <div>
              <div className="sp-header-breadcrumb">
                <span className="sp-breadcrumb-org">HSOCIETY</span>
                <span className="sp-breadcrumb-sep">/</span>
                <span className="sp-breadcrumb-page">student-payments</span>
                <span className="sp-header-visibility">Private</span>
              </div>
              <p className="sp-header-desc">Manage your bootcamp payment and unlock full access.</p>
            </div>
          </div>
        </div>
        <div className="sp-header-meta">
          <span className="sp-meta-pill">
            <FiCreditCard size={13} className="sp-meta-icon" />
            <span className="sp-meta-label">Payment</span>
            <strong className="sp-meta-value">{isPaid ? 'PAID' : 'PENDING'}</strong>
          </span>
          <span className="sp-meta-pill">
            <FiShield size={13} className="sp-meta-icon" />
            <span className="sp-meta-label">Registration</span>
            <strong className="sp-meta-value">{isRegistered ? 'ENROLLED' : 'REQUIRED'}</strong>
          </span>
        </div>
      </header>

      <div className="sp-layout">
        <main className="sp-main">
          <section className="sp-section">
            <h2 className="sp-section-title">
              <FiCreditCard size={15} className="sp-section-icon" />
              Bootcamp Access
            </h2>
            <p className="sp-section-desc">Payment unlocks all course modules, quizzes, and resources.</p>

            {statusMessage && (
              <div className="sp-panel sp-alert">
                <p>{statusMessage}</p>
              </div>
            )}

            <div className="sp-item-list">
              <article className="sp-item-row">
                <div className="sp-item-main">
                  <span className="sp-item-title">Bootcamp Access</span>
                  <span className="sp-item-subtitle">
                    {isPaid ? 'Payment complete. Full access unlocked.' : 'Payment required to unlock the bootcamp.'}
                  </span>
                </div>
                <div className="sp-item-meta">
                  <button
                    type="button"
                    className="sp-btn sp-btn-primary"
                    onClick={handleOpenPayment}
                    disabled={isPaid}
                  >
                    {isPaid ? 'Paid' : 'Pay Now'}
                  </button>
                </div>
              </article>
              <article className="sp-item-row">
                <div className="sp-item-main">
                  <span className="sp-item-title">Secure Checkout</span>
                  <span className="sp-item-subtitle">
                    Payments are securely processed. Reach out to support if you need assistance.
                  </span>
                </div>
              </article>
            </div>
          </section>
        </main>

        <aside className="sp-sidebar">
          <div className="sp-sidebar-box">
            <h3 className="sp-sidebar-heading">About</h3>
            <p className="sp-sidebar-about">
              Confirm your registration and complete payment to unlock the full bootcamp journey.
            </p>
            <div className="sp-sidebar-divider" />
            <ul className="sp-sidebar-list">
              <li>Secure checkout</li>
              <li>Instant access</li>
              <li>Support available</li>
            </ul>
          </div>

          <div className="sp-sidebar-box sp-status-box">
            <div className="sp-status-row">
              <span className="sp-status-dot" />
              <span className="sp-status-label">PAYMENT STATUS</span>
            </div>
            <strong className="sp-status-value">{isPaid ? 'ACTIVE' : 'PENDING'}</strong>
            <div className="sp-status-track"><div className="sp-status-fill" /></div>
            <p className="sp-status-note">{isPaid ? 'Access unlocked.' : 'Awaiting confirmation.'}</p>
          </div>

          <div className="sp-sidebar-box">
            <h3 className="sp-sidebar-heading">Topics</h3>
            <div className="sp-topics">
              <span className="sp-topic">payments</span>
              <span className="sp-topic">bootcamp</span>
              <span className="sp-topic">billing</span>
              <span className="sp-topic">support</span>
            </div>
          </div>
        </aside>
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
          title="Bootcamp registration required"
          description="Register for the bootcamp before completing payment."
          primaryLabel="Go to Bootcamps"
          onPrimary={() => {
            setShowRegisterModal(false);
            navigate('/student-bootcamps');
          }}
          onClose={() => setShowRegisterModal(false)}
        />
      )}
    </div>
  );
};

export default StudentPayments;
