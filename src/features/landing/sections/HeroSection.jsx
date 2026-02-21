import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowRight,
  FiArrowUpRight,
  FiCheckCircle,
  FiLock,
  FiShield
} from 'react-icons/fi';
import Button from '../../../shared/components/ui/Button';
import Logo from '../../../shared/components/common/Logo';
import '../../../styles/features/landing/hero.css';

const HeroSection = ({ content }) => {
  const navigate = useNavigate();
  const { badge, title, description, highlights, ctas, trust } = content;

  return (
    <section className="hero-section">
      <div className="hero-video-bg" aria-hidden="true">
        <span className="hero-bg-layer layer-1" />
        <span className="hero-bg-layer layer-2" />
        <span className="hero-bg-layer layer-3" />
      </div>
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-top-row">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              {badge}
            </div>
            
            <h1 className="hero-title">{title}</h1>
          </div>
          
          <p className="hero-description">{description}</p>

          <div className="hero-highlights">
            {highlights.map((item) => (
              <div key={item} className="hero-highlight">
                <FiCheckCircle size={16} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="hero-cta">
            {ctas.map((cta, index) => (
              <Button
                key={cta.label}
                variant={cta.variant}
                size="large"
                onClick={() => navigate(cta.route)}
              >
                {cta.label}
                {index === 0 ? <FiArrowUpRight size={18} /> : <FiArrowRight size={18} />}
              </Button>
            ))}
          </div>

          <div className="hero-proof">
            {content.proof?.map((item) => (
              <div key={item.label} className="hero-proof-item">
                <span className="proof-value">{item.value}</span>
                <span className="proof-label">{item.label}</span>
              </div>
            ))}
          </div>
 
          <div className="trust-indicators">
            {trust.map((item, index) => (
              <div key={item} className="trust-item">
                <span className="trust-icon">
                  {index === 0 && <FiShield size={18} />}
                  {index === 1 && <FiCheckCircle size={18} />}
                  {index === 2 && <FiLock size={18} />}
                </span>
                <span className="trust-text">{item}</span>
              </div>
            ))} 
          </div>
        </div>

        <div className="hero-visual">
          <Logo size="xlarge" className="hero-logo-minimal" />
        </div>
      </div>  
    </section>
  );
};

export default HeroSection;
