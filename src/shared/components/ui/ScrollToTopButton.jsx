import React, { useEffect, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import './ScrollToTopButton.css';

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
      className={`scroll-to-top ${visible ? 'is-visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
    >
      <FiArrowUp size={18} />
      <span>Top</span>
    </button>
  );
};

export default ScrollToTopButton;
