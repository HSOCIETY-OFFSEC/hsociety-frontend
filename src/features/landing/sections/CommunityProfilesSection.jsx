import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiHeart, FiMessageCircle, FiMessageSquare } from 'react-icons/fi';
import { getGithubAvatarDataUri } from '../../../shared/utils/avatar';
import Skeleton from '../../../shared/components/ui/Skeleton';
import cpIcon from '../../../assets/icons/CP/cp-icon.webp';
import { COMMUNITY_PROFILES_DATA } from '../../../data/landing/communityProfilesData';
import '../../../styles/landing/community-profiles.css';

const SCROLL_SPEED_PX = COMMUNITY_PROFILES_DATA.scrollSpeedPx ?? 22;

/* ─── Lightweight canvas orb background ────────────────────────────────────── */
const OrbCanvas = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const dots = Array.from({ length: 80 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.00035,
      speedY: (Math.random() - 0.5) * 0.00035,
      alpha: Math.random() * 0.35 + 0.1,
      color: Math.random() > 0.5 ? '45,212,191' : '31,191,143',
    }));

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const drawGlow = (width, height, time) => {
      const cx1 = width * 0.78 + Math.sin(time * 0.0005) * 24;
      const cy1 = height * 0.38 + Math.cos(time * 0.0004) * 20;
      const g1 = ctx.createRadialGradient(cx1, cy1, 4, cx1, cy1, 140);
      g1.addColorStop(0, 'rgba(31,191,143,0.16)');
      g1.addColorStop(1, 'rgba(31,191,143,0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const cx2 = width * 0.22 + Math.cos(time * 0.00055) * 20;
      const cy2 = height * 0.62 + Math.sin(time * 0.00045) * 18;
      const g2 = ctx.createRadialGradient(cx2, cy2, 2, cx2, cy2, 120);
      g2.addColorStop(0, 'rgba(45,212,191,0.14)');
      g2.addColorStop(1, 'rgba(45,212,191,0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);
    };

    const tick = (time) => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);
      drawGlow(width, height, time);

      dots.forEach((dot) => {
        dot.x += dot.speedX;
        dot.y += dot.speedY;
        if (dot.x < -0.05) dot.x = 1.05;
        if (dot.x > 1.05) dot.x = -0.05;
        if (dot.y < -0.05) dot.y = 1.05;
        if (dot.y > 1.05) dot.y = -0.05;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${dot.color}, ${dot.alpha})`;
        ctx.arc(dot.x * width, dot.y * height, dot.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animRef.current = window.requestAnimationFrame(tick);
    };

    animRef.current = window.requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) window.cancelAnimationFrame(animRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="cp-orb-canvas" aria-hidden="true" />;
};

/* ─── Tilt card wrapper ──────────────────────────────────────────────────────── */
const TiltCard = ({ children, className, to, ariaLabel, ...rest }) => {
  const cardRef = useRef(null);
  const Component = to ? Link : 'article';
  const [enableTilt, setEnableTilt] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnableTilt(window.innerWidth >= 1024 && !reduceMotion);
  }, []);

  const handleMove = useCallback((e) => {
    if (!enableTilt) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -18;
    el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateZ(8px)`;
    el.style.transition = 'transform 0.08s linear';
  }, [enableTilt]);

  const handleLeave = useCallback(() => {
    if (!enableTilt) return;
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
    el.style.transition = 'transform 0.5s cubic-bezier(0.16,0.64,0.2,1)';
  }, [enableTilt]);

  const componentProps = {
    ref: cardRef,
    className: `community-profile-card ${to ? 'is-link' : ''} ${className || ''}`,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    ...rest
  };

  if (to) componentProps.to = to;
  if (ariaLabel) componentProps['aria-label'] = ariaLabel;

  return (
    <Component {...componentProps}>
      {children}
    </Component>
  );
};

