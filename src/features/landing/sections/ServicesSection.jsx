import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Logo from '../../../shared/components/common/Logo';
import { SERVICES_SECTION_DATA } from '../../../data/landing/servicesSectionData';
import ServiceCardSlide from '../components/services/ServiceCardSlide';
import ServiceCarouselDots from '../components/services/ServiceCarouselDots';
import '../../../styles/landing/services.css';

const ServicesSection = ({ services = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);
  const slideRefs = useRef([]);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const SWIPE_THRESHOLD = 50;

  const prev = () => setActiveIndex((i) => (i === 0 ? services.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === services.length - 1 ? 0 : i + 1));

  const onTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
    touchEndX.current = null;
  };
  const onTouchMove = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) >= SWIPE_THRESHOLD) delta > 0 ? next() : prev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  /* ── Dynamic track height ─────────────────────────────
     Measure the active slide's card height and set the
     track to match. This means the button is never
     clipped regardless of screen size.
  ──────────────────────────────────────────────────── */
  const syncHeight = useCallback(() => {
    const activeSlide = slideRefs.current[activeIndex];
    const track = trackRef.current;
    if (!activeSlide || !track) return;

    // Temporarily make it visible so we can measure it
    const card = activeSlide.querySelector('.service-card');
    if (!card) return;

    const height = card.scrollHeight;
    track.style.height = `${height}px`;
  }, [activeIndex]);

  useEffect(() => {
    syncHeight();
    // Re-measure on resize (font loading, window resize, etc.)
    const ro = new ResizeObserver(syncHeight);
    if (slideRefs.current[activeIndex]) {
      ro.observe(slideRefs.current[activeIndex]);
    }
    return () => ro.disconnect();
  }, [activeIndex, syncHeight]);

  return (
    <section className="services-section reveal-on-scroll" id="services">
      <div className="section-container">

        <div className="section-header-center">
          <div className="section-eyebrow">
            <Logo size="small" />
            <span>{SERVICES_SECTION_DATA.eyebrow}</span>
          </div>
          <h2 className="section-title-large">{SERVICES_SECTION_DATA.title}</h2>
          <p className="section-subtitle-large">
            {SERVICES_SECTION_DATA.subtitle}
          </p>
        </div>

        <div className="services-carousel">

          <button
            className="carousel-btn carousel-btn--prev"
            onClick={prev}
            aria-label={SERVICES_SECTION_DATA.aria.previous}
          >
            <FiChevronLeft size={22} />
          </button>

          <div
            className="carousel-track"
            ref={trackRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {services.map((service, index) => {
              const offset = index - activeIndex;
              return (
                <ServiceCardSlide
                  key={service.title}
                  slideRef={(el) => (slideRefs.current[index] = el)}
                  service={service}
                  index={index}
                  offset={offset}
                />
              );
            })}
          </div>

          <button
            className="carousel-btn carousel-btn--next"
            onClick={next}
            aria-label={SERVICES_SECTION_DATA.aria.next}
          >
            <FiChevronRight size={22} />
          </button>

        </div>

        <ServiceCarouselDots
          total={services.length}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
        />

      </div>
    </section>
  );
};

export default ServicesSection;
