/* FILE: src/features/landing/sections/CommunityProfilesSection.jsx */
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiHeart, FiMessageCircle, FiMessageSquare } from 'react-icons/fi';
import { resolveProfileAvatar } from '../../../shared/utils/profileAvatar';
import Skeleton from '../../../shared/components/ui/Skeleton';
import cpIcon from '../../../assets/icons/CP/cp-icon.webp';
import { COMMUNITY_PROFILES_DATA } from '../../../data/landing/communityProfilesData';

const SCROLL_SPEED_PX = COMMUNITY_PROFILES_DATA.scrollSpeedPx ?? 22;
const CARD_WIDTH = 272; // px — fixed card width used for scroll math

/* ─────────────────────────────────────────────────────────────
   STYLE TOKENS — all inline, no CSS file dependency
───────────────────────────────────────────────────────────── */
const S = {
  section: {
    padding: '5rem 1.5rem',
    borderTop: '1px solid var(--border-color)',
    background: 'var(--bg-primary)',
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative',
  },

  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },

  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.65rem',
  },

  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.22rem 0.75rem',
    borderRadius: '999px',
    border: '1px solid var(--border-color)',
    color: 'var(--text-tertiary)',
    fontSize: '0.65rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
  },

  heading: {
    margin: 0,
    fontSize: 'clamp(1.4rem, 3vw, 2rem)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.025em',
    lineHeight: 1.2,
  },

  subtitle: {
    margin: 0,
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.65,
    maxWidth: '480px',
  },

  // Viewport clips the scrolling track
  viewport: {
    width: '100%',
    overflowX: 'auto',
    overflowY: 'hidden',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },

  // Track: one long horizontal row
  track: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    width: 'max-content',
  },

  // Each card
  card: (hovered) => ({
    flexShrink: 0,
    width: `${CARD_WIDTH}px`,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
    padding: '1.25rem',
    background: hovered ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-color)',
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
    outline: 'none',
  }),

  cardLast: {
    borderRight: 'none',
  },

  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    flexShrink: 0,
  },

  avatarWrap: {
    flexShrink: 0,
    width: '38px',
    height: '38px',
    minWidth: '38px',
    minHeight: '38px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-primary)',
  },

  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },

  nameBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.1rem',
    minWidth: 0,
    flex: 1,
    overflow: 'hidden',
  },

  handle: {
    margin: 0,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.67rem',
    color: 'var(--text-tertiary)',
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  name: {
    margin: 0,
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    lineHeight: 1.25,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  role: {
    fontSize: '0.67rem',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  bio: {
    margin: 0,
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    flex: 1,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },

  metrics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid var(--border-color)',
    marginTop: 'auto',
    flexShrink: 0,
  },

  metricRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.74rem',
    color: 'var(--text-secondary)',
  },

  metricCp: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.76rem',
    fontWeight: 600,
    color: 'var(--primary-color)',
  },

  cpIcon: {
    width: '13px',
    height: '13px',
    objectFit: 'contain',
    flexShrink: 0,
    display: 'block',
  },

  controls: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.4rem',
    marginTop: '0.6rem',
  },

  ctrlBtn: (hovered) => ({
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: hovered ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
    background: 'var(--bg-secondary)',
    color: hovered ? 'var(--primary-color)' : 'var(--text-secondary)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.15s ease, color 0.15s ease',
    padding: 0,
    flexShrink: 0,
  }),

  empty: {
    textAlign: 'center',
    padding: '3rem 1.5rem',
    color: 'var(--text-tertiary)',
    fontSize: '0.875rem',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    background: 'var(--bg-secondary)',
  },

  skeletonGrid: (cols) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: '1px',
    background: 'var(--border-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    overflow: 'hidden',
  }),

  skeletonCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
    padding: '1.25rem',
    background: 'var(--bg-secondary)',
    boxSizing: 'border-box',
  },

  skeletonHeaderRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
  },

  skeletonTextBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    flex: 1,
  },
};

