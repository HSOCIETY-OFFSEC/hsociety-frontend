import React, { useState } from 'react';
import { FiAlertTriangle, FiTrash2 } from 'react-icons/fi';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import { useAuth } from '../../core/auth/AuthContext';
import { deleteAccount, updateProfile } from './account.service';
import '../../styles/features/account.css';

const AccountSettings = () => {
  const { user, logout, updateUser } = useAuth();
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    organization: user?.organization || '',
  });

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
      <div className="account-header">
        <h1>Account Settings</h1>
        <p>Manage your profile and access.</p>
      </div>

      <Card padding="large" className="account-card">
        <div className="account-info">
          <div>
            <span className="account-label">Name</span>
            <input
              className="account-input"
              value={profile.name}
              onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Your name"
            />
          </div>
          <div>
            <span className="account-label">Organization</span>
            <input
              className="account-input"
              value={profile.organization}
              onChange={(e) => setProfile((prev) => ({ ...prev, organization: e.target.value }))}
              placeholder="Company or school"
            />
          </div>
          <div>
            <span className="account-label">Email</span>
            <strong>{user?.email || '—'}</strong>
          </div>
          <div>
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

      <Card padding="large" className="account-danger">
        <div className="account-danger-header">
          <FiAlertTriangle size={18} />
          <div>
            <h2>Delete Account</h2>
            <p>This is permanent. All your data will be removed.</p>
          </div>
        </div>

        {error && <div className="account-error">{error}</div>}

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
