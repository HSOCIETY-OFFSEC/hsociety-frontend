import React, { useState } from 'react';
import { FiBookOpen, FiCreditCard, FiUsers } from 'react-icons/fi';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import { useAuth } from '../../core/auth/AuthContext';
import { registerBootcamp } from './student.service';
import useBootcampAccess from './hooks/useBootcampAccess';
import StudentPaymentModal from './components/StudentPaymentModal';
import '../../styles/features/student.css';

const StudentBootcamp = () => {
  const { updateUser } = useAuth();
  const { isRegistered, isPaid } = useBootcampAccess();
  const [saving, setSaving] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    experienceLevel: 'beginner',
    goal: '',
    availability: '3-5'
  });

  const handleRegister = async () => {
    setSaving(true);
    setError('');
    const response = await registerBootcamp({
      experienceLevel: form.experienceLevel,
      goal: form.goal,
      availability: form.availability
    });

    if (response.success) {
      updateUser({
        bootcampRegistered: true,
        bootcampStatus: response.data?.bootcampStatus || 'enrolled',
        bootcampPaymentStatus: response.data?.bootcampPaymentStatus || 'unpaid'
      });
      setForm((prev) => ({ ...prev, goal: '' }));
    } else {
      setError(response.error || 'Unable to register for bootcamp.');
    }

    setSaving(false);
  };

  return (
    <div className="student-page">
      <div className="dashboard-shell">
        <header className="student-hero dashboard-shell-header reveal-on-scroll">
          <div>
            <p className="student-kicker dashboard-shell-kicker">HSOCIETY Bootcamp</p>
            <h1 className="dashboard-shell-title">Register, pay, and unlock the full course.</h1>
            <p className="dashboard-shell-subtitle">
              The bootcamp is the course. Once registered and paid, all learning modules unlock.
            </p>
          </div>
        </header>

        {error && (
          <Card padding="medium" className="student-card reveal-on-scroll">
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{error}</p>
          </Card>
        )}

        <div className="student-grid">
          <Card padding="medium" className="student-card reveal-on-scroll">
            <div className="student-card-header">
              <FiUsers size={20} />
              <h3>Bootcamp Registration</h3>
            </div>
            <p>Tell us about your goals so we can place you in the right cohort.</p>
            <div className="student-modal-form">
              <label className="student-modal-field">
                <span>Experience level</span>
                <select
                  value={form.experienceLevel}
                  onChange={(e) => setForm((prev) => ({ ...prev, experienceLevel: e.target.value }))}
                >
                  <option value="beginner">Beginner</option>
                  <option value="some">Some experience</option>
                  <option value="advanced">Advanced</option>
                </select>
              </label>
              <label className="student-modal-field">
                <span>Weekly availability</span>
                <select
                  value={form.availability}
                  onChange={(e) => setForm((prev) => ({ ...prev, availability: e.target.value }))}
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
                  value={form.goal}
                  onChange={(e) => setForm((prev) => ({ ...prev, goal: e.target.value }))}
                />
              </label>
            </div>
            <Button
              variant="primary"
              size="small"
              onClick={handleRegister}
              disabled={saving || !form.goal.trim() || isRegistered}
            >
              {isRegistered ? 'Registration Complete' : saving ? 'Registering...' : 'Register'}
            </Button>
          </Card>

          <Card padding="medium" className="student-card reveal-on-scroll">
            <div className="student-card-header">
              <FiCreditCard size={20} />
              <h3>Bootcamp Payment</h3>
            </div>
            <p>Complete payment to unlock all modules, quizzes, and resources.</p>
            <Button
              variant="secondary"
              size="small"
              onClick={() => setShowPaymentModal(true)}
              disabled={isPaid}
            >
              {isPaid ? 'Payment Completed' : 'Open Payment'}
            </Button>
          </Card>

          <Card padding="medium" className="student-card reveal-on-scroll">
            <div className="student-card-header">
              <FiBookOpen size={20} />
              <h3>Bootcamp Outline</h3>
            </div>
            <p>
              Modules map to the cohort sessions. Register first, then complete payment to unlock
              the full learning path.
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
    </div>
  );
};

export default StudentBootcamp;
