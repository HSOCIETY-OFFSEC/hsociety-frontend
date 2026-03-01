import React, { useEffect, useRef, useCallback } from 'react';
import '../../../styles/sections/threat-map/globe.css';

/* ─── Data ─────────────────────────────────────────────── */

const CITIES = [
  { id: 'nyc', name: 'New York',      x: 21,  y: 33 },
  { id: 'lon', name: 'London',        x: 46,  y: 22 },
  { id: 'par', name: 'Paris',         x: 47,  y: 24 },
  { id: 'ber', name: 'Berlin',        x: 50,  y: 21 },
  { id: 'mos', name: 'Moscow',        x: 55,  y: 19 },
  { id: 'dub', name: 'Dubai',         x: 60,  y: 36 },
  { id: 'mum', name: 'Mumbai',        x: 63,  y: 39 },
  { id: 'sin', name: 'Singapore',     x: 72,  y: 48 },
  { id: 'sha', name: 'Shanghai',      x: 76,  y: 31 },
  { id: 'tok', name: 'Tokyo',         x: 80,  y: 28 },
  { id: 'syd', name: 'Sydney',        x: 79,  y: 64 },
  { id: 'lax', name: 'Los Angeles',   x: 9,   y: 34 },
  { id: 'chi', name: 'Chicago',       x: 18,  y: 29 },
  { id: 'sao', name: 'São Paulo',     x: 28,  y: 63 },
  { id: 'joh', name: 'Johannesburg',  x: 52,  y: 64 },
  { id: 'bei', name: 'Beijing',       x: 75,  y: 29 },
  { id: 'tor', name: 'Toronto',       x: 20,  y: 27 },
  { id: 'mex', name: 'Mexico City',   x: 14,  y: 41 },
  { id: 'lag', name: 'Lagos',         x: 46,  y: 48 },
  { id: 'acc', name: 'Accra',         x: 44,  y: 49 },
  { id: 'nai', name: 'Nairobi',       x: 55,  y: 50 },
  { id: 'war', name: 'Warsaw',        x: 51,  y: 21 },
  { id: 'kyi', name: 'Kyiv',          x: 53,  y: 22 },
  { id: 'sea', name: 'Seattle',       x: 8,   y: 26 },
  { id: 'ams', name: 'Amsterdam',     x: 48,  y: 21 },
  { id: 'zur', name: 'Zurich',        x: 49,  y: 24 },
  { id: 'ist', name: 'Istanbul',      x: 54,  y: 27 },
  { id: 'ban', name: 'Bangkok',       x: 70,  y: 42 },
  { id: 'jak', name: 'Jakarta',       x: 72,  y: 52 },
  { id: 'man', name: 'Manila',        x: 76,  y: 41 },
];

const ATTACK_TYPES = [
  'DDoS', 'Ransomware', 'Phishing', 'SQL Injection',
  'XSS', 'Brute Force', 'Zero-Day', 'MITM', 'APT', 'Botnet',
  'Credential Stuffing', 'Supply Chain',
];

const SEVERITY = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const SEVERITY_COLORS = {
  CRITICAL: '#ff2d55',
  HIGH:     '#ff6b00',
  MEDIUM:   '#ffd60a',
  LOW:      '#2dd4bf',
};

/* ─── Helpers ───────────────────────────────────────────── */

let _id = 0;
const uid  = () => ++_id;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (a, b) => a + Math.random() * (b - a);

function buildArc(x1pct, y1pct, x2pct, y2pct, W, H) {
  const ax = (x1pct / 100) * W, ay = (y1pct / 100) * H;
  const bx = (x2pct / 100) * W, by = (y2pct / 100) * H;
  const mx = (ax + bx) / 2,     my = (ay + by) / 2;
  const dx = bx - ax,            dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const bulge = Math.min(len * 0.38, 90);
  const cx = mx + (-dy / len) * bulge;
  const cy = my + ( dx / len) * bulge;
  return { ax, ay, bx, by, cx, cy, path: `M${ax},${ay} Q${cx},${cy} ${bx},${by}` };
}

function pointOnQuad(ax, ay, cx, cy, bx, by, t) {
  const u = 1 - t;
  return {
    x: u * u * ax + 2 * u * t * cx + t * t * bx,
    y: u * u * ay + 2 * u * t * cy + t * t * by,
  };
}

/* ─── Component ─────────────────────────────────────────── */

