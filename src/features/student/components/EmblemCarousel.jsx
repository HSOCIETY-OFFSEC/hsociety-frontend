import React from 'react';

const EmblemCarousel = ({ items = [], onSelect }) => {
  const loopItems = [...items, ...items];

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
          >
            <span className="emblem-carousel-image-wrap">
              <img src={item.emblem} alt={`${item.codename} emblem`} />
            </span>
            <span className="emblem-carousel-title">{item.codename}</span>
            <span className="emblem-carousel-subtitle">{item.roleTitle}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmblemCarousel;
