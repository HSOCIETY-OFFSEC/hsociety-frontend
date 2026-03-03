import React, { useCallback, useEffect, useState } from 'react';
import ThreatGlobeInteractive from '../../threat-map/components/ThreatGlobeInteractive';
import '../../../styles/landing/threat-map-section.css';

const ThreatMapSection = () => {
  const handleAttack = useCallback(() => {}, []);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('workspace-lock-scroll', expanded);
    return () => document.body.classList.remove('workspace-lock-scroll');
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return undefined;
    const handleKey = (event) => {
      if (event.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [expanded]);

  return (
    <section className="landing-threatmap">
      <div className="landing-threatmap-inner">
        <div className="landing-threatmap-copy">
          <p className="landing-threatmap-kicker">Live Visualization</p>
          <h2 className="landing-threatmap-title">Global Threat Activity</h2>
          <p className="landing-threatmap-subtitle">
            A real-time styled view of simulated attack paths across the globe, built for
            rapid pattern recognition and executive briefings.
          </p>
        </div>
        <div className="landing-threatmap-visual" aria-hidden="true">
          <div className="landing-threatmap-frame">
            <div className="landing-threatmap-overlay" />
            <ThreatGlobeInteractive paused={false} onNewAttack={handleAttack} />
          </div>
          <div className="landing-threatmap-caption">
            Simulated data • Not a live threat intelligence feed
          </div>
          <button
            type="button"
            className="landing-threatmap-open"
            onClick={() => setExpanded(true)}
          >
            Open Fullscreen Globe
          </button>
        </div>
      </div>

      {expanded && (
        <div
          className="landing-threatmap-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Threat map expanded view"
          onClick={() => setExpanded(false)}
        >
          <div
            className="landing-threatmap-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="landing-threatmap-modal-close"
              onClick={() => setExpanded(false)}
            >
              Close
            </button>
            <div className="landing-threatmap-modal-frame">
              <ThreatGlobeInteractive paused={false} onNewAttack={handleAttack} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ThreatMapSection;
