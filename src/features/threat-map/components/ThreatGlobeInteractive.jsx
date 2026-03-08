import React, { useEffect, useState } from 'react';
import ThreatGlobe from './ThreatGlobe';
import '../../../styles/sections/threat-map/controls.css';

const DEFAULT_ZOOM = 0.45;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const ThreatGlobeInteractive = ({ paused: pausedProp = false, onNewAttack }) => {
  const [paused, setPaused] = useState(pausedProp);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  useEffect(() => {
    setPaused(pausedProp);
  }, [pausedProp]);

  const zoomIn    = () => setZoom((prev) => clamp(prev + 0.12, 0, 1));
  const zoomOut   = () => setZoom((prev) => clamp(prev - 0.12, 0, 1));
  const resetView = () => {
    setZoom(DEFAULT_ZOOM);
  };

  return (
    <div className="threat-globe-interactive">
      <div className="threat-globe-stage">
        <ThreatGlobe paused={paused} onNewAttack={onNewAttack} zoom={zoom} />

        {/* Corner HUD brackets — top-left */}
        <div className="tgi-corner tgi-corner--tl" aria-hidden="true">
          <span className="tgi-corner-label">SYS:LIVE</span>
        </div>
        {/* Corner HUD brackets — bottom-right */}
        <div className="tgi-corner tgi-corner--br" aria-hidden="true">
          <span className="tgi-corner-label">VIZ:2D</span>
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
        Animated simulation&nbsp;&nbsp;·&nbsp;&nbsp;Use +/− to zoom
      </p>
    </div>
  );
};

export default ThreatGlobeInteractive;
