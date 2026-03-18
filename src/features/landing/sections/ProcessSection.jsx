import React from 'react';
import './process.css';

const ProcessSection = ({ steps = [] }) => {
  if (!steps.length) return null;

  return (
    <section className="process-section reveal-on-scroll" id="process">
      <div className="section-container">
        <header className="section-header-center">
          <p className="section-eyebrow"><span className="eyebrow-dot" />Process</p>
          <h2 className="section-title">A disciplined offensive workflow.</h2>
          <p className="section-subtitle">
            Each phase is documented, supervised, and built for evidence-driven delivery.
          </p>
        </header>

        <div className="process-timeline" role="list">
          <div className="process-line" aria-hidden="true" />
          {steps.map((step, index) => (
            <div
              key={step.title || index}
              className={`process-step ${index % 2 === 0 ? 'is-left' : 'is-right'}`}
              role="listitem"
            >
              <div className="process-node" aria-hidden="true" />
              <div className="process-card">
                <span className="process-index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.detail || step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
