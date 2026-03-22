import React, { useEffect, useRef } from 'react';
import '../../styles/sections/partners.css';

import SorbitLogo from '../../../../assets/images/partners/sorbit.webp';
import RedspectreAILogo from '../../../../assets/images/partners/redspectre-ai.webp';
import WSuitsIndustriesLogo from '../../../../assets/images/partners/wsuits-industries.webp';

const PartnerCarouselSection = () => {
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

  const partners = [SorbitLogo, RedspectreAILogo, WSuitsIndustriesLogo];
  if (!partners.length) return null;

  return (
    <section className="partners-section reveal-on-scroll" aria-label="Partners" ref={sectionRef}>
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