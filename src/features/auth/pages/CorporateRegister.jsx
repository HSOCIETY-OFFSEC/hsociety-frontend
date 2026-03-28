import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';
import RegistrationForm from '../components/RegistrationForm';
import { AUTH_FORM_CONTENT } from '../../../data/static/auth/authContent';
import { authLinkInline, authNotice } from '../styles/authClasses';

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
      className={`flex w-full max-w-[520px] flex-col gap-4 ${layout === 'modal' ? 'max-h-[calc(100vh-2rem)] overflow-y-auto' : ''}`}
      onClick={layout === 'modal' ? (event) => event.stopPropagation() : undefined}
    >
      <RegistrationForm
        defaultAccountType="corporate"
        allowAccountTypeSwitch={false}
        note={copy.note.corporate}
        onSuccessRedirect={redirectRoute}
        onLoginRedirect={onLoginRedirect}
      />
      <div className="flex flex-col gap-2 border-t border-border pt-2 text-xs text-text-secondary">
        <p>
          {copy.footer.studentPrompt}{' '}
          <button
            type="button"
            className={authLinkInline}
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
            className={authLinkInline}
            onClick={() => navigate('/terms')}
          >
            {copy.footer.termsAction}
          </button>
          .
        </p>
      </div>
      <div className={authNotice}>
        <FiShield size={14} className="text-brand" />
        {copy.notice.corporate}
      </div>
    </section>
  );

  if (layout === 'modal') return content;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-bg-primary px-6 py-8 pt-[calc(var(--navbar-height,64px)+2rem)] max-sm:px-4">
      {content}
    </div>
  );
};

export default CorporateRegister;
