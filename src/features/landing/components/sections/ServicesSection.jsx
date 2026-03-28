import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageWithLoader from '../../../../shared/components/ui/ImageWithLoader';
import { SERVICES_SECTION_DATA } from '../../../../data/static/landing/servicesSectionData';
import ServiceCardSlide from '../services/ServiceCardSlide';
import ServiceCarouselDots from '../services/ServiceCarouselDots';
import { slugify } from '../../../../shared/utils/display/slugify';
import { FiBookOpen, FiShield, FiCpu } from 'react-icons/fi';

const ServicesSection = ({ services = [] }) => {
  const navigate = useNavigate();
  const items = services.slice(0, 3);
  const sectionRef = useRef(null); // ← added

  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);
  const slideRefs = useRef([]);
  const [isVisible, setIsVisible] = useState(false);

  const prev = () => setActiveIndex((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === items.length - 1 ? 0 : i + 1));

  useEffect(() => {
    const updateTrackHeight = () => {
      const activeSlide = slideRefs.current[activeIndex];
      const track = trackRef.current;
      if (!activeSlide || !track) return;
      const card = activeSlide.querySelector('[data-service-card]');
      if (!card) return;
      track.style.height = `${card.scrollHeight}px`;
    };

    updateTrackHeight();
    window.addEventListener('resize', updateTrackHeight);
    return () => window.removeEventListener('resize', updateTrackHeight);
  }, [activeIndex, items.length]);

  // ← added: IntersectionObserver for .is-visible
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (!items.length) return null;

  return (
    <section className="reveal-on-scroll bg-bg-primary py-16" id="services" ref={sectionRef}>
      <div className="section-container">
        <header className="section-header">
          <p className="section-eyebrow"><span className="eyebrow-dot" />{SERVICES_SECTION_DATA.eyebrow}</p>
          <h2 className="section-title">{SERVICES_SECTION_DATA.title}</h2>
          <p className="section-subtitle">{SERVICES_SECTION_DATA.subtitle}</p>
        </header>

        {/* Desktop grid */}
        <div className="hidden grid-cols-3 gap-6 md:grid" role="list">
          {items.map((service, index) => {
            const icons = [FiBookOpen, FiShield, FiCpu];
            const Icon = icons[index % icons.length];
            return (
              <article
                data-service-card
                key={service.title}
                className={`group relative flex min-h-full flex-col overflow-hidden rounded-md border border-border bg-bg-secondary transition-all duration-200 hover:-translate-y-1 hover:border-brand hover:shadow-md motion-reduce:transform-none ${
                  isVisible
                    ? 'animate-stat-in'
                    : 'opacity-0 translate-y-4 motion-reduce:opacity-100 motion-reduce:translate-y-0'
                }`}
                style={isVisible ? { animationDelay: `${index * 100}ms` } : undefined}
                role="listitem"
              >
                <div className="hs-signature" aria-hidden="true" />
                <div className="relative aspect-video w-full overflow-hidden after:absolute after:inset-0 after:bg-[linear-gradient(to_bottom,transparent_50%,var(--bg-secondary))] after:opacity-60 after:transition-opacity after:content-['']">
                  <ImageWithLoader
                    src={service.image}
                    alt={service.title}
                    srcSet={service.imageSrcSet}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                    decoding="async"
                    className="transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
                  />
                </div>
                <div className="flex flex-col gap-3 p-6 max-md:p-4 max-md:gap-2">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-bg-tertiary px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-text-secondary transition-colors">
                    <Icon size={14} aria-hidden="true" />
                    {service.title.split(' ')[0]}
                  </span>
                  <h3 className="text-lg font-semibold text-text-primary">{service.title}</h3>
                  <p className="text-sm leading-relaxed text-text-secondary max-md:[display:-webkit-box] max-md:[-webkit-line-clamp:3] max-md:[-webkit-box-orient:vertical] max-md:overflow-hidden">
                    {service.description}
                  </p>
                  <button
                    type="button"
                    className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-text-secondary transition-all hover:gap-2 hover:text-text-primary"
                    onClick={() => navigate(`/services/${slugify(service.title)}`)}
                    aria-label={`Explore ${service.title}`}
                  >
                    Explore {service.title} &rarr;
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Mobile carousel */}
        <div className="grid grid-cols-2 items-center gap-3 md:hidden" role="region" aria-label="Services carousel">
          <button
            className="h-11 w-11 justify-self-start rounded-sm border border-border bg-bg-secondary text-sm text-text-secondary transition-colors hover:border-brand hover:bg-bg-tertiary hover:text-brand"
            onClick={prev}
            aria-label={SERVICES_SECTION_DATA.aria.previous}
          >
            Prev
          </button>

          <div className="col-span-2 relative block w-full transition-[height] duration-200" ref={trackRef}>
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
            className="h-11 w-11 justify-self-end rounded-sm border border-border bg-bg-secondary text-sm text-text-secondary transition-colors hover:border-brand hover:bg-bg-tertiary hover:text-brand"
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
