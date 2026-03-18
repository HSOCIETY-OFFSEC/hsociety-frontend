import React from 'react';
import './cycle.css';

const CycleSection = ({ steps }) => {
  const cycle = steps?.length
    ? steps
    : [
        { title: 'Train', description: 'Learn offensive security through guided labs and coaching.' },
        { title: 'Deploy', description: 'Apply skills in supervised real-world engagements.' },
        { title: 'Earn', description: 'Build credibility and get paid for verified delivery.' },
      ];

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
              <div className="cycle-circle">{index + 1}</div>
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
