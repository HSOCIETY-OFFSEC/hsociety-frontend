import React, { useState } from 'react';
import { FiCreditCard } from 'react-icons/fi';
import Button from '../../../shared/components/ui/Button';
import { initializeBootcampPayment, submitBootcampBtcPayment } from '../../dashboards/student/student.service';
import { PAYMENT_METHODS } from '../../../config/payment-methods.config';
import momoIcon from '../../../assets/icons/payment-icons/momo-icon.png';
import telecelIcon from '../../../assets/icons/payment-icons/telecel-cash-logo.png';
import btcIcon from '../../../assets/icons/payment-icons/Bitcoin-logo.png';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import '../../corporate/billing/components/PaymentModal.css';

const BTC_WALLET_ADDRESS = import.meta.env.VITE_BTC_WALLET || 'bc1qexamplebootcampwallet';

const StudentPaymentModal = ({ onClose, onSuccess, headline = 'Bootcamp Payment' }) => {
  const [method, setMethod] = useState('momo');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const iconMap = {
    mtn: momoIcon,
    telcel: telecelIcon,
    btc: btcIcon,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (method === 'btc') {
        if (!txHash.trim()) {
          setError('Please add the BTC transaction hash.');
          setSubmitting(false);
          return;
        }
        const response = await submitBootcampBtcPayment({ txHash: txHash.trim() });
        if (!response.success) {
          throw new Error(getPublicErrorMessage({ action: 'payment', response }));
        }
        onSuccess?.(response.data);
        return;
      }

      const response = await initializeBootcampPayment({ method });
      if (!response.success) {
        throw new Error(getPublicErrorMessage({ action: 'payment', response }));
      }

      const authorizationUrl = response.data?.authorizationUrl;
      if (!authorizationUrl) {
        throw new Error(getPublicErrorMessage({ action: 'payment' }));
      }

      window.location.href = authorizationUrl;
    } catch (err) {
      setError(err?.message || getPublicErrorMessage({ action: 'payment', response: err }));
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
            <div className="payment-method-grid">
              {PAYMENT_METHODS.map((option) => {
                const iconSrc = iconMap[option.id];
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`payment-method-card ${method === option.id ? 'active' : ''}`}
                    onClick={() => setMethod(option.id)}
                  >
                    <span className="payment-method-icon" aria-hidden="true">
                      {iconSrc ? (
                        <img src={iconSrc} alt={`${option.label} icon`} />
                      ) : (
                        <FiCreditCard size={16} />
                      )}
                    </span>
                    <strong>{option.label}</strong>
                    <span>{option.description}</span>
                  </button>
                );
              })}
            </div>

            {method === 'btc' && (
              <div className="payment-btc-panel">
                <p>
                  Send 150 GHS equivalent in BTC to the wallet below, then paste the transaction
                  hash. BTC submissions are reviewed before access is unlocked.
                </p>
                <div className="payment-btc-wallet">
                  <span>BTC Wallet</span>
                  <strong>{BTC_WALLET_ADDRESS}</strong>
                </div>
                <label className="payment-modal-field">
                  <span>Transaction hash</span>
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="Paste transaction hash"
                  />
                </label>
              </div>
            )}

            {error && <p className="payment-modal-error">{error}</p>}

            <div className="payment-modal-footer">
              <Button variant="ghost" size="small" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" size="small" type="submit" disabled={submitting}>
                {submitting ? 'Processing...' : method === 'btc' ? 'Submit BTC Payment' : 'Pay with Paystack'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentPaymentModal;
