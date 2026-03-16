import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Logo from '../../../shared/components/common/Logo';
import Card from '../../../shared/components/ui/Card';
import '../../../styles/landing/process.css';

const SCROLL_SPEED_PX = 18;

const ProcessSection = ({ steps = [] }) => {
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotionRef = useRef(false);
  const carouselRef = useRef(null);
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);

  const slides = useMemo(() => steps.filter(Boolean), [steps]);
  const count = slides.length;
  const loopSlides = useMemo(() => (!count ? [] : [...slides, ...slides]), [count, slides]);

  const pauseCarousel = useCallback(() => setIsPaused(true), []);
  const resumeCarousel = useCallback(() => setIsPaused(false), []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      reduceMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }, []);

  useEffect(() => {
    if (!count || reduceMotionRef.current) return undefined;
    const el = carouselRef.current;
    const track = trackRef.current;
    if (!el || !track) return undefined;

    const normalize = () => {
      const half = track.scrollWidth / 2;
      if (half <= 0) return;
      if (el.scrollLeft >= half) el.scrollLeft -= half;
      else if (el.scrollLeft < 0) el.scrollLeft += half;
    };

    const tick = (t) => {
      if (!lastTimeRef.current) lastTimeRef.current = t;
      const dt = t - lastTimeRef.current;
      lastTimeRef.current = t;
      if (!isPaused) {
        el.scrollLeft += (SCROLL_SPEED_PX * dt) / 1000;
        normalize();
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    el.addEventListener('scroll', normalize, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = null;
      el.removeEventListener('scroll', normalize);
    };
  }, [count, isPaused, loopSlides]);

  return (
    <section className="process-section reveal-on-scroll">
      <div className="section-container">
        <div className="section-header-center">
          <div className="section-eyebrow">
            <Logo size="small" />
            <span>Engagement Flow</span>
          </div>
          <h2 className="section-title-large">Built for Clarity and Speed</h2>
          <p className="section-subtitle-large">
            Every engagement follows a structured, evidence-driven process.
          </p>
        </div>

        <div className="process-carousel" role="region" aria-label="Engagement flow">
          <div
            ref={carouselRef}
            className="process-viewport"
            aria-live="polite"
          >
            <div ref={trackRef} className="process-track">
              {loopSlides.map((step, index) => (
                <Card
                  key={`${step.title}-${index}`}
                  padding="large"
                  className="process-card reveal-on-scroll"
                  tabIndex={0}
                  onMouseEnter={pauseCarousel}
                  onMouseLeave={resumeCarousel}
                  onFocus={pauseCarousel}
                  onBlur={resumeCarousel}
                >
                  <div className="process-header">
                    <div className="process-icon">
                      <step.icon size={26} />
                    </div>
                    <div className="process-meta">{step.meta}</div>
                  </div>
                  <h3 className="process-title">{step.title}</h3>
                  <p className="process-description">{step.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
