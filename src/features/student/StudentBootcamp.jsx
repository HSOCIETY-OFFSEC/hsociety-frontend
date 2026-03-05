import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiCreditCard, FiLayers, FiMonitor, FiShield } from 'react-icons/fi';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import { useAuth } from '../../core/auth/AuthContext';
import { registerBootcamp } from '../dashboards/student/student.service';
import useBootcampAccess from './hooks/useBootcampAccess';
import StudentPaymentModal from './components/StudentPaymentModal';
import { getPublicErrorMessage } from '../../shared/utils/publicError';
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
    if (!isRegistered) return 'Not enrolled';
    if (isRegistered && !isPaid) return 'Enrollment complete · Payment pending';
    return 'Enrolled · Access active';
  }, [isRegistered, isPaid]);

  const statusDotClass = useMemo(() => {
    if (!isRegistered) return 'bootcamp-status-dot';
    if (isRegistered && !isPaid) return 'bootcamp-status-dot registered';
    return 'bootcamp-status-dot active';
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
      setError(getPublicErrorMessage({ action: 'submit', response }));
    }

    setSaving(false);
  };

  return (
    <div className="student-page">
      <div className="dashboard-shell">

        <header className="student-hero dashboard-shell-header reveal-on-scroll">
          <div>
            <p className="student-kicker dashboard-shell-kicker">Bootcamps</p>
            <h1 className="dashboard-shell-title">Choose your training cycle.</h1>
            <p className="dashboard-shell-subtitle">
              Enroll in a bootcamp, complete payment, then unlock the phase-based dashboard.
            </p>
          </div>
        </header>

        {error && (
          <div className="student-notice error reveal-on-scroll" style={{ marginBottom: '0.5rem' }}>
            <span>{error}</span>
          </div>
        )}

        <div className="bootcamp-layout">

          {/* ── Main Bootcamp Card ── */}
          <div
            className="bootcamp-hero-card reveal-on-scroll"
            onClick={() => navigate('/student-bootcamps/hacker-protocol/dashboard')}
            style={{ cursor: 'pointer' }}
          >
            <div className="bootcamp-hero-cover">
              <img src={HACKER_PROTOCOL_BOOTCAMP.emblem} alt="Hacker Protocol emblem" />
            </div>

            <div className="bootcamp-hero-body">
              <div className="bootcamp-hero-eyebrow">
                <FiShield size={14} />
                <span>Hacker Protocol</span>
              </div>

              <h2 className="bootcamp-hero-title">{HACKER_PROTOCOL_BOOTCAMP.title}</h2>
              <p className="bootcamp-hero-subtitle">{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>

              <div className="bootcamp-metadata">
                <span className="bootcamp-metadata-pill">
                  <FiClock size={12} />
                  {HACKER_PROTOCOL_BOOTCAMP.duration}
                </span>
                <span className="bootcamp-metadata-pill">
                  <FiMonitor size={12} />
                  {HACKER_PROTOCOL_BOOTCAMP.format}
                </span>
                <span className="bootcamp-metadata-pill">
                  <FiLayers size={12} />
                  {HACKER_PROTOCOL_BOOTCAMP.phases} phases
                </span>
              </div>

              <div className="bootcamp-status-row">
                <div className="bootcamp-status-label">
                  <span className={statusDotClass} />
                  {enrolledStateLabel}
                </div>

                <div className="bootcamp-hero-actions" onClick={(e) => e.stopPropagation()}>
                  {!isRegistered && (
                    <Button
                      variant="primary"
                      size="small"
                      onClick={handleEnroll}
                      disabled={saving}
                    >
                      {saving ? 'Enrolling…' : 'Enroll now'}
                    </Button>
                  )}

                  {isRegistered && !isPaid && (
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => setShowPaymentModal(true)}
                    >
                      <FiCreditCard size={13} />
                      Continue payment
                    </Button>
                  )}

                  {isRegistered && isPaid && (
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => navigate('/student-bootcamps/hacker-protocol/dashboard')}
                    >
                      Open dashboard
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Phase Emblems ── */}
          <div className="bootcamp-phases-section reveal-on-scroll">
            <div className="bootcamp-phases-label">
              <FiLayers size={13} />
              Phase breakdown
            </div>

            <div className="bootcamp-phases-grid">
              {HACKER_PROTOCOL_PHASES.map((phase) => (
                <div key={phase.moduleId} className="bootcamp-phase-item">
                  <img src={phase.emblem} alt={`${phase.codename} emblem`} />
                  <div className="bootcamp-phase-item-text">
                    <strong>{phase.codename}</strong>
                    <span>{phase.roleTitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

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