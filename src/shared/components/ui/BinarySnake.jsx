import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Anaconda cross-section radius profile ────────────────────────────────────
// t=0 HEAD TIP → t=1 TAIL TIP
const snakeRadius = (t) => {
  if (t < 0.02) return 0.02 + t * 8;                          // snout tip
  if (t < 0.07) return lerp(0.18, 0.44, (t - 0.02) / 0.05);  // jaw flare
  if (t < 0.15) return lerp(0.44, 0.62, (t - 0.07) / 0.08);  // neck rise
  if (t < 0.72) return lerp(0.62, 0.54, (t - 0.15) / 0.57);  // huge body, slight taper
  if (t < 0.90) return lerp(0.54, 0.18, (t - 0.72) / 0.18);  // tail taper
  return lerp(0.18, 0.01, (t - 0.90) / 0.10);                 // needle tip
};
const lerp = (a, b, t) => a + (b - a) * Math.min(1, Math.max(0, t));
const digitsForR = (r) => {
  if (r > 0.55) return 16;
  if (r > 0.42) return 12;
  if (r > 0.28) return 9;
  if (r > 0.14) return 6;
  if (r > 0.06) return 3;
  return 1;
};

// ─── Config ───────────────────────────────────────────────────────────────────
const SPINE   = 140;
const GAP     = 0.17;
const STRIDE  = 2;

const color1 = () => {
  if (typeof window === 'undefined') return '#1fbf8f';
  return window.getComputedStyle(document.documentElement)
    .getPropertyValue('--primary-color').trim() || '#1fbf8f';
};

// ─── Canvas texture helpers ───────────────────────────────────────────────────
const TC = {};
const makeTex = (fn) => {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 128;
  fn(cv.getContext('2d'), cv);
  const t = new THREE.CanvasTexture(cv);
  t.minFilter = t.magFilter = THREE.LinearFilter;
  return t;
};

const digitTex = (ch, col) => {
  const k = ch + col;
  if (TC[k]) return TC[k];
  return TC[k] = makeTex((ctx) => {
    // Outer halo
    const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 58);
    g.addColorStop(0,   col + 'dd');
    g.addColorStop(0.4, col + '55');
    g.addColorStop(1,   col + '00');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
    // Digit — big, crisp, bright
    ctx.font = 'bold 82px "Courier New",monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = col; ctx.shadowBlur = 28;
    ctx.fillStyle = '#fff'; ctx.fillText(ch, 64, 70);
  });
};

const eyeTex = (col) => makeTex((ctx) => {
  // Golden iris glow
  const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 58);
  g.addColorStop(0,    '#ffffffee');
  g.addColorStop(0.15, '#ffe566ee');
  g.addColorStop(0.5,  col + 'cc');
  g.addColorStop(1,    col + '00');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
  // Vertical slit pupil
  ctx.fillStyle = '#00000011';
  ctx.beginPath(); ctx.ellipse(64, 64, 62, 62, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#000000ee';
  ctx.beginPath(); ctx.ellipse(64, 64, 9, 36, 0, 0, Math.PI * 2); ctx.fill();
  // Specular glint
  ctx.fillStyle = '#ffffff99';
  ctx.beginPath(); ctx.ellipse(74, 50, 7, 5, -0.6, 0, Math.PI * 2); ctx.fill();
});

const tongueTex = () => makeTex((ctx) => {
  ctx.strokeStyle = '#ff3355'; ctx.lineWidth = 8; ctx.lineCap = 'round';
  // Left fork
  ctx.beginPath(); ctx.moveTo(64, 100); ctx.lineTo(64, 55);
  ctx.lineTo(30, 20); ctx.stroke();
  // Right fork
  ctx.beginPath(); ctx.moveTo(64, 55); ctx.lineTo(98, 20); ctx.stroke();
  // Glow
  ctx.shadowColor = '#ff1144'; ctx.shadowBlur = 18;
  ctx.strokeStyle = '#ff88aa'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(64, 100); ctx.lineTo(64, 55);
  ctx.lineTo(30, 20); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(64, 55); ctx.lineTo(98, 20); ctx.stroke();
});

