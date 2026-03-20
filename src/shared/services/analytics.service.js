import { envConfig } from '../../config/app/env.config';

const emitDataLayer = (event, payload) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
};

export const trackEvent = (event, payload = {}) => {
  if (!event || !envConfig.analytics.enabled) return;

  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', event, payload);
  }

  emitDataLayer(event, payload);
};

export const trackPageView = (path) => {
  const pathname = path || (typeof window !== 'undefined' ? window.location.pathname : '');
  trackEvent('page_view', { page_path: pathname });
};

export default {
  trackEvent,
  trackPageView,
};
