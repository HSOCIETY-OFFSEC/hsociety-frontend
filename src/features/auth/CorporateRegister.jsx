import React from 'react';
import { useLocation } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';
import Logo from '../../shared/components/common/Logo';
import ThemeToggle from '../../shared/components/common/ThemeToggle';
import RegistrationForm from './RegistrationForm';
import '../../styles/core/auth.css';

const CorporateRegister = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const redirectRoute = query.get('redirect') || '/login';

  return (
    <div className="auth-container">
      <div className="auth-split">
        <section className="auth-panel auth-panel--hero">
          <div className="auth-hero-content">
            <div className="auth-hero-badge">
              <Logo size="small" />
              <span>HSOCIETY Corporate Access</span>
            </div>
            <div className="auth-hero-toggle">
              <ThemeToggle />
            </div>
            <h1 className="auth-hero-title">Register as a Corporate Customer</h1>
            <p className="auth-hero-subtitle">
              Collect team details, verify your organization, and unlock pentest intake routes.
            </p>
            <div className="auth-hero-list">
              <div className="auth-hero-item">Secure client dashboard</div>
              <div className="auth-hero-item">Corporate pentesting requests</div>
              <div className="auth-hero-item">Access to reports & remediation</div>
            </div>
          </div>
        </section>

        <section className="auth-panel auth-panel--form">
          <div className="auth-wrapper">
            <RegistrationForm
              defaultAccountType="corporate"
              allowAccountTypeSwitch={false}
              note="Corporate accounts power pentest requests, dashboards, and client tracking."
              onSuccessRedirect={redirectRoute}
            />
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
