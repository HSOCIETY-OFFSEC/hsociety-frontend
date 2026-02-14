import React from 'react';
import { FiCheckCircle, FiClipboard, FiSearch, FiShield, FiTarget, FiTool } from 'react-icons/fi';
import Card from '../../shared/components/ui/Card';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import '../../styles/features/methodology.css';

const Methodology = () => {
  useScrollReveal();

  const phases = [
    { title: 'Scoping', icon: FiClipboard, detail: 'Define assets, risks, and constraints.' },
    { title: 'Recon', icon: FiSearch, detail: 'Enumerate external and internal attack surface.' },
    { title: 'Exploitation', icon: FiTarget, detail: 'Validate real-world impact safely.' },
    { title: 'Hardening', icon: FiShield, detail: 'Prioritize fixes and verify remediation.' },
    { title: 'Tooling', icon: FiTool, detail: 'Custom tooling and automated evidence capture.' },
    { title: 'Reporting', icon: FiCheckCircle, detail: 'Board-ready narratives and technical proof.' }
  ];

  return (
    <div className="methodology-page">
        <header className="methodology-hero reveal-on-scroll">
          <h1>Testing Methodology</h1>
          <p>Repeatable, evidence-driven engagement flow aligned to OWASP and PTES.</p>
          <div className="methodology-meta">
            <div className="meta-chip">Scope in 48h</div>
            <div className="meta-chip">Evidence-backed findings</div>
            <div className="meta-chip">Retest included</div>
          </div>
        </header>

        <section className="methodology-grid reveal-on-scroll">
          {phases.map((phase) => (
            <Card key={phase.title} padding="large" className="methodology-card">
              <div className="methodology-icon">
                <phase.icon size={24} />
              </div>
              <h3>{phase.title}</h3>
              <p>{phase.detail}</p>
            </Card>
          ))}
        </section>
    </div>
  );
};

export default Methodology;
