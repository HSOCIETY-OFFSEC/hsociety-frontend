import React from 'react';
import { Link } from 'react-router-dom';
import ThreatMap from './ThreatMap';

const LiveThreatMiniMap = () => {
  return (
    <section className="live-threat-mini">
      <div className="live-threat-mini-header">
        <h2>Global Live Threat Map</h2>
        <p>Real-time arcs visualize source-to-target attack flow and severity.</p>
      </div>
      <ThreatMap mini />
      <Link to="/live-map" className="live-threat-open-link">
        Enter Fullscreen Threat Center
      </Link>
    </section>
  );
};

export default LiveThreatMiniMap;
