import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiCheckSquare, FiEdit2, FiLink2, FiSave, FiSlash, FiUserX, FiUsers, FiZap } from 'react-icons/fi';
import Button from '../../../../shared/components/ui/Button';
import TableSkeleton from '../../../../shared/components/ui/TableSkeleton';
import { getUsers, updateUser, muteUser, sendBootcampRoomLink, grantCpPoints } from '../services/admin.service';
import { getPublicErrorMessage } from '../../../../shared/utils/errors/publicError';
import PublicError from '../../../../shared/components/ui/PublicError';
import { HACKER_PROTOCOL_PHASES } from '../../../../data/static/bootcamps/hackerProtocolData';

const ROLE_OPTIONS = [
 { value: 'student', label: 'Student' },
 { value: 'pentester', label: 'Pentester' },
 { value: 'corporate', label: 'Corporate' },
 { value: 'admin', label: 'Admin' }
];

const alertClassName =
 'flex items-center gap-3 rounded-sm border border-[color-mix(in_srgb,#ef4444_30%,var(--border-color))] bg-[color-mix(in_srgb,#ef4444_8%,var(--card-bg))] px-4 py-3 text-sm text-[color-mix(in_srgb,#ef4444_80%,var(--text-primary))]';

const inputClassName =
 'w-full rounded-sm border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-text-primary transition focus:border-[color-mix(in_srgb,var(--text-primary)_30%,var(--border-color))] focus:bg-[var(--input-bg-focus)] focus:outline-none';

const textareaClassName =
 'w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary transition focus:border-[color-mix(in_srgb,var(--text-primary)_30%,var(--border-color))] focus:bg-bg-tertiary focus:outline-none';

const pillClassName =
 'inline-flex items-center rounded-full border border-border bg-[color-mix(in_srgb,var(--border-color)_60%,var(--card-bg))] px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-text-tertiary';

const warningFlagClassName =
 'inline-flex items-center rounded-full border border-status-orange/40 bg-status-orange/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-widest text-status-orange';

