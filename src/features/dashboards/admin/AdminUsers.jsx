import React, { useEffect, useMemo, useState } from 'react';
import { FiEdit2, FiSave, FiUserX, FiUsers } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import PageLoader from '../../../shared/components/ui/PageLoader';
import { getUsers, updateUser, muteUser } from './admin.service';
import '../../../styles/dashboards/admin/index.css';

const ROLE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'pentester', label: 'Pentester' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'admin', label: 'Admin' }
];

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    const response = await getUsers();
    if (response.success) {
      setUsers(response.data || []);
    } else {
      setError(response.error || 'Failed to load users');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const startEdit = (user) => {
    setEditingId(user.id);
    setDrafts((prev) => ({
      ...prev,
      [user.id]: {
        name: user.name || '',
        email: user.email || '',
        organization: user.organization || '',
        role: user.role || 'student',
        bootcampStatus: user.bootcampStatus || 'not_enrolled'
      }
    }));
  };

  const cancelEdit = () => setEditingId(null);

  const saveUser = async (userId) => {
    const payload = drafts[userId];
    if (!payload) return;
    setSavingId(userId);
    const response = await updateUser(userId, payload);
    if (response.success) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? response.data : u)));
      setEditingId(null);
    } else {
      setError(response.error || 'Failed to update user');
    }
    setSavingId(null);
  };

  const updateDraft = (userId, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value
      }
    }));
  };

  const stats = useMemo(() => {
    return users.reduce(
      (acc, user) => {
        acc.total += 1;
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      },
      { total: 0, student: 0, pentester: 0, corporate: 0, admin: 0 }
    );
  }, [users]);

  if (loading) {
    return <PageLoader message="Loading user management..." durationMs={0} />;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-shell">
        <div className="admin-hero dashboard-shell-header">
          <div>
            <p className="admin-kicker dashboard-shell-kicker">USER CONTROL</p>
            <h1 className="dashboard-shell-title">Manage Users</h1>
            <p className="admin-subtitle dashboard-shell-subtitle">
              Update roles, bootcamp status, and user profiles.
            </p>
          </div>
          <div className="admin-badges dashboard-shell-actions">
            <div className="admin-badge">
              <FiUsers size={18} />
              <div>
                <span>Total Users</span>
                <strong>{stats.total}</strong>
              </div>
            </div>
            <div className="admin-badge">
              <FiUsers size={18} />
              <div>
                <span>Pentesters</span>
                <strong>{stats.pentester}</strong>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="admin-alert">{error}</div>}

        <Card className="admin-card" padding="medium">
          <div className="admin-table">
            <div className="admin-row admin-row-header admin-row-users">
              <span>Name</span>
              <span>Email</span>
              <span>Organization</span>
              <span>Role</span>
              <span>Bootcamp</span>
              <span>Mute</span>
              <span>Actions</span>
            </div>

            {users.map((user) => {
              const isEditing = editingId === user.id;
              const draft = drafts[user.id] || {};
              return (
                <div key={user.id} className="admin-row admin-row-users">
                  <div>
                    {isEditing ? (
                      <input
                        className="admin-input"
                        value={draft.name || ''}
                        onChange={(e) => updateDraft(user.id, 'name', e.target.value)}
                      />
                    ) : (
                      <span>{user.name || '—'}</span>
                    )}
                  </div>
                  <div>
                    {isEditing ? (
                      <input
                        className="admin-input"
                        value={draft.email || ''}
                        onChange={(e) => updateDraft(user.id, 'email', e.target.value)}
                      />
                    ) : (
                      <span>{user.email}</span>
                    )}
                  </div>
                  <div>
                    {isEditing ? (
                      <input
                        className="admin-input"
                        value={draft.organization || ''}
                        onChange={(e) => updateDraft(user.id, 'organization', e.target.value)}
                      />
                    ) : (
                      <span>{user.organization || '—'}</span>
                    )}
                  </div>
                <div>
                  {isEditing ? (
                    <select
                      className="admin-select"
                        value={draft.role || 'student'}
                        onChange={(e) => updateDraft(user.id, 'role', e.target.value)}
                      >
                        {ROLE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className={`admin-role role-${user.role || 'student'}`}>
                        {user.role || 'student'}
                      </span>
                    )}
                  </div>
                  <div>
                    {isEditing ? (
                      <select
                        className="admin-select"
                        value={draft.bootcampStatus || 'not_enrolled'}
                        onChange={(e) => updateDraft(user.id, 'bootcampStatus', e.target.value)}
                      >
                        {['not_enrolled', 'enrolled', 'completed'].map((status) => (
                          <option key={status} value={status}>
                            {status.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    ) : (
                    <span className="admin-role">
                      {(user.bootcampStatus || 'not_enrolled').replace('_', ' ')}
                    </span>
                  )}
                </div>
                <div>
                  <span className="admin-role">
                    {user.mutedUntil && new Date(user.mutedUntil) > new Date()
                      ? 'Muted'
                      : 'Active'}
                  </span>
                </div>
                <div className="admin-actions">
                  {!isEditing && (
                    <Button size="small" variant="ghost" onClick={() => startEdit(user)}>
                      <FiEdit2 size={14} />
                      Edit
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="ghost"
                    onClick={async () => {
                      const minutes = user.mutedUntil && new Date(user.mutedUntil) > new Date() ? 0 : 60;
                      const response = await muteUser(user.id, minutes);
                      if (response.success) {
                        setUsers((prev) =>
                          prev.map((u) =>
                            u.id === user.id ? { ...u, mutedUntil: response.data.mutedUntil } : u
                          )
                        );
                      }
                    }}
                  >
                    <FiUserX size={14} />
                    {user.mutedUntil && new Date(user.mutedUntil) > new Date() ? 'Unmute' : 'Mute 1h'}
                  </Button>
                  {isEditing && (
                    <>
                        <Button
                          size="small"
                          variant="primary"
                          onClick={() => saveUser(user.id)}
                          disabled={savingId === user.id}
                        >
                          <FiSave size={14} />
                          {savingId === user.id ? 'Saving...' : 'Save'}
                        </Button>
                        <Button size="small" variant="ghost" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;
