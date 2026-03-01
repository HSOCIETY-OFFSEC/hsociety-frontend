import React, { useState } from 'react';
import { FiAlertTriangle, FiLock, FiShield, FiUsers, FiLayers } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';
import { login as loginRequest } from '../../core/auth/auth.service';
import { verify2FA } from '../../core/auth/twofa.service';
import { apiClient } from '../../shared/services/api.client';
import { API_ENDPOINTS } from '../../config/api.config';
import Logo from '../../shared/components/common/Logo';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
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

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFactorToken, setTwoFactorToken] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // SECURITY UPDATE IMPLEMENTED: Optional mobile OTP for login
  const [mobile, setMobile] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);

  const resolveRouteForRole = (role) => {
    if (role === 'admin') return '/mr-robot';
    if (role === 'pentester') return '/pentester';
    if (role === 'student') return '/student-dashboard';
    return '/corporate-dashboard';
  };

  const enforceRole = (role) => {
    if (mode === 'pentester' && role !== 'pentester') {
      throw new Error('This login is for pentesters only.');
    }
  };

  const handleSendOtp = async () => {
    if (!mobile.trim()) {
      setError('Enter your mobile number');
      return;
    }
    setError('');
    setOtpSending(true);
    try {
      const res = await apiClient.post(API_ENDPOINTS.OTP.REQUEST, { mobile: mobile.trim(), context: 'login' });
      if (res.success) {
        setOtpSent(true);
      } else {
        setError(res.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setOtpSending(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await loginRequest(email, password, mobile.trim() && otpCode ? { mobile: mobile.trim(), otp: otpCode } : undefined);
      if (!response.success) throw new Error(response.message || 'Login failed');

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
      navigate(resolveRouteForRole(role));
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setError('');
    if (twoFACode.length !== 6) {
      setError('2FA code must be 6 digits');
      return;
    }
    setLoading(true);
    try {
      const response = await verify2FA(twoFactorToken, twoFACode);
      if (!response.success) throw new Error(response.message || 'Invalid 2FA code');

      const user = response.user || pendingUser;
      const role = user?.role;
      enforceRole(role);
      await login(user, response.token, response.refreshToken);
      navigate(resolveRouteForRole(role));
    } catch (err) {
      setError(err.message || 'Invalid 2FA code. Please try again.');
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
                  {step === 1 && 'Enter your email and password'}
                  {step === 2 && 'Enter your 2FA authentication code'}
                </p>
              </div>

              {error && (
                <div className="auth-error">
                  <span className="error-icon">
                    <FiAlertTriangle size={16} />
                  </span>
                  {error}
                </div>
              )}

              {step === 1 && (
                <>
                  <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        autoFocus
                        disabled={loading}
                        className="form-input"
                        autoComplete="username"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
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
                    <div className="form-group">
                      <label htmlFor="mobile">Mobile (optional, for OTP)</label>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="tel"
                          id="mobile"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="+1234567890"
                          disabled={loading}
                          className="form-input"
                          style={{ flex: 1 }}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="small"
                          onClick={handleSendOtp}
                          disabled={otpSending || !mobile.trim()}
                        >
                          {otpSending ? 'Sending…' : 'Send OTP'}
                        </Button>
                      </div>
                    </div>
                    {otpSent && (
                      <div className="form-group">
                        <label htmlFor="otp">OTP code</label>
                        <input
                          type="text"
                          id="otp"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="000000"
                          maxLength={6}
                          disabled={loading}
                          className="form-input"
                        />
                      </div>
                    )}
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
