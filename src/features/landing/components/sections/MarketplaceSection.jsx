import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiDownloadCloud, FiZap } from 'react-icons/fi';
import '../../styles/sections/marketplace.css';

const MarketplaceSection = () => {
  const navigate = useNavigate();
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

  return (
    <section className="landing-marketplace-section reveal-on-scroll" id="marketplace" ref={sectionRef}>
      <div className="section-container">
        <div className="landing-marketplace-grid">
          <div className="landing-marketplace-copy">
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              ZeroDay Market
            </p>
            <h2 className="section-title">Spend CP or download for free.</h2>
            <p className="section-subtitle">
              ZeroDay Market is the student-only shelf for operator books and curated freebies.
              Earn CP points inside HSOCIETY, then redeem them for premium titles.
            </p>
            <div className="landing-marketplace-actions">
              <button
                type="button"
                className="marketplace-primary"
                onClick={() => navigate('/marketplace')}
              >
                Explore ZeroDay Market
              </button>
              <button
                type="button"
                className="marketplace-secondary"
                onClick={() => navigate('/register')}
              >
                Earn CP Points
              </button>
            </div>
          </div>

          <div className="landing-marketplace-cards" role="list">
            <article className="landing-marketplace-card" role="listitem">
              <span className="marketplace-card-icon">
                <FiBookOpen size={16} />
              </span>
              <h3>CP Books</h3>
              <p>Redeem points for operator-grade playbooks and guides.</p>
            </article>
            <article className="landing-marketplace-card" role="listitem">
              <span className="marketplace-card-icon">
                <FiDownloadCloud size={16} />
              </span>
              <h3>Free Resources</h3>
              <p>Download analyst-ready PDFs without spending CP.</p>
            </article>
            <article className="landing-marketplace-card" role="listitem">
              <span className="marketplace-card-icon">
                <FiZap size={16} />
              </span>
              <h3>Student-Only</h3>
              <p>ZeroDay Market is reserved for students and pentesters.</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceSection;
