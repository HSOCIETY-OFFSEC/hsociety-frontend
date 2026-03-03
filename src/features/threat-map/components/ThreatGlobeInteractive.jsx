import React, { useEffect, useMemo, useState } from 'react';
import ThreatGlobe from './ThreatGlobe';
import ThreatGlobe3D from './ThreatGlobe3D';
import '../../../styles/sections/threat-map/controls.css';

const canUseWebGL = () => {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch (_err) {
    return false;
  }
};

const DEFAULT_ZOOM = 0.45;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const ThreatGlobeInteractive = ({ paused: pausedProp = false, onNewAttack }) => {
  const supportsWebGL = useMemo(canUseWebGL, []);
  const [paused, setPaused] = useState(pausedProp);
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [resetSeed, setResetSeed] = useState(0);

  useEffect(() => {
    setPaused(pausedProp);
  }, [pausedProp]);

  const zoomIn = () => setZoom((prev) => clamp(prev + 0.12, 0, 1));
  const zoomOut = () => setZoom((prev) => clamp(prev - 0.12, 0, 1));
  const resetView = () => {
    setZoom(DEFAULT_ZOOM);
    setAutoRotate(true);
    setResetSeed((prev) => prev + 1);
  };

  return (
    <div className="threat-globe-interactive">
      <div className="threat-globe-stage">
        {supportsWebGL ? (
          <ThreatGlobe3D
            paused={paused}
            onNewAttack={onNewAttack}
            zoom={zoom}
            autoRotate={autoRotate}
            resetSeed={resetSeed}
          />
        ) : (
          <ThreatGlobe paused={paused} onNewAttack={onNewAttack} zoom={zoom} />
        )}
      </div>

      <div className="threat-globe-controls" role="group" aria-label="Globe controls">
        <button type="button" className="threat-globe-btn" onClick={zoomIn}>
          +
        </button>
        <button type="button" className="threat-globe-btn" onClick={zoomOut}>
          -
        </button>
        <button type="button" className="threat-globe-btn" onClick={() => setPaused((p) => !p)}>
          {paused ? 'Resume' : 'Pause'}
        </button>
        {supportsWebGL && (
          <button
            type="button"
            className="threat-globe-btn"
            onClick={() => setAutoRotate((prev) => !prev)}
          >
            {autoRotate ? 'Stop Rotate' : 'Auto Rotate'}
          </button>
        )}
        <button type="button" className="threat-globe-btn is-ghost" onClick={resetView}>
          Reset
        </button>
      </div>

      <p className="threat-globe-hint">
        Drag to rotate • Scroll to zoom
      </p>
    </div>
  );
};

export default ThreatGlobeInteractive;
