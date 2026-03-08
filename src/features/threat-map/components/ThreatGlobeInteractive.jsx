import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import '../../../styles/sections/threat-map/controls.css';
import '../../../styles/sections/threat-map/globe-3d.css';

/* ─── Africa-emphasis city data ─────────────────────────────── */
const CITIES = [
  // Africa (emphasized — higher weight)
  { id: 'lag', name: 'Lagos',         lat:  6.52,  lon:  3.38,  region: 'Africa',   weight: 3 },
  { id: 'acc', name: 'Accra',         lat:  5.55,  lon: -0.20,  region: 'Africa',   weight: 3 },
  { id: 'nai', name: 'Nairobi',       lat: -1.29,  lon: 36.82,  region: 'Africa',   weight: 3 },
  { id: 'joh', name: 'Johannesburg',  lat:-26.20,  lon: 28.05,  region: 'Africa',   weight: 3 },
  { id: 'cai', name: 'Cairo',         lat: 30.06,  lon: 31.25,  region: 'Africa',   weight: 3 },
  { id: 'cas', name: 'Casablanca',    lat: 33.57,  lon: -7.59,  region: 'Africa',   weight: 2 },
  { id: 'dar', name: 'Dar es Salaam', lat: -6.79,  lon: 39.21,  region: 'Africa',   weight: 2 },
  { id: 'aba', name: 'Abidjan',       lat:  5.35,  lon: -4.00,  region: 'Africa',   weight: 2 },
  { id: 'add', name: 'Addis Ababa',   lat:  9.03,  lon: 38.74,  region: 'Africa',   weight: 2 },
  { id: 'luo', name: 'Luanda',        lat: -8.84,  lon: 13.23,  region: 'Africa',   weight: 2 },
  // Americas
  { id: 'nyc', name: 'New York',      lat: 40.71,  lon:-74.01,  region: 'Americas', weight: 2 },
  { id: 'lax', name: 'Los Angeles',   lat: 34.05,  lon:-118.24, region: 'Americas', weight: 1 },
  { id: 'chi', name: 'Chicago',       lat: 41.88,  lon: -87.63, region: 'Americas', weight: 1 },
  { id: 'sao', name: 'São Paulo',     lat:-23.55,  lon: -46.64, region: 'Americas', weight: 1 },
  { id: 'tor', name: 'Toronto',       lat: 43.65,  lon: -79.38, region: 'Americas', weight: 1 },
  { id: 'mex', name: 'Mexico City',   lat: 19.43,  lon: -99.13, region: 'Americas', weight: 1 },
  // Europe
  { id: 'lon', name: 'London',        lat: 51.51,  lon: -0.13,  region: 'Europe',   weight: 2 },
  { id: 'par', name: 'Paris',         lat: 48.86,  lon:  2.35,  region: 'Europe',   weight: 1 },
  { id: 'ber', name: 'Berlin',        lat: 52.52,  lon: 13.40,  region: 'Europe',   weight: 1 },
  { id: 'mos', name: 'Moscow',        lat: 55.76,  lon: 37.62,  region: 'Europe',   weight: 2 },
  { id: 'ams', name: 'Amsterdam',     lat: 52.37,  lon:  4.90,  region: 'Europe',   weight: 1 },
  // Asia/Pacific
  { id: 'tok', name: 'Tokyo',         lat: 35.68,  lon: 139.65, region: 'Asia',     weight: 2 },
  { id: 'sha', name: 'Shanghai',      lat: 31.23,  lon: 121.47, region: 'Asia',     weight: 2 },
  { id: 'sin', name: 'Singapore',     lat:  1.35,  lon: 103.82, region: 'Asia',     weight: 2 },
  { id: 'mum', name: 'Mumbai',        lat: 19.08,  lon: 72.88,  region: 'Asia',     weight: 1 },
  { id: 'bei', name: 'Beijing',       lat: 39.90,  lon: 116.41, region: 'Asia',     weight: 2 },
  { id: 'dub', name: 'Dubai',         lat: 25.20,  lon: 55.27,  region: 'Asia',     weight: 1 },
  { id: 'syd', name: 'Sydney',        lat:-33.87,  lon: 151.21, region: 'Asia',     weight: 1 },
];

