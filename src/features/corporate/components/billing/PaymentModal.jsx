import React, { useState } from 'react';
import { FiX, FiCreditCard } from 'react-icons/fi';
import Button from '../../../../shared/components/ui/Button';

const PaymentModal = ({ invoice, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  const initializePayment = () => {
    setError('');
    if (!publicKey) {
      setError('Missing Paystack public key. Configure VITE_PAYSTACK_PUBLIC_KEY to proceed.');
      return;
    }

    if (typeof window === 'undefined' || !window.PaystackPop) {
      setError('Paystack script must load before starting a payment.');
      return;
    }

    setLoading(true);

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: invoice.customerEmail || 'billing@corporate.com',
      amount: Math.round((invoice.amount || 0) * 100),
      currency: invoice.currency || 'USD',
      ref: invoice.id,
      metadata: {
        invoiceId: invoice.id
      },
      callback: (response) => {
        setLoading(false);
        onSuccess(response);
      },
      onClose: () => {
        setLoading(false);
        setError('Payment window closed before completion.');
      }
    });

    handler.openIframe();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm motion-reduce:animate-none"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex w-full max-w-[440px] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-lg motion-reduce:animate-none sm:rounded-xl animate-modal-card-in">
        <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-5 sm:px-6">
          <div>
            <h2 className="text-base font-semibold text-text-primary">Invoice summary</h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              Paystack handles the secure transaction for the selected engagement.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-bg-tertiary text-text-secondary transition hover:bg-bg-secondary hover:text-text-primary"
          >
            <FiX size={18} />
          </button>
        </header>
        <div className="flex flex-col gap-0 py-3">
          <div className="flex items-baseline justify-between gap-4 border-b border-border/50 px-6 py-2.5">
            <span className="text-sm font-medium text-text-tertiary">ID</span>
            <strong className="max-w-[220px] truncate text-sm font-semibold text-text-primary">
              {invoice.id}
            </strong>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-b border-border/50 px-6 py-2.5">
            <span className="text-sm font-medium text-text-tertiary">Description</span>
            <strong className="max-w-[220px] truncate text-sm font-semibold text-text-primary">
              {invoice.description}
            </strong>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-b border-border/50 px-6 py-2.5">
            <span className="text-sm font-medium text-text-tertiary">Amount</span>
            <strong className="max-w-[220px] truncate text-sm font-semibold text-text-primary">
              {invoice.currency} {invoice.amount?.toLocaleString()}
            </strong>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-b border-border/50 px-6 py-2.5">
            <span className="text-sm font-medium text-text-tertiary">Engagement</span>
            <strong className="max-w-[220px] truncate text-sm font-semibold text-text-primary">
              {invoice.engagementName}
            </strong>
          </div>
          <div className="flex items-baseline justify-between gap-4 px-6 py-2.5">
            <span className="text-sm font-medium text-text-tertiary">Due</span>
            <strong className="max-w-[220px] truncate text-sm font-semibold text-text-primary">
              {invoice.dueDate?.toLocaleDateString('en-US')}
            </strong>
          </div>
        </div>
        {error && (
          <p className="border-t border-status-danger/20 bg-status-danger/10 px-6 py-3 text-sm text-status-danger">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-3 border-t border-border bg-bg-secondary px-6 py-4">
          <Button
            variant="secondary"
            size="medium"
            onClick={initializePayment}
            loading={loading}
            className="flex-1 min-w-[120px]"
          >
            <FiCreditCard size={16} /> Pay with Paystack
          </Button>
          <Button
            variant="ghost"
            size="medium"
            onClick={onClose}
            disabled={loading}
            className="flex-1 min-w-[120px]"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
