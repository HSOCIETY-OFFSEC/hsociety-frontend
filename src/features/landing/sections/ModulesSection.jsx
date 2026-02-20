import React from 'react';
import { FiTerminal } from 'react-icons/fi';
import Logo from '../../../shared/components/common/Logo';
import Card from '../../../shared/components/ui/Card';
import '../../../styles/features/landing/modules.css';

const ModulesSection = ({ modules = [] }) => (
  <section className="modules-section reveal-on-scroll">
    <div className="section-container">
      <div className="section-header-center">
        <div className="section-eyebrow">
          <Logo size="small" />
          <span>Learning Modules</span>
        </div>
        <h2 className="section-title-large">Hands-On Hacker Curriculum</h2>
        <p className="section-subtitle-large">
          Structured modules designed to build real offensive security skills with African context.
        </p>
      </div>

      <div className="modules-grid">
        {modules.map((module) => (
          <Card key={module.title} padding="large" className="module-card reveal-on-scroll">
            {module.image && (
              <div className="module-media">
                <img src={module.image} alt={module.title} loading="lazy" decoding="async" />
              </div>
            )}
            <div className="module-meta">
              <span className="module-level">{module.level}</span>
              <span className="module-duration">{module.duration}</span>
            </div>
            <h3 className="module-title">{module.title}</h3>
            <p className="module-description">{module.description}</p>
            <div className="module-footer">
              <FiTerminal size={16} />
              <span>Interactive labs + CTFs</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default ModulesSection;
