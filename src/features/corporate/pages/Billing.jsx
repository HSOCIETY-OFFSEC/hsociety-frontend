import React, { useEffect, useState } from 'react';
import { FiDownload, FiRotateCw } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Skeleton from '../../../shared/components/ui/Skeleton';
import PaymentModal from '../components/billing/PaymentModal';
import { getAgreements, getInvoices } from '../services/billing.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import { apiClient } from '../../../shared/services/api.client';
import { API_ENDPOINTS, buildEndpoint } from '../../../config/api/api.config';
import '../styles/billing.css';

const Billing = () => {
  const [invoices, setInvoices] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [loadingAgreements, setLoadingAgreements] = useState(true);
  const [invoiceError, setInvoiceError] = useState('');
  const [agreementError, setAgreementError] = useState('');
  const [paymentInvoice, setPaymentInvoice] = useState(null);

  useEffect(() => {
    loadInvoices();
    loadAgreements();
  }, []);

  const loadInvoices = async () => {
    setLoadingInvoices(true);
    setInvoiceError('');
    try {
      const response = await getInvoices();
      if (!response.success) {
        throw new Error(getPublicErrorMessage({ action: 'load', response }));
      }
      setInvoices(response.data);
    } catch (err) {
      console.error(err);
      setInvoiceError('Unable to load invoices.');
    } finally {
      setLoadingInvoices(false);
    }
  };

  const loadAgreements = async () => {
    setLoadingAgreements(true);
    setAgreementError('');
    try {
      const response = await getAgreements();
      if (!response.success) {
        throw new Error(getPublicErrorMessage({ action: 'load', response }));
      }
      setAgreements(response.data);
    } catch (err) {
      console.error(err);
      setAgreementError('Unable to load agreements.');
    } finally {
      setLoadingAgreements(false);
    }
  };

  const downloadInvoice = async (invoice) => {
    if (!invoice?.id) return;
    const endpoint = buildEndpoint(API_ENDPOINTS.BILLING.DOWNLOAD, { id: invoice.id });
    await apiClient.download(endpoint, `${invoice.id}.pdf`);
  };

  const downloadAgreement = async (agreement) => {
    if (!agreement?.id) return;
    const endpoint = buildEndpoint(API_ENDPOINTS.BILLING.AGREEMENT_DOWNLOAD, { id: agreement.id });
    await apiClient.download(endpoint, `${agreement.title || agreement.id}.pdf`);
  };

  const openPayment = (invoice) => {
    setPaymentInvoice({
      id: invoice.id,
      engagementName: invoice.engagementName,
      description: `Invoice ${invoice.id}`,
      amount: invoice.amount,
      currency: 'USD',
      dueDate: new Date(invoice.date),
      customerEmail: 'billing@corporate.com'
    });
  };

  const closePayment = () => setPaymentInvoice(null);

  const handlePaymentSuccess = () => closePayment();

  const formatDate = (timestamp) =>
    new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

  return (
    <div className="billing-page">
      <header className="billing-header">
        <div>
          <p className="billing-kicker">Billing</p>
          <h1>Invoice history & engagements</h1>
          <p>Every payable engagement is tracked with downloadable invoices and agreements.</p>
        </div>
        <Button variant="ghost" size="medium" onClick={() => loadInvoices()}>
          <FiRotateCw size={16} /> Refresh Invoices
        </Button>
      </header>

      <section className="billing-section">
        <div className="billing-section-header">
          <h2>Invoice History</h2>
          {invoiceError && <p className="billing-error">{invoiceError}</p>}
        </div>
        <Card className="billing-table-card" padding="none">
          <div className="billing-table">
            <div className="billing-row billing-header-row">
              <span>Invoice ID</span>
              <span>Engagement</span>
              <span>Date</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
                {loadingInvoices
              ? [...Array(3)].map((_, index) => (
                  <div key={index} className="billing-row">
                    <Skeleton className="billing-skeleton" style={{ width: '100%' }} />
                  </div>
                ))
              : invoices.map((invoice) => (
                  <div key={invoice.id} className="billing-row">
                    <span data-label="Invoice ID">{invoice.id}</span>
                    <span data-label="Engagement">{invoice.engagementName}</span>
                    <span data-label="Date">{formatDate(invoice.date)}</span>
                    <span data-label="Amount">${invoice.amount?.toLocaleString()}</span>
                    <span data-label="Status">
                      <span className={`billing-status billing-status-${invoice.status.toLowerCase()}`}>
                        {invoice.status}
                      </span>
                    </span>
                    <span className="billing-row-actions" data-label="Actions">
                      <Button variant="ghost" size="small" onClick={() => downloadInvoice(invoice)}>
                        <FiDownload size={14} />
                      </Button>
                      {(invoice.status === 'Pending' || invoice.status === 'Failed') && (
                        <Button variant="secondary" size="small" onClick={() => openPayment(invoice)}>
                          Pay Now
                        </Button>
                      )}
                    </span>
                  </div>
                ))}
          </div>
        </Card>
      </section>

      <section className="billing-section">
        <div className="billing-section-header">
          <h2>Engagement Agreements</h2>
          {agreementError && <p className="billing-error">{agreementError}</p>}
        </div>
        <div className="billing-agreements-grid">
          {loadingAgreements
            ? [...Array(2)].map((_, index) => (
                <Card key={index} padding="large" shadow="small">
                  <Skeleton className="skeleton-line" style={{ width: '80%', height: '22px' }} />
                  <Skeleton className="skeleton-line" style={{ width: '40%' }} />
                </Card>
              ))
            : agreements.map((agreement) => (
                <Card key={agreement.id} padding="large" shadow="medium">
                  <h3>{agreement.title}</h3>
                  <p className="billing-agreement-date">{formatDate(agreement.date)}</p>
                  <Button variant="secondary" size="small" onClick={() => downloadAgreement(agreement)}>
                    Download PDF <FiDownload size={16} />
                  </Button>
                </Card>
              ))}
        </div>
      </section>

      {paymentInvoice && (
        <PaymentModal invoice={paymentInvoice} onClose={closePayment} onSuccess={handlePaymentSuccess} />
      )}
    </div>
  );
};

export default Billing;