const ATTACK_TYPES = [
  'DDoS', 'Ransomware', 'Phishing', 'SQL Injection',
  'XSS', 'Brute Force', 'Zero-Day', 'MITM', 'APT', 'Botnet',
  'Credential Stuffing', 'Supply Chain', 'Malware', 'Spear Phishing',
];

const SEVERITY = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const SEVERITY_COLORS = {
  CRITICAL: '#ff2d55',
  HIGH:     '#ff6b00',
  MEDIUM:   '#ffd60a',
  LOW:      '#2dd4bf',
};

const REGION_COLORS = {
  Africa:   '#2dd4bf',
  Americas: '#3b82f6',
  Europe:   '#a78bfa',
  Asia:     '#f59e0b',
};

/* Country-level Africa attack stats (simulated, emphasis data) */
const AFRICA_STATS = [
  { country: 'Nigeria',       pct: 23, count: 1840, flag: '🇳🇬' },
  { country: 'South Africa',  pct: 18, count: 1440, flag: '🇿🇦' },
  { country: 'Kenya',         pct: 14, count: 1120, flag: '🇰🇪' },
  { country: 'Egypt',         pct: 12, count:  960, flag: '🇪🇬' },
  { country: 'Ghana',         pct:  9, count:  720, flag: '🇬🇭' },
  { country: "Côte d'Ivoire", pct:  7, count:  560, flag: '🇨🇮' },
  { country: 'Ethiopia',      pct:  6, count:  480, flag: '🇪🇹' },
  { country: 'Morocco',       pct:  5, count:  400, flag: '🇲🇦' },
  { country: 'Others',        pct:  6, count:  480, flag: '🌍' },
];

/* ─── Helpers ──────────────────────────────────────────────── */
let _id = 0;
const uid  = () => ++_id;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (a, b) => a + Math.random() * (b - a);

const latLonToVec3 = (lat, lon, r = 1) => {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  );
};

const buildArcPoints = (start, end, r = 1, segs = 80) => {
  const pts = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const v = new THREE.Vector3().lerpVectors(start, end, t).normalize();
    const h = Math.sin(Math.PI * t) * 0.22;
    v.multiplyScalar(r * (1 + h));
    pts.push(v.clone());
  }
  return pts;
};

const weightedPick = (cities) => {
  const pool = cities.flatMap((c) => Array(c.weight || 1).fill(c));
  return pool[Math.floor(Math.random() * pool.length)];
};

/* ─── Flat 2D map helpers ──────────────────────────────────── */
const latLonToXY = (lat, lon, W, H) => ({
  x: ((lon + 180) / 360) * W,
  y: ((90 - lat) / 180) * H,
});

