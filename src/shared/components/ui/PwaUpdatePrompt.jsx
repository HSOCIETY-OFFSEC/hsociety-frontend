import React, { useEffect, useRef, useState } from 'react';
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
  const updateSWRef = useRef(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    updateSWRef.current = registerSW({
      immediate: true,
      onNeedRefresh() {
        setNeedRefresh(true);
      }
    });
  }, []);

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
