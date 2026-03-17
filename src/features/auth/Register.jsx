import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import RegistrationForm from './RegistrationForm';
import { AUTH_FORM_CONTENT } from '../../data/auth/authContent';
import '../../styles/core/auth.css';

/**
 * Register page / modal wrapper.
 * Renders RegistrationForm inside the standard auth layout.
 * Viewport-contained — no scrolling required.
 */
const Register = ({
  layout = 'page',
  onRequestModeChange = null,
  onLoginRedirect = null,
}) => {
  const navigate = useNavigate();
  const copy = AUTH_FORM_CONTENT.register;

  const content = (
    <section
      className={`auth-wrapper ${layout === 'modal' ? 'auth-wrapper--modal' : ''}`}
      onClick={layout === 'modal' ? (event) => event.stopPropagation() : undefined}
    >
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
              onRequestModeChange ? onRequestModeChange('login') : navigate('/posts?auth=login')
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
                : navigate('/posts?auth=register-corporate')
            }
          >
            {copy.footer.corporateAction}
          </button>
        </p>
      </div>

      <div className="auth-notice">
        <p>
          <span className="notice-icon">
            <FiLock size={13} />
          </span>
          {copy.notice?.student ?? copy.notice}
        </p>
      </div>
    </section>
  );

  if (layout === 'modal') return content;

  return (
    <div className="auth-container">
      {content}
    </div>
  );
};

export default Register;
