// DEPRECATED — superseded by AuthPortal.jsx. Safe to delete once routes confirmed.
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import RegistrationForm from './RegistrationForm';
import { AUTH_FORM_CONTENT } from '../../data/auth/authContent';
import './auth-portal.css';

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
      className={`ap-wrapper ${layout === 'modal' ? 'ap-wrapper--modal' : ''}`}
      onClick={layout === 'modal' ? (event) => event.stopPropagation() : undefined}
    >
      <RegistrationForm
        defaultAccountType="student"
        allowAccountTypeSwitch={false}
        onLoginRedirect={onLoginRedirect}
      />

      <div className="ap-footer">
        <p>
          {copy.footer.loginPrompt}{' '}
          <button
            onClick={() =>
              onRequestModeChange ? onRequestModeChange('login') : navigate('/posts?auth=login')
            }
            className="ap-link-inline"
          >
            {copy.footer.loginAction}
          </button>
        </p>
        <p>
          {copy.footer.corporatePrompt}{' '}
          <button
            type="button"
            className="ap-link-inline"
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

      <div className="ap-notice">
        <FiLock size={13} />
        {copy.notice?.student ?? copy.notice}
      </div>
    </section>
  );

  if (layout === 'modal') return content;

  return (
    <div className="ap-container">
      {content}
    </div>
  );
};

export default Register;
