import React, { useEffect, useRef } from 'react';
import '../../styles/sections/modules.css';

const ModulesSection = ({ modules = [] }) => {
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

  if (!modules.length) return null;

  return (
    <section className="modules-section reveal-on-scroll" id="modules" ref={sectionRef}>
      <div className="section-container">
        <header className="section-header-center">
          <p className="section-eyebrow"><span className="eyebrow-dot" />Modules</p>
          <h2 className="section-title">Bootcamp emblems.</h2>
          <p className="section-subtitle">Preview the Hacker Protocol phases.</p>
        </header>

        <div className="modules-strip" role="list">
          {modules.map((module) => (
            <div key={module.codename} className="module-tile" role="listitem">
              <div className="module-card">
                <img
                  src={module.emblem}
                  alt={module.codename}
                  width={80}
                  height={80}
                  loading="lazy"
                />
              </div>
              <span>{module.codename}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
