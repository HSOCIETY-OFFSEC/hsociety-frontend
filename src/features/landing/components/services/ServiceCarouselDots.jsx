import React from 'react';
import { SERVICES_SECTION_DATA } from '../../../../data/static/landing/servicesSectionData';

const ServiceCarouselDots = ({ total, activeIndex, onChange }) => (
  <div className="mt-4 flex justify-center gap-2 md:hidden" role="tablist" aria-label="Carousel navigation">
    {Array.from({ length: total }).map((_, index) => (
      <button
        key={index}
        role="tab"
        aria-selected={index === activeIndex}
        className={`h-2 w-2 rounded-full border border-border transition-all ${
          index === activeIndex
            ? 'w-5 rounded-full border-brand bg-brand'
            : 'bg-transparent'
        }`}
        onClick={() => onChange(index)}
        aria-label={`${SERVICES_SECTION_DATA.aria.goToServicePrefix} ${index + 1}`}
      />
    ))}
  </div>
);

export default ServiceCarouselDots;