const AdminUsers = () => {
 const [loading, setLoading] = useState(true);
 const [users, setUsers] = useState([]);
 const [page, setPage] = useState(0);
 const pageSize = 10;
 const [editingId, setEditingId] = useState(null);
 const [drafts, setDrafts] = useState({});
 const [savingId, setSavingId] = useState(null);
 const [error, setError] = useState('');
 const [selectedIds, setSelectedIds] = useState(new Set());
 const [bulkStatus, setBulkStatus] = useState('');
 const [bulkLoading, setBulkLoading] = useState(false);
 const [cpGrantOpen, setCpGrantOpen] = useState(false);
 const [cpGrantPoints, setCpGrantPoints] = useState(0);
 const [cpGrantReason, setCpGrantReason] = useState('');
 const [cpGrantStatus, setCpGrantStatus] = useState('');
 const [roomForm, setRoomForm] = useState(() => ({
  moduleId: HACKER_PROTOCOL_PHASES[0]?.moduleId || 1,
  roomId: HACKER_PROTOCOL_PHASES[0]?.rooms?.[0]?.roomId || 1,
  title: '',
  instructor: 'Admin',
  time: '',
  meetUrl: ''
 }));

 const loadUsers = useCallback(async () => {
  setLoading(true);
  setError('');
  const response = await getUsers();
  if (response.success) {
   setUsers(response.data || []);
  } else {
   setError(getPublicErrorMessage({ action: 'load', response }));
  }
  setLoading(false);
 }, []);

 useEffect(() => { loadUsers(); }, [loadUsers]);
 useEffect(() => {
  setPage(0);
 }, [users.length]);

 const pageCount = Math.max(1, Math.ceil(users.length / pageSize));
 const pagedUsers = users.slice(page * pageSize, page * pageSize + pageSize);
 const goPrev = () => setPage((p) => Math.max(0, p - 1));
 const goNext = () => setPage((p) => Math.min(pageCount - 1, p + 1));
 const displayName = (name) => {
  if (!name) return '—';
  const first = String(name).trim().split(/\s+/)[0];
  return first || name;
 };

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
    bootcampAccessRevoked: Boolean(user.bootcampAccessRevoked),
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
   [userId]: { ...prev[userId], [field]: value }
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

 const selectedCpIds = useMemo(
  () => selectedUsers
   .filter((user) => user.role === 'student' || user.role === 'pentester')
   .map((user) => user.id),
  [selectedUsers]
 );

 const toggleSelect = (userId) => {
  setSelectedIds((prev) => {
   const next = new Set(prev);
   if (next.has(userId)) next.delete(userId);
   else next.add(userId);
   return next;
  });
 };

 const selectAllStudents = () =>
  setSelectedIds(new Set(users.filter((u) => u.role === 'student').map((u) => u.id)));

 const selectPaidStudents = () =>
  setSelectedIds(new Set(
   users.filter((u) => u.role === 'student' && u.bootcampPaymentStatus === 'paid').map((u) => u.id)
  ));

 const clearSelection = () => setSelectedIds(new Set());

 const bulkUpdateUsers = async (updates) => {
  if (!selectedStudentIds.length) { setBulkStatus('Select at least one student.'); return; }
  setBulkLoading(true);
  setBulkStatus('');
  const responses = await Promise.all(selectedStudentIds.map((id) => updateUser(id, updates)));
  const successIds = responses
   .map((res, i) => (res.success ? selectedStudentIds[i] : null))
   .filter(Boolean);
  if (successIds.length) {
   setUsers((prev) => prev.map((u) => successIds.includes(u.id) ? { ...u, ...updates } : u));
  }
  setBulkStatus(successIds.length
   ? `Updated ${successIds.length} student${successIds.length === 1 ? '' : 's'}.`
   : 'No updates were applied.');
  setBulkLoading(false);
 };

 const handleSendRoomLink = async () => {
  if (!selectedStudentIds.length) { setBulkStatus('Select at least one student.'); return; }
  if (!roomForm.meetUrl) { setBulkStatus('Add a live class link before sending.'); return; }
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

 const handleGrantCp = async () => {
  if (!selectedCpIds.length) {
   setCpGrantStatus('Select at least one student or pentester.');
   return;
  }
  if (!cpGrantPoints || cpGrantPoints <= 0) {
   setCpGrantStatus('Enter a positive CP amount.');
   return;
  }
  setCpGrantStatus('');
  setBulkLoading(true);
  const response = await grantCpPoints({
   userIds: selectedCpIds,
   points: Number(cpGrantPoints || 0),
   reason: cpGrantReason,
  });
  if (response.success) {
   setCpGrantStatus(`Granted ${cpGrantPoints} CP to ${response.data?.sentCount || selectedCpIds.length} users.`);
   await loadUsers();
   setCpGrantOpen(false);
   setCpGrantPoints(0);
   setCpGrantReason('');
  } else {
   setCpGrantStatus(getPublicErrorMessage({ action: 'submit', response }));
  }
  setBulkLoading(false);
 };

 const stats = useMemo(() => users.reduce(
  (acc, u) => { acc.total += 1; acc[u.role] = (acc[u.role] || 0) + 1; return acc; },
  { total: 0, student: 0, pentester: 0, corporate: 0, admin: 0 }
 ), [users]);

 if (loading) {
  return (
   <div className="min-h-[calc(100vh-60px)] w-full px-[clamp(1rem,3vw,1.5rem)] pt-[clamp(1.25rem,3vw,2rem)] pb-16 text-text-primary">
    <div className="mt-5">
     <TableSkeleton rows={10} columns={6} />
    </div>
   </div>
  );
 }

 return (
  <div className="min-h-[calc(100vh-60px)] w-full px-[clamp(1rem,3vw,1.5rem)] pt-[clamp(1.25rem,3vw,2rem)] pb-16 text-text-primary">
   {/* Page header */}
   <header className="mb-6 flex flex-col gap-3 border-b border-border pb-5">
    <div className="flex flex-wrap items-center justify-between gap-6">
     <div className="flex items-center gap-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-border bg-bg-secondary">
       <FiUsers size={20} className="text-brand" />
      </div>
      <div>
       <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-text-tertiary">
        <span className="font-semibold text-text-secondary">HSOCIETY</span>
        <span className="text-text-tertiary">/</span>
        <span className="font-semibold text-text-secondary">users</span>
        <span className="rounded-full border border-border bg-bg-secondary px-2 py-0.5 text-xs font-semibold text-text-secondary">
         Admin
        </span>
       </div>
       <p className="mt-1 text-sm text-text-secondary">Manage roles, bootcamp access, and send live class links.</p>
      </div>
     </div>
    </div>
    <div className="flex flex-wrap gap-2">
     <span className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-2.5 py-1 text-xs text-text-secondary">
      <FiUsers size={13} className="text-text-tertiary" />
      <span className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">Total</span>
      <strong className="font-semibold text-text-primary">{stats.total}</strong>
     </span>
     <span className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-2.5 py-1 text-xs text-text-secondary">
      <span className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">Students</span>
      <strong className="font-semibold text-text-primary">{stats.student}</strong>
     </span>
     <span className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-2.5 py-1 text-xs text-text-secondary">
      <span className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">Pentesters</span>
      <strong className="font-semibold text-text-primary">{stats.pentester}</strong>
     </span>
     <span className="inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-2.5 py-1 text-xs text-text-secondary">
      <span className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">Corporate</span>
      <strong className="font-semibold text-text-primary">{stats.corporate}</strong>
     </span>
    </div>
   </header>

   <div className="mt-5">
    <PublicError message={error} className={`${alertClassName} mb-4`} />
    {bulkStatus && <div className={`${alertClassName} mb-4`}>{bulkStatus}</div>}

    {/* Bulk action toolbar */}
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3 py-2">
     <div className="flex flex-wrap items-center gap-2">
      <span className="border-r border-border pr-2 text-sm text-text-secondary">
       <strong>{selectedIds.size}</strong> selected
      </span>
      <Button type="button" variant="ghost" size="small" onClick={selectAllStudents}>
       All Students
      </Button>
      <Button type="button" variant="ghost" size="small" onClick={selectPaidStudents}>
       Paid Students
      </Button>
      <Button type="button" variant="ghost" size="small" onClick={clearSelection}>
       Clear
      </Button>
     </div>
     <div className="flex flex-wrap items-center gap-2">
      <Button
       type="button"
       variant="secondary"
       size="small"
       onClick={() => bulkUpdateUsers({ bootcampAccessRevoked: false, bootcampStatus: 'active' })}
       disabled={bulkLoading}
      >
       <FiCheckSquare size={14} /> Grant Access
      </Button>
      <Button
       type="button"
       variant="ghost"
       size="small"
       onClick={() => bulkUpdateUsers({ bootcampAccessRevoked: true, bootcampStatus: 'enrolled' })}
       disabled={bulkLoading}
      >
       <FiSlash size={14} /> Revoke Access
      </Button>
      <Button
       type="button"
       variant="primary"
       size="small"
       onClick={() => setCpGrantOpen(true)}
       disabled={bulkLoading}
      >
       <FiZap size={14} /> Grant CP
      </Button>
     </div>
    </div>

    {/* Live class link sender */}
    <details className="mb-4 overflow-hidden rounded-sm border border-border bg-bg-secondary">
     <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary [&::-webkit-details-marker]:hidden">
      <FiLink2 size={14} /> Send Live Class Link to Selected Students
     </summary>
     <div className="flex flex-col gap-3 border-t border-border px-4 pb-4 pt-3">
      <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]">
       <label className="flex flex-col gap-2 text-sm text-text-secondary">
        Module
        <select
         className={inputClassName}
         value={roomForm.moduleId}
         onChange={(e) => {
          const nextModuleId = Number(e.target.value);
          const nextModule = HACKER_PROTOCOL_PHASES.find((p) => p.moduleId === nextModuleId);
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
       <label className="flex flex-col gap-2 text-sm text-text-secondary">
        Room
        <select
         className={inputClassName}
         value={roomForm.roomId}
         onChange={(e) => setRoomForm((prev) => ({ ...prev, roomId: Number(e.target.value) }))}
        >
         {(HACKER_PROTOCOL_PHASES.find((p) => p.moduleId === roomForm.moduleId)?.rooms || []).map((room) => (
          <option key={room.roomId} value={room.roomId}>
           Room {room.roomId}: {room.title}
          </option>
         ))}
        </select>
       </label>
       <label className="flex flex-col gap-2 text-sm text-text-secondary">
        Class Title
        <input className={inputClassName} value={roomForm.title}
         onChange={(e) => setRoomForm((prev) => ({ ...prev, title: e.target.value }))} />
       </label>
       <label className="flex flex-col gap-2 text-sm text-text-secondary">
        Instructor
        <input className={inputClassName} value={roomForm.instructor}
         onChange={(e) => setRoomForm((prev) => ({ ...prev, instructor: e.target.value }))} />
       </label>
       <label className="flex flex-col gap-2 text-sm text-text-secondary">
        Time
        <input className={inputClassName} value={roomForm.time}
         onChange={(e) => setRoomForm((prev) => ({ ...prev, time: e.target.value }))} />
       </label>
       <label className="flex flex-col gap-2 text-sm text-text-secondary">
        Live Class Link
        <input className={inputClassName} value={roomForm.meetUrl}
         onChange={(e) => setRoomForm((prev) => ({ ...prev, meetUrl: e.target.value }))} />
       </label>
      </div>
      <Button
       type="button"
       variant="primary"
       size="small"
       onClick={handleSendRoomLink}
       disabled={bulkLoading}
      >
       <FiLink2 size={14} /> Send to Selected
      </Button>
     </div>
    </details>

    {/* Users table */}
    <div className="overflow-x-auto rounded-sm border border-border">
     <div className="grid min-w-[1160px] grid-cols-[0.4fr_1.2fr_1.6fr_1fr_0.8fr_0.7fr_0.9fr_0.8fr_0.7fr_0.9fr_0.7fr_1.6fr] items-center gap-3 border-b border-border bg-bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-text-tertiary">
      <span />
      <span>Name</span>
      <span>Email</span>
      <span>Org</span>
      <span>Role</span>
      <span>CP</span>
      <span>Bootcamp</span>
      <span>Payment</span>
      <span>Access</span>
      <span>Key</span>
      <span>Mute</span>
      <span>Actions</span>
     </div>

     {pagedUsers.map((user) => {
      const isEditing = editingId === user.id;
      const draft = drafts[user.id] || {};
      const isMuted = user.mutedUntil && new Date(user.mutedUntil) > new Date();
      return (
       <div
        key={user.id}
        className={`grid min-w-[1160px] grid-cols-[0.4fr_1.2fr_1.6fr_1fr_0.8fr_0.7fr_0.9fr_0.8fr_0.7fr_0.9fr_0.7fr_1.6fr] items-center gap-3 border-b border-border px-4 py-3 text-sm transition-colors hover:bg-bg-secondary ${
         isEditing ? 'bg-[color-mix(in_srgb,var(--primary-color)_4%,var(--bg-secondary))]' : 'bg-bg-primary'
        }`}
       >
        <div>
         <input
          type="checkbox"
          checked={selectedIds.has(user.id)}
          onChange={() => toggleSelect(user.id)}
         />
        </div>
        <div>
         {isEditing ? (
          <input className={inputClassName} value={draft.name || ''}
           onChange={(e) => updateDraft(user.id, 'name', e.target.value)} />
         ) : (
          <span className="block truncate font-semibold text-text-primary" title={user.name || '—'}>
           {displayName(user.name)}
          </span>
         )}
        </div>
        <div>
         {isEditing ? (
          <input className={inputClassName} value={draft.email || ''}
           onChange={(e) => updateDraft(user.id, 'email', e.target.value)} />
         ) : (
          <span className="block truncate text-text-secondary" title={user.email}>
           {user.email}
          </span>
         )}
        </div>
        <div>
         {isEditing ? (
          <input className={inputClassName} value={draft.organization || ''}
           onChange={(e) => updateDraft(user.id, 'organization', e.target.value)} />
         ) : (
          <span className="block truncate" title={user.organization || '—'}>
           {user.organization || '—'}
          </span>
         )}
        </div>
        <div>
         {isEditing ? (
          <select className={inputClassName} value={draft.role || 'student'}
           onChange={(e) => updateDraft(user.id, 'role', e.target.value)}>
           {ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
         ) : (
          <span className={pillClassName}>{user.role || 'student'}</span>
         )}
        </div>
        <div>
         <span className={pillClassName}>{user.cpPoints ?? 0}</span>
        </div>
        <div>
         {isEditing ? (
          <select className={inputClassName} value={draft.bootcampStatus || 'not_enrolled'}
           onChange={(e) => updateDraft(user.id, 'bootcampStatus', e.target.value)}>
           {['not_enrolled', 'enrolled', 'active', 'completed'].map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
           ))}
          </select>
         ) : (
          <span className={pillClassName}>{(user.bootcampStatus || 'not_enrolled').replace('_', ' ')}</span>
         )}
        </div>
        <div>
         {isEditing ? (
          <select className={inputClassName} value={draft.bootcampPaymentStatus || 'unpaid'}
           onChange={(e) => updateDraft(user.id, 'bootcampPaymentStatus', e.target.value)}>
           {['unpaid', 'pending', 'paid'].map((s) => (
            <option
             key={s}
             value={s}
             disabled={draft.bootcampAccessRevoked === true && s === 'paid'}
            >
             {s}
            </option>
           ))}
          </select>
         ) : (
          <span className={pillClassName}>{user.bootcampPaymentStatus || 'unpaid'}</span>
         )}
        </div>
        <div>
         {isEditing ? (
          <select className={inputClassName}
           value={draft.bootcampAccessRevoked ? 'revoked' : 'allowed'}
           onChange={(e) => updateDraft(user.id, 'bootcampAccessRevoked', e.target.value === 'revoked')}>
           <option value="allowed">allowed</option>
           <option value="revoked">revoked</option>
          </select>
         ) : (
          <div className="inline-flex flex-wrap items-center gap-2">
           <span className={pillClassName}>{user.bootcampAccessRevoked ? 'revoked' : 'allowed'}</span>
           {user.bootcampAccessRevoked === true && (
            <span className={warningFlagClassName}>Revoked</span>
           )}
          </div>
         )}
        </div>
        <div>
         <span className={pillClassName}>{user.bootcampAccessKey || '—'}</span>
        </div>
        <div>
         <span className={pillClassName}>{isMuted ? 'Muted' : 'Active'}</span>
        </div>
        <div className="flex w-full min-w-0 flex-wrap items-center justify-end gap-2 [&>*]:flex-1 sm:w-auto sm:[&>*]:flex-none">
         {!isEditing && (
          <Button size="small" variant="ghost" onClick={() => startEdit(user)}>
           <FiEdit2 size={14} /> Edit
          </Button>
         )}
         <Button
          size="small"
          variant="ghost"
          onClick={async () => {
           const minutes = isMuted ? 0 : 60;
           const response = await muteUser(user.id, minutes);
           if (response.success) {
            setUsers((prev) => prev.map((u) =>
             u.id === user.id ? { ...u, mutedUntil: response.data.mutedUntil } : u
            ));
           }
          }}
         >
          <FiUserX size={14} /> {isMuted ? 'Unmute' : 'Mute 1h'}
         </Button>
         {isEditing && (
          <>
           <Button size="small" variant="primary" onClick={() => saveUser(user.id)} disabled={savingId === user.id}>
            <FiSave size={14} /> {savingId === user.id ? 'Saving...' : 'Save'}
           </Button>
           <Button size="small" variant="ghost" onClick={cancelEdit}>Cancel</Button>
          </>
         )}
        </div>
       </div>
      );
     })}

     {users.length === 0 && (
      <div className="bg-bg-primary px-4 py-6 text-center text-sm text-text-tertiary">No users found.</div>
     )}
    </div>
    <div className="mt-4 flex items-center justify-between text-xs text-text-tertiary">
     <span>
      Showing {users.length === 0 ? 0 : page * pageSize + 1}–{Math.min((page + 1) * pageSize, users.length)} of {users.length}
     </span>
     <div className="flex items-center gap-2">
      <Button size="small" variant="ghost" onClick={goPrev} disabled={page === 0}>
       Prev
      </Button>
      <span className="px-2">{page + 1} / {pageCount}</span>
      <Button size="small" variant="ghost" onClick={goNext} disabled={page >= pageCount - 1}>
       Next
      </Button>
     </div>
    </div>
    {cpGrantOpen && (
     <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-[var(--modal-overlay-bg)] p-6 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="flex w-[min(520px,92vw)] flex-col gap-4 card-plain p-6 shadow-xl">
       <h3 className="text-base font-semibold text-text-primary">Grant CP Points</h3>
       <p className="text-sm text-text-secondary">Grant CP Points to selected students/pentesters. Add a reason to notify them.</p>
       {cpGrantStatus && <div className={`${alertClassName} mb-2`}>{cpGrantStatus}</div>}
       <label className="flex flex-col gap-2 text-sm text-text-secondary">
        CP Points
        <input
         className={inputClassName}
         type="number"
         min="1"
         value={cpGrantPoints}
         onChange={(e) => setCpGrantPoints(Number(e.target.value))}
        />
       </label>
       <label className="flex flex-col gap-2 text-sm text-text-secondary">
        Reason / Message
        <textarea
         className={textareaClassName}
         rows={3}
         value={cpGrantReason}
         onChange={(e) => setCpGrantReason(e.target.value)}
         placeholder="e.g. Top leaderboard performance this month."
        />
       </label>
       <div className="flex justify-end gap-3">
        <Button variant="ghost" size="small" onClick={() => setCpGrantOpen(false)}>
         Cancel
        </Button>
        <Button variant="primary" size="small" onClick={handleGrantCp} disabled={bulkLoading}>
         Grant CP
        </Button>
       </div>
      </div>
     </div>
    )}
   </div>
  </div>
 );
};

export default AdminUsers;
