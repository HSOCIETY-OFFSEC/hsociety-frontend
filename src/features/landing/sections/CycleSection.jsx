import React from 'react';
import Logo from '../../../shared/components/common/Logo';
import '../../../styles/features/landing/cycle.css';

const CycleSection = ({ steps = [] }) => (
  <section className="cycle-section reveal-on-scroll">
    <div className="section-container">
      <div className="section-header-center">
        <div className="section-eyebrow">
          <Logo size="small" />
          <span>Pentest Cycle</span>
        </div>
        <h2 className="section-title-large">From Penetration to Fix, End-to-End</h2>
        <p className="section-subtitle-large">
          A continuous loop that moves findings into verified remediation.
        </p>
      </div>

      <div className="cycle-layout">
        <div className="cycle-orbit">
          <div className="cycle-ring">
            {steps.map((step, index) => (
              <div key={step.title} className={`cycle-node cycle-node-${index + 1}`}>
                <span>{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cycle-list">
          {steps.map((step, index) => (
            <div key={step.title} className="cycle-item">
              <div className="cycle-index">{index + 1}</div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default CycleSection;
