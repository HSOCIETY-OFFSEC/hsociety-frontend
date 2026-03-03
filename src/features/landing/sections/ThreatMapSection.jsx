import React, { useCallback } from 'react';
import ThreatGlobeInteractive from '../../threat-map/components/ThreatGlobeInteractive';
import '../../../styles/landing/threat-map-section.css';

const ThreatMapSection = () => {
  const handleAttack = useCallback(() => {}, []);

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
        </div>
      </div>
    </section>
  );
};

export default ThreatMapSection;
