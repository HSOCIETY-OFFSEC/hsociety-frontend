import React from 'react';
import '../../../styles/landing/partners.css';

import SorbitLogo from '../../../assets/partners/sorbit.webp';
import RedspectreAILogo from '../../../assets/partners/redspectre-ai.webp';
import WSuitsIndustriesLogo from '../../../assets/partners/wsuits-industries.webp';

const PartnerLogo = ({ src, isDuplicate }) => (
  <div className="partner-logo" aria-hidden={isDuplicate}>
    <img src={src} alt="" loading="lazy" draggable="false" />
  </div>
);

const PartnerCarouselSection = () => {
  const partners = [
    { src: SorbitLogo },
    { src: RedspectreAILogo },
    { src: WSuitsIndustriesLogo },
  ];

  const items = partners;
  const trackItems = [...items, ...items, ...items];
  const hasPartners = items.length > 0;

  return (
    <section className="partners-section" aria-label="Partners">

      <div className="partners-header">
        <div className="partners-rule" />
        <p className="partners-kicker">Trusted by security teams worldwide</p>
        <div className="partners-rule" />
      </div>

      {hasPartners ? (
        <div className="partners-carousel" role="presentation">
          <div className="partners-track">
            {trackItems.map((partner, index) => (
              <PartnerLogo
                key={`partner-${index}`}
                src={partner.src}
                isDuplicate={index >= items.length}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="partners-empty">Partner logos are unavailable right now.</div>
      )}

    </section>
  );
};

export default PartnerCarouselSection;
