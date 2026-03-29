import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiFlag, FiShield } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Skeleton from '../../../shared/components/ui/Skeleton';
import { getEngagements, requestEngagement } from '../services/engagements.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import { logger } from '../../../core/logging/logger';

const statusMap = {
  pending_verification: { label: 'Verification', className: 'border-status-info/40 bg-status-info/10 text-status-info' },
  pending: { label: 'Pending', className: 'border-status-info/40 bg-status-info/10 text-status-info' },
  'in-progress': { label: 'In Progress', className: 'border-status-orange/40 bg-status-orange/10 text-status-orange' },
  recon: { label: 'Recon', className: 'border-status-info/40 bg-status-info/10 text-status-info' },
  exploitation: { label: 'Exploitation', className: 'border-status-orange/40 bg-status-orange/10 text-status-orange' },
  reporting: { label: 'Reporting', className: 'border-status-purple/40 bg-status-purple/10 text-status-purple' },
  retest: { label: 'Retest', className: 'border-status-warning/40 bg-status-warning/10 text-status-warning' },
  completed: { label: 'Completed', className: 'border-status-success/40 bg-status-success/10 text-status-success' }
};

const PROOF_METHODS = ['dns', 'meta', 'token', 'manual'];

const parseScopeInput = (value = '') =>
  String(value)
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

const formatProofBadge = (proof) => {
  if (!proof) return 'Ownership proof pending';
  const method = String(proof.method || '').toUpperCase();
  return `${method} proof submitted`; 
};

const DEFAULT_REQUEST_FORM = {
  identifier: '',
  proofMethod: 'dns',
  proofValue: '',
  proofNotes: '',
  scope: '',
  notes: '',
  amount: '',
};

const createRequestForm = () => ({ ...DEFAULT_REQUEST_FORM });

const truncateText = (value, length = 30) => {
  if (!value) return '';
  return value.length > length ? `${value.slice(0, length)}…` : value;
};

