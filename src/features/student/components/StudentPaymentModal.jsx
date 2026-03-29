import React, { useState } from 'react';
import { FiCreditCard } from 'react-icons/fi';
import Button from '../../../shared/components/ui/Button';
import { initializeBootcampPayment, submitBootcampBtcPayment } from '../../dashboards/student/services/student.service';
import { PAYMENT_METHODS } from '../../../config/app/payment-methods.config';
import momoIcon from '../../../assets/icons/payment-icons/momo-icon.png';
import telecelIcon from '../../../assets/icons/payment-icons/telecel-cash-logo.png';
import btcIcon from '../../../assets/icons/payment-icons/Bitcoin-logo.png';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';

const BTC_WALLET_ADDRESS = import.meta.env.VITE_BTC_WALLET || 'bc1qexamplebootcampwallet';

const StudentPaymentModal = ({ onClose, onSuccess, headline = 'Bootcamp Payment' }) => {
  const [method, setMethod] = useState('mtn');
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

  const backdropClassName =
    'fixed inset-0 z-[2000] grid place-items-center bg-black/85 p-5 backdrop-blur-[4px] animate-[route-fade_0.2s_ease]';
  const cardClassName =
    "relative w-full max-w-[500px] max-h-[calc(100vh-2.5rem)] overflow-y-auto rounded-lg border border-border bg-card p-7 shadow-lg animate-modal-card-in before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(var(--brand-rgb),0.18),transparent)] before:content-['']";
  const headerClassName = 'flex flex-wrap items-start justify-between gap-4';
  const closeButtonClassName =
    'flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-bg-secondary text-lg text-text-tertiary transition-colors hover:border-text-secondary/40 hover:bg-bg-tertiary hover:text-text-primary';
  const bodyClassName = 'mt-2 flex flex-col gap-4';
  const subtitleClassName = 'mt-2 text-sm text-text-secondary';
  const formClassName = 'flex flex-col gap-4';
  const fieldClassName = 'flex flex-col gap-2 text-sm text-text-secondary';
  const fieldLabelClassName = 'text-xs font-semibold uppercase tracking-widest text-text-tertiary';
  const inputClassName =
    'w-full rounded-sm border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-text-primary transition focus:border-brand/40 focus:bg-[var(--input-bg-focus)]';
  const actionsClassName = 'flex flex-col-reverse items-stretch justify-end gap-3 border-t border-border pt-5 sm:flex-row sm:items-center';
  const methodGridClassName = 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3';
  const methodCardBase =
    'flex w-full flex-col items-start gap-1 rounded-sm border border-border bg-bg-secondary p-3 text-left text-sm text-text-secondary transition hover:border-text-secondary/40';
  const methodCardActive = 'border-brand bg-brand/10 text-text-primary ring-1 ring-brand/30';
  const methodIconClassName =
    'flex h-9 w-9 items-center justify-center rounded-sm bg-bg-tertiary text-text-secondary ring-1 ring-border/60';
  const btcPanelClassName = 'flex flex-col gap-3 rounded-sm border border-border bg-bg-secondary p-4 text-sm text-text-secondary';
  const btcWalletClassName = 'flex flex-col gap-1 text-xs text-text-secondary';
  const errorClassName = 'rounded-sm border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger';

  return (
    <div
      className={backdropClassName}
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-payment-title"
    >
      <div className={cardClassName}>
        <div className={headerClassName}>
          <div>
            <h3 id="student-payment-title">{headline}</h3>
            <p className={subtitleClassName}>Secure your seat in the HSOCIETY bootcamp.</p>
          </div>
          <button
            type="button"
            className={closeButtonClassName}
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <div className={bodyClassName}>
          <form className={formClassName} onSubmit={handleSubmit}>
            <div className={methodGridClassName}>
              {PAYMENT_METHODS.map((option) => {
                const iconSrc = iconMap[option.id];
                const isActive = method === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`${methodCardBase}${isActive ? ` ${methodCardActive}` : ''}`}
                    onClick={() => setMethod(option.id)}
                  >
                    <span className={methodIconClassName} aria-hidden="true">
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
              <div className={btcPanelClassName}>
                <p>
                  Send the 150 GHS equivalent in BTC to the wallet below, then paste the transaction
                  hash. BTC submissions are reviewed before access is unlocked.
                </p>
                <div className={btcWalletClassName}>
                  <span>BTC Wallet</span>
                  <strong className="text-sm text-text-primary">{BTC_WALLET_ADDRESS}</strong>
                </div>
                <label className={fieldClassName}>
                  <span className={fieldLabelClassName}>Transaction hash</span>
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="Paste transaction hash"
                    className={inputClassName}
                  />
                </label>
              </div>
            )}

            {error && <p className={errorClassName}>{error}</p>}

            <div className={actionsClassName}>
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
