// DEPRECATED — superseded by AuthPortal.jsx. Safe to delete once routes confirmed.
import React, { useState, useEffect, useRef } from 'react';
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
import './auth.css';

/**
 * Login Component
 *
 * Flow:
 * 1. Email + password
 * 2. If 2FA enabled, prompt for code
 *
 * Designed to be viewport-contained — no scrolling required on any screen size.
 */
const Login = ({
  mode = 'default',
  layout = 'page',
  onRequestModeChange = null,
  prefillEmail = '',
  redirect = null,
  useCard = true,
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
  const otpInputRef = useRef(null);

  // Auto-focus OTP input when entering step 2
  useEffect(() => {
    if (step === 2 && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  // Clear error on step change
  useEffect(() => {
    setError('');
  }, [step]);

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

  // Handle OTP digit input — auto-submit when 6 digits entered
  const handleOtpChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setTwoFACode(val);
    if (val.length === 6) {
      // Trigger submit after state settles
      setTimeout(() => {
        document.getElementById('otp-submit-btn')?.click();
      }, 80);
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

  const formContent = (
    <>
          {/* Step indicator for 2FA flow */}
          {step === 2 && (
            <div className="auth-step-indicator">
              <span className="auth-step-dot auth-step-dot--done" />
              <span className="auth-step-line" />
              <span className="auth-step-dot auth-step-dot--active" />
            </div>
          )}

          <div className="auth-header">
            <h1>{mode === 'pentester' ? copy.titles.pentester : copy.titles.default}</h1>
            <p className="auth-subtitle">
              {step === 1 && copy.subtitles.step1}
              {step === 2 && (
                <>
                  {copy.subtitles.step2}{' '}
                  <span className="auth-email-pill">{email}</span>
                </>
              )}
            </p>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              <span className="error-icon"><FiAlertTriangle size={15} /></span>
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleLogin} className="auth-form" noValidate>
              <div className="form-group">
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
                  className="form-input"
                  autoComplete="username"
                  inputMode="email"
                />
              </div>
              <div className="form-group">
                <div className="form-label-row">
                  <label htmlFor="password">{copy.fields.password.label}</label>
                  {copy.fields.password.forgotLink && (
                    <button
                      type="button"
                      className="auth-link-muted"
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
                  className="form-input"
                  autoComplete="current-password"
                />
              </div>
              <div className="auth-mobile-actions">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={loading}
                  disabled={loading || !email || !password}
                >
                  {loading ? copy.buttons.signingIn : copy.buttons.signIn}
                </Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerify2FA} className="auth-form" noValidate>
              <div className="form-group">
                <label htmlFor="twofa">{copy.fields.twofa.label}</label>
                <input
                  ref={otpInputRef}
                  type="text"
                  id="twofa"
                  value={twoFACode}
                  onChange={handleOtpChange}
                  placeholder={copy.fields.twofa.placeholder}
                  maxLength={6}
                  required
                  disabled={loading}
                  className="form-input otp-input"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="\d{6}"
                />
                <span className="form-hint">{copy.fields.twofa.hint}</span>
              </div>
              <div className="auth-mobile-actions">
                <Button
                  id="otp-submit-btn"
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
              </div>
            </form>
          )}

          <div className="auth-footer">
            <p>
              {copy.footer.studentPrompt}{' '}
              <button
                onClick={() =>
                  onRequestModeChange
                    ? onRequestModeChange('register')
                    : navigate('/posts?auth=register')
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
                    : navigate('/posts?auth=register-corporate')
                }
                className="auth-link-inline"
                disabled={loading}
              >
                {copy.footer.corporateAction}
              </button>
            </p>
          </div>
    </>
  );

  const content = (
    <section
      className={`auth-wrapper ${layout === 'modal' ? 'auth-wrapper--modal' : ''}`}
      onClick={layout === 'modal' ? (event) => event.stopPropagation() : undefined}
    >
      {useCard ? (
        <Card className="auth-card">{formContent}</Card>
      ) : (
        <div className="auth-panel">{formContent}</div>
      )}

        <div className="auth-notice">
          <p>
            <span className="notice-icon"><FiLock size={13} /></span>
            {copy.notice}
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

export default Login;