const ThreatGlobe = ({ paused, onNewAttack }) => {
  const svgRef      = useRef(null);
  const wrapRef     = useRef(null);
  const dimsRef     = useRef({ W: 900, H: 500 });
  const attacksRef  = useRef([]);
  const rafRef      = useRef(null);
  const spawnRef    = useRef(null);
  const pausedRef   = useRef(paused);

  pausedRef.current = paused;

  /* Resize observer */
  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) dimsRef.current = { W: width, H: height };
    });
    if (wrapRef.current) obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  /* Spawn a new attack */
  const spawnAttack = useCallback(() => {
    const src      = pick(CITIES);
    let   dst      = pick(CITIES);
    while (dst.id === src.id) dst = pick(CITIES);
    const severity = pick(SEVERITY);
    const { W, H } = dimsRef.current;
    const arc      = buildArc(src.x, src.y, dst.x, dst.y, W, H);
    const attack   = {
      id:       uid(),
      src, dst,
      type:     pick(ATTACK_TYPES),
      severity,
      color:    SEVERITY_COLORS[severity],
      arc,
      progress: 0,
      speed:    rand(0.004, 0.011),
      trail:    [],
      done:     false,
      fadeTick: 0,
    };
    attacksRef.current = [...attacksRef.current.slice(-20), attack];
    onNewAttack({
      id:       attack.id,
      src:      src.name,
      dst:      dst.name,
      type:     attack.type,
      severity: attack.severity,
      color:    attack.color,
      time:     new Date().toLocaleTimeString(),
    });
  }, [onNewAttack]);

  /* Animation loop */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const arcLayer    = svg.querySelector('#arc-layer');
    const dotLayer    = svg.querySelector('#dot-layer');
    const pulseLayer  = svg.querySelector('#pulse-layer');

    function tick() {
      if (!pausedRef.current) {
        const { W, H } = dimsRef.current;

        attacksRef.current = attacksRef.current
          .map((atk) => {
            if (atk.done) {
              return { ...atk, fadeTick: atk.fadeTick + 1 };
            }
            const np = Math.min(atk.progress + atk.speed, 1);
            const pt = pointOnQuad(atk.arc.ax, atk.arc.ay, atk.arc.cx, atk.arc.cy, atk.arc.bx, atk.arc.by, np);
            const trail = [...atk.trail, pt].slice(-28);
            return { ...atk, progress: np, trail, done: np >= 1 };
          })
          .filter((atk) => atk.fadeTick < 60);

        /* ── Rebuild SVG layer contents ── */
        arcLayer.innerHTML   = '';
        dotLayer.innerHTML   = '';
        pulseLayer.innerHTML = '';

        attacksRef.current.forEach((atk) => {
          const alpha = atk.done ? Math.max(0, 1 - atk.fadeTick / 60) : 1;

          /* Faint full arc */
          const fullArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          fullArc.setAttribute('d', atk.arc.path);
          fullArc.setAttribute('fill', 'none');
          fullArc.setAttribute('stroke', atk.color);
          fullArc.setAttribute('stroke-width', '1');
          fullArc.setAttribute('opacity', String(alpha * 0.18));
          arcLayer.appendChild(fullArc);

          /* Glowing trail polyline */
          if (atk.trail.length > 1) {
            const pts = atk.trail.map((p) => `${p.x},${p.y}`).join(' ');

            const glow = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            glow.setAttribute('points', pts);
            glow.setAttribute('fill', 'none');
            glow.setAttribute('stroke', atk.color);
            glow.setAttribute('stroke-width', '3.5');
            glow.setAttribute('stroke-linecap', 'round');
            glow.setAttribute('opacity', String(alpha * 0.35));
            glow.setAttribute('filter', 'url(#glow)');
            arcLayer.appendChild(glow);

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            line.setAttribute('points', pts);
            line.setAttribute('fill', 'none');
            line.setAttribute('stroke', atk.color);
            line.setAttribute('stroke-width', '1.5');
            line.setAttribute('stroke-linecap', 'round');
            line.setAttribute('opacity', String(alpha * 0.9));
            arcLayer.appendChild(line);
          }

          /* Moving head dot */
          if (!atk.done && atk.trail.length > 0) {
            const head = atk.trail[atk.trail.length - 1];
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', String(head.x));
            circle.setAttribute('cy', String(head.y));
            circle.setAttribute('r', '4');
            circle.setAttribute('fill', atk.color);
            circle.setAttribute('filter', 'url(#glow)');
            circle.setAttribute('opacity', String(alpha));
            dotLayer.appendChild(circle);
          }

          /* Impact burst on arrival */
          if (atk.done && atk.fadeTick < 40) {
            const r    = (atk.fadeTick / 40) * 22;
            const opac = Math.max(0, 1 - atk.fadeTick / 40);
            const burst = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            burst.setAttribute('cx', String(atk.arc.bx));
            burst.setAttribute('cy', String(atk.arc.by));
            burst.setAttribute('r', String(r));
            burst.setAttribute('fill', 'none');
            burst.setAttribute('stroke', atk.color);
            burst.setAttribute('stroke-width', '1.5');
            burst.setAttribute('opacity', String(opac * 0.8));
            pulseLayer.appendChild(burst);
          }
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* Spawn interval */
  useEffect(() => {
    if (paused) {
      clearInterval(spawnRef.current);
      return;
    }
    spawnRef.current = setInterval(spawnAttack, 900);
    return () => clearInterval(spawnRef.current);
  }, [paused, spawnAttack]);

  return (
    <div className="threat-globe-wrap" ref={wrapRef}>

      {/* World map image underneath */}
      <div className="threat-globe-map-bg" />

      {/* SVG overlay */}
      <svg
        ref={svgRef}
        className="threat-globe-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="soft-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="city-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#2dd4bf" stopOpacity="1" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* City dots — rendered once, static */}
        <g id="city-layer">
          {CITIES.map((c) => (
            <g key={c.id}>
              <circle
                cx={`${c.x}%`}
                cy={`${c.y}%`}
                r="5"
                fill="var(--primary-color)"
                opacity="0.15"
              />
              <circle
                cx={`${c.x}%`}
                cy={`${c.y}%`}
                r="2.5"
                fill="var(--primary-color)"
                opacity="0.7"
              />
            </g>
          ))}
        </g>

        {/* Dynamic layers — filled by animation loop */}
        <g id="arc-layer" />
        <g id="pulse-layer" />
        <g id="dot-layer" />

        {/* City labels on hover (CSS-driven) */}
        <g id="label-layer" className="city-labels">
          {CITIES.map((c) => (
            <text
              key={c.id}
              x={`${c.x}%`}
              y={`${c.y}%`}
              className="city-label"
              dy="-8"
            >
              {c.name}
            </text>
          ))}
        </g>
      </svg>

      {/* Corner scan-line overlay */}
      <div className="threat-globe-scanlines" />
      <div className="threat-globe-vignette" />
    </div>
  );
};

export default ThreatGlobe;