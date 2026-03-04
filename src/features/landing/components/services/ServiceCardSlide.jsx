import React from 'react';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../shared/components/ui/Button';
import Card from '../../../../shared/components/ui/Card';
import { slugify } from '../../../../shared/utils/slugify';
import { SERVICES_SECTION_DATA } from '../../../../data/landing/servicesSectionData';

const ServiceCardSlide = ({ service, index, offset, slideRef }) => {
  const navigate = useNavigate();

  return (
    <div
      ref={slideRef}
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
      <Card hover3d={false} padding="none" className={`service-card service-card-${index + 1}`}>
        {service.image && (
          <div className="service-card-image">
            <img src={service.image} alt={service.title} loading="lazy" decoding="async" />
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
            {SERVICES_SECTION_DATA.cta.learnMore}
            <FiArrowRight className="service-btn-arrow" size={16} />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ServiceCardSlide;
