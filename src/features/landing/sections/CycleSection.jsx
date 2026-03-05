import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import Logo from '../../../shared/components/common/Logo';
import '../../../styles/landing/cycle.css';

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

const OrbitNodes = ({ steps, activeIdx, onHover, pausedRef }) => {
  const groupRef = useRef(null);
  const positions = useMemo(() => getOrbitPositions(steps.length, 3.1, 1.15, 3.1), [steps.length]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (!pausedRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
    groupRef.current.rotation.x = -0.35 + Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 2.32, 80]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 1.62, 80]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.14} />
      </mesh>

      {positions.map((pos, i) => {
        const isActive = activeIdx === i;
        const color = new THREE.Color(isActive ? '#10b981' : '#1f2937');
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
            <sphereGeometry args={[0.28, 32, 32]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isActive ? 0.6 : 0.2}
              roughness={0.35}
              metalness={0.4}
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
        onPointerLeave={() => {
          pausedRef.current = false;
        }}
      >
        <ambientLight intensity={0.55} />
        <pointLight position={[4, 4, 6]} intensity={1.2} />
        <OrbitNodes steps={steps} activeIdx={activeIdx} onHover={onHover} pausedRef={pausedRef} />
      </Canvas>

      <div className="orbit-core">
        <div className="orbit-core-ring" />
        <div className="orbit-core-inner">
          <Logo size="small" className="orbit-core-logo" />
        </div>
      </div>

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
