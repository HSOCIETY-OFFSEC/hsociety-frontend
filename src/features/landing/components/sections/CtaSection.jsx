import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthModal from '../../../../shared/hooks/useAuthModal';

const CtaSection = ({ content }) => {
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();

  const handleRoute = (route) => {
    if (route === '/register') { openAuthModal('register'); return; }
    navigate(route);
  };

  return (
    <section className="reveal-on-scroll border-t border-border bg-bg-secondary py-16" id="cta">
      <div className="section-container">
        <div className="relative overflow-visible rounded-lg border border-border bg-bg-secondary px-6 py-12 text-center shadow-md">
          <div className="hs-signature absolute -right-2 -top-2 h-5 w-5" aria-hidden="true" />
          <div className="absolute inset-0 opacity-0" aria-hidden="true" />
          <h2 className="text-[clamp(2.2rem,3.8vw,3.8rem)] text-text-primary">
            {content?.left?.title || 'Ready to join HSOCIETY OFFSEC?'}
          </h2>
          <p className="mx-auto mt-3 max-w-[60ch] text-text-secondary">
            {content?.left?.description || 'Launch your offensive security journey.'}
          </p>
          <div className="mt-8 inline-flex flex-wrap justify-center gap-3 max-sm:w-full max-sm:flex-col">
            <button
              type="button"
              className="rounded-md bg-brand px-6 py-3 font-bold text-ink-black shadow-[0_8px_18px_color-mix(in_srgb,var(--primary-color)_25%,transparent)] transition-transform duration-150 max-sm:w-full"
              onClick={() => handleRoute(content?.left?.route || '/register')}
            >
              {content?.left?.button || 'Join as Student'}
            </button>
            <button
              type="button"
              className="rounded-md border border-border px-6 py-3 font-semibold text-text-primary transition-colors duration-150 max-sm:w-full"
              onClick={() => handleRoute(content?.right?.route || '/corporate/pentest')}
            >
              {content?.right?.button || 'Book Pentest'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
