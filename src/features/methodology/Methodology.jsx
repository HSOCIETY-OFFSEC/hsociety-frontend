import React, { useMemo } from 'react';
import { FiCheckCircle, FiClipboard, FiSearch, FiShield, FiTarget, FiTool } from 'react-icons/fi';
import Card from '../../shared/components/ui/Card';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import methodologyContent from '../../data/methodology.json';
import '../../styles/sections/methodology/index.css';

const Methodology = () => {
  useScrollReveal();

  const iconMap = useMemo(() => ({
    FiClipboard,
    FiSearch,
    FiTarget,
    FiShield,
    FiTool,
    FiCheckCircle
  }), []);

  const phases = methodologyContent.phases.map((phase) => ({
    ...phase,
    icon: iconMap[phase.icon]
  }));

  return (
    <div className="methodology-page">
        <header className="methodology-hero reveal-on-scroll">
          <h1>{methodologyContent.hero.title}</h1>
          <p>{methodologyContent.hero.subtitle}</p>
          <div className="methodology-meta">
            {methodologyContent.hero.chips.map((chip) => (
              <div key={chip} className="meta-chip">{chip}</div>
            ))}
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
