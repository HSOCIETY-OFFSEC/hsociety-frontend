import { envConfig } from '../../../config/app/env.config';

const buildRumUrl = () => {
  const base = String(envConfig.api.baseURL || '').replace(/\/+$/, '');
  return `${base}/telemetry/rum`;
};

export const reportRum = ({ metric, value, tags = {} }) => {
  if (!metric || !Number.isFinite(value)) return;
  const payload = {
    metric,
    value,
    tags,
    timestamp: Date.now(),
  };

  const url = buildRumUrl();
  const body = JSON.stringify(payload);

  if (navigator?.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon(url, blob);
    return;
  }

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {});
};

export default reportRum;
