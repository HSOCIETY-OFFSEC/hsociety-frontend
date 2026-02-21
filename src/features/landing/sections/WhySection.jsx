import React from 'react';
import Logo from '../../../shared/components/common/Logo';
import ImageWithLoader from '../../../shared/components/ui/ImageWithLoader';
import '../../../styles/features/landing/why.css';

const WhySection = ({ items = [] }) => (
  <section className="why-section reveal-on-scroll">
    <div className="section-container">
      <div className="section-header-center">
        <div className="section-eyebrow">
          <Logo size="small" />
          <span>Why HSOCIETY</span>
        </div>
        <h2 className="section-title-large">Why Choose HSOCIETY?</h2>
        <p className="section-subtitle-large">
          Execution over marketing. Proof over promises.
        </p>
      </div>

      <div className="why-grid">
        {items.map((item) => (
          <div key={item.title} className="why-item reveal-on-scroll">
            {item.image && (
              <div className="why-media">
                <ImageWithLoader
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  loaderMessage="Loading highlight..."
                />
              </div>
            )}
            <div className="why-icon">
              <item.icon size={28} />
            </div>
            <h4 className="why-title">{item.title}</h4>
            <p className="why-description">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhySection;
