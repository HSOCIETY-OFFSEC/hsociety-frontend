import React, { useEffect, useRef } from 'react';
import { FiBookOpen, FiShield, FiDollarSign } from 'react-icons/fi';
import '../../styles/sections/cycle.css';

const CycleSection = ({ steps }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      if (sectionRef.current) sectionRef.current.classList.add('is-visible');
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (sectionRef.current) sectionRef.current.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const cycle = steps?.length
    ? steps
    : [
        { title: 'Train', description: 'Learn offensive security through guided labs and coaching.' },
        { title: 'Deploy', description: 'Apply skills in supervised real-world engagements.' },
        { title: 'Earn', description: 'Build credibility and get paid for verified delivery.' },
      ];

  const icons = [FiBookOpen, FiShield, FiDollarSign];

  return (
    <section className="cycle-section reveal-on-scroll" id="cycle" ref={sectionRef}>
      {/* [ADDED] dual-box signature */}
      <div className="hs-signature" aria-hidden="true" />

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
                {/* [ADDED] glow layer for hover effect */}
                <div className="cycle-circle-glow" />
                {React.createElement(icons[index] || FiBookOpen, { size: 18 })}
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {index < 2 && (
                <span className="cycle-connector" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CycleSection;