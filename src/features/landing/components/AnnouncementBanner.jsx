import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'hsociety.announcement.dismissed.v1';

const AnnouncementBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
  };

  if (!visible) return null;

  return (
    <div className="ann-banner" role="banner" aria-label="Announcement">
      <span className="ann-badge">New</span>
      <p className="ann-text">
        Next bootcamp cohort is open — limited seats available.{' '}
        <a href="#pathways" className="ann-link" onClick={dismiss}>
          Secure your spot &rarr;
        </a>
      </p>
      <button
        type="button"
        className="ann-close"
        onClick={dismiss}
        aria-label="Dismiss announcement"
      >
        &times;
      </button>
    </div>
  );
};

export default AnnouncementBanner;
