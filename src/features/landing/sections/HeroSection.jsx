import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiTerminal, FiChevronDown } from 'react-icons/fi';
import { getSocialLinks } from '../../../config/social.config';
import Logo from '../../../shared/components/common/Logo';
import useRequestPentest from '../../../shared/hooks/useRequestPentest';
import useAuthModal from '../../../shared/hooks/useAuthModal';
import { validateEmail } from '../../../core/validation/input.validator';
import '../../../styles/landing/hero.css';

/* ════════════════════════════════════════
   BINARY RAIN
════════════════════════════════════════ */
function makeBinaryString(len) {
  let s = '';
  for (let i = 0; i < len; i++) {
    s += Math.random() > 0.5 ? '1' : '0';
    if (i > 0 && i % 8 === 7) s += ' ';
  }
  return s;
}

const BinaryStreamCol = ({ index }) => {
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

const STREAM_COUNT = 33;

const BinaryRain = () => (
  <div className="hero-binary-stream" aria-hidden="true">
    {Array.from({ length: STREAM_COUNT }, (_, i) => (
      <BinaryStreamCol key={i} index={i} />
    ))}
  </div>
);

/* ════════════════════════════════════════
   TYPEWRITER HOOK
════════════════════════════════════════ */
function useTypewriter(text, { speed = 38, startDelay = 300 } = {}) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);
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
          const jitter = speed + (Math.random() * 20 - 10);
          timerRef.current = setTimeout(tick, Math.max(14, jitter));
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

/* ════════════════════════════════════════
   COLOR "Hacker/Hackers" — accent only
════════════════════════════════════════ */
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

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
const HeroSection = ({ content }) => {
  const { requestPentestModal } = useRequestPentest();
  const { openAuthModal } = useAuthModal();
  const { ctas, title, description } = content;
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  /* ── Title cycling ── */
  const defaultTitles = [
    'Train like a|Hacker.',
    'Prepare for|Hackers.',
  ];
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const hasOverride = Boolean(title && String(title).trim());
    if (hasOverride) return undefined;
    const timer = window.setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % defaultTitles.length);
    }, 3800);
    return () => window.clearInterval(timer);
  }, [title]);

  const resolvedTitle = useMemo(() => {
    if (title && String(title).trim()) return title;
    return defaultTitles[titleIndex];
  }, [title, titleIndex]);

  /* Split on | for two lines */
  const [line1, line2] = String(resolvedTitle || '').split('|');
  const singleLineTitle = String(resolvedTitle || '').replace('|', ' ');

  /* Typewriter for each line */
  const { displayed: text1, isDone: done1 } = useTypewriter(line1 || '', { speed: 32, startDelay: 250 });
  const { displayed: text2, isDone: done2 } = useTypewriter(
    done1 ? (line2 || '') : '',
    { speed: 32, startDelay: 100 }
  );
  const { displayed: singleText, isDone: singleDone } = useTypewriter(singleLineTitle, { speed: 28, startDelay: 200 });

  const cursorOnLine1 = !done1;
  const cursorOnLine2 = done1 && line2 && !done2;
  const cursorIdle    = done1 && (!line2 || done2);
  const cursorSingle  = !singleDone;

  /* Scroll-down arrow pulse */
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setPulse(true), 2200);
    return () => clearTimeout(id);
  }, []);

  /* Handle CTA click */
  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setEmailError('');
    const normalized = String(email || '').trim().toLowerCase();
    if (!validateEmail(normalized)) {
      setEmailError('Enter a valid email address to continue.');
      return;
    }
    openAuthModal('register', { email: normalized, payload: { email: normalized } });
  };

  const heroCtaLabel = ctas?.[0]?.label || 'Sign up for HSOCIETY';

  return (
    <section className="hero-section hero-section--centered">
      <BinaryRain />
      <div className="hero-grid-overlay" aria-hidden="true" />

      {/* ── Radial glow behind title ── */}
      <div className="hero-center-glow" aria-hidden="true" />

      {/* ── Logo silhouette watermark ── */}
      <div className="hero-logo-silhouette" aria-hidden="true">
        <Logo size="xlarge" className="hero-logo-silhouette-img" />
      </div>

      <div className="hero-centered-container">

        {/* KICKER */}
        <p className="hero-kicker hero-kicker--center hs-reveal">
          <FiTerminal size={12} aria-hidden="true" />
          Real Attacks. Real Security.
        </p>

        {/* TITLE */}
        <div className="hero-title-block hs-reveal hs-reveal--delay-1">
          {/* Single-line (desktop) */}
          <h1 className="hero-title-mega hero-title-mega--single">
            <span className="hero-typed-text">
              <ColoredText text={singleText} />
            </span>
            {cursorSingle && (
              <span className="hero-type-cursor" aria-hidden="true" />
            )}
            {!cursorSingle && (
              <span className="hero-type-cursor hero-type-cursor--idle" aria-hidden="true" />
            )}
          </h1>

          {/* Line 1 */}
          <h1 className="hero-title-mega hero-title-mega--line1">
            <span className="hero-typed-text">
              <ColoredText text={text1} />
            </span>
            {cursorOnLine1 && (
              <span className="hero-type-cursor" aria-hidden="true" />
            )}
          </h1>

          {/* Line 2 */}
          {line2 && (
            <h1
              className={`hero-title-mega hero-title-mega--line2 hs-reveal ${done1 ? '' : 'hero-title-mega--ghost'}`}
              aria-hidden={!done1}
            >
              <span className="hero-typed-text">
                <ColoredText text={done1 ? text2 : line2} />
              </span>
              {cursorOnLine2 && (
                <span className="hero-type-cursor" aria-hidden="true" />
              )}
              {cursorIdle && (
                <span className="hero-type-cursor hero-type-cursor--idle" aria-hidden="true" />
              )}
            </h1>
          )}
        </div>

        {/* DESCRIPTION */}
        <p className="hero-desc-centered hs-reveal hs-reveal--delay-2">
          {description ||
            'HSOCIETY is a cybersecurity ecosystem that trains beginners, integrates them into a community, and deploys them into supervised real-world security engagements.'}
        </p>

        {/* CTAs */}
        <div className="hero-cta-centered hs-reveal hs-reveal--delay-3">
          <form className="hero-email-form" onSubmit={handleEmailSubmit} noValidate>
            <div className="hero-email-shell">
              <input
                type="email"
                name="hero-email"
                aria-label="Email address"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (emailError) setEmailError('');
                }}
                autoComplete="email"
                inputMode="email"
                className="hero-email-input"
              />
              <button
                type="submit"
                className="hero-email-button"
              >
                {heroCtaLabel}
              </button>
            </div>
          </form>
          {emailError && (
            <p className="hero-email-error" role="alert">{emailError}</p>
          )}
          <button
            type="button"
            className="hero-email-signin"
            onClick={() => openAuthModal('login', { email: String(email || '').trim().toLowerCase() || undefined })}
          >
            Already have an account? Sign in.
          </button>
        </div>

        {/* SOCIAL LINKS */}
        <div className="hero-socials-centered hs-reveal hs-reveal--delay-4">
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
                <Icon size={16} />
              </a>
            );
          })}
        </div>

        {/* SCROLL CUE */}
        <div className={`hero-scroll-cue-centered ${pulse ? 'hero-scroll-cue-centered--visible' : ''}`} aria-hidden="true">
          <FiChevronDown size={18} />
        </div>
      </div>

      {requestPentestModal}
    </section>
  );
};

export default HeroSection;
