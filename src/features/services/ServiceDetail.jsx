import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import Logo from '../../shared/components/common/Logo';
import landingContent from '../../data/landing.json';
import '../../styles/sections/services/detail.css';

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const services = landingContent.services || [];
  const service = services.find((item) => slugify(item.title) === slug);

  useEffect(() => {
    if (!service) {
      navigate('/services', { replace: true });
    }
  }, [navigate, service]);

  if (!service) {
    return null;
  }

  return (
    <div className="service-detail-page">
      <header className="service-detail-hero reveal-on-scroll">
        <div className="service-detail-hero-inner">
          <div>
            <div className="service-detail-eyebrow">
              <Logo size="small" />
              <span>{service.title}</span>
            </div>
            <h1>{service.title}</h1>
            <p>{service.description}</p>
            <div className="service-detail-actions">
              <Button variant="primary" size="large" onClick={() => navigate('/contact')}>
                Talk to HSOCIETY
              </Button>
              <Button
                variant="ghost"
                size="large"
                onClick={() => navigate('/register')}
              >
                Join the Training Cycle
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="service-detail-features reveal-on-scroll">
        <div className="service-detail-section-header">
          <h2>What we cover</h2>
          <p>Every engagement prioritizes clarity, evidence, and immediate impact.</p>
        </div>
        <div className="service-detail-feature-grid">
          {service.features.map((feature) => (
            <Card key={feature} padding="large" className="service-detail-feature-card">
              <p>{feature}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