// ─── Sprite material factory ──────────────────────────────────────────────────
const spriteMat = (tex, opacity = 1, blend = THREE.AdditiveBlending) =>
  new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: blend, opacity });

// ─── Head: eyes + mouth outline + tongue ─────────────────────────────────────
const Head = ({ spineRef, col }) => {
  const eyeL     = useRef();
  const eyeR     = useRef();
  const tongue   = useRef();
  const mouthTop = useRef([]);
  const mouthBot = useRef([]);
  const nostrils = useRef([]);

  const matEye  = useMemo(() => spriteMat(eyeTex(col),    1.0, THREE.NormalBlending), [col]);
  const matTong = useMemo(() => spriteMat(tongueTex(),     1.0, THREE.NormalBlending), []);
  const mat0    = useMemo(() => spriteMat(digitTex('0', col)), [col]);
  const mat1    = useMemo(() => spriteMat(digitTex('1', col)), [col]);

  // Mouth edge digits — upper lip arc
  const lipTop = useMemo(() => Array.from({ length: 9 }, (_, i) => {
    const a = Math.PI * 0.05 + (i / 8) * Math.PI * 0.90; // top arc
    return { a, r: 0.36, ch: i % 2 === 0 ? '0' : '1' };
  }), []);
  // Lower jaw arc — slightly wider (snake can open wide)
  const lipBot = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const a = Math.PI * 1.08 + (i / 6) * Math.PI * 0.84;
    return { a, r: 0.30, ch: i % 2 === 0 ? '1' : '0' };
  }), []);
  // Nostril scales
  const nostrilDefs = useMemo(() => [
    { offR:  0.20, offU: 0.22, offF: 0.28, ch: '1' },
    { offR: -0.20, offU: 0.22, offF: 0.28, ch: '1' },
  ], []);

  const v = {
    fwd:  new THREE.Vector3(),
    rt:   new THREE.Vector3(),
    up:   new THREE.Vector3(),
    WU:   new THREE.Vector3(0, 1, 0),
  };

  useFrame(({ clock }) => {
    const s    = spineRef.current;
    const time = clock.elapsedTime;
    const head = s[0];

    // Head local frame
    v.fwd.copy(s[0]).sub(s[4]).normalize();
    v.rt.crossVectors(v.fwd, v.WU);
    if (v.rt.lengthSq() < 1e-6) v.rt.set(1, 0, 0);
    v.rt.normalize();
    v.up.crossVectors(v.rt, v.fwd).normalize();

    const F = v.fwd, R = v.rt, U = v.up;

    // ── Eyes (on top-side of head, behind snout) ──
    const eyeU = 0.28, eyeF = 0.12, eyePulse = 0.9 + Math.sin(time * 1.8) * 0.1;
    [eyeL, eyeR].forEach((ref, side) => {
      const sign = side === 0 ? 1 : -1;
      if (!ref.current) return;
      ref.current.position.set(
        head.x + R.x * sign * 0.30 + U.x * eyeU + F.x * eyeF,
        head.y + R.y * sign * 0.30 + U.y * eyeU + F.y * eyeF,
        head.z + R.z * sign * 0.30 + U.z * eyeU + F.z * eyeF,
      );
      ref.current.scale.setScalar(0.38 * eyePulse);
      ref.current.material.opacity = eyePulse;
    });

    // ── Tongue — flicks in and out, rotates with head ──
    const tongueFlick = Math.abs(Math.sin(time * 3.5)); // 0..1 fast flick
    const tongueOut   = 0.55 + tongueFlick * 0.35;
    if (tongue.current) {
      tongue.current.position.set(
        head.x + F.x * tongueOut,
        head.y + F.y * tongueOut - 0.05,
        head.z + F.z * tongueOut,
      );
      tongue.current.scale.setScalar(0.5 + tongueFlick * 0.15);
      tongue.current.material.opacity = 0.6 + tongueFlick * 0.4;
    }

    // ── Mouth / upper lip digits — orbit around head forward axis ──
    const jawOpen = 0.04 + Math.abs(Math.sin(time * 0.6)) * 0.04; // subtle breathing
    lipTop.forEach(({ a, r, ch }, i) => {
      const sp = mouthTop.current[i]; if (!sp) return;
      const cosA = Math.cos(a), sinA = Math.sin(a);
      sp.position.set(
        s[1].x + (R.x * cosA + U.x * sinA) * r + F.x * 0.05,
        s[1].y + (R.y * cosA + U.y * sinA) * r + F.y * 0.05,
        s[1].z + (R.z * cosA + U.z * sinA) * r + F.z * 0.05,
      );
      sp.scale.setScalar(0.22);
      sp.material.opacity = 0.95;
    });

    lipBot.forEach(({ a, r, ch }, i) => {
      const sp = mouthBot.current[i]; if (!sp) return;
      // Lower jaw drops slightly during breathe cycle
      const jawDrop = jawOpen * 0.4;
      const cosA = Math.cos(a), sinA = Math.sin(a);
      sp.position.set(
        s[2].x + (R.x * cosA + (U.x - jawDrop) * sinA) * r,
        s[2].y + (R.y * cosA + (U.y - jawDrop) * sinA) * r,
        s[2].z + (R.z * cosA + (U.z - jawDrop) * sinA) * r,
      );
      sp.scale.setScalar(0.20);
      sp.material.opacity = 0.85;
    });

    // ── Nostril scales ──
    nostrilDefs.forEach(({ offR, offU, offF, ch }, i) => {
      const sp = nostrils.current[i]; if (!sp) return;
      sp.position.set(
        head.x + R.x * offR + U.x * offU + F.x * offF,
        head.y + R.y * offR + U.y * offU + F.y * offF,
        head.z + R.z * offR + U.z * offU + F.z * offF,
      );
      sp.scale.setScalar(0.16);
      sp.material.opacity = 0.8;
    });
  });

  return (
    <>
      <sprite ref={eyeL}  material={matEye} />
      <sprite ref={eyeR}  material={matEye} />
      <sprite ref={tongue} material={matTong} />
      {lipTop.map((d, i) => (
        <sprite key={`lt${i}`} ref={n => { mouthTop.current[i] = n; }}
          material={d.ch === '0' ? mat0 : mat1} />
      ))}
      {lipBot.map((d, i) => (
        <sprite key={`lb${i}`} ref={n => { mouthBot.current[i] = n; }}
          material={d.ch === '0' ? mat0 : mat1} />
      ))}
      {nostrilDefs.map((d, i) => (
        <sprite key={`ns${i}`} ref={n => { nostrils.current[i] = n; }}
          material={d.ch === '0' ? mat0 : mat1} />
      ))}
    </>
  );
};

