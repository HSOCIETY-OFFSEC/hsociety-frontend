import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BinaryLoader from '../ui/BinaryLoader';
import '../../../styles/shared/components/layout/RouteEffects.css';

const RouteEffects = ({ durationMs = 520 }) => {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    const isInitial = firstRender.current;
    firstRender.current = false;

    if (isInitial) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      return undefined;
    }

    setShowLoader(true);
    const timeout = setTimeout(() => setShowLoader(false), durationMs);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    return () => clearTimeout(timeout);
  }, [location.pathname, durationMs]);

  if (!showLoader) return null;

  return (
    <div className="route-loader-overlay" aria-hidden="true">
      <BinaryLoader size="lg" message="Switching secure context..." />
    </div>
  );
};

export default RouteEffects;
