import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiTerminal, FiChevronDown } from 'react-icons/fi';
import { getSocialLinks } from '../../../../config/app/social.config';
import Logo from '../../../../shared/components/common/Logo';
import useRequestPentest from '../../../../shared/hooks/useRequestPentest';
import useAuthModal from '../../../../shared/hooks/useAuthModal';
import { validateEmail } from '../../../../core/validation/input.validator';

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
      {parts.map((part, i) => {
        if (!HACKER_RE.test(part)) return part;
        return (
          <span
            key={i}
            className="relative inline-flex items-end gap-1 px-1.5 pb-1 text-brand before:mr-0.5 before:text-[0.85em] before:tracking-[0.08em] before:content-['<'] after:ml-0.5 after:text-[0.85em] after:tracking-[0.08em] after:content-['/>'] before:font-mono after:font-mono"
          >
            <span className="relative">{part}</span>
          </span>
        );
      })}
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

  const heroCtaLabel = ctas?.[0]?.label || 'Sign up for HSOCIETY OFFSEC';

  return (
    <section className="relative flex h-[100svh] min-h-[600px] w-full items-center justify-center overflow-hidden pb-0 pt-8">
      <div
        className="pointer-events-none absolute -inset-[6%] z-0 bg-[image:var(--hero-brand-image)] bg-cover bg-center bg-no-repeat opacity-90 blur-[12px] saturate-90 brightness-110 hue-rotate-[-6deg]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 z-[2] opacity-0" aria-hidden="true" />

      {/* ── Radial glow behind title ── */}
      <div
        className="pointer-events-none absolute left-1/2 top-[30%] z-[1] h-[clamp(300px,50vh,600px)] w-[clamp(400px,70vw,900px)] -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />

      

      <div className="relative z-[3] flex h-full w-full max-w-[900px] flex-col items-center justify-center gap-5 px-6 py-10 text-center">

        {/* TITLE */}
        <div className="flex w-full flex-col items-center gap-1 animate-hs-reveal" style={{ animationDelay: '0.08s' }}>
          {/* Single-line (desktop) */}
          <h1 className="hidden min-h-[1.1em] whitespace-nowrap text-center text-[clamp(4rem,8.5vw,9rem)] font-extrabold leading-[1.06] tracking-[-0.05em] text-text-primary lg:block">
            <span className="inline">
              <ColoredText text={singleText} />
            </span>
            {cursorSingle && (
              <span className="ml-2 inline-block h-[1.15em] w-[3px] rounded-sm bg-brand align-baseline animate-hero-cursor motion-reduce:animate-none" aria-hidden="true" />
            )}
            {!cursorSingle && (
              <span className="ml-2 inline-block h-[1.15em] w-[3px] rounded-sm bg-[color-mix(in_srgb,var(--primary-color)_60%,var(--text-tertiary))] align-baseline opacity-70 animate-hero-cursor-idle motion-reduce:animate-none" aria-hidden="true" />
            )}
          </h1>

          {/* Line 1 */}
          <h1
            className="min-h-[1.1em] text-[clamp(3rem,8vw,6.5rem)] font-extrabold leading-[1.06] tracking-[-0.04em] text-text-primary lg:hidden"
            style={{ contain: 'layout style' }}
          >
            <span className="inline">
              <ColoredText text={text1} />
            </span>
            {cursorOnLine1 && (
              <span className="ml-2 inline-block h-[1.15em] w-[3px] rounded-sm bg-brand align-baseline animate-hero-cursor motion-reduce:animate-none" aria-hidden="true" />
            )}
          </h1>

          {/* Line 2 */}
          {line2 && (
            <h1
              className={`min-h-[1.1em] text-[clamp(3rem,8vw,6.5rem)] font-extrabold leading-[1.06] tracking-[-0.04em] text-text-primary lg:hidden ${done1 ? '' : 'invisible'}`}
              aria-hidden={!done1}
              style={{ contain: 'layout style' }}
            >
              <span className="inline">
                <ColoredText text={done1 ? text2 : line2} />
              </span>
              {cursorOnLine2 && (
                <span className="ml-2 inline-block h-[1.15em] w-[3px] rounded-sm bg-brand align-baseline animate-hero-cursor motion-reduce:animate-none" aria-hidden="true" />
              )}
              {cursorIdle && (
                <span className="ml-2 inline-block h-[1.15em] w-[3px] rounded-sm bg-[color-mix(in_srgb,var(--primary-color)_60%,var(--text-tertiary))] align-baseline opacity-70 animate-hero-cursor-idle motion-reduce:animate-none" aria-hidden="true" />
              )}
            </h1>
          )}
        </div>

        {/* DESCRIPTION */}
        <p
          className="max-w-[560px] text-[clamp(0.95rem,1.8vw,1.05rem)] leading-[1.75] text-text-secondary animate-hs-reveal"
          style={{ animationDelay: '0.22s' }}
        >
          {description ||
            'HSOCIETY OFFSEC is a cybersecurity ecosystem that trains beginners, integrates them into a community, and deploys them into supervised real-world security engagements.'}
        </p>

        {/* CTAs */}
        <div className="flex w-full max-w-[560px] flex-col items-center gap-2 animate-hs-reveal" style={{ animationDelay: '0.36s' }}>
          <form className="w-full" onSubmit={handleEmailSubmit} noValidate>
            <div className="relative w-full">
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
                className="w-full rounded-lg border border-border bg-bg-secondary px-5 py-4 pr-4 text-sm text-text-primary transition-all focus:border-[color-mix(in_srgb,var(--primary-color)_50%,var(--border-color))] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary-color)_20%,transparent)] sm:pr-[11.5rem]"
              />
              <button
                type="submit"
                className="mt-3 w-full rounded-md bg-brand px-5 py-3 text-sm font-semibold text-ink-white sm:absolute sm:right-2 sm:top-1/2 sm:mt-0 sm:w-auto sm:-translate-y-1/2"
              >
                {heroCtaLabel}
              </button>
            </div>
          </form>
          {emailError && (
            <p className="text-sm text-brand" role="alert">{emailError}</p>
          )}
          <button
            type="button"
            className="text-sm text-text-tertiary transition-colors hover:text-text-primary"
            onClick={() => openAuthModal('login', { email: String(email || '').trim().toLowerCase() || undefined })}
          >
            Already have an account? Sign in.
          </button>
        </div>

        {/* SOCIAL + SCROLL FOOTER */}
        <div className="flex w-full flex-col items-center gap-2">
          <div className="flex flex-wrap justify-center gap-2 animate-hs-reveal" style={{ animationDelay: '0.48s' }}>
            {getSocialLinks().map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.key}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-bg-secondary text-text-secondary transition-colors hover:border-brand hover:bg-[color-mix(in_srgb,var(--primary-color)_8%,var(--bg-secondary))] hover:text-brand"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>

          <div
            className={`flex items-center justify-center text-text-tertiary transition-opacity motion-reduce:animate-none ${
              pulse ? 'opacity-60 animate-hero-scroll-pulse' : 'opacity-0'
            }`}
            aria-hidden="true"
          >
            <FiChevronDown size={18} />
          </div>
        </div>
      </div>

      {requestPentestModal}
    </section>
  );
};

export default HeroSection;
