import React, { useEffect, useRef, useState } from 'react';

import SorbitLogo from '../../../../assets/images/partners/sorbit.webp';
import RedspectreAILogo from '../../../../assets/images/partners/redspectre-ai.webp';
import WSuitsIndustriesLogo from '../../../../assets/images/partners/wsuits-industries.webp';

const PartnerCarouselSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const partners = [
    { src: SorbitLogo, label: 'Sorbit' },
    { src: RedspectreAILogo, label: 'Redspectre AI' },
    { src: WSuitsIndustriesLogo, label: 'WSuits Industries' },
  ];
  if (!partners.length) return null;

  return (
    <section className="reveal-on-scroll border-t border-border bg-bg-secondary py-6" aria-label="Partners" ref={sectionRef}>
      <div className="section-container">
        <div
          className={`group overflow-hidden ${isVisible ? 'animate-partners-fade' : 'opacity-0'}`}
          style={{
            maskImage:
              'linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)',
            animationDelay: isVisible ? '80ms' : undefined,
          }}
          aria-hidden="true"
        >
          <div
            className="flex w-max items-center gap-16 animate-trust-scroll group-hover:[animation-play-state:paused] motion-reduce:animate-none"
            style={{ animationDuration: '28s' }}
          >
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={`${partner.label}-${index}`}
                className="flex items-center justify-center rounded-sm border border-transparent px-3 py-1 opacity-45 grayscale transition-all duration-200 hover:-translate-y-0.5 hover:opacity-100 hover:grayscale-0 motion-reduce:transition-none"
              >
                <img
                  src={partner.src}
                  alt={`${partner.label} logo`}
                  loading="lazy"
                  width={140}
                  height={40}
                  className="block h-7 w-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerCarouselSection;
