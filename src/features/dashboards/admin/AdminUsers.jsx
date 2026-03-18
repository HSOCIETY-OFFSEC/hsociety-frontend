import React, { useEffect, useMemo, useState } from 'react';
import { FiCheckSquare, FiEdit2, FiLink2, FiSave, FiSlash, FiUserX, FiUsers } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import PageLoader from '../../../shared/components/ui/PageLoader';
import { getUsers, updateUser, muteUser, sendBootcampRoomLink } from './admin.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import PublicError from '../../../shared/components/ui/PublicError';
import { HACKER_PROTOCOL_PHASES } from '../../../data/bootcamps/hackerProtocolData';
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
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [roomForm, setRoomForm] = useState(() => ({
    moduleId: HACKER_PROTOCOL_PHASES[0]?.moduleId || 1,
    roomId: HACKER_PROTOCOL_PHASES[0]?.rooms?.[0]?.roomId || 1,
    title: '',
    instructor: 'Admin',
    time: '',
    meetUrl: ''
  }));

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    const response = await getUsers();
    if (response.success) {
      setUsers(response.data || []);
    } else {
      setError(getPublicErrorMessage({ action: 'load', response }));
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
        bootcampStatus: user.bootcampStatus || 'not_enrolled',
        bootcampPaymentStatus: user.bootcampPaymentStatus || 'unpaid',
        bootcampAccess: Boolean(user.bootcampAccess),
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

  const selectedUsers = useMemo(
    () => users.filter((user) => selectedIds.has(user.id)),
    [users, selectedIds]
  );

  const selectedStudentIds = useMemo(
    () => selectedUsers.filter((user) => user.role === 'student').map((user) => user.id),
    [selectedUsers]
  );

  const toggleSelect = (userId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const selectAllStudents = () => {
    setSelectedIds(new Set(users.filter((user) => user.role === 'student').map((user) => user.id)));
  };

  const selectPaidStudents = () => {
    const paid = users
      .filter((user) => user.role === 'student' && user.bootcampPaymentStatus === 'paid')
      .map((user) => user.id);
    setSelectedIds(new Set(paid));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const bulkUpdateUsers = async (updates) => {
    if (!selectedStudentIds.length) {
      setBulkStatus('Select at least one student.');
      return;
    }
    setBulkLoading(true);
    setBulkStatus('');
    const responses = await Promise.all(
      selectedStudentIds.map((userId) => updateUser(userId, updates))
    );
    const successIds = responses
      .map((response, index) => (response.success ? selectedStudentIds[index] : null))
      .filter(Boolean);
    if (successIds.length) {
      setUsers((prev) =>
        prev.map((user) =>
          successIds.includes(user.id)
            ? { ...user, ...updates }
            : user
        )
      );
    }
    setBulkStatus(
      successIds.length
        ? `Updated ${successIds.length} student${successIds.length === 1 ? '' : 's'}.`
        : 'No updates were applied.'
    );
    setBulkLoading(false);
  };

  const handleSendRoomLink = async () => {
    if (!selectedStudentIds.length) {
      setBulkStatus('Select at least one student.');
      return;
    }
    if (!roomForm.meetUrl) {
      setBulkStatus('Add a live class link before sending.');
      return;
    }
    setBulkLoading(true);
    setBulkStatus('');
    const response = await sendBootcampRoomLink({
      title: roomForm.title || 'Live Class',
      message: `Room ${roomForm.roomId} live session link is now available.`,
      audience: 'custom',
      userIds: selectedStudentIds,
      metadata: {
        moduleId: roomForm.moduleId,
        roomId: roomForm.roomId,
        meetUrl: roomForm.meetUrl,
        instructor: roomForm.instructor,
        time: roomForm.time,
        title: roomForm.title
      }
    });
    if (response.success) {
      setBulkStatus(`Live class link sent to ${response.data?.sentCount || selectedStudentIds.length} students.`);
    } else {
      setBulkStatus(getPublicErrorMessage({ action: 'submit', response }));
    }
    setBulkLoading(false);
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
        <PublicError message={error} className="admin-alert" />
        {bulkStatus && <div className="admin-alert">{bulkStatus}</div>}

        <Card className="admin-card" padding="medium">
          <div className="admin-bulk-bar">
            <div className="admin-bulk-left">
              <strong>{selectedIds.size}</strong>
              <span>selected</span>
            </div>
            <div className="admin-bulk-actions">
              <Button size="small" variant="ghost" onClick={selectAllStudents}>
                Select All Students
              </Button>
              <Button size="small" variant="ghost" onClick={selectPaidStudents}>
                Select Paid Students
              </Button>
              <Button size="small" variant="ghost" onClick={clearSelection}>
                Clear
              </Button>
              <Button
                size="small"
                variant="secondary"
                onClick={() => bulkUpdateUsers({ bootcampAccess: true, bootcampStatus: 'active' })}
                disabled={bulkLoading}
              >
                <FiCheckSquare size={14} />
                Grant Bootcamp Access
              </Button>
              <Button
                size="small"
                variant="ghost"
                onClick={() => bulkUpdateUsers({ bootcampAccess: false, bootcampStatus: 'enrolled' })}
                disabled={bulkLoading}
              >
                <FiSlash size={14} />
                Revoke Access
              </Button>
            </div>
          </div>

          <div className="admin-bulk-room">
            <div className="admin-bulk-room-form">
              <label>
                Module
                <select
                  className="admin-select"
                  value={roomForm.moduleId}
                  onChange={(e) => {
                    const nextModuleId = Number(e.target.value);
                    const nextModule = HACKER_PROTOCOL_PHASES.find((phase) => phase.moduleId === nextModuleId);
                    setRoomForm((prev) => ({
                      ...prev,
                      moduleId: nextModuleId,
                      roomId: nextModule?.rooms?.[0]?.roomId || prev.roomId
                    }));
                  }}
                >
                  {HACKER_PROTOCOL_PHASES.map((phase) => (
                    <option key={phase.moduleId} value={phase.moduleId}>
                      Phase {phase.moduleId}: {phase.codename}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Room
                <select
                  className="admin-select"
                  value={roomForm.roomId}
                  onChange={(e) => setRoomForm((prev) => ({ ...prev, roomId: Number(e.target.value) }))}
                >
                  {(HACKER_PROTOCOL_PHASES.find((phase) => phase.moduleId === roomForm.moduleId)?.rooms || []).map(
                    (room) => (
                      <option key={room.roomId} value={room.roomId}>
                        Room {room.roomId}: {room.title}
                      </option>
                    )
                  )}
                </select>
              </label>
              <label>
                Class Title
                <input
                  className="admin-input"
                  value={roomForm.title}
                  onChange={(e) => setRoomForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              </label>
              <label>
                Instructor
                <input
                  className="admin-input"
                  value={roomForm.instructor}
                  onChange={(e) => setRoomForm((prev) => ({ ...prev, instructor: e.target.value }))}
                />
              </label>
              <label>
                Time
                <input
                  className="admin-input"
                  value={roomForm.time}
                  onChange={(e) => setRoomForm((prev) => ({ ...prev, time: e.target.value }))}
                />
              </label>
              <label>
                Live Class Link
                <input
                  className="admin-input"
                  value={roomForm.meetUrl}
                  onChange={(e) => setRoomForm((prev) => ({ ...prev, meetUrl: e.target.value }))}
                />
              </label>
            </div>
            <Button
              size="small"
              variant="primary"
              onClick={handleSendRoomLink}
              disabled={bulkLoading}
            >
              <FiLink2 size={14} />
              Send Room Link to Selected
            </Button>
          </div>

          <div className="admin-table">
            <div className="admin-row admin-row-header admin-row-users">
              <span>Select</span>
              <span>Name</span>
              <span>Email</span>
              <span>Organization</span>
              <span>Role</span>
              <span>Bootcamp</span>
              <span>Payment</span>
              <span>Access</span>
              <span>Mute</span>
              <span>Actions</span>
            </div>

            {users.map((user) => {
              const isEditing = editingId === user.id;
              const draft = drafts[user.id] || {};
              return (
                <div key={user.id} className="admin-row admin-row-users">
                  <div className="admin-select-cell">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(user.id)}
                      onChange={() => toggleSelect(user.id)}
                    />
                  </div>
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
                        {['not_enrolled', 'enrolled', 'active', 'completed'].map((status) => (
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
                <div>
                  {isEditing ? (
                    <select
                      className="admin-select"
                      value={draft.bootcampAccess ? 'granted' : 'blocked'}
                      onChange={(e) => updateDraft(user.id, 'bootcampAccess', e.target.value === 'granted')}
                    >
                      <option value="granted">granted</option>
                      <option value="blocked">blocked</option>
                    </select>
                  ) : (
                    <span className="admin-role">{user.bootcampAccess ? 'granted' : 'blocked'}</span>
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
