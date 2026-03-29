import React, { useEffect, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';

const SHOW_AFTER_PX = 400;
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
      className={`fixed bottom-[calc(40px+env(safe-area-inset-bottom))] right-7 z-50 inline-flex h-10 w-10 items-center justify-center rounded-sm border border-brand/50 bg-bg-primary text-brand shadow-[0_0_12px_rgba(var(--brand-rgb),0.25)] transition-all duration-200 hover:bg-bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand max-sm:right-4 max-sm:bottom-[calc(32px+env(safe-area-inset-bottom))] ${
        visible
          ? 'translate-y-0 scale-100 opacity-100 pointer-events-auto'
          : 'translate-y-2.5 scale-95 opacity-0 pointer-events-none'
      }`}
      onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
    >
      <FiArrowUp size={18} />
    </button>
  );
};

export default ScrollToTopButton;