// ─── Body rings ───────────────────────────────────────────────────────────────
const Body = ({ spineRef, col }) => {
  const mat0 = useMemo(() => spriteMat(digitTex('0', col)), [col]);
  const mat1 = useMemo(() => spriteMat(digitTex('1', col)), [col]);

  const defs = useMemo(() => {
    const out = [];
    const start = 5, end = SPINE - 10;
    for (let si = start; si < end; si += STRIDE) {
      const t   = si / (SPINE - 1);
      const r   = snakeRadius(t);
      const cnt = digitsForR(r);
      const sc  = 0.10 + r * 0.24;
      for (let d = 0; d < cnt; d++) {
        const base = (d / cnt) * Math.PI * 2;
        // richer scale pattern: use prime-ish offset
        const ch = ((Math.floor(si / STRIDE) * 3 + d * 7)) % 5 === 0 ? '1' : '0';
        out.push({ si, base, r, sc, ch });
      }
    }
    return out;
  }, []);

  const refs = useRef([]);
  const fwd  = useMemo(() => new THREE.Vector3(), []);
  const rt   = useMemo(() => new THREE.Vector3(), []);
  const up   = useMemo(() => new THREE.Vector3(), []);
  const WU   = new THREE.Vector3(0, 1, 0);

  useFrame(({ clock }) => {
    const s    = spineRef.current;
    const time = clock.elapsedTime;

    defs.forEach(({ si, base, r, sc }, i) => {
      const sp = refs.current[i]; if (!sp) return;
      const cur = s[si]; if (!cur) return;

      fwd.copy(s[Math.min(si + STRIDE, SPINE - 1)]).sub(s[Math.max(si - STRIDE, 0)]);
      if (fwd.lengthSq() < 1e-6) fwd.set(0, 0, -1); fwd.normalize();
      rt.crossVectors(fwd, WU); if (rt.lengthSq() < 1e-6) rt.set(1,0,0); rt.normalize();
      up.crossVectors(rt, fwd).normalize();

      // Extremely slow scale rotation — like scales shifting as it moves
      const spin = time * 0.08 + si * 0.055;
      const a    = base + spin;
      const ca   = Math.cos(a), sa = Math.sin(a);

      sp.position.set(
        cur.x + (rt.x * ca + up.x * sa) * r,
        cur.y + (rt.y * ca + up.y * sa) * r,
        cur.z + (rt.z * ca + up.z * sa) * r,
      );

      // Dorsal brightening — digits on top face are brighter
      const dorsal = up.y * sa + rt.y * ca; // approx: is it facing up?
      sp.material.opacity = 0.45 + Math.max(0, dorsal) * 0.55 + 0.05;
      sp.scale.setScalar(sc);
    });
  });

  return (
    <>
      {defs.map((d, i) => (
        <sprite key={i} ref={n => { refs.current[i] = n; }}
          material={d.ch === '0' ? mat0 : mat1} />
      ))}
    </>
  );
};

