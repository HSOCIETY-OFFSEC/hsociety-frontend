import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiShield,
  FiFileText,
  FiTarget,
  FiClipboard,
  FiSearch,
  FiLayers,
  FiCheckCircle,
  FiTerminal,
  FiLock,
  FiMessageSquare
} from 'react-icons/fi';
import { FaGraduationCap, FaUsers, FaShieldAlt, FaRocket } from 'react-icons/fa';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import landingContent from '../../data/landing.json';
import Logo from '../../shared/components/common/Logo';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import useRequestPentest from '../../shared/hooks/useRequestPentest';
import { slugify } from '../../shared/utils/slugify';
import terminalWallpaper from '../../assets/brand-images/terminalwallpaper.png';
import greenBinaryWallpaper from '../../assets/backgrounds/greenbinarywallaper.png';
import hackerLaptop from '../../assets/backgrounds/hacker_laptop_with_stckers.png';
import '../../styles/sections/services/index.css';

const Services = () => {
  const navigate = useNavigate();
  const { requestPentest, requestPentestModal } = useRequestPentest();
  useScrollReveal();

  const iconMap = useMemo(
    () => ({
      FiShield,
      FiFileText,
      FiTarget,
      FiClipboard,
      FiSearch,
      FiLayers,
      FiCheckCircle,
      FiTerminal,
      FiLock,
      FiMessageSquare,
      FaGraduationCap,
      FaUsers,
      FaShieldAlt,
      FaRocket
    }),
    []
  );

  const imageMap = useMemo(
    () => ({
      terminal: terminalWallpaper,
      binary: greenBinaryWallpaper,
      hacker: hackerLaptop
    }),
    []
  );

  const services = landingContent.services.map((item) => ({
    ...item,
    icon: iconMap[item.icon],
    image: item.imageKey ? imageMap[item.imageKey] : item.image
  }));

  const heroTrust = landingContent.hero?.trust || [];
  const cta = landingContent.cta;

  const handleRoute = (route) => {
    if (route === '/corporate/pentest') {
      requestPentest();
      return;
    }
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="services-page">
      {requestPentestModal}
      <header className="services-hero reveal-on-scroll">
        <div className="services-hero-inner">
          <div className="services-hero-text">
            <div className="services-eyebrow">
              <Logo size="small" />
              <span>Offensive Capabilities</span>
            </div>
            <h1>Services built for real-world risk.</h1>
            <p>
              From targeted penetration tests to red team simulations, we deliver
              evidence-driven security work with reporting that maps directly to fixes.
            </p>
            <div className="services-hero-actions">
              <Button
                variant="primary"
                size="large"
                onClick={requestPentest}
              >
                Request a Pentest
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

          <div className="services-hero-panel">
            <span className="services-hero-index">01</span>
            <div className="services-hero-list">
              {heroTrust.map((item) => (
                <div key={item} className="services-hero-pill">
                  <span className="pill-dot" aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="services-list reveal-on-scroll">
        <div className="services-section-header">
          <Logo size="small" />
          <h2>Core Services</h2>
          <p>Built to surface risk, validate impact, and accelerate remediation.</p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <Card
              key={service.title}
              padding="none"
              className="services-card services-card--link"
              onClick={() => navigate(`/services/${slugify(service.title)}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  navigate(`/services/${slugify(service.title)}`);
                }
              }}
            >
              {service.image && (
                <div className="services-card-image">
                  <img src={service.image} alt={service.title} loading="lazy" />
                </div>
              )}
              <div className="services-card-body">
                <div className="services-card-title">
                  <div className="services-card-icon">
                    <service.icon size={22} />
                  </div>
                  <h3>{service.title}</h3>
                </div>
                <p>{service.description}</p>
                <ul>
                  {service.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="services-cta reveal-on-scroll">
        <Card padding="large" className="services-cta-card">
          <div className="services-cta-content">
            <div>
              <h3>{cta?.right?.title}</h3>
              <p>{cta?.right?.description}</p>
            </div>
            <Button
              variant={cta?.right?.variant || 'secondary'}
              size="large"
              onClick={() => handleRoute(cta?.right?.route || '/corporate/pentest')}
            >
              {cta?.right?.button || 'Request Pentest'}
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Services;
