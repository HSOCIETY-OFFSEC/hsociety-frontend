import React from 'react';

const EmblemCarousel = ({ items = [], onSelect }) => {
  // Triple the items — ensures the loop is seamless even on wide screens
  // with few items, and -50% translateX always lands on a clean repeat
  const loopItems = [...items, ...items, ...items];

  return (
    <div className="emblem-carousel" aria-label="Module emblems carousel">
      <div className="emblem-carousel-track">
        {loopItems.map((item, index) => (
          <button
            key={`${item.moduleId}-${index}`}
            type="button"
            className="emblem-carousel-card"
            style={{ '--module-color': item.color || '#0EA5E9' }}
            onClick={() => onSelect?.(item)}
            aria-label={`Open ${item.codename} phase`}
          >
            <span className="emblem-carousel-image-wrap">
              <img src={item.emblem} alt={`${item.codename} emblem`} loading="lazy" />
            </span>
            <span className="emblem-carousel-meta">
              <span className="emblem-carousel-title">{item.codename}</span>
              <span className="emblem-carousel-subtitle">{item.roleTitle}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmblemCarousel;
