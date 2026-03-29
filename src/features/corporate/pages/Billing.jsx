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
import { logger } from '../../../core/logging/logger';

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
      logger.error(err);
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
      logger.error(err);
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
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-text-tertiary">Billing</p>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Invoice history & engagements
          </h1>
          <p className="text-sm leading-relaxed text-text-secondary">
            Every payable engagement is tracked with downloadable invoices and agreements.
          </p>
        </div>
        <Button variant="ghost" size="medium" onClick={() => loadInvoices()}>
          <FiRotateCw size={16} /> Refresh Invoices
        </Button>
      </header>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-text-primary">Invoice History</h2>
          {invoiceError && <p className="text-xs text-status-danger">{invoiceError}</p>}
        </div>
        <Card className="overflow-hidden" padding="none">
          <div className="w-full overflow-x-visible sm:overflow-x-auto">
            <div className="hidden min-w-0 grid-cols-1 gap-2 border-b border-border bg-bg-secondary px-5 py-3 text-xs font-bold uppercase tracking-widest text-text-tertiary sm:grid sm:min-w-[600px] sm:grid-cols-[1.1fr_1.6fr_1fr_0.9fr_0.9fr_1fr]">
              <span>Invoice ID</span>
              <span>Engagement</span>
              <span>Date</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
                {loadingInvoices
              ? [...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="grid min-w-0 grid-cols-1 gap-2 border-b border-border px-4 py-3 sm:min-w-[600px] sm:grid-cols-[1.1fr_1.6fr_1fr_0.9fr_0.9fr_1fr] sm:px-5"
                  >
                    <Skeleton className="h-3.5 w-full rounded-md" style={{ width: '100%' }} />
                  </div>
                ))
              : invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="grid min-w-0 grid-cols-1 gap-2 border-b border-border px-4 py-3 text-sm text-text-secondary transition-colors hover:bg-bg-secondary/50 sm:min-w-[600px] sm:grid-cols-[1.1fr_1.6fr_1fr_0.9fr_0.9fr_1fr] sm:px-5"
                  >
                    <span className="block text-sm text-text-secondary before:mb-1 before:block before:text-xs before:uppercase before:tracking-widest before:text-text-tertiary before:content-[attr(data-label)] sm:inline sm:before:content-none" data-label="Invoice ID">{invoice.id}</span>
                    <span className="block text-sm text-text-secondary before:mb-1 before:block before:text-xs before:uppercase before:tracking-widest before:text-text-tertiary before:content-[attr(data-label)] sm:inline sm:before:content-none" data-label="Engagement">{invoice.engagementName}</span>
                    <span className="block text-sm text-text-secondary before:mb-1 before:block before:text-xs before:uppercase before:tracking-widest before:text-text-tertiary before:content-[attr(data-label)] sm:inline sm:before:content-none" data-label="Date">{formatDate(invoice.date)}</span>
                    <span className="block text-sm text-text-secondary before:mb-1 before:block before:text-xs before:uppercase before:tracking-widest before:text-text-tertiary before:content-[attr(data-label)] sm:inline sm:before:content-none" data-label="Amount">${invoice.amount?.toLocaleString()}</span>
                    <span
                      className="block text-sm text-text-secondary before:mb-1 before:block before:text-xs before:uppercase before:tracking-widest before:text-text-tertiary before:content-[attr(data-label)] sm:inline sm:before:content-none"
                      data-label="Status"
                    >
                      <span
                        className={[
                          'inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold',
                          invoice.status?.toLowerCase() === 'paid' && 'border-status-success/40 bg-status-success/10 text-status-success',
                          invoice.status?.toLowerCase() === 'pending' && 'border-status-warning/40 bg-status-warning/10 text-status-warning',
                          invoice.status?.toLowerCase() === 'failed' && 'border-status-danger/40 bg-status-danger/10 text-status-danger',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {invoice.status}
                      </span>
                    </span>
                    <span
                      className="flex items-center gap-3 before:mb-1 before:block before:text-xs before:uppercase before:tracking-widest before:text-text-tertiary before:content-[attr(data-label)] sm:gap-2 sm:before:content-none"
                      data-label="Actions"
                    >
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

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-text-primary">Engagement Agreements</h2>
          {agreementError && <p className="text-xs text-status-danger">{agreementError}</p>}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {loadingAgreements
            ? [...Array(2)].map((_, index) => (
                <Card key={index} padding="large" shadow="small">
                  <Skeleton className="h-5 w-4/5 rounded-md" />
                  <Skeleton className="h-4 w-2/5 rounded-md" />
                </Card>
              ))
            : agreements.map((agreement) => (
                <Card key={agreement.id} padding="large" shadow="medium">
                  <h3 className="text-base font-semibold text-text-primary">{agreement.title}</h3>
                  <p className="text-sm text-text-tertiary">{formatDate(agreement.date)}</p>
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
