import React, { useEffect, useState } from 'react';
const STORAGE_KEY = 'hsociety_cookie_consent';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const handleChoice = (value) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[color-mix(in_srgb,var(--bg-primary)_65%,transparent)] px-8 py-8 max-sm:px-5"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      style={{
        paddingBottom: 'calc(2rem + var(--mobile-action-dock-height, 0px) + env(safe-area-inset-bottom))',
      }}
    >
      <div className="flex min-h-[min(50vh,520px)] w-[min(960px,92vw)] items-start justify-between gap-8 rounded-2xl border border-border bg-bg-secondary px-9 py-8 shadow-lg max-sm:w-full max-sm:flex-col max-sm:items-stretch">
        <div className="flex flex-col gap-2 text-base text-text-secondary">
          <strong className="text-lg text-text-primary">We use cookies</strong>
          <p>
            HSOCIETY uses essential cookies to keep you signed in and secure your session. Allow cookies to
            continue using the platform.
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-wrap items-center gap-2 max-sm:w-full max-sm:justify-start">
          <button
            type="button"
            className="rounded-full border border-border bg-transparent px-5 py-2.5 text-sm text-text-secondary"
            onClick={() => handleChoice('declined')}
          >
            Not now
          </button>
          <button
            type="button"
            className="rounded-full border border-[color-mix(in_srgb,var(--primary-color)_60%,var(--bg-primary))] bg-brand px-5 py-2.5 text-sm font-semibold text-ink-white"
            onClick={() => handleChoice('accepted')}
          >
            Allow cookies
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