/* ─── Main section ───────────────────────────────────────────────────────────── */
const CommunityProfilesSection = ({ title, subtitle, profiles = [], loading = false, error = '' }) => {
  const [cardsPerView, setCardsPerView] = useState(3);
  const [showOrb, setShowOrb] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotionRef = useRef(false);
  const carouselRef = useRef(null);
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);

  const slides = useMemo(() => profiles.filter(Boolean), [profiles]);
  const count = slides.length;

  useEffect(() => {
    const calcCards = () => {
      const w = window.innerWidth;
      if (w < 640) return 1;
      if (w < 1024) return 2;
      return 3;
    };
    const update = () => setCardsPerView(calcCards());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onDesktop = window.innerWidth >= 1024;
    setShowOrb(onDesktop && !reduceMotion);
    reduceMotionRef.current = reduceMotion;
  }, []);

  const loopSlides = useMemo(() => {
    if (!count) return [];
    return [...slides, ...slides];
  }, [count, slides]);

  const pauseCarousel = useCallback(() => setIsPaused(true), []);
  const resumeCarousel = useCallback(() => setIsPaused(false), []);

  useEffect(() => {
    if (!count || reduceMotionRef.current) return undefined;
    const el = carouselRef.current;
    const track = trackRef.current;
    if (!el || !track) return undefined;

    const normalizeScroll = () => {
      const maxScroll = track.scrollWidth / 2;
      if (maxScroll <= 0) return;
      if (el.scrollLeft >= maxScroll) {
        el.scrollLeft -= maxScroll;
      } else if (el.scrollLeft < 0) {
        el.scrollLeft += maxScroll;
      }
    };

    const tick = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (!isPaused) {
        const next = el.scrollLeft + (SCROLL_SPEED_PX * delta) / 1000;
        el.scrollLeft = next;
        normalizeScroll();
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
    const onScroll = () => normalizeScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = null;
      el.removeEventListener('scroll', onScroll);
    };
  }, [count, isPaused, loopSlides]);

  const scrollByCards = useCallback((direction = 1) => {
    const el = carouselRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const card = el.querySelector('.community-profile-card');
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || '24') || 24;
    const amount = card ? card.offsetWidth + gap : el.clientWidth * 0.85;
    el.scrollBy({ left: amount * direction, behavior: 'smooth' });
    window.requestAnimationFrame(() => {
      const maxScroll = track.scrollWidth / 2;
      if (maxScroll > 0 && el.scrollLeft >= maxScroll) el.scrollLeft -= maxScroll;
    });
  }, []);

  const fmt = (v) => (v === null || v === undefined || Number.isNaN(v) ? '—' : v);

  return (
    <section className="community-profiles" id="community-profiles">
      {/* Background canvas */}
      {showOrb && <OrbCanvas />}

      <div className="community-profiles-inner">
        {/* Header */}
        <div className="community-profiles-header reveal-on-scroll">
          <span className="eyebrow cp-eyebrow">{COMMUNITY_PROFILES_DATA.sectionEyebrow}</span>
          <h2 className="cp-heading">{title}</h2>
          <p className="cp-sub">{subtitle}</p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="community-profiles-skeleton">
            {Array.from({ length: cardsPerView }).map((_, i) => (
              <div key={`sk-${i}`} className="community-profile-card cp-skeleton-card">
                <header>
                  <Skeleton variant="circle" className="community-profile-avatar-skeleton" />
                  <div className="community-profile-skeleton-text">
                    <Skeleton className="community-profile-skeleton-line" />
                    <Skeleton className="community-profile-skeleton-line short" />
                  </div>
                </header>
                <Skeleton className="community-profile-skeleton-line" />
                <Skeleton className="community-profile-skeleton-line long" />
                <div className="community-profile-metrics">
                  {Array.from({ length: 3 }).map((_, mi) => (
                    <Skeleton key={`m-${mi}`} className="community-profile-skeleton-metric" />
                  ))}
                </div>
              </div>
            ))}
          </div>

        /* Empty */
        ) : count === 0 ? (
          <div className="community-profiles-empty">
            {error || COMMUNITY_PROFILES_DATA.emptyStateText}
          </div>

        /* Carousel */
        ) : (
          <div
            className={`community-profiles-carousel ${isPaused ? 'is-paused' : ''}`}
            role="region"
            aria-label="Community profiles"
          >
            <div
              ref={carouselRef}
              className="community-profiles-viewport"
              aria-live="polite"
            >
              <div
              ref={trackRef}
              className="community-profiles-track"
            >
              {loopSlides.map((profile, gi) => {
                const avatarFallback = getGithubAvatarDataUri(
                  profile.name || profile.hackerHandle || profile.id || 'member'
                );
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

                return (
                  <TiltCard
                    key={`${profile.id || handle}-${gi}`}
                    to={profileUrl}
                    ariaLabel={profileUrl ? `View ${handle} profile` : undefined}
                    onMouseEnter={pauseCarousel}
                    onMouseLeave={resumeCarousel}
                    onFocus={pauseCarousel}
                    onBlur={resumeCarousel}
                  >
                    {/* Glint overlay */}
                    <div className="cp-card-glint" aria-hidden="true" />

                    <header>
                      <div className="cp-avatar-wrap">
                        <img
                          src={profile.avatarUrl || avatarFallback}
                          alt={profile.name || 'Community member'}
                          onError={(e) => {
                            if (e.currentTarget.src !== avatarFallback)
                              e.currentTarget.src = avatarFallback;
                          }}
                        />
                        <div className="cp-avatar-ring" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="community-profile-handle">{handle}</p>
                        <h3>{profile.name || 'Name unavailable'}</h3>
                        <span className="community-profile-role">{profile.role || 'Role unavailable'}</span>
                      </div>
                    </header>

                    <p className="community-profile-bio">{profile.bio || 'Bio unavailable.'}</p>

                    <div className="community-profile-metrics">
                      <div className="community-profile-cp">
                        <img src={cpIcon} alt="CP" className="community-profile-cp-icon" />
                        <span>{fmt(profile.xpSummary?.totalXp)}</span>
                      </div>
                      <div>
                        <FiMessageSquare size={13} />
                        <span>{fmt(profile.stats?.messages)} messages</span>
                      </div>
                      <div>
                        <FiHeart size={13} />
                        <span>{fmt(profile.stats?.likesReceived)} likes</span>
                      </div>
                      <div>
                        <FiMessageCircle size={13} />
                        <span>{fmt(profile.stats?.commentsMade)} comments</span>
                      </div>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
            </div>

            <div className="community-profiles-controls" aria-label="Carousel controls">
              <button
                type="button"
                className="community-profiles-control"
                onClick={() => scrollByCards(-1)}
                aria-label="Scroll profiles left"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="community-profiles-control"
                onClick={() => scrollByCards(1)}
                aria-label="Scroll profiles right"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommunityProfilesSection;
