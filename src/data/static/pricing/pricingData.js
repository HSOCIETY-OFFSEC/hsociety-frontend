export const PRICING_TIERS = [
  {
    title: 'Community Security Review',
    price: 'Starting from GH₵150',
    details:
      'Entry-level security assessment covering common vulnerabilities and OWASP Top 10 risks. Conducted under supervision with a remediation checklist and vulnerability summary.',
  },
  {
    title: 'Professional Pentest',
    price: 'GH₵700 – GH₵1,500',
    details:
      'Comprehensive web and API penetration testing including authentication testing, exploit validation, and a structured technical report with remediation guidance.',
  },
  {
    title: 'Advanced Security Engagement',
    price: 'GH₵2,000 – GH₵5,000',
    details:
      'Deep offensive security testing for production systems including business logic analysis, retesting after fixes, and advisory guidance for improving security posture.',
  },
];

export const PRICING_INCLUDED_ITEMS = [
  'Executive security summary',
  'Technical vulnerability report',
  'Proof-of-concept exploits',
  'Remediation guidance',
];

export const PRICING_NOTE =
  'Final pricing depends on scope, application size, and testing complexity.';

export default PRICING_TIERS;
