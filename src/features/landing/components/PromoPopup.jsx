import React, { useEffect, useRef, useState } from 'react';
import Button from '../../../shared/components/ui/Button';
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--modal-overlay-bg)] p-4 backdrop-blur"
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-title"
    >
      <div className="relative w-full max-w-[480px] max-h-[calc(100vh-(2*clamp(1rem,3vw,2rem)))] overflow-y-auto rounded-lg border border-border bg-bg-secondary px-[clamp(1.25rem,3vw,2rem)] pb-[clamp(1.1rem,2.5vw,1.75rem)] pt-[clamp(1.25rem,3vw,2rem)] shadow-xl">
        <button
          type="button"
          className="absolute right-3 top-3 rounded-sm px-1.5 py-0.5 text-xl leading-none text-text-tertiary transition-colors hover:text-text-primary"
          onClick={dismiss}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="mb-3 inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-text-tertiary">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Offensive Security Training
        </div>
        <h2 id="promo-title" className="mb-3 text-[1.4rem] font-semibold tracking-[-0.02em] text-text-primary">
          Start your security journey today.
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-text-secondary">
          Join HSOCIETY OFFSEC's structured bootcamp — hands-on labs, supervised pentests,
          and a community of operators building real skills.
        </p>
        <ul className="mb-6 flex flex-col gap-1.5 text-sm text-text-secondary">
          <li className="relative pl-5 before:absolute before:left-0 before:top-[0.1rem] before:text-brand before:content-['→']">
            Guided offensive security curriculum
          </li>
          <li className="relative pl-5 before:absolute before:left-0 before:top-[0.1rem] before:text-brand before:content-['→']">
            Real-world pentest engagements
          </li>
          <li className="relative pl-5 before:absolute before:left-0 before:top-[0.1rem] before:text-brand before:content-['→']">
            Earn CP and build your operator profile
          </li>
        </ul>
        <div className="flex flex-wrap gap-3 max-sm:flex-col">
          <Button type="button" variant="primary" size="small" onClick={handleCta} className="max-sm:w-full">
            Create free account
          </Button>
          <Button type="button" variant="secondary" size="small" onClick={dismiss} className="max-sm:w-full">
            Maybe later
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;
