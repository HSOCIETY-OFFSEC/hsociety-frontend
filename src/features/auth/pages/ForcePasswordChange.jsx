/**
 * Force password change - for users with mustChangePassword (weak password)
 * SECURITY UPDATE IMPLEMENTED: Block access until strong password is set
 */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import PasswordInput from '../../../shared/components/ui/PasswordInput';
import PasswordStrengthIndicator from '../../../shared/components/ui/PasswordStrengthIndicator';
import Button from '../../../shared/components/ui/Button';
import { useAuth } from '../../../core/auth/AuthContext';
import { validatePassword } from '../../../core/validation/input.validator';
import { apiClient } from '../../../shared/services/api.client';
import { API_ENDPOINTS } from '../../../config/api/api.config';
import { buildAuthModalUrl } from '../../../shared/utils/auth/authModal';
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
  authPanel,
} from '../styles/authClasses';

export default function ForcePasswordChange() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { passwordChangeToken, user } = location.state || {};
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (error) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [error]);

  if (!passwordChangeToken) {
    navigate(buildAuthModalUrl('login', { reason: 'password_required' }), {
      replace: true,
      state: { message: 'Please log in again to set a new password.' },
    });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setError('Password update failed. Please try again.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Password update failed. Please try again.');
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        passwordChangeToken,
        newPassword,
      });
      if (!response.success) throw new Error('Password update failed');
      const data = response.data || {};
      await login(data.user, data.token, data.refreshToken, data.expiresIn);
      const role = data.user?.role;
      const target = role === 'admin' ? '/mr-robot' : role === 'pentester' ? '/pentester' : role === 'student' ? '/student-dashboard' : '/corporate-dashboard';
      navigate(target, { replace: true });
    } catch (err) {
      setError('Password update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-bg-primary px-6 py-8 pt-[calc(var(--navbar-height,64px)+2rem)] max-sm:px-4">
      <section className="flex w-full max-w-[520px] flex-col gap-4">
        <div className={authPanel}>
          <div className={authFormHeader}>
            <h1 className={authFormTitle}>Update your password</h1>
            <p className={authFormSubtitle}>
              Your password must meet security requirements: at least 8 characters, one uppercase, one lowercase, one number, and one special character.
            </p>
          </div>
          {error && (
            <div className={authError} role="alert">
              <span className={authErrorIcon}><FiLock size={16} /></span>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className={authForm}>
            <div className={authField}>
              <label htmlFor="new-password" className={authLabel}>New password</label>
              <PasswordInput
                id="new-password"
                className={authInput}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <PasswordStrengthIndicator password={newPassword} />
            </div>
            <div className={authField}>
              <label htmlFor="confirm-password" className={authLabel}>Confirm password</label>
              <PasswordInput
                id="confirm-password"
                className={authInput}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Button type="submit" variant="primary" size="medium" fullWidth loading={loading} disabled={loading}>
                {loading ? 'Updating…' : 'Update password'}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
