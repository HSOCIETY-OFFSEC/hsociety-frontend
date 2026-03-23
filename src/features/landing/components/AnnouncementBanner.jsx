import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'hsociety.announcement.dismissed.v1';

const AnnouncementBanner = () => {
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  useLayoutEffect(() => {
    if (!visible) {
      document.documentElement.style.removeProperty('--ann-banner-height');
      return undefined;
    }

    const updateHeight = () => {
      const height = bannerRef.current?.offsetHeight || 0;
      document.documentElement.style.setProperty('--ann-banner-height', `${height}px`);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
      document.documentElement.style.removeProperty('--ann-banner-height');
    };
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
  };

  if (!visible) return null;

  return (
    <div className="ann-banner" ref={bannerRef} role="banner" aria-label="Announcement">
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
