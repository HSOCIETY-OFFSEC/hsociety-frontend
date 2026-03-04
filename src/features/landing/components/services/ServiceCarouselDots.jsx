import React from 'react';
import { SERVICES_SECTION_DATA } from '../../../../data/landing/servicesSectionData';

const ServiceCarouselDots = ({ total, activeIndex, onChange }) => (
  <div className="carousel-dots">
    {Array.from({ length: total }).map((_, index) => (
      <button
        key={index}
        className={`carousel-dot${index === activeIndex ? ' is-active' : ''}`}
        onClick={() => onChange(index)}
        aria-label={`${SERVICES_SECTION_DATA.aria.goToServicePrefix} ${index + 1}`}
      />
    ))}
  </div>
);

export default ServiceCarouselDots;
