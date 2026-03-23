import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiCreditCard, FiShield } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/auth/AuthContext';
import useBootcampAccess from '../hooks/useBootcampAccess';
import StudentPaymentModal from '../components/StudentPaymentModal';
import { verifyBootcampPayment, getBootcampAccessKey } from '../../dashboards/student/services/student.service';
import { getCurrentUser } from '../../../core/auth/auth.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import { consumeBootcampRedirect } from '../utils/bootcampRedirect';
import '../styles/components.css';
import '../styles/payments.css';

const StudentPayments = () => {
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isRegistered, isPaid, accessRevoked } = useBootcampAccess();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [accessKey, setAccessKey] = useState('');

  const autoOpenedRef = useRef(false);

  const handleOpenPayment = useCallback(() => {
    if (accessRevoked) {
      navigate('/contact');
      return;
    }
    if (!isRegistered) {
      navigate('/student-bootcamps');
      return;
    }
    setShowPaymentModal(true);
  }, [accessRevoked, isRegistered, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const open = params.get('open');
    if (autoOpenedRef.current) return;
    if (open === 'payment' || open === 'modal' || open === 'pay') {
      autoOpenedRef.current = true;
      handleOpenPayment();
    }
  }, [handleOpenPayment, location.search]);

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
      const refreshed = await getCurrentUser();
      if (refreshed.success && refreshed.user) {
        updateUser(refreshed.user);
      }
      setStatusMessage(
        status === 'success' ? 'Payment verified. Access unlocked.' : 'Payment verified.'
      );
      navigate(consumeBootcampRedirect('/student-bootcamps/overview'), { replace: true });
    };

    verify();
  }, [location.search, navigate, updateUser]);

  useEffect(() => {
    let mounted = true;
    const loadKey = async () => {
      if (!isPaid) return;
      const response = await getBootcampAccessKey();
      if (!mounted) return;
      if (response.success) {
        setAccessKey(response.data?.bootcampAccessKey || '');
      }
    };
    loadKey();
    return () => { mounted = false; };
  }, [isPaid]);

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

            {accessRevoked && (
              <div className="sp-panel sp-alert">
                <p>Your bootcamp access is revoked. Contact support to resolve this issue.</p>
                <button
                  type="button"
                  className="sp-btn sp-btn-secondary"
                  onClick={() => navigate('/contact')}
                >
                  Contact Support
                </button>
              </div>
            )}

            {!isRegistered && !accessRevoked && (
              <div className="sp-panel sp-alert">
                <p>Register for the bootcamp before completing payment.</p>
                <button
                  type="button"
                  className="sp-btn sp-btn-secondary"
                  onClick={() => navigate('/student-bootcamps')}
                >
                  Go to Bootcamps
                </button>
              </div>
            )}

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
                    disabled={isPaid || !isRegistered || accessRevoked}
                  >
                    {isPaid ? 'Paid' : 'Pay Now'}
                  </button>
                </div>
              </article>
              {isPaid && (
                <article className="sp-item-row">
                  <div className="sp-item-main">
                    <span className="sp-item-title">Bootcamp Access Key</span>
                    <span className="sp-item-subtitle">
                      {accessKey ? accessKey : 'Generating access key...'}
                    </span>
                  </div>
                  <div className="sp-item-meta">
                    <button
                      type="button"
                      className="sp-btn sp-btn-secondary"
                      onClick={() => accessKey && navigator.clipboard?.writeText(accessKey)}
                      disabled={!accessKey}
                    >
                      Copy Key
                    </button>
                  </div>
                </article>
              )}
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
      </div>

      {showPaymentModal && (
        <StudentPaymentModal
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            updateUser({ bootcampPaymentStatus: 'pending', bootcampStatus: 'enrolled' });
            setShowPaymentModal(false);
            navigate(consumeBootcampRedirect('/student-bootcamps/overview'), { replace: true });
          }}
        />
      )}
    </div>
  );
};

export default StudentPayments;
