import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiCreditCard, FiLayers, FiMonitor, FiShield } from 'react-icons/fi';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import { useAuth } from '../../core/auth/AuthContext';
import { registerBootcamp } from '../dashboards/student/student.service';
import useBootcampAccess from './hooks/useBootcampAccess';
import StudentPaymentModal from './components/StudentPaymentModal';
import {
  HACKER_PROTOCOL_BOOTCAMP,
  HACKER_PROTOCOL_PHASES,
} from '../../data/bootcamps/hackerProtocolData';
import '../../styles/student/base.css';
import '../../styles/student/components.css';
import '../../styles/student/pages/bootcamp.css';

const StudentBootcamp = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const { isRegistered, isPaid } = useBootcampAccess();
  const [saving, setSaving] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [error, setError] = useState('');

  const enrolledStateLabel = useMemo(() => {
    if (!isRegistered) return 'Not Enrolled';
    if (isRegistered && !isPaid) return 'Enrollment Complete · Payment Pending';
    return 'Enrolled · Access Active';
  }, [isRegistered, isPaid]);

  const handleEnroll = async () => {
    setSaving(true);
    setError('');

    const response = await registerBootcamp({
      experienceLevel: 'beginner',
      goal: 'Join Hacker Protocol',
      availability: '6-10',
    });

    if (response.success) {
      updateUser({
        bootcampRegistered: true,
        bootcampStatus: response.data?.bootcampStatus || 'enrolled',
        bootcampPaymentStatus: response.data?.bootcampPaymentStatus || 'unpaid',
      });
      setShowPaymentModal(true);
    } else {
      setError(response.error || 'Unable to enroll in bootcamp.');
    }

    setSaving(false);
  };

  return (
    <div className="student-page">
      <div className="dashboard-shell">
        <header className="student-hero dashboard-shell-header reveal-on-scroll">
          <div>
            <p className="student-kicker dashboard-shell-kicker">Bootcamps</p>
            <h1 className="dashboard-shell-title">Choose your current training cycle.</h1>
            <p className="dashboard-shell-subtitle">
              Enroll in a bootcamp, complete payment, then unlock the phase-based dashboard.
            </p>
          </div>
        </header>

        {error && (
          <Card padding="medium" className="student-card reveal-on-scroll">
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{error}</p>
          </Card>
        )}

        <section className="student-grid bootcamp-catalog-grid">
          <Card
            padding="medium"
            className="student-card bootcamp-catalog-card reveal-on-scroll"
            onClick={() => navigate('/student-bootcamps/hacker-protocol/dashboard')}
          >
            <div className="bootcamp-cover">
              <img src={HACKER_PROTOCOL_BOOTCAMP.emblem} alt="Hacker Protocol emblem" />
            </div>

            <div className="bootcamp-catalog-body">
              <div className="student-card-header">
                <FiShield size={20} />
                <h3>{HACKER_PROTOCOL_BOOTCAMP.title}</h3>
              </div>
              <p>{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>

              <div className="bootcamp-catalog-metadata">
                <span>
                  <FiClock size={14} />
                  {HACKER_PROTOCOL_BOOTCAMP.duration}
                </span>
                <span>
                  <FiMonitor size={14} />
                  {HACKER_PROTOCOL_BOOTCAMP.format}
                </span>
                <span>
                  <FiLayers size={14} />
                  {HACKER_PROTOCOL_BOOTCAMP.phases} phases
                </span>
              </div>

              <p className="bootcamp-state-pill">{enrolledStateLabel}</p>

              <div className="bootcamp-catalog-actions">
                {!isRegistered && (
                  <Button
                    variant="primary"
                    size="small"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleEnroll();
                    }}
                    disabled={saving}
                  >
                    {saving ? 'Enrolling...' : 'Enroll on Bootcamp'}
                  </Button>
                )}

                {isRegistered && !isPaid && (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={(event) => {
                      event.stopPropagation();
                      setShowPaymentModal(true);
                    }}
                  >
                    <FiCreditCard size={14} />
                    Continue Payment
                  </Button>
                )}

                {isRegistered && isPaid && (
                  <Button
                    variant="primary"
                    size="small"
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate('/student-bootcamps/hacker-protocol/dashboard');
                    }}
                  >
                    Open Bootcamp Dashboard
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Card padding="medium" className="student-card reveal-on-scroll">
            <div className="student-card-header">
              <FiLayers size={20} />
              <h3>Phase Emblems</h3>
            </div>
            <div className="bootcamp-phase-preview-grid">
              {HACKER_PROTOCOL_PHASES.map((phase) => (
                <div key={phase.moduleId} className="bootcamp-phase-preview-item">
                  <img src={phase.emblem} alt={`${phase.codename} emblem`} />
                  <div>
                    <strong>{phase.codename}</strong>
                    <span>{phase.roleTitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
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
