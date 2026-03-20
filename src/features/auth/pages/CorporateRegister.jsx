import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';
import RegistrationForm from '../components/RegistrationForm';
import { AUTH_FORM_CONTENT } from '../../../data/static/auth/authContent';
import '../styles/auth-portal.css';

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
      className={`ap-wrapper ${layout === 'modal' ? 'ap-wrapper--modal' : ''}`}
      onClick={layout === 'modal' ? (event) => event.stopPropagation() : undefined}
    >
      <RegistrationForm
        defaultAccountType="corporate"
        allowAccountTypeSwitch={false}
        note={copy.note.corporate}
        onSuccessRedirect={redirectRoute}
        onLoginRedirect={onLoginRedirect}
      />
      <div className="ap-footer">
        <p>
          {copy.footer.studentPrompt}{' '}
          <button
            type="button"
            className="ap-link-inline"
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
            className="ap-link-inline"
            onClick={() => navigate('/terms')}
          >
            {copy.footer.termsAction}
          </button>
          .
        </p>
      </div>
      <div className="ap-notice">
        <FiShield size={14} />
        {copy.notice.corporate}
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

export default CorporateRegister;
