import React from 'react';
import Logo from '../../../shared/components/common/Logo';
import Card from '../../../shared/components/ui/Card';
import '../../../styles/landing/trust.css';

const TrustSection = ({ signals = [] }) => (
  <section className="trust-section reveal-on-scroll">
    <div className="section-container">
      <div className="section-header-center">
        <div className="section-eyebrow">
          <Logo size="small" />
          <span>Why Trust HSOCIETY</span>
        </div>
        <h2 className="section-title-large">Real Hacking For African Companies</h2>
        <p className="section-subtitle-large">
          We deliver high-value, affordable offensive security for teams that need clarity, speed, and proof.
        </p>
      </div>

      <div className="trust-grid">
        {signals.map((item) => (
          <Card key={item.title} padding="large" className="trust-card reveal-on-scroll">
            {item.icon && (
              <div className="trust-icon">
                <item.icon size={24} />
              </div>
            )}
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default TrustSection;
