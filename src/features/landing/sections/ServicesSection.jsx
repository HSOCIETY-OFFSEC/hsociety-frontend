import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Logo from '../../../shared/components/common/Logo';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import { slugify } from '../../../shared/utils/slugify';
import '../../../styles/landing/services.css';

const ServicesSection = ({ services = [] }) => {
  const navigate = useNavigate();
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
            <span>Offensive Capabilities</span>
          </div>
          <h2 className="section-title-large">Our Services</h2>
          <p className="section-subtitle-large">
            Comprehensive security testing tailored to your needs
          </p>
        </div>

        <div className="services-carousel">

          <button
            className="carousel-btn carousel-btn--prev"
            onClick={prev}
            aria-label="Previous service"
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
                <div
                  key={service.title}
                  ref={(el) => (slideRefs.current[index] = el)}
                  className={[
                    'carousel-slide',
                    offset === 0 && 'is-active',
                    offset === -1 && 'is-prev',
                    offset === 1 && 'is-next',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ '--slide-offset': offset }}
                  aria-hidden={offset !== 0}
                >
                  <Card
                    hover3d={false}
                    padding="none"
                    className={`service-card service-card-${index + 1}`}
                  >
                    {service.image && (
                      <div className="service-card-image">
                        <img src={service.image} alt={service.title} loading="lazy" />
                      </div>
                    )}

                    <div className="service-card-body">
                      <div className="service-card-header">
                        <div className="service-icon">
                          <service.icon size={26} />
                        </div>
                        <h3 className="service-title">{service.title}</h3>
                      </div>

                      <p className="service-description">{service.description}</p>

                      <ul className="service-features">
                        {service.features.map((feature) => (
                          <li key={feature}>
                            <span className="feature-check">
                              <FiCheck size={14} />
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Button
                        variant="card"
                        size="small"
                        fullWidth
                        className="service-learn-btn"
                        onClick={() => navigate(`/services/${slugify(service.title)}`)}
                      >
                        Learn More{' '}
                        <FiArrowRight className="service-btn-arrow" size={16} />
                      </Button>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>

          <button
            className="carousel-btn carousel-btn--next"
            onClick={next}
            aria-label="Next service"
          >
            <FiChevronRight size={22} />
          </button>

        </div>

        <div className="carousel-dots">
          {services.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot${i === activeIndex ? ' is-active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to service ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;