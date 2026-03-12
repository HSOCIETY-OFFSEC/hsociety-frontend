import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiArrowRight,
  FiTerminal
} from 'react-icons/fi';
import { getSocialLinks } from '../../../config/social.config';
import Button from '../../../shared/components/ui/Button';
import Logo from '../../../shared/components/common/Logo';
import useRequestPentest from '../../../shared/hooks/useRequestPentest';
import useAuthModal from '../../../shared/hooks/useAuthModal';
import { trackEvent } from '../../../shared/services/analytics.service';
import { ROUTES } from '../../../app/routes';
import '../../../styles/landing/hero.css';

/* ══════════════════════════════════════════════════════════
   BINARY RAIN — streams of 0s and 1s scrolling vertically.
   Pure CSS animation; no JS timers or canvas needed.
   ══════════════════════════════════════════════════════════ */

// Generate a random binary string of given length
function makeBinaryString(len) {
  let s = '';
  for (let i = 0; i < len; i++) {
    s += Math.random() > 0.5 ? '1' : '0';
    // Occasionally inject a space for readability / variety
    if (i > 0 && i % 8 === 7) s += ' ';
  }
  return s;
}

// One scrolling column: a long text block that CSS scrolls downward
const BinaryStreamCol = ({ index }) => {
  // Each column gets a unique seed so they all look different
  const text = useMemo(() => makeBinaryString(220), []);
  return (
    <div
      className="hero-binary-stream-col"
      aria-hidden="true"
      style={{ '--col-index': index }}
    >
      {text}
    </div>
  );
};

const STREAM_COUNT = 33; // matches CSS nth-child rules above

const BinaryRain = () => (
  <div className="hero-binary-stream" aria-hidden="true">
    {Array.from({ length: STREAM_COUNT }, (_, i) => (
      <BinaryStreamCol key={i} index={i} />
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════
   TYPEWRITER HOOK
   ══════════════════════════════════════════════════════════ */
function useTypewriter(text, { speed = 45, startDelay = 350 } = {}) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone]       = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setDisplayed('');
    setIsDone(false);
    let index = 0;

    const startTimer = setTimeout(() => {
      const tick = () => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index < text.length) {
          const jitter = speed + (Math.random() * 28 - 14);
          timerRef.current = setTimeout(tick, Math.max(16, jitter));
        } else {
          setIsDone(true);
        }
      };
      tick();
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(timerRef.current);
    };
  }, [text, speed, startDelay]);

  return { displayed, isDone };
}

/* ══════════════════════════════════════════════════════════
   COLOR "Hacker" / "Hackers" wherever they appear in text.
   ══════════════════════════════════════════════════════════ */
const HACKER_RE = /(Hackers?)/g;

const ColoredText = ({ text }) => {
  const parts = text.split(HACKER_RE);
  return (
    <>
      {parts.map((part, i) =>
        HACKER_RE.test(part)
          ? <span key={i} className="hero-hacker-word">{part}</span>
          : part
      )}
    </>
  );
};

/* ══════════════════════════════════════════════════════════
   TYPED TITLE
   ══════════════════════════════════════════════════════════ */
