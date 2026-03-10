import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';
import RegistrationForm from './RegistrationForm';
import '../../styles/core/auth.css';

const CorporateRegister = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const redirectRoute = query.get('redirect') || '/login';

  return (
    <div className="auth-container">
      <div className="auth-split auth-split--single">
        <section className="auth-panel auth-panel--form">
          <div className="auth-wrapper">
            <RegistrationForm
              defaultAccountType="corporate"
              allowAccountTypeSwitch={false}
              note="Corporate accounts power pentest requests, dashboards, and client tracking."
              onSuccessRedirect={redirectRoute}
            />
            <div className="auth-footer">
              <p>
                Looking for student access?{' '}
                <button
                  type="button"
                  className="auth-link-inline"
                  onClick={() => navigate('/register')}
                >
                  Register as student
                </button>
              </p>
              <p>
                By creating a corporate account you agree to the{' '}
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
                <FiShield size={14} />
              </span>
              HSOCIETY verifies each corporate registration before pentest access is granted.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CorporateRegister;
