/* FILE: src/features/landing/sections/ThreatMapSection.jsx */
import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import '../../../styles/landing/threat-map-section.css';

const ThreatGlobeInteractive = lazy(() => import('../../threat-map/components/ThreatGlobeInteractive'));

const ThreatMapSection = () => {
  const handleAttack = useCallback(() => {}, []);
  const [expanded, setExpanded] = useState(false);
  const [shouldLoadGlobe, setShouldLoadGlobe] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('workspace-lock-scroll', expanded);
    return () => document.body.classList.remove('workspace-lock-scroll');
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return undefined;
    setShouldLoadGlobe(true);
    const handleKey = (e) => { if (e.key === 'Escape') setExpanded(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [expanded]);

  useEffect(() => {
    if (shouldLoadGlobe || typeof window === 'undefined') return undefined;
    const section = sectionRef.current;
    if (!section) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setShouldLoadGlobe(true);
          observer.disconnect();
        });
      },
      { rootMargin: '240px 0px' }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [shouldLoadGlobe]);

  return (
    <section className="landing-threatmap" ref={sectionRef}>
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
            {shouldLoadGlobe ? (
              <Suspense fallback={<div className="landing-threatmap-caption">Loading globe...</div>}>
                <ThreatGlobeInteractive paused={false} onNewAttack={handleAttack} />
              </Suspense>
            ) : (
              <div className="landing-threatmap-caption">Globe loads when section is visible.</div>
            )}
          </div>
          <div className="landing-threatmap-caption">
            Simulated data · Not a live threat intelligence feed
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
              <Suspense fallback={<div className="landing-threatmap-caption">Loading globe...</div>}>
                <ThreatGlobeInteractive paused={false} onNewAttack={handleAttack} />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ThreatMapSection;