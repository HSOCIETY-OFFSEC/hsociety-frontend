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
      .map(([path, src]) => ({ name: formatPartnerName(path), src }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const fallback = [
    { name: 'Acme Corp' },
    { name: 'Nexus Labs' },
    { name: 'Cipher Tech' },
    { name: 'RedSec' },
    { name: 'Vaultline' },
    { name: 'Stealth.io' },
    { name: 'Darknode' },
  ];

  const items = partners.length ? partners : fallback;
  const trackItems = [...items, ...items, ...items];

  return (
    <section className="partners-section" aria-label="Partners">

      <div className="partners-header">
        <div className="partners-rule" />
        <p className="partners-kicker">Trusted by security teams worldwide</p>
        <div className="partners-rule" />
      </div>

      <div className="partners-carousel" role="presentation">
        <div className="partners-track">
          {trackItems.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="partner-logo"
              aria-hidden={index >= items.length}
            >
              {partner.src ? (
                <img src={partner.src} alt={partner.name} loading="lazy" draggable="false" />
              ) : (
                <span className="partner-logo-text">{partner.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default PartnerCarouselSection;