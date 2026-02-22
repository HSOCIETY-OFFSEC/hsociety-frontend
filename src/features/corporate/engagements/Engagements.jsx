import React, { useEffect, useState } from 'react';
import { FiArrowRight, FiCalendar, FiFlag, FiShield } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Skeleton from '../../../shared/components/ui/Skeleton';
import { getEngagements } from './engagements.service';
import PaymentModal from '../billing/components/PaymentModal';
import '../../../styles/features/engagements.css';

const statusMap = {
  recon: { label: 'Recon', className: 'status-recon' },
  exploitation: { label: 'Exploitation', className: 'status-exploitation' },
  reporting: { label: 'Reporting', className: 'status-reporting' },
  retest: { label: 'Retest', className: 'status-retest' },
  completed: { label: 'Completed', className: 'status-completed' }
};

const Engagements = () => {
  const [activeEngagements, setActiveEngagements] = useState([]);
  const [pastEngagements, setPastEngagements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invoiceDraft, setInvoiceDraft] = useState(null);

  useEffect(() => {
    loadEngagements();
  }, []);

  const loadEngagements = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getEngagements();
      if (!response.success) {
        throw new Error(response.error || 'Unable to load engagements');
      }
      setActiveEngagements(response.data.active);
      setPastEngagements(response.data.past);
    } catch (err) {
      console.error('Engagements load error:', err);
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

  const handleRequestEngagement = () => {
    setInvoiceDraft({
      id: `INV-${Date.now()}`,
      engagementName: 'New Corporate Engagement',
      description: 'Request for a tailored penetration testing cycle.',
      amount: 5400,
      currency: 'USD',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      customerEmail: 'security@corporate.com'
    });
  };

  const closeModal = () => setInvoiceDraft(null);

  const handlePaymentSuccess = () => {
    closeModal();
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
        <div className="engagement-footer">
          <p className="engagement-budget">
            <FiCalendar size={16} /> {engagement.summary}
          </p>
          <Button variant="ghost" size="small">
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
        <Button variant="primary" size="large" onClick={handleRequestEngagement}>
          Request Engagement
        </Button>
      </header>

      {error && <p className="engagements-error">{error}</p>}

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

      {invoiceDraft && (
        <PaymentModal
          invoice={invoiceDraft}
          onClose={closeModal}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Engagements;
