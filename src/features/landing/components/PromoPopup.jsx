import React, { useEffect, useRef, useState } from 'react';
import useAuthModal from '../../../shared/hooks/useAuthModal';

const STORAGE_KEY = 'hsociety.promo.dismissed.v1';
const DELAY_MS = 28000; // 28 seconds

const PromoPopup = () => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch { /* ignore */ }

    const show = () => {
      setVisible(true);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (timerRef.current) clearTimeout(timerRef.current);
    };

    const onMouseLeave = (e) => {
      if (e.clientY <= 0) show();
    };

    timerRef.current = setTimeout(show, DELAY_MS);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      clearTimeout(timerRef.current);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
  };

  const handleCta = () => {
    dismiss();
    openAuthModal('register');
  };

  if (!visible) return null;

  return (
    <div className="promo-overlay" role="dialog" aria-modal="true" aria-label="Start your security journey">
      <div className="promo-card">
        <button type="button" className="promo-close" onClick={dismiss} aria-label="Close">
          &times;
        </button>
        <div className="promo-eyebrow">
          <span className="promo-dot" />
          Offensive Security Training
        </div>
        <h2 className="promo-title">Start your security journey today.</h2>
        <p className="promo-body">
          Join HSOCIETY's structured bootcamp — hands-on labs, supervised pentests,
          and a community of operators building real skills.
        </p>
        <ul className="promo-list">
          <li>Guided offensive security curriculum</li>
          <li>Real-world pentest engagements</li>
          <li>Earn CP and build your operator profile</li>
        </ul>
        <div className="promo-actions">
          <button type="button" className="promo-btn-primary" onClick={handleCta}>
            Create free account
          </button>
          <button type="button" className="promo-btn-ghost" onClick={dismiss}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;
