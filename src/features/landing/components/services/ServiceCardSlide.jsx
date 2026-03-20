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
      className={[
        'carousel-slide',
        isActive && 'is-active',
        isPrev && 'is-prev',
        isNext && 'is-next',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ '--slide-offset': offset }}
      aria-hidden={!isActive}
      role="group"
      aria-roledescription="slide"
      aria-label={`Service ${index + 1} of ${total}: ${service.title}`}
    >
      <article className={`service-card service-card-${index + 1}`}>
        <div className="service-media">
          <ImageWithLoader
            src={service.image}
            alt={service.title}
            srcSet={service.imageSrcSet}
            sizes="(max-width: 768px) 100vw, 90vw"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="service-body">
          <span className="service-tag">
            <Icon size={14} aria-hidden="true" />
            {service.title.split(' ')[0]}
          </span>
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
    </div>
  );
};

export default ServiceCardSlide;
