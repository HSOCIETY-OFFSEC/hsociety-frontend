import React, { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';
import Logo from '../../../shared/components/common/Logo';
import '../../../styles/features/landing/cycle.css';

/* ─────────────────────────────────────────
   Step icons (inline SVG fallback shapes)
───────────────────────────────────────── */
const STEP_ICONS = ['⬡', '◈', '⬟', '◇', '⬠'];

/* ─────────────────────────────────────────
   Distribute N points evenly on a circle
   in 3D space (tilted ellipse for depth)
───────────────────────────────────────── */
const getOrbitPositions = (count, rx = 155, ry = 55, rz = 155) => {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    return {
      x: Math.cos(angle) * rx,
      y: Math.sin(angle) * ry,
      z: Math.sin(angle) * rz,
      angle,
    };
  });
};

/* ─────────────────────────────────────────
   ORBIT RING + NODES (CSS 3D)
───────────────────────────────────────── */
const Orbit3D = ({ steps, activeIdx, onHover }) => {
  const sceneRef  = useRef(null);
  const rotateY   = useMotionValue(0);
  const rotateX   = useMotionValue(-18);
  const springY   = useSpring(rotateY, { stiffness: 60, damping: 18 });
  const springX   = useSpring(rotateX, { stiffness: 60, damping: 18 });

  // Auto-spin: increment rotateY every frame
  const rafRef    = useRef(null);
  const pausedRef = useRef(false);

  const startSpin = useCallback(() => {
    let last = performance.now();
    const tick = (now) => {
      if (!pausedRef.current) {
        const delta = now - last;
        rotateY.set(rotateY.get() + delta * 0.018);
      }
      last = now;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [rotateY]);

  React.useEffect(() => {
    startSpin();
    return () => cancelAnimationFrame(rafRef.current);
  }, [startSpin]);

  // Mouse tilt on hover
  const handleMouseMove = (e) => {
    const rect = sceneRef.current.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);
    rotateX.set(-18 + dy * 14);
  };

  const handleMouseLeave = () => {
    rotateX.set(-18);
  };

  const positions = getOrbitPositions(steps.length);

  return (
    <div
      className="orbit-scene-wrap"
      ref={sceneRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Decorative base glow */}
      <div className="orbit-glow-base" />

      <motion.div
        className="orbit-scene"
        style={{
          rotateY: springY,
          rotateX: springX,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Orbit ellipse rings (decorative planes) */}
        <div className="orbit-ring-plane orbit-ring-outer" />
        <div className="orbit-ring-plane orbit-ring-inner" />

        {/* Connection lines between nodes */}
        <svg className="orbit-connector-svg" viewBox="-200 -200 400 400" aria-hidden="true">
          {positions.map((pos, i) => {
            const next = positions[(i + 1) % positions.length];
            return (
              <line
                key={i}
                x1={pos.x} y1={pos.y}
                x2={next.x} y2={next.y}
                stroke="rgba(16,185,129,0.15)"
                strokeWidth="1"
                strokeDasharray="4 6"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {steps.map((step, i) => {
          const pos    = positions[i];
          const isActive = activeIdx === i;

          return (
            <motion.div
              key={step.title}
              className={`orbit-node ${isActive ? 'orbit-node--active' : ''}`}
              style={{
                transform: `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px)`,
                zIndex: Math.round(pos.z + 200),
              }}
              onHoverStart={() => {
                pausedRef.current = true;
                onHover(i);
              }}
              onHoverEnd={() => {
                pausedRef.current = false;
              }}
              whileHover={{ scale: 1.18 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <div className="orbit-node-inner">
                <span className="orbit-node-icon">{STEP_ICONS[i % STEP_ICONS.length]}</span>
                <span className="orbit-node-label">{step.title}</span>
                <span className="orbit-node-index">0{i + 1}</span>
              </div>
              {/* Depth shadow dot */}
              <div className="orbit-node-shadow" />
            </motion.div>
          );
        })}

        {/* Central core */}
        <div className="orbit-core">
          <div className="orbit-core-ring" />
          <div className="orbit-core-inner">
            <span className="orbit-core-label">CYCLE</span>
          </div>
        </div>

      </motion.div>

      {/* Ground shadow ellipse */}
      <div className="orbit-ground-shadow" />
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const CycleSection = ({ steps = [] }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeStep = steps[activeIdx] ?? steps[0];

  return (
    <section className="cycle-section reveal-on-scroll">
      <div className="section-container">

        {/* Header */}
        <div className="section-header-center">
          <div className="section-eyebrow">
            <Logo size="small" />
            <span>Pentest Cycle</span>
          </div>
          <h2 className="section-title-large">From Penetration to Fix, End-to-End</h2>
          <p className="section-subtitle-large">
            A continuous loop that moves findings into verified remediation.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="cycle-layout">

          {/* LEFT — 3D orbit */}
          <div className="cycle-orbit-col">
            <Orbit3D steps={steps} activeIdx={activeIdx} onHover={setActiveIdx} />
          </div>

          {/* RIGHT — Step list */}
          <div className="cycle-list-col">

            {/* Active step detail card */}
            {activeStep && (
              <motion.div
                className="cycle-detail-card"
                key={activeIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
              >
                <div className="cycle-detail-eyebrow">
                  <span className="cycle-detail-num">0{activeIdx + 1}</span>
                  <span className="cycle-detail-tag">ACTIVE PHASE</span>
                </div>
                <h3 className="cycle-detail-title">{activeStep.title}</h3>
                <p className="cycle-detail-desc">{activeStep.description}</p>
              </motion.div>
            )}

            {/* Step index list */}
            <div className="cycle-list">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  className={`cycle-item ${activeIdx === index ? 'cycle-item--active' : ''}`}
                  onClick={() => setActiveIdx(index)}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <div className="cycle-index">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="cycle-item-content">
                    <h3>{step.title}</h3>
                  </div>
                  <div className="cycle-item-arrow">›</div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CycleSection;