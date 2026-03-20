import React from 'react';
import '../../styles/sections/trust.css';

import SorbitLogo from '../../../../assets/images/partners/sorbit.webp';
import RedspectreAILogo from '../../../../assets/images/partners/redspectre-ai.webp';
import WSuitsIndustriesLogo from '../../../../assets/images/partners/wsuits-industries.webp';

const TrustSection = ({ signals = [] }) => {
  const logos = [SorbitLogo, RedspectreAILogo, WSuitsIndustriesLogo];
  const statements = signals.slice(0, 3);

  return (
    <section className="trust-section reveal-on-scroll" aria-label="Trusted by">
      <div className="section-container">
        <div className="trust-shell">
          <div className="trust-marquee" aria-hidden="true">
            <div className="trust-track">
              {[...logos, ...logos].map((logo, index) => (
                <div key={`${logo}-${index}`} className="trust-logo">
                  <img src={logo} alt="" loading="lazy" width={140} height={40} />
                </div>
              ))}
            </div>
          </div>

          <div className="trust-quotes">
            {statements.map((item) => (
              <div key={item.title} className="trust-quote">
                <p>{item.description}</p>
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
