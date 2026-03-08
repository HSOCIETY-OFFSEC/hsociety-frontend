import React, { useEffect, useState } from 'react';
import { FiArrowUp, FiMoon, FiRefreshCw, FiSettings, FiSun } from 'react-icons/fi';
import { useTheme } from '../../../app/providers';
import '../../../styles/shared/components/ui/FloatingUtilityToolbar.css';

const SHOW_AFTER_PX = 220;
const MIN_SCROLLABLE_PX = 420;

const FloatingUtilityToolbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [canScroll, setCanScroll] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [status, setStatus] = useState(null);
  const [showNotice, setShowNotice] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const themeOrder = ['light', 'dark', 'black'];
  const themeLabels = {
    light: 'White',
    dark: 'Dark',
    black: 'Black',
  };
  const currentIndex = themeOrder.indexOf(theme);
  const nextTheme = themeOrder[currentIndex === -1 ? 0 : (currentIndex + 1) % themeOrder.length];

  useEffect(() => {
    let ticking = false;

    const evaluate = () => {
      const doc = document.documentElement;
      const scrollable = Math.max(doc.scrollHeight - window.innerHeight, 0);
      const eligible = scrollable > MIN_SCROLLABLE_PX;
      setCanScroll(eligible);
      setShowTop(eligible && window.scrollY > SHOW_AFTER_PX);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(evaluate);
    };

    evaluate();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', evaluate);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', evaluate);
    };
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setShowNotice(false), 4200);
    return () => window.clearTimeout(timeoutId);
  }, []);

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
      message: updated ? 'Checked. If an update exists, a prompt will appear.' : 'Update service not ready.',
    });
  };

  return (
    <div className={`floating-utility-toolbar ${showNotice ? 'is-notice' : ''}`} aria-live="polite">
      {menuOpen && (
        <div className="floating-utility-menu" role="toolbar" aria-label="Quick actions">
          <button
            type="button"
            className="floating-utility-btn"
            onClick={handleCheckUpdates}
            aria-label="Check for updates"
          >
            <FiRefreshCw size={16} />
            <span>Updates</span>
          </button>

          <button
            type="button"
            className="floating-utility-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${themeLabels[nextTheme] || 'Dark'} mode`}
            title={`Switch to ${themeLabels[nextTheme] || 'Dark'} mode`}
          >
            {theme === 'light' ? <FiSun size={16} /> : <FiMoon size={16} />}
            <span>{themeLabels[theme] || 'Dark'}</span>
          </button>

          {showTop && canScroll && (
            <button
              type="button"
              className="floating-utility-btn"
              onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
              aria-label="Scroll to top"
            >
              <FiArrowUp size={16} />
              <span>Top</span>
            </button>
          )}
        </div>
      )}

      <button
        type="button"
        className="floating-utility-launcher"
        aria-label={menuOpen ? 'Close quick actions' : 'Open quick actions'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <FiSettings size={18} />
      </button>

      {status && <span className={`floating-utility-status ${status.type}`}>{status.message}</span>}
    </div>
  );
};

export default FloatingUtilityToolbar;
