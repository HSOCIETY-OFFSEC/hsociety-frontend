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

  const syncHeight = useCallback(() => {
    const activeSlide = slideRefs.current[activeIndex];
    const track = trackRef.current;
    if (!activeSlide || !track) return;

    const card = activeSlide.querySelector('.service-card');
    if (!card) return;

    track.style.height = `${card.scrollHeight}px`;
  }, [activeIndex]);

  useEffect(() => {
    syncHeight();
    const ro = new ResizeObserver(syncHeight);
    if (slideRefs.current[activeIndex]) {
      ro.observe(slideRefs.current[activeIndex]);
    }
    return () => ro.disconnect();
  }, [activeIndex, syncHeight]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <section className="services-section reveal-on-scroll" id="services">
      <div className="services-bg-glow services-bg-glow--1" aria-hidden="true" />
      <div className="services-bg-glow services-bg-glow--2" aria-hidden="true" />

      <div className="section-container">
        <div className="section-header-center">
          <div className="section-eyebrow">
            <Logo size="small" />
            <span>{SERVICES_SECTION_DATA.eyebrow}</span>
          </div>
          <h2 className="section-title-large">{SERVICES_SECTION_DATA.title}</h2>
          <p className="section-subtitle-large">{SERVICES_SECTION_DATA.subtitle}</p>
        </div>

        <div className="services-carousel" role="region" aria-label="Services carousel">
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
                  total={services.length}
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

        <p className="carousel-counter" aria-live="polite">
          {activeIndex + 1} / {services.length}
        </p>
      </div>
    </section>
  );
};

export default ServicesSection;