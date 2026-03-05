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

  const zoomIn    = () => setZoom((prev) => clamp(prev + 0.12, 0, 1));
  const zoomOut   = () => setZoom((prev) => clamp(prev - 0.12, 0, 1));
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

        {/* Corner HUD brackets — top-left */}
        <div className="tgi-corner tgi-corner--tl" aria-hidden="true">
          <span className="tgi-corner-label">SYS:LIVE</span>
        </div>
        {/* Corner HUD brackets — bottom-right */}
        <div className="tgi-corner tgi-corner--br" aria-hidden="true">
          <span className="tgi-corner-label">VIZ:3D</span>
        </div>

        {/* Sweep line animation */}
        <div className="tgi-sweep" aria-hidden="true" />
      </div>

      {/* Control panel */}
      <div className="threat-globe-controls" role="group" aria-label="Globe controls">
        {/* Zoom cluster */}
        <div className="tgi-btn-group">
          <button
            type="button"
            className="threat-globe-btn threat-globe-btn--zoom"
            onClick={zoomIn}
            aria-label="Zoom in"
            title="Zoom in"
          >
            +
          </button>
          <div className="tgi-btn-sep" />
          <button
            type="button"
            className="threat-globe-btn threat-globe-btn--zoom"
            onClick={zoomOut}
            aria-label="Zoom out"
            title="Zoom out"
          >
            −
          </button>
        </div>

        <div className="threat-globe-controls-sep" />

        {/* Pause/Resume */}
        <button
          type="button"
          className={`threat-globe-btn ${paused ? 'is-active' : ''}`}
          onClick={() => setPaused((p) => !p)}
          data-label-short={paused ? '▶' : '⏸'}
          aria-label={paused ? 'Resume simulation' : 'Pause simulation'}
        >
          <span className="tgi-btn-icon">{paused ? '▶' : '⏸'}</span>
          <span className="tgi-btn-text">{paused ? 'Resume' : 'Pause'}</span>
        </button>

        {/* Auto-rotate (3D only) */}
        {supportsWebGL && (
          <button
            type="button"
            className={`threat-globe-btn ${autoRotate ? 'is-active' : ''}`}
            onClick={() => setAutoRotate((prev) => !prev)}
            data-label-short="↻"
            aria-label={autoRotate ? 'Stop auto-rotate' : 'Enable auto-rotate'}
          >
            <span className="tgi-btn-icon">↻</span>
            <span className="tgi-btn-text">{autoRotate ? 'Stop' : 'Rotate'}</span>
          </button>
        )}

        <div className="threat-globe-controls-sep" />

        {/* Reset */}
        <button
          type="button"
          className="threat-globe-btn is-ghost"
          onClick={resetView}
          data-label-short="⟳"
          aria-label="Reset view"
          title="Reset view"
        >
          <span className="tgi-btn-icon">⟳</span>
          <span className="tgi-btn-text">Reset</span>
        </button>
      </div>

      {/* Drag hint */}
      <p className="threat-globe-hint">
        <span className="tgi-hint-icon">⊹</span>
        Drag to rotate&nbsp;&nbsp;·&nbsp;&nbsp;Scroll to zoom
      </p>
    </div>
  );
};

export default ThreatGlobeInteractive;