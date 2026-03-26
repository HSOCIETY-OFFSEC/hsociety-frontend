import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiFlag, FiShield } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Skeleton from '../../../shared/components/ui/Skeleton';
import { getEngagements, requestEngagement } from '../services/engagements.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import { logger } from '../../../core/logging/logger';
import '../styles/engagements.css';

const statusMap = {
  pending_verification: { label: 'Verification', className: 'status-recon' },
  pending: { label: 'Pending', className: 'status-recon' },
  'in-progress': { label: 'In Progress', className: 'status-exploitation' },
  recon: { label: 'Recon', className: 'status-recon' },
  exploitation: { label: 'Exploitation', className: 'status-exploitation' },
  reporting: { label: 'Reporting', className: 'status-reporting' },
  retest: { label: 'Retest', className: 'status-retest' },
  completed: { label: 'Completed', className: 'status-completed' }
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
      <Card key={engagement.id} className="engagement-card" padding="large" shadow="medium">
        <div className="engagement-card-header">
          <h3>{engagement.name}</h3>
          <span className={`engagement-status-badge ${status.className}`}>
            <FiFlag size={14} /> {status.label}
          </span>
        </div>
        <p className="engagement-scope">{engagement.scope}</p>
        <div className="engagement-dates">
          <div>
            <small>Start</small>
            <p>{formatDate(engagement.startDate)}</p>
          </div>
          <div>
            <small>Expected</small>
            <p>{formatDate(engagement.expectedCompletion)}</p>
          </div>
        </div>
        <div className="engagement-metadata">
          <span className={`engagement-metadata-badge ${engagement.ownerVerified ? 'metadata-verified' : 'metadata-awaiting'}`}>
            {engagement.ownerVerified ? 'Ownership verified' : formatProofBadge(engagement.ownershipProof)}
          </span>
          <span className={`engagement-metadata-badge ${engagement.paymentStatus === 'approved' ? 'metadata-paid' : 'metadata-awaiting'}`}>
            {engagement.paymentStatus === 'approved' ? 'Payment approved' : 'Payment pending'}
          </span>
        </div>
        {!engagement.ownerVerified && engagement.ownershipProof && (
          <p className="engagement-proof">
            Proof value: {truncateText(engagement.ownershipProof.value)}
          </p>
        )}
        <div className="engagement-footer">
          <p className="engagement-budget">
            <FiCalendar size={16} /> {engagement.summary}
          </p>
          <Button variant="ghost" size="small" onClick={() => navigate('/reports')}>
            View Details <FiArrowRight size={16} />
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="engagements-page">
      <header className="engagements-header">
        <div>
          <p className="engagements-kicker">Engagements</p>
          <h1>Active and Past Engagements</h1>
          <p>
            Track every active engagement, view completed delivery artifacts, and trigger new
            work through a secure payment flow.
          </p>
        </div>
        <Button variant="primary" size="large" onClick={openRequestModal}>
          Request Engagement
        </Button>
      </header>

      {showRequestModal && (
        <div className="engagements-overlay" role="dialog" aria-modal="true">
          <div className="engagements-request-modal">
            <div className="engagements-modal-header">
              <div>
                <p className="engagements-kicker">New Request</p>
                <h3>Request a Pentest</h3>
                <p className="engagements-modal-subtitle">
                  Submit the target info, proof of ownership, and budget to start the verification workflow.
                </p>
              </div>
              <button type="button" className="engagements-modal-close" onClick={closeRequestModal}>
                Close
              </button>
            </div>
            <form className="engagements-request-form" onSubmit={handleSubmitRequest}>
              <div className="engagements-field">
                <label htmlFor="request-identifier">Target identifier</label>
                <input
                  id="request-identifier"
                  type="text"
                  value={requestForm.identifier}
                  onChange={handleFormChange('identifier')}
                  placeholder="e.g. app.example.com"
                />
                {formErrors.identifier && <span className="engagements-field-error">{formErrors.identifier}</span>}
              </div>
              <div className="engagements-field-grid">
                <div className="engagements-field">
                  <label htmlFor="request-method">Proof method</label>
                  <select
                    id="request-method"
                    value={requestForm.proofMethod}
                    onChange={handleFormChange('proofMethod')}
                  >
                    {PROOF_METHODS.map((method) => (
                      <option key={method} value={method}>
                        {method.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  {formErrors.proofMethod && <span className="engagements-field-error">{formErrors.proofMethod}</span>}
                </div>
                <div className="engagements-field">
                  <label htmlFor="request-value">Verification value</label>
                  <input
                    id="request-value"
                    value={requestForm.proofValue}
                    onChange={handleFormChange('proofValue')}
                    placeholder="DNS record, token, or proof note"
                  />
                  {formErrors.proofValue && <span className="engagements-field-error">{formErrors.proofValue}</span>}
                </div>
              </div>
              <div className="engagements-field">
                <label htmlFor="request-proofs">Proof notes (optional)</label>
                <textarea
                  id="request-proofs"
                  rows={2}
                  value={requestForm.proofNotes}
                  onChange={handleFormChange('proofNotes')}
                  placeholder="Add context for the verification team"
                />
              </div>
              <div className="engagements-field">
                <label htmlFor="request-scope">Scope</label>
                <textarea
                  id="request-scope"
                  rows={3}
                  value={requestForm.scope}
                  onChange={handleFormChange('scope')}
                  placeholder="Web application, APIs, infrastructure"
                />
              </div>
              <div className="engagements-field">
                <label htmlFor="request-notes">Additional context</label>
                <textarea
                  id="request-notes"
                  rows={3}
                  value={requestForm.notes}
                  onChange={handleFormChange('notes')}
                  placeholder="Anything we should keep in mind?"
                />
              </div>
              <div className="engagements-field-grid">
                <div className="engagements-field">
                  <label htmlFor="request-amount">Estimated budget (USD)</label>
                  <input
                    id="request-amount"
                    type="number"
                    min="0"
                    step="100"
                    value={requestForm.amount}
                    onChange={handleFormChange('amount')}
                    placeholder="0"
                  />
                  {formErrors.amount && <span className="engagements-field-error">{formErrors.amount}</span>}
                </div>
              </div>
              <div className="engagements-modal-footer">
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

      {error && <p className="engagements-error">{error}</p>}
      {requestStatus && <p className="engagements-status">{requestStatus}</p>}

      <section className="engagements-section">
        <div className="section-title-row">
          <div>
            <h2>Active Engagements</h2>
            <p>Current cycles that are in progress across recon, exploitation, and reporting.</p>
          </div>
          <span className="engagements-count">
            <FiShield size={16} /> {activeEngagements.length} Active
          </span>
        </div>
        <div className="engagements-grid">
          {loading
            ? [...Array(2)].map((_, index) => (
                <Card key={index} padding="large" shadow="small">
                  <Skeleton className="skeleton-line" style={{ width: '70%', height: '28px' }} />
                  <Skeleton className="skeleton-line" style={{ width: '40%' }} />
                  <Skeleton className="skeleton-line" style={{ width: '80%' }} />
                </Card>
              ))
            : activeEngagements.map(renderEngagementCard)}
        </div>
      </section>

      <section className="engagements-section">
        <div className="section-title-row">
          <div>
            <h2>Past Engagements</h2>
            <p>Completed engagements with available final reports and remediation briefings.</p>
          </div>
          <span className="engagements-count">
            <FiShield size={16} /> {pastEngagements.length} Completed
          </span>
        </div>
        <div className="engagements-grid">
          {loading
            ? [...Array(2)].map((_, index) => (
                <Card key={index} padding="large" shadow="small">
                  <Skeleton className="skeleton-line" style={{ width: '70%', height: '28px' }} />
                  <Skeleton className="skeleton-line" style={{ width: '40%' }} />
                  <Skeleton className="skeleton-line" style={{ width: '80%' }} />
                </Card>
              ))
            : pastEngagements.map(renderEngagementCard)}
        </div>
      </section>

    </div>
  );
};

export default Engagements;
