import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiLayers, FiMonitor, FiShield, FiTrendingUp } from 'react-icons/fi';
import Button from '../../../shared/components/ui/Button';
import { useAuth } from '../../../core/auth/AuthContext';
import { getStudentOverview, registerBootcamp } from '../../dashboards/student/services/student.service';
import useBootcampAccess from '../hooks/useBootcampAccess';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import {
  HACKER_PROTOCOL_BOOTCAMP,
} from '../../../data/static/bootcamps/hackerProtocolData';

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
    if (!isRegistered) return 'bg-text-tertiary';
    if (isRegistered && !isPaid) return 'bg-status-warning';
    return 'bg-status-success';
  }, [isRegistered, isPaid]);

  const pageClassName =
    'min-h-[calc(100vh-60px)] w-full max-w-[1200px] mx-auto px-[clamp(1rem,4vw,2rem)] py-[clamp(1.5rem,3vw,2.5rem)] text-text-primary';
  const heroClassName =
    'w-full rounded-lg border border-border bg-card p-4 shadow-sm md:p-5';
  const heroCardClassName =
    'grid overflow-hidden rounded-lg border border-border bg-card shadow-sm lg:grid-cols-[260px_1fr]';
  const heroBodyClassName = 'flex flex-col gap-4 border-t border-border p-6 lg:border-t-0 lg:border-l';
  const eyebrowClassName = 'flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-tertiary';
  const metadataPillClassName =
    'inline-flex items-center gap-2 rounded-full border border-border bg-bg-secondary px-3 py-1 text-xs text-text-secondary';
  const statusRowClassName = 'flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4';
  const statusLabelClassName = 'flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-tertiary';
  const errorClassName = 'rounded-sm border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger';

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
    <div className={pageClassName}>
      <div className="flex flex-col gap-5">

        <header className={`reveal-on-scroll ${heroClassName}`}>
          <div>
            <p className="inline-flex items-center rounded-xs border border-border bg-bg-secondary px-2 py-1 text-xs font-semibold uppercase tracking-widest text-text-tertiary">
              Bootcamps
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-text-primary md:text-3xl">
              Choose your training cycle.
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Enroll in a bootcamp, complete payment, then unlock the phase-based dashboard.
            </p>
          </div>
        </header>

        {error && (
          <div className={`reveal-on-scroll ${errorClassName}`}>
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-6">
          <div className={`reveal-on-scroll ${heroCardClassName}`}>
            <div className="flex items-center justify-center bg-bg-secondary p-6 lg:p-0">
              <img
                src={HACKER_PROTOCOL_BOOTCAMP.emblem}
                alt="Hacker Protocol emblem"
                className="h-full w-full object-contain lg:object-cover"
              />
            </div>

            <div className={heroBodyClassName}>
              <div className={eyebrowClassName}>
                <FiShield size={14} className="text-text-tertiary" />
                <span>{HACKER_PROTOCOL_BOOTCAMP.title}</span>
              </div>

              <h2 className="text-xl font-semibold text-text-primary">{HACKER_PROTOCOL_BOOTCAMP.title}</h2>
              <p className="text-sm text-text-secondary">{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>

              <div className="flex flex-wrap gap-2">
                <span className={metadataPillClassName}>
                  <FiClock size={12} className="text-text-tertiary" />
                  {HACKER_PROTOCOL_BOOTCAMP.duration}
                </span>
                <span className={metadataPillClassName}>
                  <FiMonitor size={12} className="text-text-tertiary" />
                  {HACKER_PROTOCOL_BOOTCAMP.format}
                </span>
                <span className={metadataPillClassName}>
                  <FiLayers size={12} className="text-text-tertiary" />
                  {HACKER_PROTOCOL_BOOTCAMP.phases} phases
                </span>
                <span className={metadataPillClassName}>
                  <FiTrendingUp size={12} className="text-text-tertiary" />
                  {progress}% progress
                </span>
              </div>

              <div className={statusRowClassName}>
                <div className={statusLabelClassName}>
                  <span className={`h-2 w-2 rounded-full ${statusDotClass}`} />
                  {enrolledStateLabel}
                </div>

                <div className="flex flex-wrap items-center gap-2">
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
