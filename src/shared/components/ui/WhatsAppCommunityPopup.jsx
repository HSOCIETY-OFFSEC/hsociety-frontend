import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../core/auth/AuthContext';
import { getWhatsAppLink } from '../../../config/app/social.config';
import Button from './Button';

const STORAGE_KEY = 'hsociety.whatsappPopup';
const JOINED_KEY = 'hsociety.whatsappJoined';

const WhatsAppCommunityPopup = () => {
  const { isAuthenticated } = useAuth();
  const [visible, setVisible] = useState(false);
  const whatsappUrl = getWhatsAppLink();

  useEffect(() => {
    if (!whatsappUrl) return;
    if (isAuthenticated && typeof window !== 'undefined') {
      if (localStorage.getItem(JOINED_KEY) === '1') return;
      const shouldShow = sessionStorage.getItem(STORAGE_KEY) === '1';
      if (shouldShow) setVisible(true);
    }
  }, [isAuthenticated, whatsappUrl]);

  const dismiss = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    setVisible(false);
  };

  const joinCommunity = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(JOINED_KEY, '1');
      sessionStorage.removeItem(STORAGE_KEY);
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[color-mix(in_srgb,var(--bg-primary)_64%,transparent)] p-6 backdrop-blur"
      role="dialog"
      aria-modal="true"
      aria-label="Join HSOCIETY WhatsApp community"
    >
      <div className="w-[min(520px,92vw)] rounded-lg border border-[color-mix(in_srgb,var(--primary-color)_35%,transparent)] bg-[radial-gradient(circle_at_top,color-mix(in_srgb,var(--primary-color)_18%,var(--bg-secondary)),var(--bg-secondary)_65%)] p-8 text-text-primary shadow-xl max-sm:p-6">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--primary-color)_20%,transparent)] px-3 py-1 text-[0.7rem] uppercase tracking-[0.08em] text-brand">
          Community
        </div>
        <h3 className="text-xl font-semibold">Join the HSOCIETY WhatsApp Community</h3>
        <p className="mt-3 text-text-secondary">
          Get announcements, live session links, and direct support from the team.
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3 max-sm:justify-stretch">
          <Button type="button" variant="ghost" size="small" onClick={dismiss} className="max-sm:w-full">
            Maybe later
          </Button>
          <Button type="button" variant="primary" size="small" onClick={joinCommunity} className="max-sm:w-full">
            Join now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppCommunityPopup;
