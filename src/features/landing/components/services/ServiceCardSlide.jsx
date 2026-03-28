import React from 'react';
import ImageWithLoader from '../../../../shared/components/ui/ImageWithLoader';
import { useNavigate } from 'react-router-dom';
import { slugify } from '../../../../shared/utils/display/slugify';
import { FiBookOpen, FiShield, FiCpu } from 'react-icons/fi';

const ServiceCardSlide = ({ service, index, offset, slideRef, total }) => {
  const navigate = useNavigate();
  const icons = [FiBookOpen, FiShield, FiCpu];
  const Icon = icons[index % icons.length];

  const isActive = offset === 0;
  const isPrev = offset === -1;
  const isNext = offset === 1;

  return (
    <div
      ref={slideRef}
      className={`absolute inset-0 w-full transition-all duration-200 ${
        isActive
          ? 'pointer-events-auto translate-x-0 opacity-100'
          : 'pointer-events-none translate-x-3 opacity-0'
      } motion-reduce:transition-none motion-reduce:transform-none`}
      aria-hidden={!isActive}
      role="group"
      aria-roledescription="slide"
      aria-label={`Service ${index + 1} of ${total}: ${service.title}`}
    >
      <article data-service-card className="group relative flex min-h-full flex-col overflow-hidden rounded-md border border-border bg-bg-secondary transition-all duration-200">
        <div className="hs-signature" aria-hidden="true" />
        <div className="relative w-full overflow-hidden aspect-video max-md:aspect-[2.2/1] after:absolute after:inset-0 after:bg-[linear-gradient(to_bottom,transparent_50%,var(--bg-secondary))] after:opacity-60 after:transition-opacity after:content-['']">
          <ImageWithLoader
            src={service.image}
            alt={service.title}
            srcSet={service.imageSrcSet}
            sizes="(max-width: 768px) 100vw, 90vw"
            loading="lazy"
            decoding="async"
            className="transition-transform duration-500 motion-reduce:transform-none"
          />
        </div>
        <div className="flex flex-col gap-3 p-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-bg-tertiary px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-text-secondary">
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
    </div>
  );
};

export default ServiceCardSlide;
