import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiCreditCard, FiShield } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/auth/AuthContext';
import useBootcampAccess from '../hooks/useBootcampAccess';
import StudentPaymentModal from '../components/StudentPaymentModal';
import { verifyBootcampPayment, getBootcampAccessKey } from '../../dashboards/student/services/student.service';
import { getCurrentUser } from '../../../core/auth/auth.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import { consumeBootcampRedirect } from '../utils/bootcampRedirect';
import { SOCIAL_LINKS } from '../../../config/app/social.config';

const StudentPayments = () => {
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isRegistered, isPaid, accessRevoked } = useBootcampAccess();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const whatsappLink = SOCIAL_LINKS.find((link) => link.key === 'whatsapp')?.href || '';

  const autoOpenedRef = useRef(false);

  const handleOpenPayment = useCallback(() => {
    if (accessRevoked) {
      navigate('/contact');
      return;
    }
    if (!isRegistered) {
      navigate('/student-bootcamps');
      return;
    }
    setShowPaymentModal(true);
  }, [accessRevoked, isRegistered, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const open = params.get('open');
    if (autoOpenedRef.current) return;
    if (open === 'payment' || open === 'modal' || open === 'pay') {
      autoOpenedRef.current = true;
      handleOpenPayment();
    }
  }, [handleOpenPayment, location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reference = params.get('reference');
    const status = params.get('status');
    if (!reference) return;

    const verify = async () => {
      setStatusMessage('Verifying payment...');
      const response = await verifyBootcampPayment(reference);
      if (!response.success) {
        setStatusMessage(getPublicErrorMessage({ action: 'payment', response }));
        return;
      }
      updateUser({
        bootcampPaymentStatus: response.data?.bootcampPaymentStatus || 'paid',
        bootcampStatus: response.data?.bootcampStatus || 'enrolled',
        bootcampPaidAt: response.data?.bootcampPaidAt,
      });
      const refreshed = await getCurrentUser();
      if (refreshed.success && refreshed.user) {
        updateUser(refreshed.user);
      }
      setStatusMessage(
        status === 'success' ? 'Payment verified. Access unlocked.' : 'Payment verified.'
      );
      navigate(consumeBootcampRedirect('/student-bootcamps/overview'), { replace: true });
    };

    verify();
  }, [location.search, navigate, updateUser]);

  useEffect(() => {
    let mounted = true;
    const loadKey = async () => {
      if (!isPaid) return;
      const response = await getBootcampAccessKey();
      if (!mounted) return;
      if (response.success) {
        setAccessKey(response.data?.bootcampAccessKey || '');
      }
    };
    loadKey();
    return () => { mounted = false; };
  }, [isPaid]);

  const pageClassName =
    'min-h-[calc(100vh-60px)] w-full px-[clamp(1rem,4vw,2rem)] pb-16 text-text-primary';
  const headerClassName = 'mb-6 flex flex-col gap-4';
  const headerInnerClassName = 'flex flex-wrap items-center justify-between gap-6';
  const headerLeftClassName = 'flex items-center gap-4';
  const iconWrapClassName = 'flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-bg-secondary text-brand';
  const breadcrumbClassName = 'flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-text-tertiary';
  const breadcrumbStrongClassName = 'font-semibold text-text-secondary';
  const visibilityClassName =
    'rounded-full border border-border bg-bg-secondary px-2 py-0.5 text-xs font-semibold uppercase tracking-widest text-text-secondary';
  const headerDescClassName = 'mt-1 text-sm text-text-secondary';
  const metaRowClassName = 'flex flex-wrap gap-3';
  const metaPillClassName =
    'inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-1 text-xs text-text-secondary';
  const metaValueClassName = 'font-semibold text-text-primary';
  const sectionTitleClassName = 'text-lg font-semibold text-text-primary';
  const sectionDescClassName = 'text-sm text-text-secondary';
  const panelClassName = 'rounded-lg border border-border bg-bg-secondary p-5 text-sm text-text-secondary';
  const listClassName = 'overflow-hidden rounded-sm border border-border';
  const rowClassName =
    'flex flex-col gap-3 border-b border-border bg-bg-secondary px-4 py-3 text-sm transition hover:bg-bg-tertiary sm:flex-row sm:items-center sm:justify-between';
  const rowTitleClassName = 'text-sm font-semibold text-text-primary';
  const rowSubtitleClassName = 'text-sm text-text-secondary';
  const buttonBaseClassName =
    'inline-flex items-center gap-2 rounded-xs border px-3 py-2 text-xs font-semibold transition disabled:opacity-60';
  const secondaryButtonClassName = `${buttonBaseClassName} border-border bg-bg-secondary text-text-primary hover:bg-bg-tertiary`;
  const primaryButtonClassName = `${buttonBaseClassName} border-brand bg-brand text-ink-onBrand hover:bg-brand/90`;

  return (
    <div className={pageClassName}>
      <header className={headerClassName}>
        <div className={headerInnerClassName}>
          <div className={headerLeftClassName}>
            <div className={iconWrapClassName}>
              <FiCreditCard size={20} />
            </div>
            <div>
              <div className={breadcrumbClassName}>
                <span className={breadcrumbStrongClassName}>HSOCIETY</span>
                <span>/</span>
                <span className={breadcrumbStrongClassName}>student-payments</span>
                <span className={visibilityClassName}>Private</span>
              </div>
              <p className={headerDescClassName}>Manage your bootcamp payment and unlock full access.</p>
            </div>
          </div>
        </div>
        <div className={metaRowClassName}>
          <span className={metaPillClassName}>
            <FiCreditCard size={13} className="text-text-tertiary" />
            <span>Payment</span>
            <strong className={metaValueClassName}>{isPaid ? 'PAID' : 'PENDING'}</strong>
          </span>
          <span className={metaPillClassName}>
            <FiShield size={13} className="text-text-tertiary" />
            <span>Registration</span>
            <strong className={metaValueClassName}>{isRegistered ? 'ENROLLED' : 'REQUIRED'}</strong>
          </span>
        </div>
      </header>

      <div className="grid gap-6">
        <main>
          <section className="flex flex-col gap-4">
            <h2 className={sectionTitleClassName}>
              <FiCreditCard size={15} className="mr-2 inline-block text-brand" />
              Bootcamp Access
            </h2>
            <p className={sectionDescClassName}>Payment unlocks all course modules, quizzes, and resources.</p>

            {accessRevoked && (
              <div className={panelClassName}>
                <p>Your bootcamp access is revoked. Contact support to resolve this issue.</p>
                <button
                  type="button"
                  className={secondaryButtonClassName}
                  onClick={() => navigate('/contact')}
                >
                  Contact Support
                </button>
              </div>
            )}

            {!isRegistered && !accessRevoked && (
              <div className={panelClassName}>
                <p>Register for the bootcamp before completing payment.</p>
                <button
                  type="button"
                  className={secondaryButtonClassName}
                  onClick={() => navigate('/student-bootcamps')}
                >
                  Go to Bootcamps
                </button>
              </div>
            )}

            {statusMessage && (
              <div className={panelClassName}>
                <p>{statusMessage}</p>
              </div>
            )}

            <div className={listClassName}>
              <article className={rowClassName}>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className={rowTitleClassName}>Bootcamp Access</span>
                  <span className={rowSubtitleClassName}>
                    {isPaid ? 'Payment complete. Full access unlocked.' : 'Payment required to unlock the bootcamp.'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={primaryButtonClassName}
                    onClick={handleOpenPayment}
                    disabled={isPaid || !isRegistered || accessRevoked}
                  >
                    {isPaid ? 'Paid' : 'Pay Now'}
                  </button>
                </div>
              </article>
              {isPaid && (
                <article className={rowClassName}>
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className={rowTitleClassName}>Bootcamp Access Key</span>
                    <span className={rowSubtitleClassName}>
                      {accessKey ? accessKey : 'Generating access key...'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className={secondaryButtonClassName}
                      onClick={() => accessKey && navigator.clipboard?.writeText(accessKey)}
                      disabled={!accessKey}
                    >
                      Copy Key
                    </button>
                  </div>
                </article>
              )}
              {isPaid && whatsappLink && (
                <article className={rowClassName}>
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className={rowTitleClassName}>Join WhatsApp Onboarding</span>
                    <span className={rowSubtitleClassName}>
                      Get live announcements and support from mentors.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className={primaryButtonClassName}
                      onClick={() => window.open(whatsappLink, '_blank', 'noopener,noreferrer')}
                    >
                      Join WhatsApp
                    </button>
                  </div>
                </article>
              )}
              <article className={rowClassName}>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className={rowTitleClassName}>Secure Checkout</span>
                  <span className={rowSubtitleClassName}>
                    Payments are securely processed. Reach out to support if you need assistance.
                  </span>
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>

      {showPaymentModal && (
        <StudentPaymentModal
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            updateUser({ bootcampPaymentStatus: 'pending', bootcampStatus: 'enrolled' });
            setShowPaymentModal(false);
            navigate(consumeBootcampRedirect('/student-bootcamps/overview'), { replace: true });
          }}
        />
      )}
    </div>
  );
};

export default StudentPayments;