const Engagements = () => {
  const navigate = useNavigate();
  const [activeEngagements, setActiveEngagements] = useState([]);
  const [pastEngagements, setPastEngagements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestStatus, setRequestStatus] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState(createRequestForm());
  const [formErrors, setFormErrors] = useState({});
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  useEffect(() => {
    loadEngagements();
  }, []);

  const loadEngagements = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getEngagements();
      if (!response.success) {
        throw new Error(getPublicErrorMessage({ action: 'load', response }));
      }
      setActiveEngagements(response.data.active);
      setPastEngagements(response.data.past);
    } catch (err) {
      logger.error('Engagements load error:', err);
      setError('Unable to load engagement data right now.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) =>
    timestamp
      ? new Date(timestamp).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : 'TBD';

  const openRequestModal = () => {
    setRequestForm(createRequestForm());
    setFormErrors({});
    setRequestStatus('');
    setShowRequestModal(true);
  };

  const closeRequestModal = () => {
    setShowRequestModal(false);
  };

  const handleFormChange = (field) => (event) => {
    const value = event.target.value;
    setRequestForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateRequestForm = () => {
    const errors = {};
    if (!requestForm.identifier.trim()) {
      errors.identifier = 'Target identifier is required.';
    }
    const proofMethod = String(requestForm.proofMethod || '').toLowerCase();
    if (!PROOF_METHODS.includes(proofMethod)) {
      errors.proofMethod = 'Proof method must be dns, meta, token, or manual.';
    }
    if (!requestForm.proofValue.trim()) {
      errors.proofValue = 'Verification value is required.';
    }
    if (requestForm.amount && Number(requestForm.amount) < 0) {
      errors.amount = 'Amount cannot be negative.';
    }
    return errors;
  };

  const handleSubmitRequest = async (event) => {
    event.preventDefault();
    const errors = validateRequestForm();
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }
    setIsSubmittingRequest(true);
    setRequestStatus('Submitting engagement request...');
    try {
      const payload = {
        target: { identifier: requestForm.identifier.trim(), description: '' },
        scope: parseScopeInput(requestForm.scope),
        notes: requestForm.notes.trim(),
        amount: Number(requestForm.amount) || 0,
        currency: 'USD',
        ownershipProof: {
          method: requestForm.proofMethod,
          value: requestForm.proofValue.trim(),
          notes: requestForm.proofNotes.trim(),
        },
      };
      const response = await requestEngagement(payload);
      if (!response.success) {
        setRequestStatus(response.error || 'Unable to submit engagement request.');
        return;
      }
      setRequestStatus('Engagement request submitted. Ownership verification pending.');
      loadEngagements();
      closeRequestModal();
    } catch (err) {
      logger.error('Engagement request error:', err);
      setRequestStatus('Unable to submit engagement request.');
    } finally {
      setIsSubmittingRequest(false);
    }
  };


  const renderEngagementCard = (engagement) => {
    const status = statusMap[engagement.status] || statusMap.recon;
    return (
      <Card key={engagement.id} className="transition-colors hover:border-brand/30" padding="large" shadow="medium">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h3 className="text-base font-semibold text-text-primary">{engagement.name}</h3>
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}>
            <FiFlag size={14} /> {status.label}
          </span>
        </div>
          <p className="text-sm leading-relaxed text-text-secondary">{engagement.scope}</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <small className="block text-xs font-semibold uppercase tracking-widest text-text-tertiary">Start</small>
              <p className="text-sm font-semibold text-text-primary">{formatDate(engagement.startDate)}</p>
            </div>
            <div>
              <small className="block text-xs font-semibold uppercase tracking-widest text-text-tertiary">Expected</small>
              <p className="text-sm font-semibold text-text-primary">{formatDate(engagement.expectedCompletion)}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
                engagement.ownerVerified
                  ? 'border-status-success/40 bg-status-success/10 text-status-success'
                  : 'border-status-warning/40 bg-status-warning/10 text-status-warning'
              }`}
            >
              {engagement.ownerVerified ? 'Ownership verified' : formatProofBadge(engagement.ownershipProof)}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
                engagement.paymentStatus === 'approved'
                  ? 'border-status-success/40 bg-status-success/10 text-status-success'
                  : 'border-status-warning/40 bg-status-warning/10 text-status-warning'
              }`}
            >
              {engagement.paymentStatus === 'approved' ? 'Payment approved' : 'Payment pending'}
            </span>
          </div>
          {!engagement.ownerVerified && engagement.ownershipProof && (
            <p className="text-xs text-text-secondary">
              Proof value: {truncateText(engagement.ownershipProof.value)}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
            <p className="flex items-center gap-2 text-sm text-text-secondary">
              <FiCalendar size={16} /> {engagement.summary}
            </p>
            <Button variant="ghost" size="small" onClick={() => navigate('/reports')}>
              View Details <FiArrowRight size={16} />
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-text-tertiary">Engagements</p>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Active and Past Engagements
          </h1>
          <p className="max-w-[460px] text-sm leading-relaxed text-text-secondary">
            Track every active engagement, view completed delivery artifacts, and trigger new
            work through a secure payment flow.
          </p>
        </div>
        <Button variant="primary" size="large" onClick={openRequestModal}>
          Request Engagement
        </Button>
      </header>

      {showRequestModal && (
        <div className="fixed inset-0 z-20 flex items-start justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
          <div className="flex w-full max-w-[540px] flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-xl animate-modal-card-in">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-text-tertiary">New Request</p>
                <h3 className="text-lg font-semibold text-text-primary">Request a Pentest</h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  Submit the target info, proof of ownership, and budget to start the verification workflow.
                </p>
              </div>
              <button
                type="button"
                className="text-sm font-semibold text-text-secondary transition hover:text-text-primary"
                onClick={closeRequestModal}
              >
                Close
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmitRequest}>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="request-identifier" className="text-sm font-medium text-text-secondary">Target identifier</label>
                <input
                  id="request-identifier"
                  type="text"
                  value={requestForm.identifier}
                  onChange={handleFormChange('identifier')}
                  placeholder="e.g. app.example.com"
                  className={`w-full rounded-md border px-3 py-2 text-sm text-text-primary transition placeholder:text-text-tertiary focus:outline-none focus:ring-2 ${formErrors.identifier ? 'border-status-danger/60 bg-status-danger/5 focus:border-status-danger/60 focus:ring-status-danger/30' : 'border-border bg-bg-secondary focus:border-brand/60 focus:ring-brand/20'}`}
                />
                {formErrors.identifier && <span className="text-xs text-status-danger">{formErrors.identifier}</span>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="request-method" className="text-sm font-medium text-text-secondary">Proof method</label>
                  <select
                    id="request-method"
                    value={requestForm.proofMethod}
                    onChange={handleFormChange('proofMethod')}
                    className={`w-full rounded-md border px-3 py-2 text-sm text-text-primary transition focus:outline-none focus:ring-2 ${formErrors.proofMethod ? 'border-status-danger/60 bg-status-danger/5 focus:border-status-danger/60 focus:ring-status-danger/30' : 'border-border bg-bg-secondary focus:border-brand/60 focus:ring-brand/20'}`}
                  >
                    {PROOF_METHODS.map((method) => (
                      <option key={method} value={method}>
                        {method.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  {formErrors.proofMethod && <span className="text-xs text-status-danger">{formErrors.proofMethod}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="request-value" className="text-sm font-medium text-text-secondary">Verification value</label>
                  <input
                    id="request-value"
                    value={requestForm.proofValue}
                    onChange={handleFormChange('proofValue')}
                    placeholder="DNS record, token, or proof note"
                    className={`w-full rounded-md border px-3 py-2 text-sm text-text-primary transition placeholder:text-text-tertiary focus:outline-none focus:ring-2 ${formErrors.proofValue ? 'border-status-danger/60 bg-status-danger/5 focus:border-status-danger/60 focus:ring-status-danger/30' : 'border-border bg-bg-secondary focus:border-brand/60 focus:ring-brand/20'}`}
                  />
                  {formErrors.proofValue && <span className="text-xs text-status-danger">{formErrors.proofValue}</span>}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="request-proofs" className="text-sm font-medium text-text-secondary">Proof notes (optional)</label>
                <textarea
                  id="request-proofs"
                  rows={2}
                  value={requestForm.proofNotes}
                  onChange={handleFormChange('proofNotes')}
                  placeholder="Add context for the verification team"
                  className="w-full rounded-md border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary transition placeholder:text-text-tertiary focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="request-scope" className="text-sm font-medium text-text-secondary">Scope</label>
                <textarea
                  id="request-scope"
                  rows={3}
                  value={requestForm.scope}
                  onChange={handleFormChange('scope')}
                  placeholder="Web application, APIs, infrastructure"
                  className="w-full rounded-md border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary transition placeholder:text-text-tertiary focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="request-notes" className="text-sm font-medium text-text-secondary">Additional context</label>
                <textarea
                  id="request-notes"
                  rows={3}
                  value={requestForm.notes}
                  onChange={handleFormChange('notes')}
                  placeholder="Anything we should keep in mind?"
                  className="w-full rounded-md border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary transition placeholder:text-text-tertiary focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="request-amount" className="text-sm font-medium text-text-secondary">Estimated budget (USD)</label>
                  <input
                    id="request-amount"
                    type="number"
                    min="0"
                    step="100"
                    value={requestForm.amount}
                    onChange={handleFormChange('amount')}
                    placeholder="0"
                    className={`w-full rounded-md border px-3 py-2 text-sm text-text-primary transition focus:outline-none focus:ring-2 ${formErrors.amount ? 'border-status-danger/60 bg-status-danger/5 focus:border-status-danger/60 focus:ring-status-danger/30' : 'border-border bg-bg-secondary focus:border-brand/60 focus:ring-brand/20'}`}
                  />
                  {formErrors.amount && <span className="text-xs text-status-danger">{formErrors.amount}</span>}
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={closeRequestModal} disabled={isSubmittingRequest}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmittingRequest}>
                  {isSubmittingRequest ? 'Submitting…' : 'Submit request'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-md border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger">
          {error}
        </p>
      )}
      {requestStatus && (
        <p className="rounded-md border border-border bg-bg-secondary px-4 py-3 text-sm text-text-primary">
          {requestStatus}
        </p>
      )}

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-text-primary">Active Engagements</h2>
            <p className="text-sm text-text-secondary">Current cycles that are in progress across recon, exploitation, and reporting.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-secondary px-3 py-1 text-xs font-semibold text-text-secondary">
            <FiShield size={16} /> {activeEngagements.length} Active
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? [...Array(2)].map((_, index) => (
                <Card key={index} padding="large" shadow="small">
                  <Skeleton className="h-7 w-4/5 rounded-md" />
                  <Skeleton className="h-4 w-2/5 rounded-md" />
                  <Skeleton className="h-4 w-4/5 rounded-md" />
                </Card>
              ))
            : activeEngagements.map(renderEngagementCard)}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-text-primary">Past Engagements</h2>
            <p className="text-sm text-text-secondary">Completed engagements with available final reports and remediation briefings.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-secondary px-3 py-1 text-xs font-semibold text-text-secondary">
            <FiShield size={16} /> {pastEngagements.length} Completed
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? [...Array(2)].map((_, index) => (
                <Card key={index} padding="large" shadow="small">
                  <Skeleton className="h-7 w-4/5 rounded-md" />
                  <Skeleton className="h-4 w-2/5 rounded-md" />
                  <Skeleton className="h-4 w-4/5 rounded-md" />
                </Card>
              ))
            : pastEngagements.map(renderEngagementCard)}
        </div>
      </section>

    </div>
  );
};

export default Engagements;
