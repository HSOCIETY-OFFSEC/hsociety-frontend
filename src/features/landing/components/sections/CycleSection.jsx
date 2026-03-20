import React from 'react';
import { FiBookOpen, FiShield, FiDollarSign } from 'react-icons/fi';
import '../../styles/sections/cycle.css';

const CycleSection = ({ steps }) => {
  const cycle = steps?.length
    ? steps
    : [
        { title: 'Train', description: 'Learn offensive security through guided labs and coaching.' },
        { title: 'Deploy', description: 'Apply skills in supervised real-world engagements.' },
        { title: 'Earn', description: 'Build credibility and get paid for verified delivery.' },
      ];

  const icons = [FiBookOpen, FiShield, FiDollarSign];

  return (
    <section className="cycle-section reveal-on-scroll" id="cycle">
      <div className="section-container">
        <header className="section-header-center">
          <p className="section-eyebrow"><span className="eyebrow-dot" />Cycle</p>
          <h2 className="section-title">Train. Deploy. Earn.</h2>
          <p className="section-subtitle">A simple loop that compounds skill into real outcomes.</p>
        </header>

        <div className="cycle-row">
          {cycle.slice(0, 3).map((step, index) => (
            <div key={step.title} className="cycle-node">
              <div className="cycle-circle" aria-hidden="true">
                {React.createElement(icons[index] || FiBookOpen, { size: 18 })}
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
                {index < 2 && (
                  <span className="cycle-connector" aria-hidden="true">
                    &rarr;
                  </span>
                )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CycleSection;
