import React, { useEffect, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';

const SHOW_AFTER_PX = 220;
const MIN_SCROLLABLE_PX = 420;

const ScrollToTopButton = () => {
  const [eligible, setEligible] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const evaluate = () => {
      const doc = document.documentElement;
      const scrollable = Math.max(doc.scrollHeight - window.innerHeight, 0);
      const canScroll = scrollable > MIN_SCROLLABLE_PX;
      setEligible(canScroll);
      setVisible(canScroll && window.scrollY > SHOW_AFTER_PX);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(evaluate);
    };

    const onResize = () => {
      evaluate();
    };

    evaluate();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  if (!eligible) return null;

  return (
    <button
      type="button"
      className={`fixed bottom-[calc(64px+env(safe-area-inset-bottom))] right-7 z-50 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--primary-color)_35%,transparent)] bg-[color-mix(in_srgb,var(--bg-secondary)_85%,var(--primary-color)_15%)] px-4 py-3 text-sm tracking-[0.02em] text-text-primary shadow-md transition-all duration-200 hover:bg-[color-mix(in_srgb,var(--primary-color)_18%,var(--bg-secondary))] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color-mix(in_srgb,var(--primary-color)_45%,transparent)] max-sm:right-4 max-sm:bottom-[calc(48px+env(safe-area-inset-bottom))] max-sm:px-3.5 max-sm:py-2.5 ${
        visible
          ? 'translate-y-0 scale-100 opacity-100 pointer-events-auto'
          : 'translate-y-2.5 scale-95 opacity-0 pointer-events-none'
      }`}
      onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
    >
      <FiArrowUp size={18} />
      <span className="font-semibold">Top</span>
    </button>
  );
};

export default ScrollToTopButton;
