import React from 'react';
import { FiActivity, FiCheck, FiShield } from 'react-icons/fi';
import Logo from '../../../shared/components/common/Logo';
import Card from '../../../shared/components/ui/Card';
import '../../../styles/landing/deliverables.css';

const DeliverablesSection = ({ deliverables = [] }) => (
  <section className="deliverables-section reveal-on-scroll">
    <div className="section-container">
      <div className="section-header-center">
        <div className="section-eyebrow">
          <Logo size="small" />
          <span>Outcome Driven</span>
        </div>
        <h2 className="section-title-large">What You Receive</h2>
        <p className="section-subtitle-large">
          Clear documentation and hands-on guidance for lasting fixes.
        </p>
      </div>

      <div className="deliverables-grid">
        {deliverables.map((item) => (
          <Card key={item.title} padding="large" className="deliverable-card reveal-on-scroll">
            <div className="deliverable-icon">
              <item.icon size={26} />
            </div>
            <h3 className="deliverable-title">{item.title}</h3>
            <p className="deliverable-description">{item.description}</p>
          </Card>
        ))}
      </div>

      <div className="deliverables-highlight">
        <div className="highlight-item">
          <FiActivity size={18} />
          <span>Live status updates during testing</span>
        </div>
        <div className="highlight-item">
          <FiShield size={18} />
          <span>Risk scoring aligned with CVSS and MITRE</span>
        </div>
        <div className="highlight-item">
          <FiCheck size={18} />
          <span>Actionable fixes prioritized by impact</span>
        </div>
      </div>
    </div>
  </section>
);

export default DeliverablesSection;
