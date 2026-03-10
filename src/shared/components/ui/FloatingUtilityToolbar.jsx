import React, { useEffect, useRef, useState } from 'react';
import { FiArrowUp, FiMoon, FiRefreshCw, FiSun, FiZap } from 'react-icons/fi';
import { useTheme } from '../../../app/providers';

// ─── Inline styles (replaces FloatingUtilityToolbar.css) ─────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap');

  :root {
    --rail-w: 48px;
    --rail-radius: 14px;
    --rail-gap: 2px;
  }

  /* ── Rail container ──────────────────────────────────────────────────── */
  .fut-rail {
    position: fixed;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1200;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: var(--rail-w);
    border-radius: var(--rail-radius);
    background: color-mix(in srgb, var(--bg-secondary, #0f172a) 92%, transparent);
    border: 1px solid color-mix(in srgb, var(--primary-color, #6366f1) 22%, rgba(255,255,255,0.06));
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.03) inset,
      0 24px 48px -12px rgba(0,0,0,0.55),
      0 4px 16px -4px rgba(0,0,0,0.4);
    backdrop-filter: blur(16px) saturate(1.4);
    overflow: hidden;
    animation: rail-in 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
    transition: box-shadow 0.3s ease;
  }

  .fut-rail:hover {
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.05) inset,
      0 28px 56px -12px rgba(0,0,0,0.65),
      0 0 0 1px color-mix(in srgb, var(--primary-color, #6366f1) 18%, transparent);
  }

  /* ── Brand nub at top ────────────────────────────────────────────────── */
  .fut-nub {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 0 10px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    position: relative;
  }

  .fut-nub-icon {
    width: 18px;
    height: 18px;
    color: color-mix(in srgb, var(--primary-color, #6366f1) 80%, white);
    opacity: 0.9;
    filter: drop-shadow(0 0 6px color-mix(in srgb, var(--primary-color, #6366f1) 60%, transparent));
  }

  /* ── Separator ───────────────────────────────────────────────────────── */
  .fut-sep {
    width: 60%;
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 0 auto;
  }

  /* ── Individual tool buttons ─────────────────────────────────────────── */
  .fut-tool {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 13px 0;
    border: none;
    background: transparent;
    color: color-mix(in srgb, var(--text-primary, #e2e8f0) 70%, transparent);
    cursor: pointer;
    transition:
      background 0.15s ease,
      color 0.15s ease,
      transform 0.15s ease;
    outline: none;
  }

  .fut-tool:hover {
    background: color-mix(in srgb, var(--primary-color, #6366f1) 10%, transparent);
    color: var(--text-primary, #e2e8f0);
  }

  .fut-tool:focus-visible {
    background: color-mix(in srgb, var(--primary-color, #6366f1) 15%, transparent);
    color: var(--text-primary, #e2e8f0);
    outline: 2px solid color-mix(in srgb, var(--primary-color, #6366f1) 55%, transparent);
    outline-offset: -2px;
  }

  .fut-tool:active {
    transform: scale(0.93);
  }

  .fut-tool.is-active {
    color: color-mix(in srgb, var(--primary-color, #6366f1) 90%, white);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 12%, transparent);
  }

  .fut-tool.is-spinning svg {
    animation: spin 1s linear infinite;
  }

  .fut-tool-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  /* ── Tooltip label ───────────────────────────────────────────────────── */
  .fut-tool-label {
    position: absolute;
    right: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%) translateX(4px);
    background: color-mix(in srgb, var(--bg-secondary, #0f172a) 96%, transparent);
    border: 1px solid color-mix(in srgb, var(--primary-color, #6366f1) 20%, rgba(255,255,255,0.08));
    color: var(--text-primary, #e2e8f0);
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
    padding: 5px 9px;
    border-radius: 7px;
    pointer-events: none;
    opacity: 0;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
    backdrop-filter: blur(8px);
    transition: opacity 0.15s ease, transform 0.15s ease;
  }

  .fut-tool:hover .fut-tool-label,
  .fut-tool:focus-visible .fut-tool-label {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }

  /* ── Arrow pip on tooltip ────────────────────────────────────────────── */
  .fut-tool-label::after {
    content: '';
    position: absolute;
    right: -5px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 8px;
    height: 8px;
    background: inherit;
    border-top: 1px solid color-mix(in srgb, var(--primary-color, #6366f1) 20%, rgba(255,255,255,0.08));
    border-right: 1px solid color-mix(in srgb, var(--primary-color, #6366f1) 20%, rgba(255,255,255,0.08));
    border-radius: 1px;
  }

  /* ── Status toast ────────────────────────────────────────────────────── */
  .fut-toast {
    position: absolute;
    right: calc(100% + 14px);
    bottom: 12px;
    max-width: 220px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.04em;
    color: var(--text-secondary, #94a3b8);
    background: color-mix(in srgb, var(--bg-secondary, #0f172a) 95%, transparent);
    border: 1px solid rgba(148, 163, 184, 0.15);
    padding: 7px 11px;
    border-radius: 9px;
    backdrop-filter: blur(8px);
    white-space: nowrap;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
    animation: toast-in 200ms ease both;
    pointer-events: none;
  }

  .fut-toast.success { color: #7dd3fc; border-color: rgba(125,211,252,0.2); }
  .fut-toast.error   { color: #fca5a5; border-color: rgba(252,165,165,0.2); }

  /* ── Scroll-to-top fade ──────────────────────────────────────────────── */
  .fut-tool.scroll-hidden {
    max-height: 0;
    padding: 0;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
    transition: max-height 0.25s ease, padding 0.25s ease, opacity 0.2s ease;
  }

  .fut-tool.scroll-visible {
    max-height: 60px;
    opacity: 1;
    pointer-events: auto;
    transition: max-height 0.25s ease, padding 0.25s ease, opacity 0.2s ease 0.05s;
  }

  /* ── Theme chip at bottom ────────────────────────────────────────────── */
  .fut-theme-chip {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--primary-color, #6366f1) 75%, white);
    opacity: 0.55;
    padding: 6px 0 10px;
    text-align: center;
    border-top: 1px solid rgba(255,255,255,0.05);
    width: 100%;
    pointer-events: none;
    user-select: none;
  }

  /* ── Animations ──────────────────────────────────────────────────────── */
  @keyframes rail-in {
    from { opacity: 0; transform: translateY(-50%) translateX(12px); }
    to   { opacity: 1; transform: translateY(-50%) translateX(0); }
  }

  @keyframes toast-in {
    from { opacity: 0; transform: translateX(4px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 640px) {
    .fut-rail {
      right: 10px;
      --rail-w: 42px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fut-rail { animation: none; }
    .fut-tool { transition: none; }
    .fut-tool.is-spinning svg { animation: none; }
  }
`;

// ─── Constants ────────────────────────────────────────────────────────────────
const SHOW_AFTER_PX = 220;
const MIN_SCROLLABLE_PX = 420;

const THEME_ORDER = ['light', 'dark', 'black'];
const THEME_LABELS = { light: 'Light', dark: 'Dark', black: 'Black' };

// ─── Component ────────────────────────────────────────────────────────────────
const FloatingUtilityToolbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [showTop, setShowTop]   = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  const [status, setStatus]     = useState(null);
  const [spinning, setSpinning] = useState(false);
  const statusTimer = useRef(null);

  // ── Scroll tracking ──────────────────────────────────────────────────────
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
    const onScroll = () => { if (!ticking) { ticking = true; window.requestAnimationFrame(evaluate); } };
    evaluate();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', evaluate);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', evaluate); };
  }, []);

  // ── Auto-clear status ────────────────────────────────────────────────────
  const showStatus = (s) => {
    clearTimeout(statusTimer.current);
    setStatus(s);
    statusTimer.current = setTimeout(() => setStatus(null), 4000);
  };

  // ── Update check ─────────────────────────────────────────────────────────
  const handleCheckUpdates = async () => {
    const checker = window.__hsocietyCheckForUpdates;
    if (typeof checker !== 'function') {
      showStatus({ type: 'error', message: 'Update service not ready.' });
      return;
    }
    setSpinning(true);
    showStatus({ type: 'checking', message: 'Checking…' });
    const updated = await checker();
    setSpinning(false);
    showStatus({
      type: updated ? 'success' : 'info',
      message: updated ? 'Prompt incoming if update found.' : 'Already up to date.',
    });
  };

  // ── Theme info ───────────────────────────────────────────────────────────
  const idx = THEME_ORDER.indexOf(theme);
  const nextTheme = THEME_ORDER[(idx === -1 ? 0 : idx + 1) % THEME_ORDER.length];
  const ThemeIcon = theme === 'light' ? FiSun : FiMoon;

  return (
    <>
      {/* Inject scoped styles */}
      <style>{css}</style>

      <div className="fut-rail" aria-label="Utility toolbar" role="toolbar">

        {/* Brand nub */}
        <div className="fut-nub" aria-hidden="true">
          <FiZap className="fut-nub-icon" />
        </div>

        {/* ── Check for updates ── */}
        <button
          type="button"
          className={`fut-tool${spinning ? ' is-spinning' : ''}`}
          onClick={handleCheckUpdates}
          aria-label="Check for updates"
        >
          <span className="fut-tool-icon"><FiRefreshCw size={15} /></span>
          <span className="fut-tool-label">Check updates</span>
        </button>

        <div className="fut-sep" aria-hidden="true" />

        {/* ── Toggle theme ── */}
        <button
          type="button"
          className="fut-tool"
          onClick={toggleTheme}
          aria-label={`Switch to ${THEME_LABELS[nextTheme] || 'Dark'} mode`}
        >
          <span className="fut-tool-icon"><ThemeIcon size={15} /></span>
          <span className="fut-tool-label">{THEME_LABELS[nextTheme] || 'Dark'} mode</span>
        </button>

        {/* ── Scroll to top (conditional) ── */}
        {canScroll && (
          <>
            <div className="fut-sep" aria-hidden="true" />
            <button
              type="button"
              className={`fut-tool ${showTop ? 'scroll-visible' : 'scroll-hidden'}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Scroll to top"
              tabIndex={showTop ? 0 : -1}
            >
              <span className="fut-tool-icon"><FiArrowUp size={15} /></span>
              <span className="fut-tool-label">Scroll to top</span>
            </button>
          </>
        )}

        {/* ── Theme chip ── */}
        <div className="fut-theme-chip" aria-hidden="true">{THEME_LABELS[theme] || '—'}</div>

        {/* ── Status toast ── */}
        {status && (
          <span key={status.message} className={`fut-toast ${status.type}`} role="status">
            {status.message}
          </span>
        )}
      </div>
    </>
  );
};

export default FloatingUtilityToolbar;