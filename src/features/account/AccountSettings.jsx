import React, { useMemo, useState, useEffect } from 'react';
import { FiAlertTriangle, FiLock, FiTrash2 } from 'react-icons/fi';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import PasswordInput from '../../shared/components/ui/PasswordInput';
import PasswordStrengthIndicator from '../../shared/components/ui/PasswordStrengthIndicator';
import { useAuth } from '../../core/auth/AuthContext';
import { getGithubAvatarDataUri } from '../../shared/utils/avatar';
import { validatePassword } from '../../core/validation/input.validator';
import { deleteAccount, removeAvatar, updateAvatar, updateProfile, changePassword as changePasswordService } from './account.service';
import '../../styles/sections/account/index.css';

const AccountSettings = () => {
  const { user, logout, updateUser } = useAuth();
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [avatarRemoving, setAvatarRemoving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '');
  const [avatarFileName, setAvatarFileName] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profile, setProfile] = useState({
    name: user?.name || '',
    organization: user?.organization || '',
    hackerHandle: user?.hackerHandle || '',
    bio: user?.bio || '',
  });
  const isPentester = user?.role === 'pentester';

  useEffect(() => {
    if (error) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [error]);

  const identiconFallback = useMemo(
    () => getGithubAvatarDataUri(profile.name || user?.email || 'User'),
    [profile.name, user?.email]
  );

  const handleProfileSave = async () => {
    setError('');
    setProfileSaving(true);
    const response = await updateProfile(profile);
    if (response.success) {
      updateUser(response.data);
    } else {
      setError(response.error || 'Failed to update profile');
    }
    setProfileSaving(false);
  };

  const handleAvatarFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result || '');
      setAvatarFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarSave = async () => {
    if (!avatarPreview) return;
    setError('');
    setAvatarSaving(true);
    const response = await updateAvatar(avatarPreview);
    if (response.success) {
      updateUser(response.data);
    } else {
      setError(response.error || 'Failed to update avatar');
    }
    setAvatarSaving(false);
  };

  const handleAvatarRemove = async () => {
    setError('');
    setAvatarRemoving(true);
    const response = await removeAvatar();
    if (response.success) {
      updateUser(response.data);
      setAvatarPreview('');
      setAvatarFileName('');
    } else {
      setError(response.error || 'Failed to remove avatar');
    }
    setAvatarRemoving(false);
  };

  // SECURITY UPDATE IMPLEMENTED: Change password with strong validation
  const handleChangePassword = async () => {
    setError('');
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setPasswordSaving(true);
    const response = await changePasswordService(currentPassword, newPassword);
    if (response.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setError(response.error || 'Failed to change password');
    }
    setPasswordSaving(false);
  };

  const handleDelete = async () => {
    setError('');
    if (confirmText.trim().toLowerCase() !== 'delete') {
      setError('Type DELETE to confirm.');
      return;
    }

    setLoading(true);
    const response = await deleteAccount();
    if (response.success) {
      await logout();
    } else {
      setError(response.error || 'Failed to delete account');
    }
    setLoading(false);
  };

  return (
    <div className="account-settings">
      {error && <div className="account-error">{error}</div>}

      <Card padding="large" className="account-card">
        <div className="account-avatar">
          <div className="account-avatar-preview">
            <img
              src={avatarPreview || identiconFallback}
              alt="Profile avatar"
              onError={(e) => {
                if (e.currentTarget.src !== identiconFallback) {
                  e.currentTarget.src = identiconFallback;
                }
              }}
            />
          </div>
          <div className="account-avatar-actions">
            <div>
              <span className="account-label">Profile Photo</span>
              <p className="account-avatar-meta">
                {avatarFileName || user?.avatarUrl ? 'Custom image selected.' : 'Upload a photo.'}
              </p>
            </div>
            <div className="account-avatar-buttons">
              <label className="account-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAvatarFile(e.target.files?.[0])}
                />
                Choose Image
              </label>
              <Button
                variant="secondary"
                size="small"
                onClick={handleAvatarSave}
                disabled={avatarSaving || !avatarPreview}
              >
                {avatarSaving ? 'Saving...' : 'Save Photo'}
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={handleAvatarRemove}
                disabled={avatarRemoving || (!avatarPreview && !user?.avatarUrl)}
              >
                {avatarRemoving ? 'Removing...' : 'Remove Photo'}
              </Button>
            </div>
          </div>
        </div>

        <div className="account-info">
          <div className="account-field">
            <span className="account-label">Name</span>
            <input
              className="account-input"
              value={profile.name}
              onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Your name"
            />
          </div>
          <div className="account-field">
            <span className="account-label">Organization</span>
            <input
              className="account-input"
              value={profile.organization}
              onChange={(e) => setProfile((prev) => ({ ...prev, organization: e.target.value }))}
              placeholder="Company or school"
            />
          </div>
          {isPentester && (
            <>
              <div className="account-field">
                <span className="account-label">Hacker handle</span>
                <div className="account-handle-row">
                  <span className="account-handle-prefix">@</span>
                  <input
                    className="account-input"
                    value={profile.hackerHandle}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, hackerHandle: e.target.value }))
                    }
                    placeholder="ghost"
                  />
                </div>
              </div>
              <div className="account-field account-field-wide">
                <span className="account-label">Description</span>
                <textarea
                  className="account-textarea"
                  value={profile.bio}
                  onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                  placeholder="Summarize your focus, strengths, or what you bring to engagements."
                />
              </div>
            </>
          )}
          <div className="account-field">
            <span className="account-label">Email</span>
            <strong>{user?.email || '—'}</strong>
          </div>
          <div className="account-field">
            <span className="account-label">Role</span>
            <strong>{user?.role || '—'}</strong>
          </div>
        </div>
        <div className="account-actions">
          <Button
            variant="primary"
            size="small"
            onClick={handleProfileSave}
            disabled={profileSaving}
          >
            {profileSaving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </Card>

      <Card padding="large" className="account-card account-password-card">
        <div className="account-section-header">
          <FiLock size={20} />
          <div>
            <h2>Change Password</h2>
            <p>Use at least 8 characters with uppercase, lowercase, a number, and a special character.</p>
          </div>
        </div>
        <div className="account-info account-password-fields">
          <div className="account-field">
            <span className="account-label">Current password</span>
            <PasswordInput
              className="account-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <div className="account-field">
            <span className="account-label">New password</span>
            <PasswordInput
              className="account-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <PasswordStrengthIndicator password={newPassword} className="password-strength--account" />
          </div>
          <div className="account-field">
            <span className="account-label">Confirm new password</span>
            <PasswordInput
              className="account-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>
        </div>
        <div className="account-actions">
          <Button
            variant="secondary"
            size="small"
            onClick={handleChangePassword}
            disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
          >
            {passwordSaving ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </Card>

      <Card padding="large" className="account-danger">
        <div className="account-danger-header">
          <FiAlertTriangle size={18} />
          <div>
            <h2>Delete Account</h2>
            <p>This is permanent. All your data will be removed.</p>
          </div>
        </div>

        <div className="account-delete-controls">
          <input
            className="account-input"
            placeholder="Type DELETE to confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={loading}
          />
          <Button
            variant="danger"
            size="small"
            disabled={loading}
            onClick={handleDelete}
          >
            <FiTrash2 size={14} />
            {loading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AccountSettings;
