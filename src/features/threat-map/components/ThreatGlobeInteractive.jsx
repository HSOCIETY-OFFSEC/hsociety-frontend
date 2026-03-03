import React, { useMemo } from 'react';
import ThreatGlobe from './ThreatGlobe';
import ThreatGlobe3D from './ThreatGlobe3D';

const canUseWebGL = () => {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch (_err) {
    return false;
  }
};

const ThreatGlobeInteractive = ({ paused, onNewAttack }) => {
  const supportsWebGL = useMemo(canUseWebGL, []);
  if (!supportsWebGL) {
    return <ThreatGlobe paused={paused} onNewAttack={onNewAttack} />;
  }
  return <ThreatGlobe3D paused={paused} onNewAttack={onNewAttack} />;
};

export default ThreatGlobeInteractive;
