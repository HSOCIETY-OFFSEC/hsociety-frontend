import React from 'react';
import '../../styles/sections/partners.css';

import SorbitLogo from '../../../../assets/images/partners/sorbit.webp';
import RedspectreAILogo from '../../../../assets/images/partners/redspectre-ai.webp';
import WSuitsIndustriesLogo from '../../../../assets/images/partners/wsuits-industries.webp';
import ImageWithLoader from '../../../../shared/components/ui/ImageWithLoader';
import partnerBackdrop from '../../../../assets/images/services-images/community-integration.webp';

const PartnerCarouselSection = () => {
  const partners = [SorbitLogo, RedspectreAILogo, WSuitsIndustriesLogo];
  if (!partners.length) return null;

  return (
    <section className="partners-section reveal-on-scroll" aria-label="Partners">
      <div className="section-container">
        <div className="partners-header">
          <p className="section-eyebrow"><span className="eyebrow-dot" />Partners</p>
        </div>
        <div className="partners-hero">
          <div className="partners-hero-media">
            <ImageWithLoader
              src={partnerBackdrop}
              alt="HSOCIETY partner network"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="partners-hero-copy">
            <h3>Backed by operators who ship real security.</h3>
            <p>We align with teams and brands that push offensive security forward.</p>
          </div>
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
