import React, { useEffect, useState } from 'react';
import { FiCreditCard, FiShield } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import { useAuth } from '../../core/auth/AuthContext';
import useBootcampAccess from './hooks/useBootcampAccess';
import StudentAccessModal from './components/StudentAccessModal';
import StudentPaymentModal from './components/StudentPaymentModal';
import '../../styles/features/student.css';
import { verifyBootcampPayment } from './student.service';

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
        setStatusMessage(response.error || 'Unable to verify payment.');
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
    <div className="student-page">
      <div className="dashboard-shell">
        <header className="student-hero dashboard-shell-header reveal-on-scroll">
          <div>
            <p className="student-kicker dashboard-shell-kicker">Payments</p>
            <h1 className="dashboard-shell-title">Manage your bootcamp payment.</h1>
            <p className="dashboard-shell-subtitle">
              Payment unlocks all course modules, quizzes, and resources.
            </p>
          </div>
        </header>

        <div className="student-grid">
          {statusMessage && (
            <Card padding="medium" className="student-card reveal-on-scroll">
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{statusMessage}</p>
            </Card>
          )}
          <Card padding="medium" className="student-card reveal-on-scroll">
            <div className="student-card-header">
              <FiCreditCard size={20} />
              <h3>Bootcamp Access</h3>
            </div>
            <p>{isPaid ? 'Payment complete. Full access unlocked.' : 'Payment required to unlock the bootcamp.'}</p>
            <Button
              variant="primary"
              size="small"
              onClick={handleOpenPayment}
              disabled={isPaid}
            >
              {isPaid ? 'Paid' : 'Pay Now'}
            </Button>
          </Card>

          <Card padding="medium" className="student-card reveal-on-scroll">
            <div className="student-card-header">
              <FiShield size={20} />
              <h3>Secure Checkout</h3>
            </div>
            <p>
              Payments are securely processed. Reach out to support if you need assistance with
              billing.
            </p>
          </Card>
        </div>
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
          primaryLabel="Go to Bootcamp"
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

export default StudentPayments;