const TypedTitle = ({ line1, line2 }) => {
  const { displayed: text1, isDone: done1 } = useTypewriter(line1, {
    speed: 28,
    startDelay: 200,
  });

  const { displayed: text2, isDone: done2 } = useTypewriter(
    done1 ? (line2 || '') : '',
    { speed: 28, startDelay: 80 }
  );

  const showLine2    = Boolean(line2);
  const cursorOnLine1 = !done1;
  const cursorOnLine2 = done1 && showLine2 && !done2;
  const cursorIdle    = done1 && (!showLine2 || done2);

  return (
    <h1 className="hero-title">
      <span className="hero-typed-line">
        <span className="hero-typed-text"><ColoredText text={text1} /></span>
        {cursorOnLine1 && <span className="hero-type-cursor" aria-hidden="true" />}
        {cursorIdle && !showLine2 && (
          <span className="hero-type-cursor hero-type-cursor--idle" aria-hidden="true" />
        )}
      </span>

      {showLine2 && done1 && (
        <>
          <br />
          <span className="hero-typed-line">
            <span className="hero-typed-text"><ColoredText text={text2} /></span>
            {cursorOnLine2 && <span className="hero-type-cursor" aria-hidden="true" />}
            {cursorIdle && (
              <span className="hero-type-cursor hero-type-cursor--idle" aria-hidden="true" />
            )}
          </span>
        </>
      )}
    </h1>
  );
};

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */
const HeroSection = ({ content }) => {
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const { requestPentest, requestPentestModal } = useRequestPentest();
  const { openAuthModal } = useAuthModal();
  const { badge, ctas, title, description } = content;

  const defaultTitles = [
    'Train like a Hacker.|Prepare for Hackers',
    'Train like a Hacker.|Become a Hacker',
  ];
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const hasOverride = Boolean(title && String(title).trim());
    if (hasOverride) return undefined;
    const timer = window.setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % defaultTitles.length);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [title]);

  const resolvedTitle = useMemo(() => {
    if (title && String(title).trim()) return title;
    return defaultTitles[titleIndex];
  }, [title, titleIndex]);

  const [titleLine1, titleLine2] = String(resolvedTitle || '').split('|');

  return (
    <section className="hero-section" ref={heroRef}>

      {/* ── Binary rain — bottom-most layer ── */}
      <BinaryRain />

      {/* ── Grid overlay — sits above binary rain ── */}
      <div className="hero-grid-overlay" aria-hidden="true" />

      <div className="hero-container">

        {/* ── LEFT: Content ── */}
        <div className="hero-content-panel">

          {/* Kicker */}
          <p className="hero-kicker">
            <FiTerminal size={14} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
            Real Attacks. Real Security.
          </p>

          {/* ── TYPED TITLE ── */}
          <TypedTitle line1={titleLine1 || title || 'Train like a Hacker.'} line2={titleLine2} />

          {/* Description */}
          <p className="hero-description">
            {description ||
              'HSOCIETY is a cybersecurity ecosystem that trains beginners, integrates them into a community, and deploys them into supervised real-world security engagements.'}
          </p>

          {/* CTAs */}
          <div className="hero-cta">
            {ctas.map((cta, index) => (
              <Button
                key={cta.label}
                variant={cta.variant}
                size="large"
                onClick={() => {
                  trackEvent('landing_cta_click', { location: 'hero', route: cta.route });
                  if (cta.route === ROUTES.CORPORATE_PENTEST) { requestPentest(); return; }
                  if (cta.route === ROUTES.LOGIN)             { openAuthModal('login'); return; }
                  if (cta.route === ROUTES.REGISTER)          { openAuthModal('register'); return; }
                  if (cta.route === ROUTES.CORPORATE_REGISTER){ openAuthModal('register-corporate'); return; }
                  navigate(cta.route);
                }}
              >
                {cta.label}
                {index === 0 ? <FiArrowUpRight size={17} /> : <FiArrowRight size={17} />}
              </Button>
            ))}
          </div>

          <div className="hero-socials">
            {getSocialLinks().map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.key}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  className="hero-social-link"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>

          <div className="hero-scroll-cue" aria-hidden="true">
            <span className="hero-scroll-text">Scroll</span>
            <span className="hero-scroll-arrow" />
          </div>

        </div>

        {/* ── RIGHT: Logo visual ── */}
        <div className="hero-visual-panel">
          <div className="hero-logo-wrap">
            <div className="hero-logo-halo" />
            <div className="hero-logo-binary" aria-hidden="true" />
            <Logo size="xlarge" className="hero-logo-minimal" />
          </div>
        </div>

      </div>
      {requestPentestModal}
    </section>
  );
};

export default HeroSection;
