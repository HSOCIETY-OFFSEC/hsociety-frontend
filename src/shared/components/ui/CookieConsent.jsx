import React, { useEffect, useState } from 'react';
import '@styles/shared/components/ui/cookie-consent.css';

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
    <div className="cookie-consent" role="dialog" aria-live="polite" aria-label="Cookie consent">
      <div className="cookie-consent-card">
        <div className="cookie-consent-copy">
          <strong>We use cookies</strong>
          <p>
            HSOCIETY uses essential cookies to keep you signed in and secure your session. Allow cookies to
            continue using the platform.
          </p>
        </div>
        <div className="cookie-consent-actions">
          <button
            type="button"
            className="cookie-consent-btn ghost"
            onClick={() => handleChoice('declined')}
          >
            Not now
          </button>
          <button
            type="button"
            className="cookie-consent-btn primary"
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
