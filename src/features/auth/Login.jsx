import React, { useState, useEffect } from 'react';
import { FiAlertTriangle, FiLock } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';
import { login as loginRequest } from '../../core/auth/auth.service';
import { verify2FA } from '../../core/auth/twofa.service';
import { useNotifications } from '../../shared/notifications/NotificationProvider';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import PasswordInput from '../../shared/components/ui/PasswordInput';
import PublicError from '../../shared/components/ui/PublicError';
import { AUTH_FORM_CONTENT } from '../../data/auth/authContent';
import '../../styles/core/auth.css';

/**
 * Login Component
 *
 * Flow:
 * 1. Email + password
 * 2. If 2FA enabled, prompt for code
 */
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

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(prefillEmail || location.state?.email || '');
  const [password, setPassword] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFactorToken, setTwoFactorToken] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (error) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [error]);

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
        setError(response.message || genericLoginError);
        return;
      }

      if (response.twoFactorRequired) {
        setTwoFactorToken(response.twoFactorToken);
        setPendingUser(response.user || { email });
        setStep(2);
        return;
      }
      // SECURITY UPDATE IMPLEMENTED: Force password change when backend returns mustChangePassword
      if (response.mustChangePassword && response.passwordChangeToken) {
        navigate('/change-password', {
          replace: true,
          state: { passwordChangeToken: response.passwordChangeToken, user: response.user },
        });
        return;
      }

      const role = response.user?.role;
      enforceRole(role);
      await login(response.user, response.token, response.refreshToken);
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

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setError('');
    const genericVerifyError = 'Verification failed. Please try again.';
    if (twoFACode.length !== 6) {
      setError(genericVerifyError);
      return;
    }
    setLoading(true);
    try {
      const response = await verify2FA(twoFactorToken, twoFACode);
      if (!response.success) {
        setError(response.message || genericVerifyError);
        return;
      }

      const user = response.user || pendingUser;
      const role = user?.role;
      enforceRole(role);
      await login(user, response.token, response.refreshToken);
      showToast({
        variant: 'success',
        title: 'Verification complete',
        message: 'You are signed in and secured.',
        duration: 3600,
      });
      navigate(resolveRedirect(role));
    } catch (err) {
      setError(genericVerifyError);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setPassword('');
    setTwoFACode('');
    setTwoFactorToken(null);
    setPendingUser(null);
    setError('');
  };

  const content = (
    <section
      className={`auth-panel auth-panel--form ${layout === 'modal' ? 'auth-panel--modal' : ''}`}
    >
      <div className="auth-wrapper">
        <Card className="auth-card">
          <div className="auth-header">
            <h1>{mode === 'pentester' ? copy.titles.pentester : copy.titles.default}</h1>
            <p className="auth-subtitle">
              {step === 1 && copy.subtitles.step1}
              {step === 2 && copy.subtitles.step2}
            </p>
          </div>

          <PublicError message={error} icon={<FiAlertTriangle size={16} />} />

          {step === 1 && (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">{copy.fields.email.label}</label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={copy.fields.email.placeholder}
                  required
                  autoFocus
                  disabled={loading}
                  className="form-input"
                  autoComplete="username"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">{copy.fields.password.label}</label>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={copy.fields.password.placeholder}
                  required
                  disabled={loading}
                  className="form-input"
                  autoComplete="current-password"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                disabled={loading}
              >
                {loading ? copy.buttons.signingIn : copy.buttons.signIn}
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerify2FA} className="auth-form">
              <div className="form-group">
                <label htmlFor="twofa">{copy.fields.twofa.label}</label>
                <input
                  type="text"
                  id="twofa"
                  value={twoFACode}
                  onChange={(e) =>
                    setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  placeholder={copy.fields.twofa.placeholder}
                  maxLength={6}
                  required
                  autoFocus
                  disabled={loading}
                  className="form-input otp-input"
                />
                <span className="form-hint">{copy.fields.twofa.hint}</span>
              </div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                disabled={loading || twoFACode.length !== 6}
              >
                {loading ? copy.buttons.verifying : copy.buttons.verify}
              </Button>
              <button
                type="button"
                onClick={handleReset}
                className="auth-link"
                disabled={loading}
              >
                {copy.buttons.useDifferent}
              </button>
            </form>
          )}

          <div className="auth-footer">
            <p>
              {copy.footer.studentPrompt}{' '}
              <button
                onClick={() =>
                  onRequestModeChange
                    ? onRequestModeChange('register')
                    : navigate('/register')
                }
                className="auth-link-inline"
                disabled={loading}
              >
                {copy.footer.studentAction}
              </button>
            </p>
            <p>
              {copy.footer.corporatePrompt}{' '}
              <button
                onClick={() =>
                  onRequestModeChange
                    ? onRequestModeChange('register-corporate')
                    : navigate('/register/corporate')
                }
                className="auth-link-inline"
                disabled={loading}
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
                disabled={loading}
              >
                {copy.footer.termsAction}
              </button>
              .
            </p>
          </div>
        </Card>

        <div className="auth-notice">
          <p>
            <span className="notice-icon">
              <FiLock size={14} />
            </span>
            {copy.notice}
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

export default Login;
