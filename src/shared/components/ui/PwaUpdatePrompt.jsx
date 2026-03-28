import React, { useCallback, useEffect, useRef, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';
import Button from './Button';

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
    <div
      className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center p-6"
      role="dialog"
      aria-modal="true"
      style={{
        paddingBottom: 'calc(1.5rem + var(--mobile-action-dock-height, 0px) + env(safe-area-inset-bottom))',
      }}
    >
      <div className="pointer-events-auto grid w-[min(92vw,560px)] gap-4 rounded-lg border border-border bg-card px-6 py-5 shadow-lg animate-pwa-update-rise max-sm:px-4 max-sm:py-4">
        <div className="pwa-update-content">
          <p className="m-0 text-xs uppercase tracking-[0.1em] text-text-tertiary">Update available</p>
          <h3 className="mt-2 text-lg">Install the latest version</h3>
          <p className="mt-1 text-text-secondary">
            A new deployment is ready. Update now to load the latest content and features.
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-3 max-sm:justify-stretch">
          <Button size="small" variant="primary" onClick={handleUpdate} className="max-sm:w-full">
            Update now
          </Button>
          <Button size="small" variant="ghost" onClick={handleLater} className="max-sm:w-full">
            Later
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PwaUpdatePrompt;
