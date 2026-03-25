import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../core/auth/AuthContext';
import { envConfig } from '../../../config/app/env.config';
import './WhatsAppCommunityPopup.css';

const STORAGE_KEY = 'hsociety.whatsappPopup';

const WhatsAppCommunityPopup = () => {
  const { isAuthenticated } = useAuth();
  const [visible, setVisible] = useState(false);
  const whatsappUrl = envConfig.community?.whatsappUrl || '';

  useEffect(() => {
    if (!whatsappUrl) return;
    if (isAuthenticated && typeof window !== 'undefined') {
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
      sessionStorage.removeItem(STORAGE_KEY);
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="wa-popup-backdrop" role="dialog" aria-modal="true" aria-label="Join HSOCIETY WhatsApp community">
      <div className="wa-popup-card">
        <div className="wa-popup-badge">Community</div>
        <h3>Join the HSOCIETY WhatsApp Community</h3>
        <p>
          Get announcements, live session links, and direct support from the team.
        </p>
        <div className="wa-popup-actions">
          <button type="button" className="wa-btn-secondary" onClick={dismiss}>Maybe later</button>
          <button type="button" className="wa-btn-primary" onClick={joinCommunity}>Join now</button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppCommunityPopup;
