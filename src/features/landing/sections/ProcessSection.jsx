import React from 'react';
import Logo from '../../../shared/components/common/Logo';
import Card from '../../../shared/components/ui/Card';
import '../../../styles/landing/process.css';

const ProcessSection = ({ steps = [] }) => (
  <section className="process-section reveal-on-scroll">
    <div className="section-container">
      <div className="section-header-center">
        <div className="section-eyebrow">
          <Logo size="small" />
          <span>Engagement Flow</span>
        </div>
        <h2 className="section-title-large">Built for Clarity and Speed</h2>
        <p className="section-subtitle-large">
          Every engagement follows a structured, evidence-driven process.
        </p>
      </div>

      <div className="process-carousel">
        <div className="process-grid">
          {steps.map((step) => (
            <Card key={step.title} padding="large" className="process-card reveal-on-scroll">
              <div className="process-header">
                <div className="process-icon">
                  <step.icon size={26} />
                </div>
                <div className="process-meta">{step.meta}</div>
              </div>
              <h3 className="process-title">{step.title}</h3>
              <p className="process-description">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ProcessSection;
