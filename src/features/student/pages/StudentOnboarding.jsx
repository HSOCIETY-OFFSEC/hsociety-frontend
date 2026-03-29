import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiMessageSquare, FiPlayCircle } from 'react-icons/fi';
import { getStudentOverview, registerBootcamp, joinStudentCommunity, updateOnboarding } from '../../dashboards/student/services/student.service';
import { useAuth } from '../../../core/auth/AuthContext';
import { getWhatsAppLink } from '../../../config/app/social.config';

const StudentOnboarding = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [overview, setOverview] = useState(null);
  const whatsappLink = getWhatsAppLink();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const response = await getStudentOverview();
      if (!mounted) return;
      if (response.success) {
        setOverview(response.data);
      }
      setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  const onboardingCompleted = Boolean(overview?.onboarding?.completed);

  const handleStartBootcamp = async () => {
    setStatus('Registering bootcamp…');
    const response = await registerBootcamp();
    if (response.success) {
      await updateOnboarding({ startBootcamp: true });
      updateUser({
        bootcampStatus: response.data?.bootcampStatus || 'enrolled',
        bootcampPaymentStatus: response.data?.bootcampPaymentStatus || 'unpaid',
      });
      setStatus('Bootcamp registration complete.');
      navigate('/student-bootcamps', { replace: true });
      return;
    }
    setStatus(response.error || 'Unable to start bootcamp.');
  };

  const handleJoinCommunity = async () => {
    setStatus('Joining community…');
    const response = await joinStudentCommunity();
    if (response.success) {
      await updateOnboarding({ joinCommunity: true });
      setStatus('Community access granted.');
      navigate('/community', { replace: true });
      return;
    }
    setStatus(response.error || 'Unable to join community.');
  };

  const heroMessage = useMemo(() => {
    if (onboardingCompleted) {
      return 'Your onboarding is complete. Choose your next move.';
    }
    return 'Welcome to HSOCIETY. Start your journey below.';
  }, [onboardingCompleted]);

  const pageClassName =
    'min-h-[calc(100vh-60px)] w-full max-w-[1200px] mx-auto px-[clamp(1.1rem,4vw,2.25rem)] pt-[clamp(1.5rem,3.2vw,2.75rem)] pb-16 text-text-primary';
  const headerClassName = 'mb-6 flex flex-col gap-4';
  const headerInnerClassName = 'flex flex-wrap items-center justify-between gap-6';
  const headerLeftClassName = 'flex items-center gap-4';
  const headerIconClassName = 'flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-bg-secondary text-brand';
  const breadcrumbClassName = 'flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-text-tertiary';
  const breadcrumbStrongClassName = 'font-semibold text-text-secondary';
  const visibilityClassName =
    'rounded-full border border-border bg-bg-secondary px-2 py-0.5 text-xs font-semibold uppercase tracking-widest text-text-secondary';
  const headerDescClassName = 'mt-1 text-sm text-text-secondary';
  const panelClassName =
    'rounded-lg border border-border bg-bg-secondary p-5 text-sm text-text-secondary shadow-sm';
  const sectionTitleClassName = 'text-lg font-semibold text-text-primary';
  const sectionSubtitleClassName = 'text-sm text-text-secondary';
  const cardGridClassName = 'grid grid-cols-1 gap-4 md:grid-cols-3';
  const cardClassName =
    'flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-5 text-left text-text-secondary transition hover:-translate-y-0.5 hover:border-text-secondary/40 hover:shadow-md';
  const cardHeaderClassName = 'flex items-start justify-between gap-4 text-text-primary';

  if (loading) {
    return (
      <div className={pageClassName}>
        <div className={panelClassName}>
          <p>Preparing your onboarding…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={pageClassName}>
      <header className={headerClassName}>
        <div className={headerInnerClassName}>
          <div className={headerLeftClassName}>
            <div className={headerIconClassName}>
              <FiPlayCircle size={20} />
            </div>
            <div>
              <div className={breadcrumbClassName}>
                <span className={breadcrumbStrongClassName}>HSOCIETY</span>
                <span>/</span>
                <span className={breadcrumbStrongClassName}>onboarding</span>
                <span className={visibilityClassName}>Private</span>
              </div>
              <p className={headerDescClassName}>{heroMessage}</p>
            </div>
          </div>
        </div>
      </header>

      {status && (
        <div className={panelClassName}>
          <p>{status}</p>
        </div>
      )}

      <div className="mt-6">
        <main>
          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className={sectionTitleClassName}>Choose your next step</h2>
              <p className={sectionSubtitleClassName}>Complete both steps to unlock full access.</p>
            </div>

            <div className={cardGridClassName}>
              <button type="button" className={cardClassName} onClick={handleStartBootcamp}>
                <div className={cardHeaderClassName}>
                  <h3 className="text-base font-semibold">Start Bootcamp</h3>
                  <FiArrowRight size={14} />
                </div>
                <p className="text-sm">Register and unlock the hacker protocol bootcamp.</p>
              </button>
              <button type="button" className={cardClassName} onClick={handleJoinCommunity}>
                <div className={cardHeaderClassName}>
                  <h3 className="text-base font-semibold">Join Community</h3>
                  <FiMessageSquare size={14} />
                </div>
                <p className="text-sm">Access mentors, Q&A rooms, and live peer support.</p>
              </button>
              {whatsappLink && (
                <button
                  type="button"
                  className={cardClassName}
                  onClick={() => window.open(whatsappLink, '_blank', 'noopener,noreferrer')}
                >
                  <div className={cardHeaderClassName}>
                    <h3 className="text-base font-semibold">Join WhatsApp</h3>
                    <FiArrowRight size={14} />
                  </div>
                  <p className="text-sm">Get onboarding updates and bootcamp alerts.</p>
                </button>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default StudentOnboarding;
