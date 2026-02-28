import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import Logo from '../../shared/components/common/Logo';
import RegistrationForm from './RegistrationForm';
import '../../styles/core/auth.css';

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const initialAccountType = query.get('accountType') === 'student' ? 'student' : 'corporate';
  const redirectRoute = query.get('redirect') || '/login';
  const note = query.get('accountType') === 'corporate'
    ? 'Need corporate access? This form pre-selects the corporate account for you.'
    : '';

  return (
    <div className="auth-container">
      <div className="auth-split">
        {/* ── Hero Panel ── */}
        <section className="auth-panel auth-panel--hero">
          <div className="auth-hero-content">
            <div className="auth-hero-badge">
              <Logo size="small" />
              <span>HSOCIETY Secure Portal</span>
            </div>
            <h1 className="auth-hero-title">Create Your Account</h1>
            <p className="auth-hero-subtitle">
              Join a structured offensive security cycle with real-world engagement
              opportunities and community-driven learning.
            </p>
            <div className="auth-hero-list">
              <div className="auth-hero-item">Beginner-friendly training tracks</div>
              <div className="auth-hero-item">Supervised real engagement delivery</div>
              <div className="auth-hero-item">Actionable reports and remediation</div>
            </div>
          </div>
        </section>

        {/* ── Form Panel ── */}
        <section className="auth-panel auth-panel--form">
          <div className="auth-wrapper">
            <RegistrationForm
              defaultAccountType={initialAccountType}
              allowAccountTypeSwitch
              note={note}
              onSuccessRedirect={redirectRoute}
            />
            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="auth-link-inline"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
          <div className="auth-notice">
            <p>
              <span className="notice-icon">
                <FiLock size={14} />
              </span>
              Your registration data is encrypted in transit.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Register;
