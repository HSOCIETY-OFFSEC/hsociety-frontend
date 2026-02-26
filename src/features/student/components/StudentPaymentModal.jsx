import React, { useState } from 'react';
import Button from '../../../shared/components/ui/Button';
import '../../../styles/features/billing.css';

const StudentPaymentModal = ({ onClose, onSuccess, headline = 'Bootcamp Payment' }) => {
  const [form, setForm] = useState({
    name: '',
    card: '',
    expiry: '',
    cvc: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.name.trim() || !form.card.trim() || !form.expiry.trim() || !form.cvc.trim()) {
      setError('Please complete all payment fields.');
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      onSuccess?.();
    } catch (err) {
      setError('Payment could not be processed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="payment-modal-overlay" role="dialog" aria-modal="true">
      <div className="payment-modal">
        <header className="payment-modal-header">
          <div>
            <h3>{headline}</h3>
            <p>Secure your seat in the HSOCIETY bootcamp.</p>
          </div>
          <button type="button" onClick={onClose} className="payment-modal-close" aria-label="Close">
            ×
          </button>
        </header>
        <div className="payment-modal-body">
          <form className="payment-modal-form" onSubmit={handleSubmit}>
            <label className="payment-modal-field">
              <span>Cardholder name</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Full name"
              />
            </label>
            <label className="payment-modal-field">
              <span>Card number</span>
              <input
                type="text"
                value={form.card}
                onChange={(e) => handleChange('card', e.target.value)}
                placeholder="4242 4242 4242 4242"
              />
            </label>
            <div className="payment-modal-row">
              <label className="payment-modal-field">
                <span>Expiry</span>
                <input
                  type="text"
                  value={form.expiry}
                  onChange={(e) => handleChange('expiry', e.target.value)}
                  placeholder="MM/YY"
                />
              </label>
              <label className="payment-modal-field">
                <span>CVC</span>
                <input
                  type="text"
                  value={form.cvc}
                  onChange={(e) => handleChange('cvc', e.target.value)}
                  placeholder="123"
                />
              </label>
            </div>

            {error && <p className="payment-modal-error">{error}</p>}

            <div className="payment-modal-footer">
              <Button variant="ghost" size="small" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" size="small" type="submit" disabled={submitting}>
                {submitting ? 'Processing...' : 'Complete Payment'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentPaymentModal;
