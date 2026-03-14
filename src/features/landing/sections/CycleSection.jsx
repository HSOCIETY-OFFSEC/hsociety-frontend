/* FILE: src/features/landing/sections/CycleSection.jsx */
import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Logo from '../../../shared/components/common/Logo';
import '../../../styles/landing/cycle.css';

/* Distribute N points on a circle */
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

const OrbitNodes = ({ steps, activeIdx, onHover, pausedRef }) => {
  const groupRef = useRef(null);
  const positions = useMemo(() => getOrbitPositions(steps.length, 3.1, 1.15, 3.1), [steps.length]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (!pausedRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
    groupRef.current.rotation.x = -0.3 + Math.sin(state.clock.elapsedTime * 0.35) * 0.06;
  });

  return (
    <group ref={groupRef}>
      {/* Orbit rings — subtle, border-color toned */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 2.32, 80]} />
        <meshBasicMaterial color="#94a3b8" transparent opacity={0.15} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 1.62, 80]} />
        <meshBasicMaterial color="#94a3b8" transparent opacity={0.1} />
      </mesh>

      {positions.map((pos, i) => {
        const isActive = activeIdx === i;
        /* Active = primary-color green, inactive = neutral */
        const color = new THREE.Color(isActive ? '#1fbf8f' : '#64748b');
        return (
          <mesh
            key={steps[i]?.title || i}
            position={[pos.x, pos.y, pos.z]}
            onPointerOver={() => {
              pausedRef.current = true;
              onHover(i);
            }}
            onPointerOut={() => {
              pausedRef.current = false;
            }}
          >
            <sphereGeometry args={[0.24, 32, 32]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isActive ? 0.4 : 0.1}
              roughness={0.5}
              metalness={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const Orbit3D = ({ steps, activeIdx, onHover }) => {
  const pausedRef = useRef(false);

  return (
    <div className="orbit-scene-wrap">
      <div className="orbit-glow-base" />
      <Canvas
        className="orbit-canvas"
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        onPointerLeave={() => { pausedRef.current = false; }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[4, 4, 6]} intensity={0.9} />
        <OrbitNodes steps={steps} activeIdx={activeIdx} onHover={onHover} pausedRef={pausedRef} />
      </Canvas>

      <div className="orbit-core">
        <div className="orbit-core-ring" />
        <div className="orbit-core-inner">
          <Logo size="small" className="orbit-core-logo" />
        </div>
      </div>
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
            {/* Active step detail */}
            {activeStep && (
              <div className="cycle-detail-card">
                <div className="cycle-detail-eyebrow">
                  <span className="cycle-detail-num">0{activeIdx + 1}</span>
                  <span className="cycle-detail-tag">ACTIVE PHASE</span>
                </div>
                <h3 className="cycle-detail-title">{activeStep.title}</h3>
                <p className="cycle-detail-desc">{activeStep.description}</p>
              </div>
            )}

            {/* Step index list */}
            <div className="cycle-list">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className={`cycle-item${activeIdx === index ? ' cycle-item--active' : ''}`}
                  onClick={() => setActiveIdx(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveIdx(index); }}
                >
                  <div className="cycle-index">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="cycle-item-content">
                    <h3>{step.title}</h3>
                  </div>
                  <div className="cycle-item-arrow">›</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CycleSection;