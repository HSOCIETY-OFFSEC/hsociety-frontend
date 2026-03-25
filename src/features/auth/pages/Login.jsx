import React, { useState, useEffect, useRef } from 'react';
import { FiAlertTriangle, FiLock } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/auth/AuthContext';
import { login as loginRequest } from '../../../core/auth/auth.service';
import { useNotifications } from '../../../shared/components/providers/NotificationProvider';
import PasswordInput from '../../../shared/components/ui/PasswordInput';
import { AUTH_FORM_CONTENT } from '../../../data/static/auth/authContent';
import '../styles/auth-portal.css';

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
        if (response.verificationRequired) {
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
      <div className="ap-form-header">
        <h1 className="ap-form-title">{mode === 'pentester' ? copy.titles.pentester : copy.titles.default}</h1>
        <p className="ap-form-subtitle">{copy.subtitles.step1}</p>
      </div>

      {error && (
        <div className="ap-error" role="alert">
          <span className="ap-error-icon"><FiAlertTriangle size={15} /></span>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="ap-form" noValidate>
        <div className="ap-field">
          <label htmlFor="email">{copy.fields.email.label}</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={copy.fields.email.placeholder}
            required
            autoFocus
            disabled={loading}
            className="ap-input"
            autoComplete="username"
            inputMode="email"
            ref={emailRef}
          />
        </div>
        <div className="ap-field">
          <div className="ap-label-row">
            <label htmlFor="password">{copy.fields.password.label}</label>
            {copy.fields.password.forgotLink && (
              <button
                type="button"
                className="ap-link-muted"
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
            className="ap-input"
            autoComplete="current-password"
            ref={passwordRef}
          />
        </div>
        <div className="ap-form-actions">
          <button
            type="submit"
            className="ap-btn-primary"
            disabled={loading || !email || !password}
          >
            {loading ? <span className="ap-spinner" /> : null}
            {loading ? copy.buttons.signingIn : copy.buttons.signIn}
          </button>
        </div>
      </form>

      <div className="ap-footer">
        <p>
          {copy.footer.studentPrompt}{' '}
          <button
            onClick={() =>
              onRequestModeChange
                ? onRequestModeChange('register')
                : navigate('/posts?auth=register')
            }
            className="ap-link-inline"
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
      className={`ap-wrapper ${layout === 'modal' ? 'ap-wrapper--modal' : ''}`}
      onClick={layout === 'modal' ? (event) => event.stopPropagation() : undefined}
    >
      <div className="ap-panel">
        {formContent}
      </div>

      <div className="ap-notice">
        <FiLock size={13} />
        {copy.notice}
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

export default Login;
