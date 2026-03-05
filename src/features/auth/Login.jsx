import React, { useState, useEffect } from 'react';
import { FiAlertTriangle, FiLock, FiShield, FiUsers, FiLayers } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';
import { login as loginRequest } from '../../core/auth/auth.service';
import { verify2FA } from '../../core/auth/twofa.service';
import { useNotifications } from '../../shared/notifications/NotificationProvider';
import Logo from '../../shared/components/common/Logo';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import PasswordInput from '../../shared/components/ui/PasswordInput';
import PublicError from '../../shared/components/ui/PublicError';
import '../../styles/core/auth.css';

const HERO_ITEMS = [
  { icon: <FiShield size={14} />, text: '2FA-ready sessions' },
  { icon: <FiUsers size={14} />, text: 'Role-based dashboards' },
  { icon: <FiLayers size={14} />, text: 'Encrypted in transit' }
];

/**
 * Login Component
 *
 * Flow:
 * 1. Email + password
 * 2. If 2FA enabled, prompt for code
 */
const Login = ({ mode = 'default' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useNotifications();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(location.state?.email || '');
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
      navigate(resolveRouteForRole(role));
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
      navigate(resolveRouteForRole(role));
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

  const heroTitle = mode === 'pentester' ? 'Pentester Access' : 'Secure Access';
  const heroSubtitle =
    mode === 'pentester'
      ? 'Signed access for offensive operators. Verified sessions. Controlled scope.'
      : 'Role-based access to training, engagements, and reporting in one secure workspace.';

  return (
    <div className="auth-container">
      <div className="auth-split">
        {/* ── Hero Panel ── */}
        <section className="auth-panel auth-panel--hero">
          <div className="auth-hero-content">
            <div className="auth-hero-badge">
              <Logo size="small" />
              <span>HSOCIETY Secure Portal</span>
            </div>
            <h1 className="auth-hero-title">{heroTitle}</h1>
            <p className="auth-hero-subtitle">{heroSubtitle}</p>
            <div className="auth-hero-list">
              {HERO_ITEMS.map((item) => (
                <div key={item.text} className="auth-hero-item">
                  {item.icon}&nbsp; {item.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Form Panel ── */}
        <section className="auth-panel auth-panel--form">
          <div className="auth-wrapper">
            <Card className="auth-card">
              <div className="auth-header">
                <h1>{mode === 'pentester' ? 'Pentester Login' : 'Secure Login'}</h1>
                <p className="auth-subtitle">
                  {step === 1 && 'Enter your email or handle and password'}
                  {step === 2 && 'Enter your 2FA authentication code'}
                </p>
              </div>

              <PublicError message={error} icon={<FiAlertTriangle size={16} />} />

              {step === 1 && (
                <>
                  <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                      <label htmlFor="email">Email or Handle</label>
                      <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com or h4ck3r10"
                        required
                        autoFocus
                        disabled={loading}
                        className="form-input"
                        autoComplete="username"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <PasswordInput
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password"
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
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </>
              )}

              {step === 2 && (
                <form onSubmit={handleVerify2FA} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="twofa">Two-Factor Authentication</label>
                    <input
                      type="text"
                      id="twofa"
                      value={twoFACode}
                      onChange={(e) =>
                        setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))
                      }
                      placeholder="000000"
                      maxLength={6}
                      required
                      autoFocus
                      disabled={loading}
                      className="form-input otp-input"
                    />
                    <span className="form-hint">
                      Enter the 6-digit code from your authenticator app
                    </span>
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={loading}
                    disabled={loading || twoFACode.length !== 6}
                  >
                    {loading ? 'Verifying...' : 'Verify 2FA'}
                  </Button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="auth-link"
                    disabled={loading}
                  >
                    Use a different account
                  </button>
                </form>
              )}

              <div className="auth-footer">
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => navigate('/register')}
                    className="auth-link-inline"
                    disabled={loading}
                  >
                    Register here
                  </button>
                </p>
                <p>
                  By signing in you agree to the{' '}
                  <button
                    type="button"
                    className="auth-link-inline"
                    onClick={() => navigate('/terms')}
                    disabled={loading}
                  >
                    Terms & Conditions
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
                Your security is our priority. All communications are encrypted.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
