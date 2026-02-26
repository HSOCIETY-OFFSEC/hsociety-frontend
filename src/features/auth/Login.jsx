import React, { useState } from 'react';
import { FiAlertTriangle, FiLock } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';
import { login as loginRequest } from '../../core/auth/auth.service';
import { verify2FA } from '../../core/auth/twofa.service';
import Logo from '../../shared/components/common/Logo';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import '../../styles/core/auth.css';

const QUICK_LOGINS = [
  {
    role: 'corporate',
    label: 'Corporate (test-corp)',
    email: 'test-corp@hsociety.local',
    password: 'Test123!'
  },
  {
    role: 'pentester',
    label: 'Pentester (test-pen)',
    email: 'test-pen@hsociety.local',
    password: 'Test123!'
  },
  {
    role: 'student',
    label: 'Student (test-stu)',
    email: 'test-stu@hsociety.local',
    password: 'Test123!'
  }
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

  const [step, setStep] = useState(1); // 1: credentials, 2: 2FA
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFactorToken, setTwoFactorToken] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginRequest(email, password);
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      if (response.twoFactorRequired) {
        setTwoFactorToken(response.twoFactorToken);
        setPendingUser(response.user || { email });
        setStep(2);
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
      if (!response.success) {
        throw new Error(response.message || 'Invalid 2FA code');
      }

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

  const handleQuickLogin = (login) => {
    setError('');
    setEmail(login.email);
    setPassword(login.password);
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-logo">
          <Logo size="large" />
        </div>

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
          )}

          {step === 1 && (
            <div className="auth-quick-logins">
              <p>Select a role to pre-fill credentials</p>
              <div className="auth-quick-grid">
                {QUICK_LOGINS.filter((entry) => mode !== 'pentester' || entry.role === 'pentester').map(
                  (entry) => (
                    <button
                      key={entry.role}
                      type="button"
                      className="auth-quick-item"
                      onClick={() => handleQuickLogin(entry)}
                    >
                      {entry.label}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleVerify2FA} className="auth-form">
              <div className="form-group">
                <label htmlFor="twofa">Two-Factor Authentication</label>
                <input
                  type="text"
                  id="twofa"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoFocus
                  disabled={loading}
                  className="form-input otp-input"
                />
                <span className="form-hint">Enter the 6-digit code from your authenticator app</span>
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
              <FiLock size={16} />
            </span>
            Your security is our priority. All communications are encrypted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
