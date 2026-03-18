import React, { useEffect, useState } from 'react';
import '@./notification-consent.css';

const STORAGE_KEY = 'hsociety_notification_consent';

const NotificationConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'default') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const handleChoice = async (value) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
    if (value === 'accepted' && typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        window.localStorage.setItem(STORAGE_KEY, result);
      } catch {
        // ignore
      }
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="notif-consent" role="dialog" aria-live="polite" aria-label="Notification permission">
      <div className="notif-consent-card">
        <div className="notif-consent-copy">
          <strong>Enable notifications?</strong>
          <p>Get alerts for account changes, mentions, and new activity even while you browse.</p>
        </div>
        <div className="notif-consent-actions">
          <button
            type="button"
            className="notif-consent-btn ghost"
            onClick={() => handleChoice('dismissed')}
          >
            Maybe later
          </button>
          <button
            type="button"
            className="notif-consent-btn primary"
            onClick={() => handleChoice('accepted')}
          >
            Allow notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationConsent;