/* ─── Main Component ──────────────────────────────────────── */
const ThreatGlobeInteractive = ({ paused: pausedProp = false, onNewAttack }) => {
  const mountRef    = useRef(null);
  const svgRef      = useRef(null);
  const [mode, setMode]       = useState('globe'); // 'globe' | 'flat'
  const [paused, setPaused]   = useState(pausedProp);
  const [activeCity, setActiveCity]   = useState(null); // hovered city info
  const [showAfricaPanel, setShowAfricaPanel] = useState(true);
  const stateRef = useRef({
    attacks: [],
    globe: null,
    renderer: null,
    camera: null,
    scene: null,
    animId: null,
    spawnTimer: null,
    isDragging: false,
    lastMouse: { x: 0, y: 0 },
    rotation: { x: 0.3, y: 0 },
    autoRotate: true,
    flatAttacks: [],
    svgW: 800,
    svgH: 450,
  });

  useEffect(() => { setPaused(pausedProp); }, [pausedProp]);

  /* ── THREE.JS GLOBE SETUP ─────────────────────────────── */
  useEffect(() => {
    if (mode !== 'globe') return;
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth  || 800;
    const H = el.clientHeight || 500;
    const s = stateRef.current;

    /* Scene */
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 3.2);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    /* Lighting */
    scene.add(new THREE.AmbientLight(0x1a2a4a, 0.6));
    const sun = new THREE.DirectionalLight(0x4dd8e0, 1.2);
    sun.position.set(4, 2, 5);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x2dd4bf, 0.4);
    rim.position.set(-4, -1, -3);
    scene.add(rim);

    /* Globe sphere */
    const geo = new THREE.SphereGeometry(1, 64, 64);

    /* Holographic wireframe ocean */
    const wireGeo = new THREE.SphereGeometry(1.001, 32, 32);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0d4f50,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    scene.add(new THREE.Mesh(wireGeo, wireMat));

    /* Base sphere — deep ocean tint */
    const baseMat = new THREE.MeshPhongMaterial({
      color: 0x040e18,
      emissive: 0x061820,
      shininess: 80,
      transparent: true,
      opacity: 0.98,
    });
    const globe = new THREE.Mesh(geo, baseMat);
    scene.add(globe);

    /* Atmosphere glow shell */
    const atmoGeo = new THREE.SphereGeometry(1.08, 64, 64);
    const atmoMat = new THREE.MeshPhongMaterial({
      color: 0x0d4f50,
      emissive: 0x0d4f50,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(atmoGeo, atmoMat));

    /* Inner glow ring */
    const innerGeo = new THREE.SphereGeometry(1.04, 64, 64);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      transparent: true,
      opacity: 0.04,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(innerGeo, innerMat));

    /* Stars */
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(3000);
    for (let i = 0; i < 3000; i++) {
      starPos[i] = (Math.random() - 0.5) * 80;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0x88ccdd, size: 0.05, transparent: true, opacity: 0.5 })
    );
    scene.add(stars);

    /* City dots */
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);
    CITIES.forEach((c) => {
      const pos = latLonToVec3(c.lat, c.lon, 1.01);
      const isAfrica = c.region === 'Africa';
      const dotGeo = new THREE.SphereGeometry(isAfrica ? 0.016 : 0.011, 8, 8);
      const dotMat = new THREE.MeshBasicMaterial({
        color: REGION_COLORS[c.region] || 0x2dd4bf,
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(pos);
      dot.userData = c;
      cityGroup.add(dot);

      /* Africa cities get a larger pulse ring */
      if (isAfrica) {
        const ringGeo = new THREE.RingGeometry(0.022, 0.028, 16);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x2dd4bf, side: THREE.DoubleSide, transparent: true, opacity: 0.5,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(pos);
        ring.lookAt(new THREE.Vector3(0, 0, 0));
        ring.userData = { pulse: true, city: c };
        cityGroup.add(ring);
      }
    });

    /* Arc group */
    const arcGroup = new THREE.Group();
    scene.add(arcGroup);

    s.scene    = scene;
    s.camera   = camera;
    s.renderer = renderer;
    s.globe    = globe;
    s.arcGroup = arcGroup;
    s.cityGroup = cityGroup;

    /* Resize */
    const obs = new ResizeObserver(() => {
      const nW = el.clientWidth;
      const nH = el.clientHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    });
    obs.observe(el);

    /* Mouse drag to rotate */
    const onDown = (e) => {
      s.isDragging = true;
      s.lastMouse  = { x: e.clientX, y: e.clientY };
      s.autoRotate = false;
    };
    const onMove = (e) => {
      if (!s.isDragging) return;
      const dx = e.clientX - s.lastMouse.x;
      const dy = e.clientY - s.lastMouse.y;
      s.rotation.y += dx * 0.005;
      s.rotation.x += dy * 0.005;
      s.rotation.x  = Math.max(-1.2, Math.min(1.2, s.rotation.x));
      s.lastMouse = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => { s.isDragging = false; };

    el.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    /* Render loop */
    const animate = () => {
      s.animId = requestAnimationFrame(animate);
      if (!s.paused && s.autoRotate) {
        s.rotation.y += 0.0015;
      }
      globe.rotation.y = s.rotation.y;
      globe.rotation.x = s.rotation.x;
      arcGroup.rotation.y  = s.rotation.y;
      arcGroup.rotation.x  = s.rotation.x;
      cityGroup.rotation.y = s.rotation.y;
      cityGroup.rotation.x = s.rotation.x;

      /* Pulse Africa rings */
      const t = Date.now() * 0.003;
      cityGroup.children.forEach((m) => {
        if (m.userData?.pulse) {
          m.material.opacity = 0.2 + 0.35 * Math.abs(Math.sin(t + m.position.x));
        }
      });

      /* Animate arcs */
      arcGroup.children.slice().forEach((line) => {
        const d = line.userData;
        if (!d) return;
        if (!s.paused) {
          d.progress = Math.min((d.progress || 0) + d.speed, 1);
        }
        const slice = Math.max(2, Math.floor(d.progress * d.points.length));
        const pts   = d.points.slice(0, slice);
        if (pts.length > 1) {
          line.geometry.setFromPoints(pts);
        }
        if (d.progress >= 1) {
          d.fadeTick = (d.fadeTick || 0) + 1;
          line.material.opacity = Math.max(0, 1 - d.fadeTick / 50);
          if (d.fadeTick > 50) {
            arcGroup.remove(line);
            line.geometry.dispose();
            line.material.dispose();
          }
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      obs.disconnect();
      cancelAnimationFrame(s.animId);
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      renderer.dispose();
      if (renderer.domElement.parentNode === el) {
        el.removeChild(renderer.domElement);
      }
      s.scene = s.camera = s.renderer = s.globe = s.arcGroup = s.cityGroup = null;
    };
  }, [mode]);

  /* ── ATTACK SPAWN ────────────────────────────────────── */
  useEffect(() => {
    const s = stateRef.current;
    s.paused = paused;
    if (paused) return;

    const spawn = () => {
      /* Weight towards Africa targets/sources */
      const src = weightedPick(CITIES);
      let dst   = weightedPick(CITIES);
      while (dst.id === src.id) dst = weightedPick(CITIES);
      const severity = pick(SEVERITY);
      const color    = SEVERITY_COLORS[severity];
      const type     = pick(ATTACK_TYPES);
      const now      = new Date().toLocaleTimeString();
      const id       = uid();

      onNewAttack?.({ id, src: src.name, dst: dst.name, type, severity, color, time: now });

      /* Globe 3D arc */
      if (s.arcGroup) {
        const start = latLonToVec3(src.lat, src.lon, 1.01);
        const end   = latLonToVec3(dst.lat, dst.lon, 1.01);
        const pts   = buildArcPoints(start, end, 1.01, 80);

        const geo  = new THREE.BufferGeometry().setFromPoints(pts.slice(0, 2));
        const mat  = new THREE.LineBasicMaterial({
          color: new THREE.Color(color),
          transparent: true,
          opacity: 0.9,
          linewidth: 2,
        });
        const line = new THREE.Line(geo, mat);
        line.userData = { points: pts, progress: 0, speed: rand(0.008, 0.018), fadeTick: 0 };
        s.arcGroup.add(line);
      }

      /* Flat SVG arc */
      const svgEl = svgRef.current;
      if (svgEl) {
        const W = s.svgW, H = s.svgH;
        const p1 = latLonToXY(src.lat, src.lon, W, H);
        const p2 = latLonToXY(dst.lat, dst.lon, W, H);
        s.flatAttacks = [...(s.flatAttacks || []).slice(-30), {
          id, p1, p2, color, progress: 0, speed: rand(0.015, 0.03), done: false, fade: 0,
        }];
      }
    };

    const timer = setInterval(spawn, 1000);
    return () => clearInterval(timer);
  }, [paused, mode, onNewAttack]);

  /* ── FLAT SVG ANIMATION ─────────────────────────────── */
  useEffect(() => {
    if (mode !== 'flat') return;
    let raf;
    const tick = () => {
      const s   = stateRef.current;
      const svg = svgRef.current;
      if (!svg) { raf = requestAnimationFrame(tick); return; }

      const arcLayer = svg.querySelector('#flat-arc-layer');
      const dotLayer = svg.querySelector('#flat-dot-layer');
      if (!arcLayer || !dotLayer) { raf = requestAnimationFrame(tick); return; }

      if (!paused) {
        s.flatAttacks = (s.flatAttacks || []).map((a) => {
          if (a.done) return { ...a, fade: a.fade + 1 };
          const np = Math.min(a.progress + a.speed, 1);
          return { ...a, progress: np, done: np >= 1 };
        }).filter((a) => a.fade < 55);
      }

      arcLayer.innerHTML = '';
      dotLayer.innerHTML = '';

      (s.flatAttacks || []).forEach((a) => {
        const { p1, p2, color, progress, done, fade } = a;
        const alpha = done ? Math.max(0, 1 - fade / 55) : 1;
        const mx  = (p1.x + p2.x) / 2;
        const my  = Math.min(p1.y, p2.y) - Math.hypot(p2.x - p1.x, p2.y - p1.y) * 0.25;

        /* Full ghost arc */
        const ghost = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        ghost.setAttribute('d', `M${p1.x},${p1.y} Q${mx},${my} ${p2.x},${p2.y}`);
        ghost.setAttribute('fill', 'none');
        ghost.setAttribute('stroke', color);
        ghost.setAttribute('stroke-width', '1');
        ghost.setAttribute('opacity', String(alpha * 0.12));
        arcLayer.appendChild(ghost);

        /* Active portion */
        if (progress > 0.01) {
          const t = progress;
          const bx = (1-t)*(1-t)*p1.x + 2*(1-t)*t*mx + t*t*p2.x;
          const by = (1-t)*(1-t)*p1.y + 2*(1-t)*t*my + t*t*p2.y;
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          line.setAttribute('d', `M${p1.x},${p1.y} Q${mx},${my} ${bx},${by}`);
          line.setAttribute('fill', 'none');
          line.setAttribute('stroke', color);
          line.setAttribute('stroke-width', '1.8');
          line.setAttribute('stroke-linecap', 'round');
          line.setAttribute('opacity', String(alpha * 0.92));
          line.setAttribute('filter', 'url(#flat-glow)');
          arcLayer.appendChild(line);

          /* Head dot */
          if (!done) {
            const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            dot.setAttribute('cx', String(bx));
            dot.setAttribute('cy', String(by));
            dot.setAttribute('r', '3.5');
            dot.setAttribute('fill', color);
            dot.setAttribute('filter', 'url(#flat-glow)');
            dotLayer.appendChild(dot);
          }
        }

        /* Impact burst */
        if (done && fade < 40) {
          const r   = (fade / 40) * 18;
          const op  = Math.max(0, 1 - fade / 40);
          const b   = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          b.setAttribute('cx', String(p2.x));
          b.setAttribute('cy', String(p2.y));
          b.setAttribute('r', String(r));
          b.setAttribute('fill', 'none');
          b.setAttribute('stroke', color);
          b.setAttribute('stroke-width', '1.5');
          b.setAttribute('opacity', String(op * 0.8));
          dotLayer.appendChild(b);
        }
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode, paused]);

  /* ── SVG resize ─────────────────────────────────────── */
  useEffect(() => {
    if (mode !== 'flat') return;
    const obs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      stateRef.current.svgW = width;
      stateRef.current.svgH = height;
    });
    const el = svgRef.current?.parentElement;
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, [mode]);

  const switchMode = useCallback((m) => {
    stateRef.current.flatAttacks = [];
    setMode(m);
  }, []);

  return (
    <div className="threat-globe-interactive">
      <div className="threat-globe-stage">

        {/* ── 3D GLOBE ── */}
        {mode === 'globe' && (
          <div className="tgi-globe-canvas" ref={mountRef} />
        )}

        {/* ── FLAT 2D MAP ── */}
        {mode === 'flat' && (
          <div className="tgi-flat-wrap">
            <div className="tgi-flat-map-bg" />
            <svg ref={svgRef} className="tgi-flat-svg" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="flat-glow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <g id="flat-arc-layer" />
              {/* City dots */}
              <g id="flat-cities">
                {CITIES.map((c) => {
                  const pos  = latLonToXY(c.lat, c.lon, 800, 450);
                  const isAf = c.region === 'Africa';
                  return (
                    <g key={c.id}>
                      {isAf && (
                        <circle cx={`${(c.lon + 180) / 360 * 100}%`} cy={`${(90 - c.lat) / 180 * 100}%`}
                          r="7" fill={REGION_COLORS.Africa} opacity="0.12" />
                      )}
                      <circle
                        cx={`${(c.lon + 180) / 360 * 100}%`}
                        cy={`${(90 - c.lat) / 180 * 100}%`}
                        r={isAf ? '3.5' : '2'}
                        fill={REGION_COLORS[c.region] || '#2dd4bf'}
                        opacity={isAf ? '0.95' : '0.65'}
                      />
                    </g>
                  );
                })}
              </g>
              <g id="flat-dot-layer" />
            </svg>

            {/* Flat HUD corners */}
            <div className="tgi-corner tgi-corner--tl" aria-hidden="true">
              <span className="tgi-corner-label">FLAT · MERCATOR</span>
            </div>
            <div className="tgi-corner tgi-corner--br" aria-hidden="true">
              <span className="tgi-corner-label">VIZ:2D</span>
            </div>
            <div className="tgi-sweep" aria-hidden="true" />
          </div>
        )}

        {/* Globe mode HUD */}
        {mode === 'globe' && (
          <>
            <div className="tgi-corner tgi-corner--tl" aria-hidden="true">
              <span className="tgi-corner-label">SYS:LIVE</span>
            </div>
            <div className="tgi-corner tgi-corner--br" aria-hidden="true">
              <span className="tgi-corner-label">VIZ:3D</span>
            </div>
            <div className="tgi-sweep" aria-hidden="true" />
            <p className="threat-globe-hint">
              <span className="tgi-hint-icon">⊹</span>
              Drag to rotate · Holographic globe
            </p>
          </>
        )}

        {/* Africa Stats Panel */}
        {showAfricaPanel && (
          <div className="tgi-africa-panel">
            <div className="tgi-africa-panel-head">
              <span className="tgi-africa-title">🌍 Africa Attack Index</span>
              <button className="tgi-africa-close" onClick={() => setShowAfricaPanel(false)}>✕</button>
            </div>
            <div className="tgi-africa-list">
              {AFRICA_STATS.map((s) => (
                <div key={s.country} className="tgi-africa-row">
                  <span className="tgi-africa-flag">{s.flag}</span>
                  <span className="tgi-africa-name">{s.country}</span>
                  <div className="tgi-africa-bar-wrap">
                    <div className="tgi-africa-bar" style={{ width: `${s.pct}%` }} />
                  </div>
                  <span className="tgi-africa-pct">{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {!showAfricaPanel && (
          <button className="tgi-africa-reopen" onClick={() => setShowAfricaPanel(true)}>
            🌍 Africa
          </button>
        )}

        {/* Region legend */}
        <div className="tgi-region-legend">
          {Object.entries(REGION_COLORS).map(([region, color]) => (
            <span key={region} className="tgi-legend-item">
              <span className="tgi-legend-dot" style={{ background: color }} />
              {region}
            </span>
          ))}
        </div>
      </div>

      {/* Control bar */}
      <div className="threat-globe-controls" role="group" aria-label="Globe controls">
        {/* Mode toggle */}
        <div className="tgi-btn-group">
          <button
            type="button"
            className={`threat-globe-btn ${mode === 'globe' ? 'is-active' : ''}`}
            onClick={() => switchMode('globe')}
            title="3D Globe"
          >
            <span className="tgi-btn-icon">◉</span>
            <span className="tgi-btn-text">Globe</span>
          </button>
          <div className="tgi-btn-sep" />
          <button
            type="button"
            className={`threat-globe-btn ${mode === 'flat' ? 'is-active' : ''}`}
            onClick={() => switchMode('flat')}
            title="Flat map"
          >
            <span className="tgi-btn-icon">▦</span>
            <span className="tgi-btn-text">Flat</span>
          </button>
        </div>

        <div className="threat-globe-controls-sep" />

        {/* Pause/Resume */}
        <button
          type="button"
          className={`threat-globe-btn ${paused ? 'is-active' : ''}`}
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Resume' : 'Pause'}
        >
          <span className="tgi-btn-icon">{paused ? '▶' : '⏸'}</span>
          <span className="tgi-btn-text">{paused ? 'Resume' : 'Pause'}</span>
        </button>

        {/* Africa panel toggle */}
        <button
          type="button"
          className={`threat-globe-btn ${showAfricaPanel ? 'is-active' : 'is-ghost'}`}
          onClick={() => setShowAfricaPanel((p) => !p)}
          title="Toggle Africa stats"
        >
          <span className="tgi-btn-icon">🌍</span>
          <span className="tgi-btn-text">Africa</span>
        </button>

        {/* Auto-rotate (globe only) */}
        {mode === 'globe' && (
          <button
            type="button"
            className="threat-globe-btn is-ghost"
            onClick={() => { stateRef.current.autoRotate = !stateRef.current.autoRotate; }}
            title="Toggle auto-rotate"
          >
            <span className="tgi-btn-icon">⟳</span>
            <span className="tgi-btn-text">Rotate</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ThreatGlobeInteractive;