import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';
import RegistrationForm from './RegistrationForm';
import { AUTH_FORM_CONTENT } from '../../data/auth/authContent';
import './auth.css';

const CorporateRegister = ({
  layout = 'page',
  onRequestModeChange = null,
  onLoginRedirect = null,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const redirectRoute = query.get('redirect') || '/posts?auth=login';
  const copy = AUTH_FORM_CONTENT.register;

  const content = (
    <section
      className={`auth-wrapper ${layout === 'modal' ? 'auth-wrapper--modal' : ''}`}
      onClick={layout === 'modal' ? (event) => event.stopPropagation() : undefined}
    >
      <RegistrationForm
        defaultAccountType="corporate"
        allowAccountTypeSwitch={false}
        note={copy.note.corporate}
        onSuccessRedirect={redirectRoute}
        onLoginRedirect={onLoginRedirect}
      />
      <div className="auth-footer">
        <p>
          {copy.footer.studentPrompt}{' '}
          <button
            type="button"
            className="auth-link-inline"
            onClick={() =>
              onRequestModeChange
                ? onRequestModeChange('register')
                : navigate('/posts?auth=register')
            }
          >
            {copy.footer.studentAction}
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
            <FiShield size={14} />
          </span>
          {copy.notice.corporate}
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

export default CorporateRegister;
