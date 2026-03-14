import React, { useState, useCallback, useEffect } from 'react';
import ThreatGlobeInteractive from './components/ThreatGlobeInteractive';
import ThreatStats from './components/ThreatStats';
import ThreatLog from './components/ThreatLog';
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

  useEffect(() => {
    document.body.classList.add('workspace-lock-scroll', 'threat-map-fullscreen');
    return () => document.body.classList.remove('workspace-lock-scroll', 'threat-map-fullscreen');
  }, []);

  return (
    <div className="threat-map-page">
      <div className="threat-map-stars" />
      <div className="threat-map-nebula" />
      
      <header className="threat-map-header">
        <div className="threat-map-header-left">
          <h1 className="threat-map-title">
            Activity
          </h1>
        </div>
        <div className="threat-map-header-right">
          <button
            className={`threat-map-pause-btn ${paused ? 'is-paused' : ''}`}
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </header>

      <ThreatStats counts={counts} total={attacks.length} />

      <div className="threat-map-body">
        <div className="threat-map-globe-wrap">
          <ThreatGlobeInteractive paused={paused} onNewAttack={handleNewAttack} />
        </div>
        <aside className="threat-map-sidebar">
          <ThreatLog attacks={attacks} />
        </aside>
      </div>

      <footer className="threat-map-footer">
        <span className="threat-map-disclaimer">
          Simulated data for demonstration purposes
        </span>
      </footer>
    </div>
  );
};

export default ThreatMap;
