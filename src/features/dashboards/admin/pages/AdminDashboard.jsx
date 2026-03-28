import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiEdit2, FiSave, FiShield, FiUsers } from 'react-icons/fi';
import Card from '../../../../shared/components/ui/Card';
import Button from '../../../../shared/components/ui/Button';
import PageLoader from '../../../../shared/components/ui/PageLoader';
import { getUsers, updateUser, getPentests, updatePentest } from '../services/admin.service';
import { getPublicErrorMessage } from '../../../../shared/utils/errors/publicError';
import PublicError from '../../../../shared/components/ui/PublicError';
import '../styles/admin-dashboard.css';

const ROLE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'pentester', label: 'Pentester' },
  { value: 'admin', label: 'Admin' }
];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState('');
  const [pentests, setPentests] = useState([]);
  const [pentestEdits, setPentestEdits] = useState({});
  const [pentestSavingId, setPentestSavingId] = useState(null);
  const [editingPentestId, setEditingPentestId] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    const [usersRes, pentestsRes] = await Promise.all([getUsers(), getPentests()]);
    if (usersRes.success) {
      setUsers(usersRes.data || []);
    } else {
      setError(getPublicErrorMessage({ action: 'load', response: usersRes }));
    }
    if (pentestsRes.success) {
      setPentests(pentestsRes.data || []);
    } else if (!usersRes.success) {
      setError(getPublicErrorMessage({ action: 'load', response: pentestsRes }));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const startEdit = (user) => {
    setEditingId(user.id);
    setDrafts((prev) => ({
      ...prev,
      [user.id]: {
        name: user.name || '',
        email: user.email || '',
        organization: user.organization || '',
        role: user.role || 'student',
        bootcampStatus: user.bootcampStatus || 'not_enrolled',
        bootcampPaymentStatus: user.bootcampPaymentStatus || 'unpaid',
      }
    }));
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveUser = async (userId) => {
    const payload = drafts[userId];
    if (!payload) return;
    setSavingId(userId);
    const response = await updateUser(userId, payload);
    if (response.success) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? response.data : u)));
      setEditingId(null);
    } else {
      setError(getPublicErrorMessage({ action: 'save', response }));
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

  const startPentestEdit = (pentest) => {
    const id = pentest._id || pentest.id;
    setEditingPentestId(id);
    setPentestEdits((prev) => ({
      ...prev,
      [id]: {
        status: pentest.status || 'pending',
        assignedTo: pentest.assignedTo || '',
        reportAvailable: Boolean(pentest.metadata?.reportAvailable)
      }
    }));
  };

  const updatePentestDraft = (pentestId, field, value) => {
    setPentestEdits((prev) => ({
      ...prev,
      [pentestId]: {
        ...prev[pentestId],
        [field]: value
      }
    }));
  };

  const savePentest = async (pentestId) => {
    const payload = pentestEdits[pentestId];
    if (!payload) return;
    setPentestSavingId(pentestId);
    const response = await updatePentest(pentestId, payload);
    if (response.success) {
      setPentests((prev) => prev.map((p) => ((p._id || p.id) === pentestId ? response.data : p)));
    } else {
      setError(getPublicErrorMessage({ action: 'save', response }));
    }
    setEditingPentestId(null);
    setPentestSavingId(null);
  };

  const stats = useMemo(() => {
    const totals = users.reduce(
      (acc, user) => {
        acc.total += 1;
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      },
      { total: 0, student: 0, pentester: 0, admin: 0 }
    );
    return totals;
  }, [users]);

  if (loading) {
    return <PageLoader message="Loading admin console..." durationMs={0} />;
  }

  return (
    <div className="admin-dashboard">
      <div className="flex flex-col gap-5">
        <PublicError message={error} className="admin-alert" />

        <Card className="admin-card" padding="medium">
          {editingId && (
            <div className="admin-bulk-bar">
              <div className="admin-bulk-left">
                <FiUsers size={14} />
                <span>Editing user</span>
              </div>
              <div className="admin-bulk-actions">
                <Button
                  size="small"
                  variant="primary"
                  onClick={() => saveUser(editingId)}
                  disabled={savingId === editingId}
                >
                  <FiSave size={14} />
                  {savingId === editingId ? 'Saving...' : 'Save'}
                </Button>
                <Button size="small" variant="ghost" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
          <div className="admin-table">
            <div className="admin-row admin-row-header">
              <span>Name</span>
              <span>Email</span>
              <span>Organization</span>
              <span>Role</span>
              <span>Bootcamp</span>
              <span>Payment</span>
              <span>Actions</span>
            </div>

            {users.map((user) => {
              const isEditing = editingId === user.id;
              const draft = drafts[user.id] || {};
              return (
                <div key={user.id} className="admin-row admin-row-users-lite">
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
                  {isEditing ? (
                    <select
                      className="admin-select"
                      value={draft.bootcampPaymentStatus || 'unpaid'}
                      onChange={(e) => updateDraft(user.id, 'bootcampPaymentStatus', e.target.value)}
                    >
                      {['unpaid', 'pending', 'paid'].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="admin-role">{user.bootcampPaymentStatus || 'unpaid'}</span>
                  )}
                </div>
                <div className="admin-actions">
                  {!isEditing && (
                    <Button size="small" variant="ghost" onClick={() => startEdit(user)}>
                      <FiEdit2 size={14} />
                      Edit
                    </Button>
                  )}
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

        <Card className="admin-card" padding="medium">
          <div className="admin-section-header">
            <h2>Pentest Management</h2>
          </div>
          {editingPentestId && (
            <div className="admin-bulk-bar">
              <div className="admin-bulk-left">
                <FiShield size={14} />
                <span>Editing engagement</span>
              </div>
              <div className="admin-bulk-actions">
                <Button
                  size="small"
                  variant="primary"
                  onClick={() => savePentest(editingPentestId)}
                  disabled={pentestSavingId === editingPentestId}
                >
                  <FiSave size={14} />
                  {pentestSavingId === editingPentestId ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          )}
          <div className="admin-table">
            <div className="admin-row admin-row-header admin-row-pentests">
              <span>Target</span>
              <span>Status</span>
              <span>Assigned To</span>
              <span>Report</span>
              <span>Actions</span>
            </div>
            {pentests.map((pentest) => {
              const pentestId = pentest._id || pentest.id;
              const draft = pentestEdits[pentestId] || {};
              return (
                <div key={pentestId} className="admin-row admin-row-pentests">
                <span>{pentest.title || pentest.metadata?.target?.identifier || 'Untitled'}</span>
                <select
                  className="admin-select"
                  value={draft.status || pentest.status || 'pending'}
                  onChange={(e) => updatePentestDraft(pentestId, 'status', e.target.value)}
                >
                  {['pending', 'in-progress', 'completed', 'cancelled'].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <select
                  className="admin-select"
                  value={draft.assignedTo || pentest.assignedTo || ''}
                  onChange={(e) => updatePentestDraft(pentestId, 'assignedTo', e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {users
                    .filter((u) => u.role === 'pentester')
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.email}
                      </option>
                    ))}
                </select>
                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={draft.reportAvailable ?? Boolean(pentest.metadata?.reportAvailable)}
                    onChange={(e) => updatePentestDraft(pentestId, 'reportAvailable', e.target.checked)}
                  />
                  Ready
                </label>
                <div className="admin-actions">
                  <Button size="small" variant="ghost" onClick={() => startPentestEdit(pentest)}>
                    <FiEdit2 size={14} />
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="primary"
                    onClick={() => savePentest(pentestId)}
                    disabled={pentestSavingId === pentestId}
                  >
                    <FiSave size={14} />
                    {pentestSavingId === pentestId ? 'Saving...' : 'Save'}
                  </Button>
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

export default AdminDashboard;
