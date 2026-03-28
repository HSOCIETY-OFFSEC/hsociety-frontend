import React from 'react';

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
    <section className="reveal-on-scroll border-t border-border bg-bg-primary py-8" aria-label="Trusted by">
      <div className="section-container">
        <div className="flex flex-col">
          <div
            className="overflow-hidden"
            style={{
              maskImage:
                'linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)',
            }}
            aria-hidden="true"
          >
            <div className="flex gap-9 animate-trust-scroll motion-reduce:animate-none">
              {[...logos, ...logos].map((logo, index) => (
                <div
                  key={`${logo.label}-${index}`}
                  className="flex-none opacity-50 grayscale transition-all duration-200 hover:opacity-85 hover:grayscale-0"
                >
                  <img
                    src={logo.src}
                    alt={`${logo.label} logo`}
                    loading="lazy"
                    width={140}
                    height={40}
                    className="block h-9 w-auto max-w-[140px] object-contain"
                  />
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
