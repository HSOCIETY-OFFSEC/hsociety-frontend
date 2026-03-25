import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiMessageSquare, FiPlayCircle } from 'react-icons/fi';
import { getStudentOverview, registerBootcamp, joinStudentCommunity, updateOnboarding } from '../../dashboards/student/services/student.service';
import { useAuth } from '../../../core/auth/AuthContext';
import { getWhatsAppLink } from '../../../config/app/social.config';
import '../styles/components.css';
import '../../dashboards/student/styles/student-dashboard.css';

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

  if (loading) {
    return (
      <div className="sd-page">
        <div className="sd-panel sd-alert">
          <p>Preparing your onboarding…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sd-page">
      <header className="sd-page-header">
        <div className="sd-page-header-inner">
          <div className="sd-header-left">
            <div className="sd-header-icon-wrap">
              <FiPlayCircle size={20} className="sd-header-icon" />
            </div>
            <div>
              <div className="sd-header-breadcrumb">
                <span className="sd-breadcrumb-org">HSOCIETY</span>
                <span className="sd-breadcrumb-sep">/</span>
                <span className="sd-breadcrumb-page">onboarding</span>
                <span className="sd-header-visibility">Private</span>
              </div>
              <p className="sd-header-desc">{heroMessage}</p>
            </div>
          </div>
        </div>
      </header>

      {status && (
        <div className="sd-panel sd-alert">
          <p>{status}</p>
        </div>
      )}

      <div className="sd-layout">
        <main className="sd-main">
          <section className="sd-section">
            <div className="sd-section-header">
              <h2 className="sd-section-title">Choose your next step</h2>
              <p className="sd-section-subtitle">Complete both steps to unlock full access.</p>
            </div>

            <div className="sd-card-grid">
              <button type="button" className="sd-card sd-card-action" onClick={handleStartBootcamp}>
                <div className="sd-card-header">
                  <h3>Start Bootcamp</h3>
                  <FiArrowRight size={14} />
                </div>
                <p>Register and unlock the hacker protocol bootcamp.</p>
              </button>
              <button type="button" className="sd-card sd-card-action" onClick={handleJoinCommunity}>
                <div className="sd-card-header">
                  <h3>Join Community</h3>
                  <FiMessageSquare size={14} />
                </div>
                <p>Access mentors, Q&A rooms, and live peer support.</p>
              </button>
              {whatsappLink && (
                <button
                  type="button"
                  className="sd-card sd-card-action"
                  onClick={() => window.open(whatsappLink, '_blank', 'noopener,noreferrer')}
                >
                  <div className="sd-card-header">
                    <h3>Join WhatsApp</h3>
                    <FiArrowRight size={14} />
                  </div>
                  <p>Get onboarding updates and bootcamp alerts.</p>
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
