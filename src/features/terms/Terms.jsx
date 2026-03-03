import React, { useEffect, useMemo, useState } from 'react';
import { FiAlertCircle, FiClipboard, FiFileText, FiShield, FiUsers } from 'react-icons/fi';
import PageLoader from '../../shared/components/ui/PageLoader';
import { getTermsContent } from './terms.service';
import '../../styles/sections/terms/index.css';

const FALLBACK_TERMS = {
  effectiveDate: '[Insert Date]',
  lastUpdated: '[Insert Date]',
  jurisdiction: '[Insert Jurisdiction]',
  sections: [
    {
      title: 'Introduction',
      body:
        'Welcome to HSOCIETY. By accessing or using our services—including training programs, community platforms, and penetration testing services—you agree to comply with these Terms and Conditions. HSOCIETY operates a cycle-based offensive security ecosystem designed to train, integrate, and deploy penetration testing talent through real-world engagements. If you do not agree to these terms, you may not use our services.'
    },
    {
      title: 'Services Overview',
      body: 'HSOCIETY provides:',
      bullets: [
        'Training Programs – Structured beginner-to-advanced offensive security and ethical hacking courses.',
        'Community Access – Collaboration, mentorship, and team-based simulations.',
        'Supervised Engagements – Controlled real-world penetration testing for skill development.',
        'Professional Services – Paid penetration tests and structured reporting for client organizations.',
        'Services may be updated, modified, or discontinued at our discretion.'
      ]
    },
    {
      title: 'Eligibility',
      bullets: [
        'Users must be 13 years or older to access HSOCIETY services.',
        'Participation in supervised penetration testing requires explicit consent and adherence to legal and ethical standards.',
        'Users are responsible for maintaining confidentiality of their accounts and login credentials.'
      ]
    },
    {
      title: 'User Conduct',
      body: 'By using HSOCIETY, you agree not to:',
      bullets: [
        'Engage in illegal hacking, unauthorized system access, or malicious activities.',
        'Share confidential client data outside authorized channels.',
        'Harass or harm other community members.',
        'Circumvent, exploit, or disrupt HSOCIETY’s systems or services.',
        'HSOCIETY reserves the right to suspend or terminate accounts for violations.'
      ]
    },
    {
      title: 'Payments and Refunds',
      bullets: [
        'Fees apply for training programs and professional penetration testing services.',
        'Payments are processed through secure methods.',
        'Refund policies are outlined per service and may vary by program.',
        'HSOCIETY reserves the right to modify pricing with prior notice.'
      ]
    },
    {
      title: 'Intellectual Property',
      bullets: [
        'All content, training materials, tools, and reports are owned by HSOCIETY or licensed to us.',
        'Users may not copy, redistribute, or sell any HSOCIETY intellectual property without explicit permission.',
        'Community contributions remain the property of the contributor, but HSOCIETY may use anonymized insights for service improvement.'
      ]
    },
    {
      title: 'Disclaimers and Limitation of Liability',
      bullets: [
        'HSOCIETY delivers training and supervised engagements in good faith.',
        'Results from training or penetration testing cannot guarantee absolute security.',
        'HSOCIETY is not liable for damages resulting from misuse of knowledge or tools, including unauthorized hacking.',
        'Use of services is at your own risk.'
      ]
    },
    {
      title: 'Privacy',
      bullets: [
        'HSOCIETY collects and stores user data necessary for service delivery, including training progress and engagement participation.',
        'Personal data will not be sold or shared with third parties without consent, except as required by law.',
        'By using HSOCIETY, you consent to data collection and usage as outlined in our Privacy Policy.'
      ]
    },
    {
      title: 'Termination',
      bullets: [
        'HSOCIETY may terminate access for breach of terms, illegal activities, or unsafe behavior.',
        'Termination does not release users from payment obligations or liability for prior actions.'
      ]
    },
    {
      title: 'Governing Law',
      body:
        'These Terms are governed by the laws of [Insert Jurisdiction]. Disputes shall be resolved through negotiation, mediation, or binding arbitration, as applicable.'
    },
    {
      title: 'Changes to Terms',
      body:
        'HSOCIETY may update these Terms periodically. Users are responsible for reviewing the latest version. Continued use constitutes acceptance.'
    }
  ]
};

const Terms = () => {
  const [loading, setLoading] = useState(true);
  const [terms, setTerms] = useState(FALLBACK_TERMS);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const response = await getTermsContent();
      if (!mounted) return;
      if (response.success) {
        const data = response.data?.terms || {};
        setTerms({
          effectiveDate: data.effectiveDate || FALLBACK_TERMS.effectiveDate,
          lastUpdated: data.lastUpdated || FALLBACK_TERMS.lastUpdated,
          jurisdiction: data.jurisdiction || FALLBACK_TERMS.jurisdiction,
          sections: Array.isArray(data.sections) && data.sections.length
            ? data.sections
            : FALLBACK_TERMS.sections
        });
      }
      setLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const sections = useMemo(() => terms.sections || [], [terms.sections]);

  if (loading) return <PageLoader message="Loading terms..." durationMs={0} />;

  return (
    <div className="terms-page">
      <header className="terms-hero">
        <p className="terms-kicker">Legal</p>
        <h1>Terms & Conditions</h1>
        <p className="terms-subtitle">
          Please review the terms that govern access to HSOCIETY training, services, and
          community platforms.
        </p>
        <div className="terms-meta">
          <span className="terms-chip">
            <FiFileText size={14} />
            Last updated: {terms.lastUpdated || FALLBACK_TERMS.lastUpdated}
          </span>
          <span className="terms-chip">
            <FiShield size={14} />
            Applies to all HSOCIETY users
          </span>
        </div>
      </header>

      {sections.map((section, index) => {
        const isLast = index === sections.length - 1;
        const icon =
          index % 5 === 0 ? FiClipboard :
          index % 5 === 1 ? FiUsers :
          index % 5 === 2 ? FiShield :
          index % 5 === 3 ? FiAlertCircle :
          FiFileText;
        const Icon = icon;
        return (
          <section key={`${section.title}-${index}`} className={`terms-section${isLast ? ' terms-section--last' : ''}`}>
            <h2>
              <Icon size={18} />
              {section.title}
            </h2>
            {section.body && <p>{section.body}</p>}
            {Array.isArray(section.bullets) && section.bullets.length > 0 && (
              <ul className="terms-list">
                {section.bullets.map((bullet, bulletIndex) => (
                  <li key={`${section.title}-bullet-${bulletIndex}`}>{bullet}</li>
                ))}
              </ul>
            )}
          </section>
        );
      })}

      <section className="terms-section terms-section--last">
        <h2>
          <FiFileText size={18} />
          Effective Dates
        </h2>
        <p>Effective Date: {terms.effectiveDate || FALLBACK_TERMS.effectiveDate}</p>
        <p>Last Updated: {terms.lastUpdated || FALLBACK_TERMS.lastUpdated}</p>
      </section>
    </div>
  );
};

export default Terms;
