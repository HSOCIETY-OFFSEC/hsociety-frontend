import React from 'react';
import { FiFileText, FiShield, FiActivity, FiCheckCircle } from 'react-icons/fi';
import '../../styles/sections/deliverables.css';

const DeliverablesSection = ({ items = [] }) => {
  if (!items.length) return null;

  const icons = [FiFileText, FiShield, FiActivity, FiCheckCircle];

  return (
    <section className="deliverables-section reveal-on-scroll" id="deliverables">
      <div className="section-container">
        <header className="section-header-center">
          <p className="section-eyebrow"><span className="eyebrow-dot" />Deliverables</p>
          <h2 className="section-title">Evidence, reports, remediation.</h2>
          <p className="section-subtitle">Clear outputs for leadership and engineering teams.</p>
        </header>

        <div className="deliverables-grid" role="list">
          {items.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div key={item.title} className="deliverable-item" role="listitem">
                <div className="hs-signature" aria-hidden="true" />
                <span className="deliverable-icon" aria-hidden="true">
                  <Icon size={16} />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DeliverablesSection;
