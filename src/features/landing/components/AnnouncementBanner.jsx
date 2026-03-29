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
      document.documentElement.style.setProperty('--announcement-banner-height', `${height}px`);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
      document.documentElement.style.removeProperty('--ann-banner-height');
      document.documentElement.style.removeProperty('--announcement-banner-height');
    };
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 z-[calc(var(--z-sticky,60)+1)] flex items-center gap-3 border-b border-border bg-bg-secondary px-6 py-2 text-xs font-mono text-text-secondary shadow-sm"
      ref={bannerRef}
      role="banner"
      aria-label="Announcement"
    >
      <span className="rounded-full border border-brand/40 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-brand">
        New
      </span>
      <p className="min-w-0 flex-1 truncate text-xs text-text-secondary">
        Next bootcamp cohort is open — limited seats available.{' '}
        <a href="#pathways" className="font-semibold text-brand hover:underline" onClick={dismiss}>
          Secure your spot &rarr;
        </a>
      </p>
      <button
        type="button"
        className="rounded-sm px-1.5 py-0.5 text-base leading-none text-text-tertiary transition-colors hover:text-text-primary"
        onClick={dismiss}
        aria-label="Dismiss announcement"
      >
        &times;
      </button>
    </div>
  );
};

export default AnnouncementBanner;
