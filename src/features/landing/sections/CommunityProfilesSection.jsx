import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { FiHeart, FiMessageCircle, FiMessageSquare } from 'react-icons/fi';
import { getGithubAvatarDataUri } from '../../../shared/utils/avatar';
import Skeleton from '../../../shared/components/ui/Skeleton';
import cpIcon from '../../../assets/icons/CP/cp-icon.png';
import { COMMUNITY_PROFILES_DATA } from '../../../data/landing/communityProfilesData';
import '../../../styles/landing/community-profiles.css';

const AUTO_ROTATE_MS = COMMUNITY_PROFILES_DATA.autoRotateMs;

/* ─── Three.js floating orb background ─────────────────────────────────────── */
const OrbCanvas = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    let THREE;
    let renderer, scene, camera;
    let particles, clock;
    let mounted = true;

    const init = async () => {
      try {
        THREE = await import('three');
      } catch {
        return; // silently skip if Three.js unavailable
      }
      if (!mounted || !canvasRef.current) return;

      const canvas = canvasRef.current;
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
      camera.position.z = 5;

      clock = new THREE.Clock();

      // ── particle field ──────────────────────────────────────
      const count = 280;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const sizes = new Float32Array(count);

      // brand colours from common.css primary
      const palette = [
        new THREE.Color('#1fbf8f'),
        new THREE.Color('#2dd4bf'),
        new THREE.Color('#14a779'),
        new THREE.Color('#0b1220').lerp(new THREE.Color('#1fbf8f'), 0.25),
      ];

      for (let i = 0; i < count; i++) {
        pos[i * 3]     = (Math.random() - 0.5) * 14;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 6;

        const c = palette[Math.floor(Math.random() * palette.length)];
        col[i * 3]     = c.r;
        col[i * 3 + 1] = c.g;
        col[i * 3 + 2] = c.b;

        sizes[i] = Math.random() * 3 + 1;
      }

      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const mat = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
        sizeAttenuation: true,
      });

      particles = new THREE.Points(geo, mat);
      scene.add(particles);

      // ── ambient glow sphere ──────────────────────────────────
      const sphereGeo = new THREE.SphereGeometry(1.6, 32, 32);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#1fbf8f'),
        transparent: true,
        opacity: 0.04,
        wireframe: true,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(3, -0.5, -1);
      scene.add(sphere);

      const sphereGeo2 = new THREE.SphereGeometry(1.0, 24, 24);
      const sphereMat2 = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#2dd4bf'),
        transparent: true,
        opacity: 0.05,
        wireframe: true,
      });
      const sphere2 = new THREE.Mesh(sphereGeo2, sphereMat2);
      sphere2.position.set(-4, 1, -2);
      scene.add(sphere2);

      const resize = () => {
        if (!canvas || !renderer) return;
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', resize);

      const animate = () => {
        if (!mounted) return;
        animRef.current = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        particles.rotation.y = t * 0.04;
        particles.rotation.x = Math.sin(t * 0.02) * 0.15;

        sphere.rotation.y = t * 0.12;
        sphere.rotation.x = t * 0.07;
        sphere2.rotation.y = -t * 0.09;
        sphere2.rotation.z = t * 0.05;

        renderer.render(scene, camera);
      };
      animate();

      return () => window.removeEventListener('resize', resize);
    };

    init();

    return () => {
      mounted = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (renderer) renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="cp-orb-canvas" aria-hidden="true" />;
};

/* ─── Tilt card wrapper ──────────────────────────────────────────────────────── */
const TiltCard = ({ children, className, ...rest }) => {
  const cardRef = useRef(null);

  const handleMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -18;
    el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateZ(8px)`;
    el.style.transition = 'transform 0.08s linear';
  }, []);

  const handleLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
    el.style.transition = 'transform 0.5s cubic-bezier(0.16,0.64,0.2,1)';
  }, []);

  return (
    <article
      ref={cardRef}
      className={`community-profile-card ${className || ''}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {children}
    </article>
  );
};

/* ─── Main section ───────────────────────────────────────────────────────────── */
const CommunityProfilesSection = ({ title, subtitle, profiles = [], loading = false, error = '' }) => {
  const [index, setIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

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

  const groups = useMemo(() => {
    if (!count) return [];
    const groupSize = Math.max(1, cardsPerView);
    const result = [];
    for (let i = 0; i < count; i += groupSize) result.push(slides.slice(i, i + groupSize));
    return result.length ? result : [slides];
  }, [count, slides, cardsPerView]);

  const groupCount = groups.length;
  const activeIndex = groupCount ? index % groupCount : 0;

  useEffect(() => {
    if (groupCount <= 1) return;
    const timer = window.setInterval(() => setIndex((p) => (p + 1) % groupCount), AUTO_ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [groupCount]);

  const fmt = (v) => (v === null || v === undefined || Number.isNaN(v) ? '—' : v);

  return (
    <section className="community-profiles" id="community-profiles">
      {/* Three.js background canvas */}
      <OrbCanvas />

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
          <div className="community-profiles-carousel" role="region" aria-label="Community profiles">
            <div
              className="community-profiles-track"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {groups.map((group, gi) => (
                <div className="community-profiles-slide" key={`g-${gi}`}>
                  {group.map((profile) => {
                    const avatarFallback = getGithubAvatarDataUri(
                      profile.name || profile.hackerHandle || profile.id || 'member'
                    );
                    const handle = profile.hackerHandle
                      ? `@${profile.hackerHandle}`
                      : profile.name
                      ? `@${profile.name.split(' ')[0].toLowerCase()}`
                      : 'Handle unavailable';

                    return (
                      <TiltCard key={profile.id || handle}>
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
                            <span>{fmt(profile.xpSummary?.totalXp)} CP</span>
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
              ))}
            </div>

            {/* Dots */}
            <div className="community-profiles-dots" role="tablist" aria-label="Profile slides">
              {groups.map((_, i) => (
                <button
                  type="button"
                  key={`dot-${i}`}
                  className={`community-profiles-dot ${i === activeIndex ? 'is-active' : ''}`}
                  aria-label={`Go to profile ${i + 1}`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommunityProfilesSection;