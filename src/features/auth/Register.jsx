import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import Logo from '../../shared/components/common/Logo';
import ThemeToggle from '../../shared/components/common/ThemeToggle';
import RegistrationForm from './RegistrationForm';
import '../../styles/core/auth.css';

const Register = () => {
  const navigate = useNavigate();

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
            <div className="auth-hero-toggle">
              <ThemeToggle />
            </div>
            <h1 className="auth-hero-title">Join the Student Community</h1>
            <p className="auth-hero-subtitle">
              Join a structured offensive security cycle with real-world engagement
              opportunities and community-driven learning.
            </p>
            <div className="auth-hero-list">
              <div className="auth-hero-item">Cohort-based training tracks</div>
              <div className="auth-hero-item">Hands-on practice rooms</div>
              <div className="auth-hero-item">Community mentorship and feedback</div>
            </div>
          </div>
        </section>

        {/* ── Form Panel ── */}
        <section className="auth-panel auth-panel--form">
          <div className="auth-wrapper">
            <RegistrationForm
              defaultAccountType="student"
              allowAccountTypeSwitch={false}
              onSuccessRedirect="/login"
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
              <p>
                Need a corporate account?{' '}
                <button
                  type="button"
                  className="auth-link-inline"
                  onClick={() => navigate('/register/corporate')}
                >
                  Register as corporate
                </button>
              </p>
              <p>
                By creating an account you agree to the{' '}
                <button
                  type="button"
                  className="auth-link-inline"
                  onClick={() => navigate('/terms')}
                >
                  Terms & Conditions
                </button>
                .
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
