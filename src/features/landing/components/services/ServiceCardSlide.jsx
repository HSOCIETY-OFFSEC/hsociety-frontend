import React from 'react';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../shared/components/ui/Button';
import Card from '../../../../shared/components/ui/Card';
import { slugify } from '../../../../shared/utils/slugify';
import { SERVICES_SECTION_DATA } from '../../../../data/landing/servicesSectionData';

const ServiceCardSlide = ({ service, index, offset, slideRef, total }) => {
  const navigate = useNavigate();

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
      <Card hover3d={false} padding="none" className={`service-card service-card-${index + 1}`}>

        {/* Image banner */}
        {service.image && (
          <div className="service-card-image">
            <img
              src={service.image}
              srcSet={service.imageSrcSet}
              sizes="(max-width: 480px) 95vw, (max-width: 768px) 90vw, 700px"
              alt={service.title}
              loading="lazy"
              decoding="async"
            />
            {/* Gradient overlay on image */}
            <div className="service-card-image-overlay" aria-hidden="true" />
          </div>
        )}

        <div className="service-card-body">

          {/* Header row: icon + title */}
          <div className="service-card-header">
            <div className="service-icon" aria-hidden="true">
              <service.icon size={24} />
            </div>
            <h3 className="service-title">{service.title}</h3>
          </div>

          {/* Divider */}
          <div className="service-divider" aria-hidden="true" />

          {/* Description */}
          <p className="service-description">{service.description}</p>

          {/* Features */}
          <ul className="service-features" aria-label="Features">
            {service.features.map((feature) => (
              <li key={feature}>
                <span className="feature-check" aria-hidden="true">
                  <FiCheck size={13} />
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Button
            variant="card"
            size="small"
            fullWidth
            className="service-learn-btn"
            onClick={() => navigate(`/services/${slugify(service.title)}`)}
            aria-label={`Learn more about ${service.title}`}
          >
            {SERVICES_SECTION_DATA.cta.learnMore}
            <FiArrowRight className="service-btn-arrow" size={15} aria-hidden="true" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ServiceCardSlide;