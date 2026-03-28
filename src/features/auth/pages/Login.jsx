import React, { useState, useEffect, useRef } from 'react';
import { FiAlertTriangle, FiLock } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/auth/AuthContext';
import { login as loginRequest } from '../../../core/auth/auth.service';
import { useNotifications } from '../../../shared/components/providers/NotificationProvider';
import PasswordInput from '../../../shared/components/ui/PasswordInput';
import Button from '../../../shared/components/ui/Button';
import { AUTH_FORM_CONTENT } from '../../../data/static/auth/authContent';
import { envConfig } from '../../../config/app/env.config';
import {
  authError,
  authErrorIcon,
  authField,
  authForm,
  authFormHeader,
  authFormSubtitle,
  authFormTitle,
  authInput,
  authLabel,
  authLinkInline,
  authLinkMuted,
  authNotice,
  authPanel,
} from '../styles/authClasses';

const Login = ({
  mode = 'default',
  layout = 'page',
  onRequestModeChange = null,
  prefillEmail = '',
  redirect = null,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useNotifications();
  const copy = AUTH_FORM_CONTENT.login;
  const requireEmailVerification = envConfig.auth.requireEmailVerification;

  const [email, setEmail] = useState(prefillEmail || location.state?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Sync autofilled values from DOM into React state (browsers bypass onChange on autofill)
  useEffect(() => {
    const syncFromDom = () => {
      if (emailRef.current && emailRef.current.value && emailRef.current.value !== email) {
        setEmail(emailRef.current.value);
      }
      if (passwordRef.current && passwordRef.current.value && passwordRef.current.value !== password) {
        setPassword(passwordRef.current.value);
      }
    };
    syncFromDom();
    const interval = window.setInterval(syncFromDom, 500);
    const handleAnimation = (e) => {
      if (e.animationName === 'hsociety-autofill-detect') syncFromDom();
    };
    document.addEventListener('animationstart', handleAnimation, true);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('animationstart', handleAnimation, true);
    };
  }, []);

  const resolveRouteForRole = (role) => {
    if (role === 'admin') return '/mr-robot';
    if (role === 'pentester') return '/pentester';
    if (role === 'student') return '/student-dashboard';
    return '/corporate-dashboard';
  };

  const resolveRedirect = (role) => {
    const candidate = redirect || location.state?.redirect;
    if (candidate && typeof candidate === 'string' && candidate.startsWith('/')) {
      return candidate;
    }
    return resolveRouteForRole(role);
  };

  const enforceRole = (role) => {
    if (mode === 'pentester' && role !== 'pentester') {
      throw new Error('Login failed');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const genericLoginError = 'Login failed. Please try again.';
    try {
      const response = await loginRequest(email, password);
      if (!response.success) {
        if (requireEmailVerification && response.verificationRequired) {
          navigate('/verify-email', { replace: true, state: { email } });
          return;
        }
        setError(response.message || genericLoginError);
        return;
      }

      if (response.mustChangePassword && response.passwordChangeToken) {
        navigate('/change-password', {
          replace: true,
          state: { passwordChangeToken: response.passwordChangeToken, user: response.user },
        });
        return;
      }

      const role = response.user?.role;
      enforceRole(role);
      await login(response.user, response.token, response.refreshToken, response.expiresIn);
      showToast({
        variant: 'success',
        title: 'Login successful',
        message: 'Welcome back. Your workspace is ready.',
        duration: 3600,
      });
      navigate(resolveRedirect(role));
    } catch (err) {
      setError(genericLoginError);
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <>
      <div className={authFormHeader}>
        <h1 className={authFormTitle}>{mode === 'pentester' ? copy.titles.pentester : copy.titles.default}</h1>
        <p className={authFormSubtitle}>{copy.subtitles.step1}</p>
      </div>

      {error && (
        <div className={authError} role="alert">
          <span className={authErrorIcon}><FiAlertTriangle size={15} /></span>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className={authForm} noValidate>
        <div className={authField}>
          <label htmlFor="email" className={authLabel}>{copy.fields.email.label}</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={copy.fields.email.placeholder}
            required
            autoFocus
            disabled={loading}
            className={authInput}
            autoComplete="username"
            inputMode="email"
            ref={emailRef}
          />
        </div>
        <div className={authField}>
          <div className="flex items-baseline justify-between">
            <label htmlFor="password" className={authLabel}>{copy.fields.password.label}</label>
            {copy.fields.password.forgotLink && (
              <button
                type="button"
                className={authLinkMuted}
                onClick={() => navigate('/forgot-password')}
                tabIndex={-1}
              >
                Forgot password?
              </button>
            )}
          </div>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={copy.fields.password.placeholder}
            required
            disabled={loading}
            className={authInput}
            autoComplete="current-password"
            ref={passwordRef}
          />
        </div>
        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            variant="primary"
            size="medium"
            fullWidth
            loading={loading}
            disabled={loading || !email || !password}
          >
            {loading ? copy.buttons.signingIn : copy.buttons.signIn}
          </Button>
        </div>
      </form>

      <div className="flex flex-col gap-2 border-t border-border pt-2 text-xs text-text-secondary">
        <p>
          {copy.footer.studentPrompt}{' '}
          <button
            onClick={() =>
              onRequestModeChange
                ? onRequestModeChange('register')
                : navigate('/posts?auth=register')
            }
            className={authLinkInline}
            disabled={loading}
          >
            {copy.footer.studentAction}
          </button>
        </p>
      </div>
    </>
  );

  const content = (
    <section
      className={`flex w-full max-w-[520px] flex-col gap-4 ${layout === 'modal' ? 'max-h-[calc(100vh-2rem)] overflow-y-auto' : ''}`}
      onClick={layout === 'modal' ? (event) => event.stopPropagation() : undefined}
    >
      <div className={authPanel}>
        {formContent}
      </div>

      <div className={authNotice}>
        <FiLock size={13} className="text-brand" />
        {copy.notice}
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

export default Login;
