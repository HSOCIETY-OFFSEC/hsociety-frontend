import { useEffect } from 'react';
import { envConfig } from '../../../config/app/env.config';

const AnalyticsHead = () => {
  useEffect(() => {
    if (!envConfig.analytics.enabled || !envConfig.analytics.trackingId) return;
    if (typeof document === 'undefined') return;

    const scriptId = 'ga-gtag';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${envConfig.analytics.trackingId}`;
      document.head.appendChild(script);
    }

    const inlineId = 'ga-inline';
    if (!document.getElementById(inlineId)) {
      const inline = document.createElement('script');
      inline.id = inlineId;
      inline.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${envConfig.analytics.trackingId}', {
          anonymize_ip: true,
          send_page_view: false
        });
      `;
      document.head.appendChild(inline);
    }
  }, []);

  return null;
};

export default AnalyticsHead;
