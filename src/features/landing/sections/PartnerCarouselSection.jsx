import React, { useMemo } from 'react';
import '../../../styles/landing/partners.css';

const PARTNER_GLOB = import.meta.glob('../../../assets/partners/*.{png,jpg,jpeg,svg,webp}', {
  eager: true,
  import: 'default',
});

const formatPartnerName = (filePath) => {
  const fileName = filePath.split('/').pop() || '';
  const base = fileName.replace(/\.[^/.]+$/, '');
  return base.replace(/[-_]+/g, ' ').trim();
};

const PartnerCarouselSection = () => {
  const partners = useMemo(() => {
    const entries = Object.entries(PARTNER_GLOB);
    return entries
      .map(([path, src]) => ({
        name: formatPartnerName(path),
        src,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const fallback = [
    { name: 'Partner One' },
    { name: 'Partner Two' },
    { name: 'Partner Three' },
    { name: 'Partner Four' },
    { name: 'Partner Five' },
  ];

  const items = partners.length ? partners : fallback;
  const trackItems = [...items, ...items];

  return (
    <section className="partners-section" aria-label="Partners">
      <div className="partners-inner">
        <p className="partners-kicker">Trusted by teams building resilient security</p>
        <div className="partners-carousel" role="presentation">
          <div className="partners-track">
            {trackItems.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="partner-card"
                aria-hidden={index >= items.length}
              >
                {partner.src ? (
                  <img src={partner.src} alt={partner.name} loading="lazy" />
                ) : (
                  <span>{partner.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <p className="partners-note">Drop partner logos into `src/assets/partners` to populate this carousel.</p>
      </div>
    </section>
  );
};

export default PartnerCarouselSection;
