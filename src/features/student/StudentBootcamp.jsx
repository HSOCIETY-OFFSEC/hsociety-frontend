import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiLayers, FiMonitor, FiShield, FiTrendingUp } from 'react-icons/fi';
import Button from '../../shared/components/ui/Button';
import { useAuth } from '../../core/auth/AuthContext';
import { getStudentOverview, registerBootcamp } from '../dashboards/student/student.service';
import useBootcampAccess from './hooks/useBootcampAccess';
import { getPublicErrorMessage } from '../../shared/utils/errors/publicError';
import {
import './base.css';
import './components.css';
import './bootcamp.css';
  HACKER_PROTOCOL_BOOTCAMP,
} from '../../data/bootcamps/hackerProtocolData';

const StudentBootcamp = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const { isRegistered, isPaid } = useBootcampAccess();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let mounted = true;
    const loadProgress = async () => {
      const response = await getStudentOverview();
      if (!mounted || !response.success) return;
      const modules = response.data?.modules || [];
      if (!modules.length) return;
      const avg = modules.reduce((sum, module) => sum + (Number(module.progress) || 0), 0) / modules.length;
      setProgress(Math.round(avg));
    };
    loadProgress();
    return () => {
      mounted = false;
    };
  }, []);

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
      navigate('/student-payments');
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
          <div className="bootcamp-hero-card reveal-on-scroll">
            <div className="bootcamp-hero-cover">
              <img src={HACKER_PROTOCOL_BOOTCAMP.emblem} alt="Hacker Protocol emblem" />
            </div>

            <div className="bootcamp-hero-body">
              <div className="bootcamp-hero-eyebrow">
                <FiShield size={14} />
                <span>{HACKER_PROTOCOL_BOOTCAMP.title}</span>
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
                <span className="bootcamp-metadata-pill">
                  <FiTrendingUp size={12} />
                  {progress}% progress
                </span>
              </div>

              <div className="bootcamp-status-row">
                <div className="bootcamp-status-label">
                  <span className={statusDotClass} />
                  {enrolledStateLabel}
                </div>

                <div className="bootcamp-hero-actions">
                  {!isRegistered && (
                    <Button
                      variant="primary"
                      size="small"
                      onClick={handleEnroll}
                      disabled={saving}
                    >
                      {saving ? 'Enrolling…' : 'Enroll Now'}
                    </Button>
                  )}

                  {isRegistered && !isPaid && (
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => navigate('/student-payments')}
                    >
                      Complete Payment
                    </Button>
                  )}

                  {isRegistered && isPaid && (
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => navigate('/student-bootcamps/overview')}
                    >
                      Open Bootcamp
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentBootcamp;
