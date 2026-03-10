import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import RegistrationForm from './RegistrationForm';
import '../../styles/core/auth.css';

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-split auth-split--single">
        {/*
          FIX: auth-notice moved INSIDE auth-wrapper so it participates in the
          same flex column as the card and footer. Previously it was a sibling of
          auth-wrapper which meant it either overflowed outside the panel or was
          clipped — both causing the "sliced form" symptom on short viewports.
        */}
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

            {/* Moved inside wrapper — renders below footer in the same flow */}
            <div className="auth-notice">
              <p>
                <span className="notice-icon">
                  <FiLock size={14} />
                </span>
                Your registration data is encrypted in transit.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Register;