/* ─── Control button with local hover ─── */
const CtrlBtn = ({ onClick, ariaLabel, children }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      style={S.ctrlBtn(hovered)}
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
};

/* ─── Single profile card ─── */
const ProfileCard = ({ profile, isLast, onEnter, onLeave, fmt }) => {
  const [hovered, setHovered] = useState(false);

  const { src: avatarSrc, fallback: avatarFallback } = resolveProfileAvatar(profile);

  const rawHandle = profile.hackerHandle
    ? profile.hackerHandle
    : profile.name
    ? profile.name.split(' ')[0].toLowerCase()
    : '';
  const normalizedHandle = rawHandle
    ? String(rawHandle).trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9._-]/g, '')
    : '';
  const handle = normalizedHandle ? `@${normalizedHandle}` : 'Handle unavailable';
  const profileUrl = normalizedHandle ? `/@${normalizedHandle}` : null;

  const cardStyle = {
    ...S.card(hovered),
    ...(isLast ? S.cardLast : {}),
  };

  const handlers = {
    onMouseEnter: () => { setHovered(true); onEnter(); },
    onMouseLeave: () => { setHovered(false); onLeave(); },
    onFocus: onEnter,
    onBlur: onLeave,
    style: cardStyle,
  };

  const body = (
    <>
      {/* Avatar + name row */}
      <div style={S.cardHeader}>
        <div style={S.avatarWrap}>
          <img
            src={avatarSrc}
            alt={profile.name || 'Community member'}
            style={S.avatarImg}
            onError={(e) => {
              if (e.currentTarget.src !== avatarFallback)
                e.currentTarget.src = avatarFallback;
            }}
          />
        </div>
        <div style={S.nameBlock}>
          <p style={S.handle}>{handle}</p>
          <p style={S.name}>{profile.name || 'Name unavailable'}</p>
          <span style={S.role}>{profile.role || 'Role unavailable'}</span>
        </div>
      </div>

      {/* Bio */}
      <p style={S.bio}>{profile.bio || 'Bio unavailable.'}</p>

      {/* Metrics */}
      <div style={S.metrics}>
        <div style={S.metricCp}>
          <img src={cpIcon} alt="" style={S.cpIcon} />
          <span>{fmt(profile.xpSummary?.totalXp)} CP</span>
        </div>
        <div style={S.metricRow}>
          <FiMessageSquare size={12} color="var(--text-tertiary)" />
          <span>{fmt(profile.stats?.messages)} messages</span>
        </div>
        <div style={S.metricRow}>
          <FiHeart size={12} color="var(--text-tertiary)" />
          <span>{fmt(profile.stats?.likesReceived)} likes</span>
        </div>
        <div style={S.metricRow}>
          <FiMessageCircle size={12} color="var(--text-tertiary)" />
          <span>{fmt(profile.stats?.commentsMade)} comments</span>
        </div>
      </div>
    </>
  );

  if (profileUrl) {
    return (
      <Link to={profileUrl} aria-label={`View ${handle} profile`} {...handlers}>
        {body}
      </Link>
    );
  }

  return <article {...handlers}>{body}</article>;
};

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
const CommunityProfilesSection = ({
  title,
  subtitle,
  profiles = [],
  loading = false,
  error = '',
}) => {
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotionRef = useRef(false);
  const carouselRef = useRef(null);
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);

  const slides = useMemo(() => profiles.filter(Boolean), [profiles]);
  const count = slides.length;

  /* Cards-per-view (for skeleton count only) */
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 640) return 1;
      if (w < 1024) return 2;
      return 3;
    };
    const update = () => setCardsPerView(calc());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* Detect reduced motion once */
  useEffect(() => {
    if (typeof window !== 'undefined')
      reduceMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  /* Duplicate slides for seamless loop */
  const loopSlides = useMemo(() => (!count ? [] : [...slides, ...slides]), [count, slides]);

  const pauseCarousel = useCallback(() => setIsPaused(true), []);
  const resumeCarousel = useCallback(() => setIsPaused(false), []);

  /* RAF scroll loop */
  useEffect(() => {
    if (!count || reduceMotionRef.current) return undefined;
    const el = carouselRef.current;
    const track = trackRef.current;
    if (!el || !track) return undefined;

    const normalize = () => {
      const half = track.scrollWidth / 2;
      if (half <= 0) return;
      if (el.scrollLeft >= half) el.scrollLeft -= half;
      else if (el.scrollLeft < 0) el.scrollLeft += half;
    };

    const tick = (t) => {
      if (!lastTimeRef.current) lastTimeRef.current = t;
      const dt = t - lastTimeRef.current;
      lastTimeRef.current = t;
      if (!isPaused) { el.scrollLeft += (SCROLL_SPEED_PX * dt) / 1000; normalize(); }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    el.addEventListener('scroll', normalize, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = null;
      el.removeEventListener('scroll', normalize);
    };
  }, [count, isPaused, loopSlides]);

  const scrollBy = useCallback((dir) => {
    carouselRef.current?.scrollBy({ left: CARD_WIDTH * dir, behavior: 'smooth' });
  }, []);

  const fmt = (v) => (v == null || Number.isNaN(v) ? '—' : v);

  return (
    <section style={S.section} id="community-profiles" className="reveal-on-scroll">
      {/* Inject one-liner to hide webkit scrollbar — no external CSS needed */}
      <style>{`.cp-vp::-webkit-scrollbar{display:none}`}</style>

      <div style={S.inner}>
        {/* ── Header ── */}
        <div style={S.header}>
          <span style={S.eyebrow}>{COMMUNITY_PROFILES_DATA.sectionEyebrow}</span>
          <h2 style={S.heading}>{title}</h2>
          <p style={S.subtitle}>{subtitle}</p>
        </div>

        {/* ── Loading ── */}
        {loading ? (
          <div style={S.skeletonGrid(cardsPerView)}>
            {Array.from({ length: cardsPerView }).map((_, i) => (
              <div key={i} style={S.skeletonCard}>
                <div style={S.skeletonHeaderRow}>
                  <Skeleton style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0 }} />
                  <div style={S.skeletonTextBlock}>
                    <Skeleton style={{ height: 11, width: '75%', borderRadius: 3 }} />
                    <Skeleton style={{ height: 11, width: '48%', borderRadius: 3 }} />
                  </div>
                </div>
                <Skeleton style={{ height: 11, width: '90%', borderRadius: 3 }} />
                <Skeleton style={{ height: 11, width: '100%', borderRadius: 3 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.5rem' }}>
                  {[0, 1, 2].map((mi) => (
                    <Skeleton key={mi} style={{ height: 9, width: '60%', borderRadius: 3 }} />
                  ))}
                </div>
              </div>
            ))}
          </div>

        /* ── Empty ── */
        ) : count === 0 ? (
          <div style={S.empty}>{error || COMMUNITY_PROFILES_DATA.emptyStateText}</div>

        /* ── Carousel ── */
        ) : (
          <div role="region" aria-label="Community profiles">
            {/* Scrollable viewport */}
            <div
              ref={carouselRef}
              className="cp-vp"
              style={S.viewport}
              aria-live="polite"
            >
              <div ref={trackRef} style={S.track}>
                {loopSlides.map((profile, gi) => (
                  <ProfileCard
                    key={`${profile.id || profile.name || gi}-${gi}`}
                    profile={profile}
                    isLast={gi === loopSlides.length - 1}
                    onEnter={pauseCarousel}
                    onLeave={resumeCarousel}
                    fmt={fmt}
                  />
                ))}
              </div>
            </div>

            {/* Controls */}
            <div style={S.controls}>
              <CtrlBtn onClick={() => scrollBy(-1)} ariaLabel="Scroll profiles left">
                <FiChevronLeft size={16} />
              </CtrlBtn>
              <CtrlBtn onClick={() => scrollBy(1)} ariaLabel="Scroll profiles right">
                <FiChevronRight size={16} />
              </CtrlBtn>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommunityProfilesSection;
