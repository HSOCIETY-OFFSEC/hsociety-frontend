import React, { useEffect, useRef } from 'react';
import { FiSearch, FiMap, FiShield, FiCheckCircle } from 'react-icons/fi';
import '../../styles/sections/process.css';

const ProcessSection = ({ steps = [] }) => {
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
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (!steps.length) return null;

  const icons = [FiSearch, FiMap, FiShield, FiCheckCircle];

  return (
    <section className="process-section reveal-on-scroll" id="process" ref={sectionRef}>
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
                <div className="hs-signature" aria-hidden="true" />
                <span className="process-index">
                  {React.createElement(icons[index] || FiSearch, { size: 13 })}
                  Phase {String(index + 1).padStart(2, '0')}
                </span>
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