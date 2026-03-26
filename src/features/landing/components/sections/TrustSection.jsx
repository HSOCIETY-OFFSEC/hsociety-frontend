import React from 'react';
import '../../styles/sections/trust.css';

import SorbitLogo from '../../../../assets/images/partners/sorbit.webp';
import RedspectreAILogo from '../../../../assets/images/partners/redspectre-ai.webp';
import WSuitsIndustriesLogo from '../../../../assets/images/partners/wsuits-industries.webp';

const TrustSection = ({ signals = [] }) => {
  const logos = [
    { src: SorbitLogo, label: 'Sorbit' },
    { src: RedspectreAILogo, label: 'Redspectre AI' },
    { src: WSuitsIndustriesLogo, label: 'WSuits Industries' },
  ];
  return (
    <section className="trust-section reveal-on-scroll" aria-label="Trusted by">
      <div className="section-container">
        <div className="trust-shell">
          <div className="trust-marquee" aria-hidden="true">
            <div className="trust-track">
              {[...logos, ...logos].map((logo, index) => (
                <div key={`${logo.label}-${index}`} className="trust-logo">
                  <img src={logo.src} alt={`${logo.label} logo`} loading="lazy" width={140} height={40} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
