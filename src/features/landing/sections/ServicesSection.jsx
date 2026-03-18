import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageWithLoader from '../../../shared/components/ui/ImageWithLoader';
import { SERVICES_SECTION_DATA } from '../../../data/landing/servicesSectionData';
import ServiceCardSlide from '../components/services/ServiceCardSlide';
import ServiceCarouselDots from '../components/services/ServiceCarouselDots';
import { slugify } from '../../../shared/utils/slugify';
import '../../../styles/landing/services.css';

const ServicesSection = ({ services = [] }) => {
  const navigate = useNavigate();
  const items = services.slice(0, 3);

  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);
  const slideRefs = useRef([]);

  const prev = () => setActiveIndex((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === items.length - 1 ? 0 : i + 1));

  useEffect(() => {
    const activeSlide = slideRefs.current[activeIndex];
    const track = trackRef.current;
    if (!activeSlide || !track) return;
    const card = activeSlide.querySelector('.service-card');
    if (!card) return;
    track.style.height = `${card.scrollHeight}px`;
  }, [activeIndex]);

  if (!items.length) return null;

  return (
    <section className="services-section reveal-on-scroll" id="services">
      <div className="section-container">
        <header className="section-header">
          <p className="section-eyebrow"><span className="eyebrow-dot" />{SERVICES_SECTION_DATA.eyebrow}</p>
          <h2 className="section-title">{SERVICES_SECTION_DATA.title}</h2>
          <p className="section-subtitle">{SERVICES_SECTION_DATA.subtitle}</p>
        </header>

        {/* Desktop grid */}
        <div className="services-grid" role="list">
          {items.map((service) => (
            <article key={service.title} className="service-card" role="listitem">
              <div className="service-media">
                <ImageWithLoader
                  src={service.image}
                  alt={service.title}
                  srcSet={service.imageSrcSet}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="service-body">
                <span className="service-tag">{service.title.split(' ')[0]}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <button
                  type="button"
                  className="service-link"
                  onClick={() => navigate(`/services/${slugify(service.title)}`)}
                  aria-label={`Learn more about ${service.title}`}
                >
                  Learn more &rarr;
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="services-carousel" role="region" aria-label="Services carousel">
          <button
            className="carousel-btn carousel-btn--prev"
            onClick={prev}
            aria-label={SERVICES_SECTION_DATA.aria.previous}
          >
            Prev
          </button>

          <div className="carousel-track" ref={trackRef}>
            {items.map((service, index) => {
              const offset = index - activeIndex;
              return (
                <ServiceCardSlide
                  key={service.title}
                  slideRef={(el) => (slideRefs.current[index] = el)}
                  service={service}
                  index={index}
                  offset={offset}
                  total={items.length}
                />
              );
            })}
          </div>

          <button
            className="carousel-btn carousel-btn--next"
            onClick={next}
            aria-label={SERVICES_SECTION_DATA.aria.next}
          >
            Next
          </button>
        </div>

        <ServiceCarouselDots
          total={items.length}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
        />
      </div>
    </section>
  );
};

export default ServicesSection;
