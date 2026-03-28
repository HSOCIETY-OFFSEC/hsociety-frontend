// DEPRECATED — superseded by AuthPortal.jsx. Safe to delete once routes confirmed.
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import RegistrationForm from '../components/RegistrationForm';
import { AUTH_FORM_CONTENT } from '../../../data/static/auth/authContent';
import { authLinkInline, authNotice } from '../styles/authClasses';

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
      className={`flex w-full max-w-[520px] flex-col gap-4 ${layout === 'modal' ? 'max-h-[calc(100vh-2rem)] overflow-y-auto' : ''}`}
      onClick={layout === 'modal' ? (event) => event.stopPropagation() : undefined}
    >
      <RegistrationForm
        defaultAccountType="student"
        allowAccountTypeSwitch={false}
        onLoginRedirect={onLoginRedirect}
      />

      <div className="flex flex-col gap-2 border-t border-border pt-2 text-xs text-text-secondary">
        <p>
          {copy.footer.loginPrompt}{' '}
          <button
            onClick={() =>
              onRequestModeChange ? onRequestModeChange('login') : navigate('/posts?auth=login')
            }
            className={authLinkInline}
          >
            {copy.footer.loginAction}
          </button>
        </p>
      </div>

      <div className={authNotice}>
        <FiLock size={13} className="text-brand" />
        {copy.notice?.student ?? copy.notice}
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

export default Register;
