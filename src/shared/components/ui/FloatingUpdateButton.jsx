import React, { useState } from 'react';
import Button from './Button';
import '../../../styles/shared/components/ui/FloatingUpdateButton.css';

const FloatingUpdateButton = () => {
  const [status, setStatus] = useState(null);

  const handleCheckUpdates = async () => {
    if (typeof window === 'undefined') return;
    const checker = window.__hsocietyCheckForUpdates;
    if (typeof checker !== 'function') {
      setStatus({ type: 'error', message: 'Update service not ready.' });
      return;
    }

    setStatus({ type: 'checking', message: 'Checking for updates...' });
    const updated = await checker();
    setStatus({
      type: updated ? 'success' : 'info',
      message: updated ? 'Checked. If an update exists, a prompt will appear.' : 'Update service not ready.'
    });
  };

  return (
    <div className="floating-update">
      <Button size="small" variant="primary" onClick={handleCheckUpdates}>
        Check for updates
      </Button>
      {status && (
        <span className={`floating-update-status ${status.type}`}>
          {status.message}
        </span>
      )}
    </div>
  );
};

export default FloatingUpdateButton;
