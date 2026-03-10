import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import RegistrationForm from './RegistrationForm';
import { AUTH_FORM_CONTENT } from '../../data/auth/authContent';
import '../../styles/core/auth.css';

const Register = ({
  layout = 'page',
  onRequestModeChange = null,
  onLoginRedirect = null,
}) => {
  const navigate = useNavigate();
  const copy = AUTH_FORM_CONTENT.register;

  const content = (
    <section
      className={`auth-panel auth-panel--form ${layout === 'modal' ? 'auth-panel--modal' : ''}`}
    >
      <div className="auth-wrapper">
        <RegistrationForm
          defaultAccountType="student"
          allowAccountTypeSwitch={false}
          onLoginRedirect={onLoginRedirect}
        />
        <div className="auth-footer">
          <p>
            {copy.footer.loginPrompt}{' '}
            <button
              onClick={() =>
                onRequestModeChange ? onRequestModeChange('login') : navigate('/login')
              }
              className="auth-link-inline"
            >
              {copy.footer.loginAction}
            </button>
          </p>
          <p>
            {copy.footer.corporatePrompt}{' '}
            <button
              type="button"
              className="auth-link-inline"
              onClick={() =>
                onRequestModeChange
                  ? onRequestModeChange('register-corporate')
                  : navigate('/register/corporate')
              }
            >
              {copy.footer.corporateAction}
            </button>
          </p>
          <p>
            {copy.footer.termsPrompt}{' '}
            <button
              type="button"
              className="auth-link-inline"
              onClick={() => navigate('/terms')}
            >
              {copy.footer.termsAction}
            </button>
            .
          </p>
        </div>

        <div className="auth-notice">
          <p>
            <span className="notice-icon">
              <FiLock size={14} />
            </span>
            {copy.notice.student}
          </p>
        </div>
      </div>
    </section>
  );

  if (layout === 'modal') return content;

  return (
    <div className="auth-container">
      <div className="auth-split auth-split--single">{content}</div>
    </div>
  );
};

export default Register;
