import React, { useState, useCallback, useEffect } from 'react';
import ThreatGlobeInteractive from './components/ThreatGlobeInteractive';
import ThreatStats from './components/ThreatStats';
import ThreatLog from './components/ThreatLog';
import Logo from '../../shared/components/common/Logo';
import '../../styles/sections/threat-map/index.css';

const ThreatMap = () => {
  const [attacks, setAttacks] = useState([]);
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleNewAttack = useCallback((attack) => {
    setAttacks((prev) => [attack, ...prev.slice(0, 49)]);
  }, []);

  const counts = attacks.reduce(
    (acc, a) => {
      acc[a.severity] = (acc[a.severity] || 0) + 1;
      return acc;
    },
    { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 }
  );

  useEffect(() => {
    document.body.classList.add('workspace-lock-scroll', 'threat-map-fullscreen');
    return () => document.body.classList.remove('workspace-lock-scroll', 'threat-map-fullscreen');
  }, []);

  useEffect(() => {
    if (!expanded) return undefined;
    const handleKey = (event) => {
      if (event.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [expanded]);

  return (
    <div className="threat-map-page">

      {/* Header */}
      <header className="threat-map-header">
        <div className="threat-map-header-inner">
          <div className="threat-map-eyebrow">
            <Logo size="small" />
            <span className="threat-map-eyebrow-label">Live Intelligence Feed</span>
            <span className={`threat-map-status-dot ${paused ? 'is-paused' : 'is-live'}`} />
            <span className="threat-map-status-text">{paused ? 'PAUSED' : 'LIVE'}</span>
          </div>
          <div className="threat-map-header-right">
            <button
              className={`threat-map-pause-btn ${paused ? 'is-paused' : ''}`}
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button
              className="threat-map-expand-btn"
              onClick={() => setExpanded(true)}
            >
              Fullscreen
            </button>
          </div>
        </div>
        <div className="threat-map-title-row">
          <h1 className="threat-map-title">
            Hacker <span className="threat-map-title-accent">Threat Map</span>
          </h1>
          <p className="threat-map-subtitle">
            Simulated real-time visualization of attack vectors, threat origins, and targets across the globe.
          </p>
        </div>
      </header>

      {/* Stats bar */}
      <ThreatStats counts={counts} total={attacks.length} />

      {/* Main content — map + log */}
      <div className="threat-map-body">
        <div className="threat-map-globe-wrap">
          <ThreatGlobeInteractive paused={paused} onNewAttack={handleNewAttack} />
        </div>
        <aside className="threat-map-sidebar">
          <ThreatLog attacks={attacks} />
        </aside>
      </div>

      {/* Disclaimer */}
      <footer className="threat-map-footer">
        <span className="threat-map-disclaimer">
          ⚠ Simulated data for demonstration purposes only. Not sourced from live threat intelligence feeds.
        </span>
      </footer>

      {expanded && (
        <div
          className="threat-map-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Threat map expanded view"
          onClick={() => setExpanded(false)}
        >
          <div className="threat-map-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="threat-map-modal-close"
              onClick={() => setExpanded(false)}
            >
              Close
            </button>
            <div className="threat-map-modal-frame">
              <ThreatGlobeInteractive paused={paused} onNewAttack={handleNewAttack} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ThreatMap;
