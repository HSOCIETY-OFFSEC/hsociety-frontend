import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BinaryLoader from '../ui/BinaryLoader';
import { trackSecurityEvent } from '../../../core/security-tests/security-events.service';
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
      trackSecurityEvent({
        eventType: 'page_visit',
        action: 'initial_load',
        path: location.pathname,
      });
      return undefined;
    }

    setShowLoader(true);
    const timeout = setTimeout(() => setShowLoader(false), durationMs);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    trackSecurityEvent({
      eventType: 'page_visit',
      action: 'route_change',
      path: location.pathname,
    });
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
