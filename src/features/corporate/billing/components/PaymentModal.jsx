import React, { useState } from 'react';
import { FiX, FiCreditCard } from 'react-icons/fi';
import Button from '../../../shared/components/ui/Button';
import '../../../styles/features/billing.css';

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
    <div className="payment-modal-overlay" role="dialog" aria-modal="true">
      <div className="payment-modal">
        <header className="payment-modal-header">
          <div>
            <h2>Invoice summary</h2>
            <p>Paystack handles the secure transaction for the selected engagement.</p>
          </div>
          <button type="button" onClick={onClose} className="payment-modal-close">
            <FiX size={18} />
          </button>
        </header>
        <div className="payment-modal-body">
          <div className="payment-item">
            <span>ID</span>
            <strong>{invoice.id}</strong>
          </div>
          <div className="payment-item">
            <span>Description</span>
            <strong>{invoice.description}</strong>
          </div>
          <div className="payment-item">
            <span>Amount</span>
            <strong>
              {invoice.currency} {invoice.amount?.toLocaleString()}
            </strong>
          </div>
          <div className="payment-item">
            <span>Engagement</span>
            <strong>{invoice.engagementName}</strong>
          </div>
          <div className="payment-item">
            <span>Due</span>
            <strong>{invoice.dueDate?.toLocaleDateString('en-US')}</strong>
          </div>
        </div>
        {error && <p className="payment-modal-error">{error}</p>}
        <div className="payment-modal-footer">
          <Button variant="secondary" size="medium" onClick={initializePayment} loading={loading}>
            <FiCreditCard size={16} /> Pay with Paystack
          </Button>
          <Button variant="ghost" size="medium" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
