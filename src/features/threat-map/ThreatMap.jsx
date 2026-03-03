import React, { useState, useCallback } from 'react';
import ThreatGlobeInteractive from './components/ThreatGlobeInteractive';
import ThreatStats from './components/ThreatStats';
import ThreatLog from './components/ThreatLog';
import Logo from '../../shared/components/common/Logo';
import '../../styles/sections/threat-map/index.css';

const ThreatMap = () => {
  const [attacks, setAttacks] = useState([]);
  const [paused, setPaused] = useState(false);

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
          </div>
        </div>
        <div className="threat-map-title-row">
          <h1 className="threat-map-title">
            Global Cyber <span className="threat-map-title-accent">Threat Map</span>
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

    </div>
  );
};

export default ThreatMap;
