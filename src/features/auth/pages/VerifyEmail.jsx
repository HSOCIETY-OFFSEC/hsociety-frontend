import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { requestEmailVerification, confirmEmailVerification } from '../../../core/auth/auth.service';
import { useNotifications } from '../../../shared/components/providers/NotificationProvider';
import Button from '../../../shared/components/ui/Button';
import {
  authDivider,
  authDividerText,
  authError,
  authField,
  authForm,
  authFormHeader,
  authFormSubtitle,
  authFormTitle,
  authInput,
  authLabel,
} from '../styles/authClasses';

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
    <div className="min-h-screen w-full bg-bg-primary">
      <section className="mx-auto flex min-h-screen w-full max-w-[520px] items-center justify-center bg-bg-secondary px-6 py-8 pt-[calc(var(--navbar-height,64px)+2rem)] max-sm:px-4">
        <div className="flex w-full max-w-[400px] flex-col gap-4">
          <div className={authFormHeader}>
            <h1 className={authFormTitle}>Verify your email</h1>
            <p className={authFormSubtitle}>
              We sent a verification link to your inbox. Paste your token below or request a new link.
            </p>
          </div>

          {status && (
            <div className={authError} role="status">
              {status}
            </div>
          )}

          <form className={authForm} onSubmit={handleConfirm} noValidate>
            <div className={authField}>
              <label htmlFor="verify-token" className={authLabel}>Verification token</label>
              <input
                id="verify-token"
                type="text"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                className={authInput}
                placeholder="Paste token from email"
                required
              />
            </div>
            <Button type="submit" variant="primary" size="medium" fullWidth loading={loading} disabled={loading || !canSubmit}>
              {loading ? 'Verifying…' : 'Verify email'}
            </Button>
          </form>

          <div className={authDivider}><span className={authDividerText}>Need a new link?</span></div>

          <div className={authField}>
            <label htmlFor="verify-email" className={authLabel}>Email address</label>
            <input
              id="verify-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={authInput}
              placeholder="you@example.com"
            />
          </div>
          <Button type="button" variant="ghost" size="medium" fullWidth onClick={handleResend} disabled={loading}>
            Resend verification email
          </Button>
        </div>
      </section>
    </div>
  );
};

export default VerifyEmail;
