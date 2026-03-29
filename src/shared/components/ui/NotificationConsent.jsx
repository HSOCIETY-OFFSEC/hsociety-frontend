import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../core/auth/AuthContext';
const STORAGE_KEY = 'hsociety_notification_consent';

const NotificationConsent = () => {
  const [visible, setVisible] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'default') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, [isAuthenticated]);

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
    <div
      className="pointer-events-none fixed inset-0 z-50 flex items-end justify-end p-5"
      role="dialog"
      aria-live="polite"
      aria-label="Notification permission"
      style={{
        paddingBottom: 'calc(1.2rem + var(--mobile-action-dock-height, 0px) + env(safe-area-inset-bottom))',
      }}
    >
      <div className="pointer-events-auto flex w-[min(360px,100%)] flex-col gap-3 rounded-2xl border border-border bg-bg-secondary p-4 shadow-lg">
        <div className="flex flex-col gap-1.5 text-sm text-text-secondary">
          <strong className="text-base text-text-primary">Enable notifications?</strong>
          <p>Get alerts for account changes, mentions, and new activity even while you browse.</p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded-full border border-border bg-transparent px-3.5 py-1.5 text-xs text-text-secondary"
            onClick={() => handleChoice('dismissed')}
          >
            Maybe later
          </button>
          <button
            type="button"
            className="rounded-full border border-[color-mix(in_srgb,var(--primary-color)_60%,var(--bg-primary))] bg-brand px-3.5 py-1.5 text-xs font-semibold text-ink-white"
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
