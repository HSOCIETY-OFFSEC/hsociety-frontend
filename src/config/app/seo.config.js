import { BRAND, DEFAULT_DESCRIPTION, DEFAULT_KEYWORDS, DEFAULT_OG_IMAGE, SITE_URL, getCanonicalUrl } from './brand.config';
import { HACKER_PROTOCOL_BOOTCAMP } from '../../data/static/bootcamps/hackerProtocolData';

const BASE_TITLE = `${BRAND.publicName} — Offensive Security Training & Penetration Testing`;

const ROUTE_SEO = [
  {
    match: /^\/$/,
    title: BASE_TITLE,
    description:
      'HSOCIETY OFFSEC trains offensive security operators, delivers supervised penetration testing, and powers a cybersecurity pipeline for growing teams.',
    keywords:
      'offensive security training, penetration testing, cybersecurity pipeline, ethical hacking bootcamp, red team operators',
    schema: ['courses'],
  },
  {
    match: /^\/services$/,
    title: `${BRAND.publicName} — Penetration Testing Services`,
    description:
      'Request supervised penetration testing, offensive security assessments, and remediation support delivered by HSOCIETY OFFSEC.',
    keywords:
      'penetration testing services, offensive security assessments, cybersecurity pipeline, remediation support',
    schema: ['organization'],
  },
  {
    match: /^\/services\/[^/]+/,
    title: `${BRAND.publicName} — Service Detail`,
    description:
      'Explore HSOCIETY OFFSEC service scope, outcomes, and delivery timelines for offensive security engagements.',
    keywords: 'offensive security services, penetration testing scope, remediation guidance',
    schema: ['organization'],
  },
  {
    match: /^\/courses$/,
    title: `${BRAND.publicName} — Offensive Security Courses`,
    description:
      'Browse HSOCIETY OFFSEC courses and bootcamps for offensive security training, hands-on labs, and certification-ready pathways.',
    keywords:
      'offensive security courses, ethical hacking bootcamp, cybersecurity training, penetration testing education',
    schema: ['courses'],
  },
  {
    match: /^\/courses\/[^/]+$/,
    title: `${BRAND.publicName} — Course Details`,
    description:
      'Course syllabus, outcomes, and delivery format for HSOCIETY OFFSEC offensive security training programs.',
    keywords: 'offensive security course, penetration testing curriculum, cybersecurity training',
    schema: ['course'],
  },
  {
    match: /^\/courses\/[^/]+\/modules\/[^/]+/,
    title: `${BRAND.publicName} — Course Module`,
    description:
      'Module-level outcomes, labs, and skill objectives for HSOCIETY OFFSEC offensive security training.',
    keywords: 'offensive security module, penetration testing labs, cybersecurity training module',
    schema: ['course'],
  },
  {
    match: /^\/about$/,
    title: `${BRAND.publicName} — About`,
    description:
      'Learn how HSOCIETY OFFSEC trains new operators, builds community, and delivers real-world penetration testing.',
    keywords: 'about HSOCIETY OFFSEC, offensive security training, penetration testing community',
  },
  {
    match: /^\/team$/,
    title: `${BRAND.publicName} — Team`,
    description:
      'Meet the practitioners leading HSOCIETY OFFSEC offensive security training and penetration testing.',
    keywords: 'offensive security team, penetration testing experts, cybersecurity instructors',
  },
  {
    match: /^\/developer$/,
    title: `${BRAND.publicName} — Engineering`,
    description:
      'Engineering approach behind HSOCIETY OFFSEC platforms, tooling, and offensive security delivery.',
    keywords: 'offensive security engineering, cybersecurity platform, security tooling',
  },
  {
    match: /^\/contact$/,
    title: `${BRAND.publicName} — Contact`,
    description:
      'Contact HSOCIETY OFFSEC for offensive security training, supervised pentests, and cybersecurity pipeline delivery.',
    keywords: 'contact HSOCIETY OFFSEC, penetration testing inquiry, offensive security training contact',
  },
  {
    match: /^\/careers$/,
    title: `${BRAND.publicName} — Careers`,
    description:
      'Join HSOCIETY OFFSEC to help train offensive security operators and deliver penetration testing engagements.',
    keywords: 'offensive security careers, penetration testing jobs, cybersecurity roles',
  },
  {
    match: /^\/methodology$/,
    title: `${BRAND.publicName} — Methodology`,
    description:
      'Understand the HSOCIETY OFFSEC offensive security methodology from scoping to retest validation.',
    keywords: 'penetration testing methodology, offensive security process, cybersecurity assessments',
  },
  {
    match: /^\/case-studies$/,
    title: `${BRAND.publicName} — Case Studies`,
    description:
      'Review HSOCIETY OFFSEC case studies showcasing penetration testing outcomes and remediation impact.',
    keywords: 'penetration testing case studies, offensive security outcomes, remediation results',
  },
  {
    match: /^\/blog$/,
    title: `${BRAND.publicName} — Field Notes`,
    description:
      'Offensive security research, playbooks, and training insights from HSOCIETY OFFSEC.',
    keywords: 'offensive security research, penetration testing blog, cybersecurity playbooks',
  },
  {
    match: /^\/pricing$/,
    title: `${BRAND.publicName} — Pricing`,
    description:
      'Review HSOCIETY OFFSEC pricing for offensive security training and penetration testing services.',
    keywords: 'penetration testing pricing, offensive security training cost, cybersecurity services pricing',
  },
  {
    match: /^\/leaderboard$/,
    title: `${BRAND.publicName} — Operator Leaderboard`,
    description:
      'Track offensive security operator progress, verified findings, and community performance.',
    keywords: 'offensive security leaderboard, operator progress, cybersecurity community',
  },
  {
    match: /^\/cp-points$/,
    title: `${BRAND.publicName} — Compromised Points`,
    description:
      'Learn how HSOCIETY OFFSEC awards Compromised Points for verified offensive security work.',
    keywords: 'compromised points, offensive security rewards, penetration testing metrics',
  },
  {
    match: /^\/terms$/,
    title: `${BRAND.publicName} — Terms & Conditions`,
    description:
      'Review HSOCIETY OFFSEC terms covering offensive security training, community access, and penetration testing engagements.',
    keywords: 'terms and conditions, offensive security services terms, HSOCIETY OFFSEC',
  },
  {
    match: /^\/privacy$/,
    title: `${BRAND.publicName} — Privacy Policy`,
    description:
      'Privacy policy for HSOCIETY OFFSEC training, community, and penetration testing services.',
    keywords: 'privacy policy, cybersecurity privacy, HSOCIETY OFFSEC',
  },
  {
    match: /^\/feedback$/,
    title: `${BRAND.publicName} — Feedback`,
    description:
      'Share feedback on HSOCIETY OFFSEC training, services, and cybersecurity pipeline delivery.',
    keywords: 'offensive security feedback, penetration testing feedback, cybersecurity training feedback',
  },
  {
    match: /^\/posts|^\/login|^\/register|^\/pentester-login|^\/change-password|^\/verify-email/,
    title: `${BRAND.publicName} — Secure Access`,
    description:
      'Sign in to HSOCIETY OFFSEC to access offensive security training, community, and client dashboards.',
    keywords: 'offensive security login, cybersecurity training portal, HSOCIETY OFFSEC access',
    noindex: true,
  },
  {
    match: /^\/(student|student-bootcamps|student-dashboard|student-resources|student-payments|community|corporate|pentester|mr-robot|account|settings|notifications)/,
    title: `${BRAND.shortName} — Secure Workspace`,
    description:
      'Secure workspace for HSOCIETY members and partners.',
    keywords: DEFAULT_KEYWORDS,
    noindex: true,
  },
];

