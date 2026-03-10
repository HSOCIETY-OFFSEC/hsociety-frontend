import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import '../../../styles/sections/threat-map/globe-3d.css';

const CITY_POINTS = [
  { id: 'nyc', name: 'New York', lat: 40.7128, lon: -74.0060 },
  { id: 'lon', name: 'London', lat: 51.5072, lon: -0.1276 },
  { id: 'par', name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { id: 'ber', name: 'Berlin', lat: 52.5200, lon: 13.4050 },
  { id: 'mos', name: 'Moscow', lat: 55.7558, lon: 37.6176 },
  { id: 'dub', name: 'Dubai', lat: 25.2048, lon: 55.2708 },
  { id: 'mum', name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { id: 'sin', name: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { id: 'sha', name: 'Shanghai', lat: 31.2304, lon: 121.4737 },
  { id: 'tok', name: 'Tokyo', lat: 35.6764, lon: 139.6500 },
  { id: 'syd', name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { id: 'lax', name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
  { id: 'chi', name: 'Chicago', lat: 41.8781, lon: -87.6298 },
  { id: 'sao', name: 'São Paulo', lat: -23.5558, lon: -46.6396 },
  { id: 'joh', name: 'Johannesburg', lat: -26.2041, lon: 28.0473 },
  { id: 'bei', name: 'Beijing', lat: 39.9042, lon: 116.4074 },
  { id: 'tor', name: 'Toronto', lat: 43.6532, lon: -79.3832 },
  { id: 'mex', name: 'Mexico City', lat: 19.4326, lon: -99.1332 },
  { id: 'lag', name: 'Lagos', lat: 6.5244, lon: 3.3792 },
  { id: 'nai', name: 'Nairobi', lat: -1.2921, lon: 36.8219 },
];

const ATTACK_TYPES = [
  'DDoS', 'Ransomware', 'Phishing', 'SQL Injection',
  'XSS', 'Brute Force', 'Zero-Day', 'MITM', 'APT', 'Botnet',
  'Credential Stuffing', 'Supply Chain',
];

const SEVERITY = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const SEVERITY_COLORS = {
  CRITICAL: '#ff2d55',
  HIGH: '#ff6b00',
  MEDIUM: '#ffd60a',
  LOW: '#2dd4bf',
};

const EARTH_TEXTURES = {
  day: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
  night: 'https://threejs.org/examples/textures/planets/earth_lights_2048.png',
  normal: 'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg',
  specular: 'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg',
  clouds: 'https://threejs.org/examples/textures/planets/earth_clouds_1024.png',
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (a, b) => a + Math.random() * (b - a);

const latLonToVector3 = (lat, lon, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius) * Math.sin(phi) * Math.cos(theta),
    (radius) * Math.cos(phi),
    (radius) * Math.sin(phi) * Math.sin(theta)
  );
};

const buildArcPoints = (start, end, radius, segments = 64) => {
  const points = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const v = new THREE.Vector3().copy(start).lerp(end, t).normalize();
    const arcHeight = Math.sin(Math.PI * t) * 0.18;
    v.multiplyScalar(radius * (1 + arcHeight));
    points.push(v);
  }
  return points;
};

const Earth = ({ theme }) => {
  const [day, night, normal, specular, clouds] = useTexture([
    EARTH_TEXTURES.day,
    EARTH_TEXTURES.night,
    EARTH_TEXTURES.normal,
    EARTH_TEXTURES.specular,
    EARTH_TEXTURES.clouds,
  ]);

  const emissiveIntensity = theme === 'light' ? 0.25 : 0.85;
  const baseColor = theme === 'light' ? '#cfe7ff' : '#d6f6ff';

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshPhongMaterial
          map={day}
          normalMap={normal}
          specularMap={specular}
          emissiveMap={night}
          emissive={new THREE.Color(baseColor)}
          emissiveIntensity={emissiveIntensity}
          shininess={14}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.215, 64, 64]} />
        <meshPhongMaterial
          map={clouds}
          transparent
          opacity={theme === 'light' ? 0.25 : 0.38}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

const AttackLayer = ({ attacks, theme }) => {
  return (
    <group>
      {attacks.map((atk) => {
        const slice = Math.max(2, Math.floor(atk.points.length * atk.progress));
        const points = atk.points.slice(0, slice);
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <group key={atk.id}>
            <line geometry={geom}>
              <lineBasicMaterial
                color={atk.color}
                transparent
                opacity={theme === 'light' ? 0.65 : 0.9}
              />
            </line>
            {atk.head && (
              <mesh position={atk.head}>
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshStandardMaterial color={atk.color} emissive={atk.color} emissiveIntensity={0.8} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

const GlobeScene = ({ paused, onNewAttack, theme, autoRotate, cameraDistance, resetSeed }) => {
  const attacksRef = useRef([]);
  const [tick, setTick] = useState(0);
  const lastTickRef = useRef(0);
  const controlsRef = useRef(null);
  const { camera } = useThree();

  useEffect(() => {
    if (paused) return undefined;
    const interval = setInterval(() => {
      const src = pick(CITY_POINTS);
      let dst = pick(CITY_POINTS);
      while (dst.id === src.id) dst = pick(CITY_POINTS);
      const severity = pick(SEVERITY);
      const color = SEVERITY_COLORS[severity];
      const start = latLonToVector3(src.lat, src.lon, 1.2);
      const end = latLonToVector3(dst.lat, dst.lon, 1.2);
      const points = buildArcPoints(start, end, 1.2, 72);
      const attack = {
        id: `atk-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        src,
        dst,
        severity,
        color,
        type: pick(ATTACK_TYPES),
        points,
        progress: 0,
        speed: rand(0.002, 0.006),
      };
      attacksRef.current = [...attacksRef.current.slice(-18), attack];
      onNewAttack?.({
        id: attack.id,
        src: src.name,
        dst: dst.name,
        type: attack.type,
        severity: attack.severity,
        color: attack.color,
        time: new Date().toLocaleTimeString(),
      });
    }, 900);
    return () => clearInterval(interval);
  }, [onNewAttack, paused]);

  useEffect(() => {
    if (!camera || !Number.isFinite(cameraDistance)) return;
    camera.position.set(0, 0, cameraDistance);
    camera.updateProjectionMatrix();
    controlsRef.current?.update();
  }, [camera, cameraDistance]);

  useEffect(() => {
    if (!controlsRef.current) return;
    controlsRef.current.reset();
  }, [resetSeed]);

  useFrame(({ clock }) => {
    if (paused) return;
    const now = clock.elapsedTime;
    if (now - lastTickRef.current < 1 / 30) return;
    lastTickRef.current = now;
    attacksRef.current = attacksRef.current
      .map((atk) => {
        const progress = Math.min(atk.progress + atk.speed, 1);
        const headIndex = Math.max(0, Math.floor(progress * (atk.points.length - 1)));
        return {
          ...atk,
          progress,
          head: atk.points[headIndex],
        };
      })
      .filter((atk) => atk.progress < 1.05);
    setTick((t) => t + 1);
  });

  const attacks = useMemo(() => attacksRef.current, [tick]);

  return (
    <>
      <ambientLight intensity={theme === 'light' ? 0.5 : 0.2} />
      <directionalLight position={[4, 2, 5]} intensity={theme === 'light' ? 0.7 : 1.1} />
      <hemisphereLight
        intensity={theme === 'light' ? 0.35 : 0.45}
        color={theme === 'light' ? '#ffffff' : '#4dd4ff'}
        groundColor={theme === 'light' ? '#334155' : '#0b1020'}
      />
      <Earth theme={theme} />
      <AttackLayer attacks={attacks} theme={theme} />
      <Stars radius={40} depth={24} count={1200} factor={1.6} fade />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom
        minDistance={2.2}
        maxDistance={4.6}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
        autoRotate={!paused && autoRotate}
        autoRotateSpeed={0.2}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
};

const ThreatGlobe3D = ({ paused, onNewAttack, zoom = 0.45, autoRotate = true, resetSeed = 0 }) => {
  const [theme, setTheme] = useState('black');
  const cameraDistance = useMemo(() => {
    const clamped = Math.min(Math.max(zoom, 0), 1);
    const min = 2.2;
    const max = 4.6;
    return max - (max - min) * clamped;
  }, [zoom]);

  useEffect(() => {
    const root = document.documentElement;
    const getTheme = () => root.getAttribute('data-theme') || 'black';
    setTheme(getTheme());
    const observer = new MutationObserver(() => setTheme(getTheme()));
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="threat-globe-3d">
      <Canvas
        className="threat-globe-3d-canvas"
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, cameraDistance], fov: 45 }}
      >
        <color attach="background" args={[theme === 'light' ? '#eef2f6' : '#060a10']} />
        <GlobeScene
          paused={paused}
          onNewAttack={onNewAttack}
          theme={theme}
          autoRotate={autoRotate}
          cameraDistance={cameraDistance}
          resetSeed={resetSeed}
        />
      </Canvas>
    </div>
  );
};

export default ThreatGlobe3D;
