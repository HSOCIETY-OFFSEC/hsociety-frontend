import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiCalendar,
  FiClipboard,
  FiGlobe,
  FiCheckCircle,
} from 'react-icons/fi';
import '../../public/styles/public-landing.css';
import '../../terms/styles/terms.css';

const PRIVACY_POLICY = {
  effectiveDate: 'March 24, 2026',
  lastUpdated: 'March 24, 2026',
  jurisdiction: 'Global',
  sections: [
    {
      title: 'Overview',
      body:
        'This Privacy Policy explains how HSOCIETY OFFSEC collects, uses, and protects information across training, community, and penetration testing engagements.',
    },
    {
      title: 'Information We Collect',
      bullets: [
        'Account data such as name, email, role, and authentication details.',
        'Training and engagement activity including course progress, submissions, and assessment results.',
        'Operational data such as IP addresses, device details, and security logs.',
        'Payment metadata from approved processors (we do not store full card details).',
      ],
    },
    {
      title: 'How We Use Information',
      bullets: [
        'Deliver offensive security training, labs, and supervised engagements.',
        'Verify identity, secure accounts, and protect the community.',
        'Improve curricula, reporting quality, and platform performance.',
        'Provide customer support and engagement updates.',
      ],
    },
    {
      title: 'Sharing and Disclosure',
      bullets: [
        'We share data only with trusted service providers needed to operate the platform.',
        'Engagement reporting data is shared with authorized client stakeholders.',
        'We may disclose information when required to comply with legal obligations.',
      ],
    },
    {
      title: 'Data Retention',
      body:
        'We retain data only as long as required to deliver services, meet legal obligations, and maintain security records. You can request deletion where applicable.',
    },
    {
      title: 'Security Practices',
      bullets: [
        'Access controls and monitoring to protect sensitive engagement data.',
        'Encryption of data in transit and at rest where applicable.',
        'Regular security reviews and audit logging.',
      ],
    },
    {
      title: 'Your Rights',
      bullets: [
        'Request access, correction, or deletion of personal data.',
        'Opt out of non-essential communications.',
        'Contact us for data export or processing limitations.',
      ],
    },
    {
      title: 'Cookies',
      body:
        'We use essential cookies to secure sessions and improve experience. You can control cookies through your browser settings.',
    },
  ],
};

const Privacy = () => {
  const navigate = useNavigate();
  const sections = useMemo(() => PRIVACY_POLICY.sections, []);

  return (
    <div className="public-page public-page-inner trm-page">
      <section className="hero-section public-hero reveal-on-scroll">
        <div className="section-container">
          <div>
            <p className="public-hero-kicker">
              <span className="eyebrow-dot" />
              HSOCIETY OFFSEC / Privacy
            </p>
            <h1 className="public-hero-title">Privacy Policy</h1>
            <p className="public-hero-desc">
              This policy explains how HSOCIETY OFFSEC protects training, community, and engagement data.
            </p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={() => navigate('/contact')}>
                Contact support
                <FiArrowUpRight size={14} />
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/terms')}>
                View terms
              </button>
            </div>
          </div>
          <div className="public-hero-panel">
            <div className="hs-signature" aria-hidden="true" />
            <p className="public-badge">Effective dates</p>
            <div className="public-list">
              <div className="public-list-item">
                <FiCalendar size={14} />
                <span>Effective: {PRIVACY_POLICY.effectiveDate}</span>
              </div>
              <div className="public-list-item">
                <FiClipboard size={14} />
                <span>Last updated: {PRIVACY_POLICY.lastUpdated}</span>
              </div>
              <div className="public-list-item">
                <FiGlobe size={14} />
                <span>Jurisdiction: {PRIVACY_POLICY.jurisdiction}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="public-section reveal-on-scroll">
        <div className="section-container">
          <div className="section-header">
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Privacy sections
            </p>
            <h2 className="section-title">Review how we protect data.</h2>
            <p className="section-subtitle">Key privacy commitments and data handling practices.</p>
          </div>
          <div className="public-card-grid">
            {sections.map((section) => (
              <article key={section.title} className="public-card">
                <div className="hs-signature" aria-hidden="true" />
                <h3 className="public-card-title">{section.title}</h3>
                {section.body && <p className="public-card-desc">{section.body}</p>}
                {section.bullets && (
                  <ul className="trm-bullets">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>
                        <FiCheckCircle size={12} />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
