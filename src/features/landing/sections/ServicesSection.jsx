import React from 'react';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import Logo from '../../../shared/components/common/Logo';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import '../../../styles/features/landing/services.css';

const ServicesSection = ({ services = [] }) => (
  <section className="services-section reveal-on-scroll">
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

      <div className="services-grid">
        {services.map((service, index) => (
          <Card
            key={service.title}
            hover3d={true}
            padding="large"
            className={`service-card reveal-on-scroll service-card-${index + 1}`}
          >
            <div className="service-icon">
              <service.icon size={28} />
            </div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
            <ul className="service-features">
              {service.features.map((feature) => (
                <li key={feature}>
                  <span className="feature-check">
                    <FiCheck size={16} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <Button variant="card" size="small" fullWidth style={{ marginTop: 'auto' }}>
              Learn More <FiArrowRight className='service-btn-arrow' size={16} />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
