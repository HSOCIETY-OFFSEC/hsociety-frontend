import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiEdit2, FiSave, FiShield, FiUsers } from 'react-icons/fi';
import Card from '../../../../shared/components/ui/Card';
import Button from '../../../../shared/components/ui/Button';
import PageLoader from '../../../../shared/components/ui/PageLoader';
import { getUsers, updateUser, getPentests, updatePentest } from '../services/admin.service';
import { getPublicErrorMessage } from '../../../../shared/utils/errors/publicError';
import PublicError from '../../../../shared/components/ui/PublicError';

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
  <div className="min-h-[calc(100vh-60px)] w-full px-[clamp(1rem,3vw,1.5rem)] pt-[clamp(1.25rem,3vw,2rem)] pb-16 text-text-primary">
   <div className="flex flex-col gap-6">
    <PublicError
     message={error}
     className="mb-0 flex items-center gap-3 rounded-sm border border-[color-mix(in_srgb,#ef4444_30%,var(--border-color))] bg-[color-mix(in_srgb,#ef4444_8%,var(--card-bg))] px-4 py-3 text-sm text-[color-mix(in_srgb,#ef4444_80%,var(--text-primary))]"
    />

    <Card
     className="card-plain"
     padding="medium"
     shadow="none"
    >
     {editingId && (
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border bg-[color-mix(in_srgb,var(--bg-secondary)_70%,var(--card-bg))] px-4 py-3">
       <div className="flex items-center gap-2 text-sm text-text-secondary">
        <FiUsers size={14} />
        <span>Editing user</span>
       </div>
       <div className="flex flex-wrap items-center justify-end gap-2">
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
     <div className="flex flex-col gap-2 overflow-x-auto">
      <div className="hidden min-w-0 grid-cols-[1.2fr_1.6fr_1.2fr_0.8fr_0.9fr_0.8fr_1.2fr] items-center gap-3 rounded-md border border-dashed border-border bg-[color-mix(in_srgb,var(--bg-secondary)_70%,var(--card-bg))] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-text-tertiary md:grid lg:grid-cols-[1.2fr_1.6fr_1.2fr_0.8fr_0.9fr_0.8fr_1.2fr] md:grid-cols-[1.2fr_1.6fr_1.2fr_0.8fr_0.9fr_1.2fr]">
       <span>Name</span>
       <span>Email</span>
       <span>Organization</span>
       <span>Role</span>
       <span>Bootcamp</span>
       <span className="hidden lg:block">Payment</span>
       <span>Actions</span>
      </div>

      {users.map((user) => {
       const isEditing = editingId === user.id;
       const draft = drafts[user.id] || {};
       return (
        <div
         key={user.id}
         className="grid min-w-0 grid-cols-1 gap-2 rounded-md border border-border bg-bg-secondary px-3 py-3 text-sm md:grid-cols-[1.2fr_1.6fr_1.2fr_0.8fr_0.9fr_1.2fr] md:gap-3 lg:grid-cols-[1.2fr_1.6fr_1.2fr_0.8fr_0.9fr_0.8fr_1.2fr]"
        >
         <div className="min-w-0">
         {isEditing ? (
          <input
           className="w-full rounded-sm border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-text-primary transition focus:border-[color-mix(in_srgb,var(--text-primary)_30%,var(--border-color))] focus:bg-[var(--input-bg-focus)] focus:outline-none"
           value={draft.name || ''}
           onChange={(e) => updateDraft(user.id, 'name', e.target.value)}
          />
         ) : (
          <span className="block truncate">{user.name || '—'}</span>
         )}
        </div>
         <div className="min-w-0">
         {isEditing ? (
          <input
           className="w-full rounded-sm border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-text-primary transition focus:border-[color-mix(in_srgb,var(--text-primary)_30%,var(--border-color))] focus:bg-[var(--input-bg-focus)] focus:outline-none"
           value={draft.email || ''}
           onChange={(e) => updateDraft(user.id, 'email', e.target.value)}
          />
         ) : (
          <span className="block truncate">{user.email}</span>
         )}
        </div>
         <div className="min-w-0">
         {isEditing ? (
          <input
           className="w-full rounded-sm border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-text-primary transition focus:border-[color-mix(in_srgb,var(--text-primary)_30%,var(--border-color))] focus:bg-[var(--input-bg-focus)] focus:outline-none"
           value={draft.organization || ''}
           onChange={(e) => updateDraft(user.id, 'organization', e.target.value)}
          />
         ) : (
          <span className="block truncate">{user.organization || '—'}</span>
         )}
        </div>
         <div className="min-w-0">
         {isEditing ? (
          <select
           className="w-full rounded-sm border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-text-primary transition focus:border-[color-mix(in_srgb,var(--text-primary)_30%,var(--border-color))] focus:bg-[var(--input-bg-focus)] focus:outline-none"
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
          <span className="inline-flex items-center rounded-full border border-border bg-[color-mix(in_srgb,var(--border-color)_60%,var(--card-bg))] px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-text-tertiary">
           {user.role || 'student'}
          </span>
         )}
        </div>
         <div className="min-w-0">
         {isEditing ? (
          <select
           className="w-full rounded-sm border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-text-primary transition focus:border-[color-mix(in_srgb,var(--text-primary)_30%,var(--border-color))] focus:bg-[var(--input-bg-focus)] focus:outline-none"
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
          <span className="inline-flex items-center rounded-full border border-border bg-[color-mix(in_srgb,var(--border-color)_60%,var(--card-bg))] px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-text-tertiary">
           {(user.bootcampStatus || 'not_enrolled').replace('_', ' ')}
          </span>
         )}
        </div>
         <div className="min-w-0 hidden lg:block">
         {isEditing ? (
          <select
           className="w-full rounded-sm border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-text-primary transition focus:border-[color-mix(in_srgb,var(--text-primary)_30%,var(--border-color))] focus:bg-[var(--input-bg-focus)] focus:outline-none"
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
          <span className="inline-flex items-center rounded-full border border-border bg-[color-mix(in_srgb,var(--border-color)_60%,var(--card-bg))] px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-text-tertiary">
           {user.bootcampPaymentStatus || 'unpaid'}
          </span>
         )}
        </div>
         <div className="flex w-full min-w-0 flex-wrap items-center justify-end gap-2 [&>*]:flex-1 sm:w-auto sm:[&>*]:flex-none">
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

    <Card
     className="card-plain"
     padding="medium"
     shadow="none"
    >
     <div className="mb-4 flex flex-col gap-1.5">
      <h2 className="text-base font-semibold text-text-primary">Pentest Management</h2>
     </div>
     {editingPentestId && (
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border bg-[color-mix(in_srgb,var(--bg-secondary)_70%,var(--card-bg))] px-4 py-3">
       <div className="flex items-center gap-2 text-sm text-text-secondary">
        <FiShield size={14} />
        <span>Editing engagement</span>
       </div>
       <div className="flex flex-wrap items-center justify-end gap-2">
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
     <div className="flex flex-col gap-2 overflow-x-auto">
      <div className="hidden min-w-0 grid-cols-[1.6fr_0.9fr_1fr_0.6fr_1.2fr] items-center gap-3 rounded-md border border-dashed border-border bg-[color-mix(in_srgb,var(--bg-secondary)_70%,var(--card-bg))] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-text-tertiary md:grid">
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
        <div
         key={pentestId}
         className="grid min-w-0 grid-cols-1 gap-2 rounded-md border border-border bg-bg-secondary px-3 py-3 text-sm md:grid-cols-[1.6fr_0.9fr_1fr_0.6fr_1.2fr] md:gap-3"
        >
         <span className="block truncate">{pentest.title || pentest.metadata?.target?.identifier || 'Untitled'}</span>
         <select
          className="w-full rounded-sm border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-text-primary transition focus:border-[color-mix(in_srgb,var(--text-primary)_30%,var(--border-color))] focus:bg-[var(--input-bg-focus)] focus:outline-none"
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
          className="w-full rounded-sm border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-text-primary transition focus:border-[color-mix(in_srgb,var(--text-primary)_30%,var(--border-color))] focus:bg-[var(--input-bg-focus)] focus:outline-none"
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
         <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
          <input
           type="checkbox"
           checked={draft.reportAvailable ?? Boolean(pentest.metadata?.reportAvailable)}
           onChange={(e) => updatePentestDraft(pentestId, 'reportAvailable', e.target.checked)}
          />
          Ready
         </label>
         <div className="flex w-full min-w-0 flex-wrap items-center justify-end gap-2 [&>*]:flex-1 sm:w-auto sm:[&>*]:flex-none">
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
