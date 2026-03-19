/**
 * Force password change - for users with mustChangePassword (weak password)
 * SECURITY UPDATE IMPLEMENTED: Block access until strong password is set
 */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import PasswordInput from '../../shared/components/ui/PasswordInput';
import PasswordStrengthIndicator from '../../shared/components/ui/PasswordStrengthIndicator';
import { useAuth } from '../../core/auth/AuthContext';
import { validatePassword } from '../../core/validation/input.validator';
import { apiClient } from '../../shared/services/api.client';
import { API_ENDPOINTS } from '../../config/api.config';
import { buildAuthModalUrl } from '../../shared/utils/auth/authModal';
import './auth-portal.css';

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
      await login(data.user, data.token, data.refreshToken);
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
    <div className="ap-container">
      <section className="ap-wrapper">
        <div className="ap-panel">
          <div className="ap-form-header">
            <h1 className="ap-form-title">Update your password</h1>
            <p className="ap-form-subtitle">
              Your password must meet security requirements: at least 8 characters, one uppercase, one lowercase, one number, and one special character.
            </p>
          </div>
          {error && (
            <div className="ap-error" role="alert">
              <span className="ap-error-icon"><FiLock size={16} /></span>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="ap-form">
            <div className="ap-field">
              <label htmlFor="new-password">New password</label>
              <PasswordInput
                id="new-password"
                className="ap-input"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <PasswordStrengthIndicator password={newPassword} />
            </div>
            <div className="ap-field">
              <label htmlFor="confirm-password">Confirm password</label>
              <PasswordInput
                id="confirm-password"
                className="ap-input"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
            <div className="ap-form-actions">
              <button type="submit" className="ap-btn-primary" disabled={loading}>
                {loading ? <span className="ap-spinner" /> : null}
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