// ─── Tail ─────────────────────────────────────────────────────────────────────
const Tail = ({ spineRef, col }) => {
  const mat0 = useMemo(() => spriteMat(digitTex('0', col)), [col]);
  const mat1 = useMemo(() => spriteMat(digitTex('1', col)), [col]);

  const defs = useMemo(() => {
    const out = [];
    const start = SPINE - 10;
    for (let si = start; si < SPINE; si++) {
      const u   = (si - start) / (SPINE - 1 - start); // 0→1
      const r   = snakeRadius(si / (SPINE - 1));
      const cnt = Math.max(1, Math.round((1 - u) * 4));
      const sc  = lerp(0.13, 0.06, u);
      for (let d = 0; d < cnt; d++) {
        const base = (d / Math.max(cnt, 1)) * Math.PI * 2;
        out.push({ si, base, r: r * 0.85, sc, ch: (si + d) % 2 === 0 ? '0' : '1' });
      }
    }
    return out;
  }, []);

  const refs = useRef([]);
  const fwd  = useMemo(() => new THREE.Vector3(), []);
  const rt   = useMemo(() => new THREE.Vector3(), []);
  const up   = useMemo(() => new THREE.Vector3(), []);
  const WU   = new THREE.Vector3(0, 1, 0);

  useFrame(({ clock }) => {
    const s    = spineRef.current;
    const time = clock.elapsedTime;
    defs.forEach(({ si, base, r, sc }, i) => {
      const sp = refs.current[i]; if (!sp) return;
      const cur = s[si]; if (!cur) return;
      fwd.copy(cur).sub(s[Math.max(si - 1, 0)]); if (fwd.lengthSq() < 1e-6) fwd.set(0,0,-1); fwd.normalize();
      rt.crossVectors(fwd, WU); if (rt.lengthSq() < 1e-6) rt.set(1,0,0); rt.normalize();
      up.crossVectors(rt, fwd).normalize();
      const spin = time * 0.10 + si * 0.06;
      const a    = base + spin;
      sp.position.set(
        cur.x + (rt.x * Math.cos(a) + up.x * Math.sin(a)) * r,
        cur.y + (rt.y * Math.cos(a) + up.y * Math.sin(a)) * r,
        cur.z + (rt.z * Math.cos(a) + up.z * Math.sin(a)) * r,
      );
      const u2 = (si - (SPINE - 10)) / 10;
      sp.material.opacity = lerp(0.75, 0.05, u2);
      sp.scale.setScalar(sc);
    });
  });

  return (
    <>
      {defs.map((d, i) => (
        <sprite key={i} ref={n => { refs.current[i] = n; }}
          material={d.ch === '0' ? mat0 : mat1} />
      ))}
    </>
  );
};

