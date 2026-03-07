import { useEffect } from 'react';

/**
 * Scroll reveal utility
 * Adds `is-visible` when elements enter viewport.
 */
const observedElements = new WeakSet();
let sharedObserver = null;

const getObserver = (options) => {
  if (sharedObserver || typeof window === 'undefined' || typeof window.IntersectionObserver === 'undefined') {
    return sharedObserver;
  }

  const mergedOptions = { threshold: 0.2, rootMargin: '0px 0px -10% 0px', ...options };
  sharedObserver = new window.IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          sharedObserver.unobserve(entry.target);
        }
      });
    },
    mergedOptions
  );

  return sharedObserver;
};

const useScrollReveal = (selector = '.reveal-on-scroll', options = {}, deps = []) => {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const revealElements = () => {
      const elements = Array.from(document.querySelectorAll(selector));
      if (elements.length === 0) return;

      elements.forEach((el, index) => {
        if (!el.style.getPropertyValue('--reveal-delay')) {
          const delay = Math.min(index * 60, 360);
          el.style.setProperty('--reveal-delay', `${delay}ms`);
        }

        if (observedElements.has(el)) return;
        observedElements.add(el);

        if (typeof window === 'undefined' || typeof window.IntersectionObserver === 'undefined') {
          el.classList.add('is-visible');
          return;
        }

        const observer = getObserver(options);
        observer?.observe(el);
      });
    };

    revealElements();

    const mutationObserver = new MutationObserver(() => {
      revealElements();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => mutationObserver.disconnect();
  }, [selector, ...deps]);
};

export default useScrollReveal;
