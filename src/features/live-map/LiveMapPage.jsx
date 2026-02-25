import React from 'react';
import { Link } from 'react-router-dom';
import ThreatMap from './ThreatMap';

const LiveMapPage = () => {
  return (
    <div className="live-map-page">
      <div className="live-map-page-topbar">
        <div>
          <p>HSOCIETY Command View</p>
          <h1>Live Global Threat Center</h1>
        </div>
        <Link to="/" className="live-map-back-link">
          Back to Home
        </Link>
      </div>
      <ThreatMap />
    </div>
  );
};

export default LiveMapPage;