export const buildOrganizationSchema = (socialLinks = []) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: BRAND.publicName,
  legalName: BRAND.legalName,
  url: SITE_URL,
  logo: DEFAULT_OG_IMAGE,
  sameAs: socialLinks,
  description: DEFAULT_DESCRIPTION,
});

export const buildWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: BRAND.publicName,
  url: SITE_URL,
});

export const buildAudienceSchemas = () => ([
  {
    '@context': 'https://schema.org',
    '@type': 'Audience',
    audienceType: 'Students',
    name: 'Entry-level offensive security students',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Audience',
    audienceType: 'Pentesters',
    name: 'Junior and mid-level penetration testers',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Audience',
    audienceType: 'Security teams',
    name: 'Corporate security teams and founders',
  },
]);

export const buildCourseSchema = (socialLinks = []) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: HACKER_PROTOCOL_BOOTCAMP.title,
  description: HACKER_PROTOCOL_BOOTCAMP.overview,
  provider: {
    '@type': 'Organization',
    name: BRAND.publicName,
    url: SITE_URL,
    sameAs: socialLinks,
  },
  courseMode: 'Online',
  educationalCredentialAwarded: `${BRAND.publicName} Certificate`,
});

export const getSeoForPath = (pathname = '/') => {
  const entry = ROUTE_SEO.find((item) => item.match.test(pathname));
  const title = entry?.title || BASE_TITLE;
  const description = entry?.description || DEFAULT_DESCRIPTION;
  const keywords = entry?.keywords || DEFAULT_KEYWORDS;
  const noindex = Boolean(entry?.noindex);
  const schemaFlags = entry?.schema || [];

  return {
    title,
    description,
    keywords,
    canonicalUrl: getCanonicalUrl(pathname),
    image: DEFAULT_OG_IMAGE,
    type: 'website',
    noindex,
    schemaFlags,
  };
};

export default getSeoForPath;
