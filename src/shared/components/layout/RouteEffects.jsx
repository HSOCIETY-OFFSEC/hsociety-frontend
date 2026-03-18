import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loader from '../ui/Loader';
import { trackSecurityEvent } from '../../../core/security-tests/security-events.service';
import { trackPageView } from '../../services/analytics.service';
import './RouteEffects.css';

const RouteEffects = ({ durationMs = 220, loaderDelayMs = 120 }) => {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);
  const firstRender = useRef(true);

  const trackInIdle = useCallback((payload) => {
    if (typeof window === 'undefined') return;
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => {
        trackSecurityEvent(payload);
      });
      return;
    }
    window.setTimeout(() => {
      trackSecurityEvent(payload);
    }, 0);
  }, []);

  useEffect(() => {
    const isInitial = firstRender.current;
    firstRender.current = false;
    const isLanding = location.pathname === '/';

    if (isInitial) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      trackInIdle({
        eventType: 'page_visit',
        action: 'initial_load',
        path: location.pathname,
      });
      trackPageView(location.pathname);
      return undefined;
    }

    if (isLanding) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      trackInIdle({
        eventType: 'page_visit',
        action: 'route_change',
        path: location.pathname,
      });
      trackPageView(location.pathname);
      return undefined;
    }

    const showTimer = setTimeout(() => setShowLoader(true), loaderDelayMs);
    const hideTimer = setTimeout(() => setShowLoader(false), loaderDelayMs + durationMs);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    trackInIdle({
      eventType: 'page_visit',
      action: 'route_change',
      path: location.pathname,
    });
    trackPageView(location.pathname);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      setShowLoader(false);
    };
  }, [location.pathname, durationMs, loaderDelayMs, trackInIdle]);

  if (!showLoader) return null;

  return (
    <div className="route-loader-overlay" aria-hidden="true">
      <Loader size="lg" label="Switching secure context" />
    </div>
  );
};

export default RouteEffects;
