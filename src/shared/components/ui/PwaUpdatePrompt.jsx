import React, { useCallback, useEffect, useRef, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';
import Button from './Button';
import '../../../styles/shared/components/ui/PwaUpdatePrompt.css';

/**
 * PWA Update Prompt
 * Location: src/shared/components/ui/PwaUpdatePrompt.jsx
 *
 * Shows a prompt when a new service worker is waiting.
 */

const PwaUpdatePrompt = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const updateSWRef = useRef(null);
  const registrationRef = useRef(null);

  const checkForUpdates = useCallback(async () => {
    setIsChecking(true);
    try {
      if (registrationRef.current) {
        await registrationRef.current.update();
        return true;
      }
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    let updateIntervalId = null;

    updateSWRef.current = registerSW({
      immediate: true,
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onRegisteredSW(_, registration) {
        if (!registration) return;
        registrationRef.current = registration;
        checkForUpdates();
        updateIntervalId = window.setInterval(checkForUpdates, 60 * 1000);
      }
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdates();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (updateIntervalId) {
        window.clearInterval(updateIntervalId);
      }
    };
  }, [checkForUpdates]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    window.__hsocietyCheckForUpdates = checkForUpdates;
    window.__hsocietyIsCheckingUpdates = () => isChecking;
    return () => {
      delete window.__hsocietyCheckForUpdates;
      delete window.__hsocietyIsCheckingUpdates;
    };
  }, [checkForUpdates, isChecking]);

  const handleUpdate = () => {
    if (updateSWRef.current) {
      updateSWRef.current(true);
    }
  };

  const handleLater = () => {
    setNeedRefresh(false);
  };

  if (!needRefresh) return null;

  return (
    <div className="pwa-update-backdrop" role="dialog" aria-modal="true">
      <div className="pwa-update-card">
        <div className="pwa-update-content">
          <p className="pwa-update-eyebrow">Update available</p>
          <h3>Install the latest version</h3>
          <p>
            A new deployment is ready. Update now to load the latest content and features.
          </p>
        </div>
        <div className="pwa-update-actions">
          <Button size="small" variant="primary" onClick={handleUpdate}>
            Update now
          </Button>
          <Button size="small" variant="ghost" onClick={handleLater}>
            Later
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PwaUpdatePrompt;