// ─── Spine simulation ─────────────────────────────────────────────────────────
const Anaconda = ({ pointerRef }) => {
  const { viewport } = useThree();
  const col = useMemo(() => color1(), []);

  const spineRef = useRef(
    Array.from({ length: SPINE }, (_, i) =>
      new THREE.Vector3(Math.sin(i * 0.12) * 1.2, Math.cos(i * 0.08) * 0.8, -i * GAP)
    )
  );

  const tgt = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const flw = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, dt) => {
    const s    = spineRef.current;
    const ptr  = pointerRef.current;
    const time = clock.elapsedTime;

    // Head
    tgt.set(
      ptr.x * viewport.width  * 0.42,
      ptr.y * viewport.height * 0.34,
      Math.sin(time * 0.7) * 0.8
    );
    s[0].lerp(tgt, 1 - Math.exp(-dt * 3.0));

    // Chain
    for (let i = 1; i < SPINE; i++) {
      const p = s[i - 1], c = s[i];
      dir.copy(c).sub(p);
      const dist = Math.max(dir.length(), 1e-4);
      dir.normalize();
      const want = GAP * (1 + i * 0.003);
      flw.copy(p).addScaledVector(dir, want);
      c.lerp(flw, 0.44);

      // Slow, powerful anaconda undulation — low frequency, large amplitude
      const phase = i * 0.18;
      c.x += (Math.sin(time * 0.75 + phase) * 0.028 + Math.sin(time * 1.3 + phase * 0.7) * 0.012);
      c.y += Math.cos(time * 0.6  + phase * 0.9) * 0.010;
      c.z += Math.sin(time * 1.0  + phase * 1.2) * 0.014;

      if (dist < want * 0.5) c.lerp(p, 0.10);
    }
  });

  return (
    <>
      <Head spineRef={spineRef} col={col} />
      <Body spineRef={spineRef} col={col} />
      <Tail spineRef={spineRef} col={col} />
    </>
  );
};

// ─── Scene / Root ─────────────────────────────────────────────────────────────
const Scene = ({ pointerRef }) => {
  const col = useMemo(() => color1(), []);
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[5, 6, 7]}   intensity={1.2} color={col} />
      <pointLight position={[-6, -4, 3]} intensity={0.5} color="#b0ffe0" />
      <pointLight position={[0, 0, 4]}   intensity={0.3} color="#ffffff" />
      <Anaconda pointerRef={pointerRef} />
    </>
  );
};

const BinarySnake = ({ targetRef }) => {
  const pointerRef   = useRef(new THREE.Vector2(0, 0));
  const containerRef = useRef(null);

  useEffect(() => {
    const target = targetRef?.current ?? containerRef.current;
    if (!target) return;
    const onMove = (e) => {
      const r = target.getBoundingClientRect();
      pointerRef.current.set(
        ((e.clientX - r.left) / r.width  - 0.5) * 2,
        (0.5 - (e.clientY - r.top) / r.height)  * 2
      );
    };
    const onTouch = (e) => {
      if (!e.touches?.length) return;
      const r = target.getBoundingClientRect();
      const t = e.touches[0];
      pointerRef.current.set(
        ((t.clientX - r.left) / r.width  - 0.5) * 2,
        (0.5 - (t.clientY - r.top) / r.height)  * 2
      );
    };
    const onLeave = () => pointerRef.current.set(0, 0);
    target.addEventListener('pointermove',  onMove,  { passive: true });
    target.addEventListener('touchmove',    onTouch, { passive: true });
    target.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      target.removeEventListener('pointermove',  onMove);
      target.removeEventListener('touchmove',    onTouch);
      target.removeEventListener('pointerleave', onLeave);
    };
  }, [targetRef]);

  return (
    <div ref={containerRef} aria-hidden="true" style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      minHeight: '100px', zIndex: 0, pointerEvents: 'none', opacity: 0.97,
      filter: 'drop-shadow(0 0 40px rgba(31,191,143,0.65)) saturate(1.5)',
    }}>
      <Canvas
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 9], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene pointerRef={pointerRef} />
      </Canvas>
    </div>
  );
};

export default BinarySnake;
