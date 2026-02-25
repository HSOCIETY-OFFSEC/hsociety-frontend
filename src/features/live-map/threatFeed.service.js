const PROVIDER = import.meta.env.VITE_THREAT_PROVIDER || 'otx';
const OTX_KEY = import.meta.env.VITE_OTX_API_KEY;
const POLL_MS = Number(import.meta.env.VITE_THREAT_POLL_MS || 15000);
const PROXY_URL = import.meta.env.VITE_THREAT_PROXY_URL || '';

const SOC = {
  lat: Number(import.meta.env.VITE_SOC_LAT || 40.7128),
  lng: Number(import.meta.env.VITE_SOC_LNG || -74.006),
};

const SEVERITY_SCORE = { low: 1, medium: 2, high: 3, critical: 4 };

const COUNTRY_TO_LATLNG = {
  US: [37.0902, -95.7129], CN: [35.8617, 104.1954], RU: [61.524, 105.3188], BR: [-14.235, -51.9253], IN: [20.5937, 78.9629], DE: [51.1657, 10.4515], GB: [55.3781, -3.436], FR: [46.2276, 2.2137], JP: [36.2048, 138.2529],
};

const pickSeverity = (tags = []) => {
  const t = tags.join(' ').toLowerCase();
  if (t.includes('ransom') || t.includes('apt')) return 'critical';
  if (t.includes('malware') || t.includes('botnet')) return 'high';
  if (t.includes('phishing') || t.includes('spam')) return 'medium';
  return 'low';
};

const toPoint = (countryCode) => {
  const point = COUNTRY_TO_LATLNG[(countryCode || '').toUpperCase()];
  if (point) return { lat: point[0], lng: point[1] };
  return { lat: Math.random() * 140 - 70, lng: Math.random() * 360 - 180 };
};

const normalizeOTX = (payload) => {
  const pulses = payload?.results || payload?.pulses || [];
  return pulses.slice(0, 100).map((pulse, i) => {
    const cc = pulse?.country_code || pulse?.author?.country_code || 'US';
    const severity = pickSeverity(pulse?.tags || []);
    return {
      id: pulse?.id || `otx-${i}`,
      src: toPoint(cc),
      dst: { ...SOC },
      severity,
      scale: SEVERITY_SCORE[severity],
      label: pulse?.name || 'OTX Pulse',
      ts: pulse?.modified || new Date().toISOString(),
    };
  });
};

const normalizeAbuseCh = (payload) => {
  const rows = payload?.urls || payload?.data || [];
  return rows.slice(0, 100).map((row, i) => {
    const cc = row?.reporter_country || row?.country || 'US';
    const severity = /malware|payload|c2/i.test(`${row?.threat || ''}`) ? 'high' : 'medium';
    return {
      id: row?.id || `abusech-${i}`,
      src: toPoint(cc),
      dst: { ...SOC },
      severity,
      scale: SEVERITY_SCORE[severity],
      label: row?.url || 'URLhaus Event',
      ts: row?.dateadded || new Date().toISOString(),
    };
  });
};

export async function fetchThreatEvents() {
  if (PROXY_URL) {
    const r = await fetch(PROXY_URL);
    const j = await r.json();
    return j?.events || [];
  }

  if (PROVIDER === 'otx') {
    const res = await fetch('https://otx.alienvault.com/api/v1/pulses/subscribed?limit=100', {
      headers: { 'X-OTX-API-KEY': OTX_KEY || '' },
    });
    return normalizeOTX(await res.json());
  }

  const res = await fetch('https://urlhaus-api.abuse.ch/v1/urls/recent/');
  return normalizeAbuseCh(await res.json());
}

export { POLL_MS };
