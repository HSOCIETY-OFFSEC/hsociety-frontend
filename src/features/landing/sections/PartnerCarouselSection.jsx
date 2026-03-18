import React from 'react';
import '../../../styles/landing/partners.css';

import SorbitLogo from '../../../assets/partners/sorbit.webp';
import RedspectreAILogo from '../../../assets/partners/redspectre-ai.webp';
import WSuitsIndustriesLogo from '../../../assets/partners/wsuits-industries.webp';

const PartnerCarouselSection = () => {
  const partners = [SorbitLogo, RedspectreAILogo, WSuitsIndustriesLogo];
  if (!partners.length) return null;

  return (
    <section className="partners-section reveal-on-scroll" aria-label="Partners">
      <div className="section-container">
        <div className="partners-header">
          <p className="section-eyebrow"><span className="eyebrow-dot" />Partners</p>
        </div>
        <div className="partners-marquee" aria-hidden="true">
          <div className="partners-track">
            {[...partners, ...partners].map((logo, index) => (
              <div key={`${logo}-${index}`} className="partner-logo">
                <img src={logo} alt="" loading="lazy" width={140} height={40} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerCarouselSection;
