import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiTwitter,
  FiGithub,
  FiLinkedin,
  FiGlobe,
} from 'react-icons/fi';

const EMAIL_ADDRESS = 'hsocietyoffsec@gmail.com';
const PHONE_NUMBER = '+233 504 500 337';
const PHONE_LINK = 'tel:+233504500337';

export const CONTACT_HERO = {
  kicker: 'Contact HSOCIETY OFFSEC',
  title: 'Talk to the offensive security team that ships results.',
  description:
    'HSOCIETY OFFSEC runs distributed offensive-security operations across Africa. Send through training, community, or engagement requests and expect a reply within one business day.',
  availability: 'Team online · servicing multiple time zones',
  primaryAction: {
    label: 'Email the team',
    href: `mailto:${EMAIL_ADDRESS}`,
    icon: FiMail,
  },
  secondaryAction: {
    label: 'Call support',
    href: PHONE_LINK,
    icon: FiPhone,
  },
};

export const CONTACT_CHANNELS = [
  {
    icon: FiMail,
    label: 'Email',
    value: EMAIL_ADDRESS,
    sub: 'Operational support, readouts, and partnership inquiries',
    accent: 'alpha',
    tag: 'Primary',
  },
  {
    icon: FiPhone,
    label: 'Phone',
    value: PHONE_NUMBER,
    sub: 'Mon–Fri, 09:00–18:00 EAT',
    accent: 'beta',
    tag: 'Voice',
  },
  {
    icon: FiMapPin,
    label: 'Presence',
    value: 'Remote-first across Africa',
    sub: 'Distributed offensive security operators',
    accent: 'gamma',
    tag: 'HQ',
  },
  {
    icon: FiClock,
    label: 'Response SLA',
    value: '< 4 hours',
    sub: 'Average first reply on business days',
    accent: 'delta',
    tag: 'SLA',
  },
];

export const CONTACT_STATS = [
  { value: '< 4h', label: 'Avg. response' },
  { value: '98%', label: 'Satisfaction' },
  { value: '24/7', label: 'Ops watch' },
  { value: '50+', label: 'Countries supported' },
];

export const CONTACT_SOCIAL_LINKS = [
  { icon: FiTwitter, label: 'X (Twitter)', href: 'https://twitter.com/hsocietyoffsec' },
  { icon: FiLinkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/company/hsocietyoffsec' },
  { icon: FiGithub, label: 'GitHub', href: 'https://github.com/hsocietyoffsec' },
  { icon: FiGlobe, label: 'Website', href: 'https://hsocietyoffsec.io' },
];
