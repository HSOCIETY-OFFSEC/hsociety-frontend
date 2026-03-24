export const BRAND = {
  publicName: 'HSOCIETY OFFSEC',
  shortName: 'HSOCIETY',
  legalName: 'HSOCIETY OFFSEC',
};

const normalizeSiteUrl = (value) => {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  return trimmed.replace(/\/+$/, '');
};

const rawSiteUrl =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SITE_URL)
    ? import.meta.env.VITE_SITE_URL
    : 'https://hsocietyoffsec.io';

export const SITE_URL = normalizeSiteUrl(rawSiteUrl) || 'https://hsocietyoffsec.io';

export const LOGO_URL = `${SITE_URL}/hsociety-logo-black.png`;
export const DEFAULT_OG_IMAGE = `${SITE_URL}/hsociety-logo-black.png`;

export const DEFAULT_DESCRIPTION =
  'HSOCIETY OFFSEC delivers offensive security training, supervised penetration testing, and a cybersecurity pipeline for teams and emerging operators.';

export const DEFAULT_KEYWORDS =
  'offensive security training, penetration testing, cybersecurity pipeline, ethical hacking bootcamp, red team, vulnerability assessment';

export const BRAND_TAGLINE = 'Offensive security training and penetration testing, delivered end-to-end.';

export const getCanonicalUrl = (path = '/') => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath === '/' ? '/' : cleanPath}`;
};
