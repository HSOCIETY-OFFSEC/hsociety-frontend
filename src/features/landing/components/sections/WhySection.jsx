import React, { useEffect, useRef } from 'react';
import { FiTarget, FiUsers, FiShield, FiTrendingUp } from 'react-icons/fi';
import '../../styles/sections/why.css';

const WhySection = ({ items = [] }) => {
  const sectionRef = useRef(null); // ← added

  // ← added: IntersectionObserver for .is-visible
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

  if (!items.length) return null;

  return (
    <section className="why-section reveal-on-scroll" id="why" ref={sectionRef}> {/* ← ref added */}
      <div className="section-container">
        <div className="why-grid">
          <div className="why-left">
            <p className="section-eyebrow"><span className="eyebrow-dot" />Why HSOCIETY OFFSEC</p>
            <h2 className="section-title">Built for operators, not spectators.</h2>
            <p className="section-subtitle">
              We combine beginner training, community feedback, and supervised
              execution so skill converts into real-world outcomes.
            </p>
          </div>

          <div className="why-right">
            {items.map((item, index) => {
              const icons = [FiTarget, FiUsers, FiShield, FiTrendingUp];
              const Icon = icons[index % icons.length];
              return (
                <div key={item.title || index} className="why-item">
                  <div className="why-thumb">
                    <img
                      src={item.image}
                      alt={item.title}
                      width={64}
                      height={64}
                      loading="lazy"
                    />
                  </div>
                  <div className="why-content">
                    <h3>
                      <span className="landing-icon landing-icon--sm">
                        <Icon size={14} aria-hidden="true" />
                      </span>
                      {item.title}
                    </h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
