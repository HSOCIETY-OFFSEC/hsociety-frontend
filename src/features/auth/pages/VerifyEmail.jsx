import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { requestEmailVerification, confirmEmailVerification } from '../../../core/auth/auth.service';
import { useNotifications } from '../../../shared/components/providers/NotificationProvider';
import '../styles/auth-portal.css';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useNotifications();
  const query = new URLSearchParams(location.search);
  const tokenFromQuery = query.get('token') || '';
  const emailFromState = location.state?.email || '';
  const [token, setToken] = useState(tokenFromQuery);
  const [email, setEmail] = useState(emailFromState);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const autoResentRef = useRef(false);

  useEffect(() => {
    if (!tokenFromQuery) return;
    setToken(tokenFromQuery);
  }, [tokenFromQuery]);

  const canSubmit = useMemo(() => token.trim().length > 10, [token]);

  const handleConfirm = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setStatus('');
    const response = await confirmEmailVerification(token.trim());
    setLoading(false);
    if (!response.success) {
      setStatus(response.message || 'Verification failed. Please try again.');
      return;
    }
    showToast({ variant: 'success', title: 'Email verified', message: 'You can now sign in.', duration: 3600 });
    navigate('/posts?auth=login', { replace: true });
  };

  const handleResend = async () => {
    if (!email) {
      setStatus('Enter your email to resend the verification link.');
      return;
    }
    setLoading(true);
    setStatus('');
    const response = await requestEmailVerification(email.trim());
    setLoading(false);
    if (!response.success) {
      setStatus(response.message || 'Unable to resend verification email.');
      return;
    }
    setStatus('Verification email sent. Check your inbox.');
  };

  useEffect(() => {
    if (autoResentRef.current) return;
    if (!email || tokenFromQuery) return;
    autoResentRef.current = true;
    handleResend();
  }, [email, tokenFromQuery]);

  return (
    <div className="ap-root">
      <section className="ap-right" style={{ margin: '0 auto' }}>
        <div className="ap-right-inner">
          <div className="ap-form-header">
            <h1 className="ap-form-title">Verify your email</h1>
            <p className="ap-form-subtitle">
              We sent a verification link to your inbox. Paste your token below or request a new link.
            </p>
          </div>

          {status && (
            <div className="ap-error" role="status">
              {status}
            </div>
          )}

          <form className="ap-form" onSubmit={handleConfirm} noValidate>
            <div className="ap-field">
              <label htmlFor="verify-token">Verification token</label>
              <input
                id="verify-token"
                type="text"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                className="ap-input"
                placeholder="Paste token from email"
                required
              />
            </div>
            <button type="submit" className="ap-btn-primary" disabled={loading || !canSubmit}>
              {loading ? 'Verifying…' : 'Verify email'}
            </button>
          </form>

          <div className="ap-divider"><span>Need a new link?</span></div>

          <div className="ap-field">
            <label htmlFor="verify-email">Email address</label>
            <input
              id="verify-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="ap-input"
              placeholder="you@example.com"
            />
          </div>
          <button type="button" className="ap-btn-ghost" onClick={handleResend} disabled={loading}>
            Resend verification email
          </button>
        </div>
      </section>
    </div>
  );
};

export default VerifyEmail;
