import { useEffect } from 'react';

/**
 * Scroll reveal utility
 * Adds `is-visible` when elements enter viewport.
 */
const useScrollReveal = (selector = '.reveal-on-scroll', options = {}, deps = []) => {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(selector));
    if (elements.length === 0) return undefined;

    const mergedOptions = { threshold: 0.2, rootMargin: '0px 0px -10% 0px', ...options };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      mergedOptions
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selector, ...deps]);
};

export default useScrollReveal;
