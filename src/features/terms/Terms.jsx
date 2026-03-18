/**
 * Terms & Conditions Page
 * Location: src/features/terms/Terms.jsx
 *
 * GitHub repo-page layout:
 *   page header (breadcrumb + meta pills) → two-column (main + sidebar)
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  FiAlertCircle,
  FiClipboard,
  FiFileText,
  FiShield,
  FiUsers,
  FiCheckCircle,
  FiCalendar,
  FiGlobe,
} from 'react-icons/fi';
import PageLoader from '../../shared/components/ui/PageLoader';
import { getTermsContent } from './terms.service';
import '../../styles/features/terms/index.css';

/* ── fallback data ─────────────────────────────── */
const FALLBACK_TERMS = {
  effectiveDate: '—',
  lastUpdated: '—',
  jurisdiction: '—',
  sections: [
    {
      title: 'Introduction',
      body: 'Welcome to HSOCIETY. By accessing or using our services—including training programs, community platforms, and penetration testing services—you agree to comply with these Terms and Conditions. HSOCIETY operates a cycle-based offensive security ecosystem designed to train, integrate, and deploy penetration testing talent through real-world engagements. If you do not agree to these terms, you may not use our services.'
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
        'Circumvent, exploit, or disrupt HSOCIETY\'s systems or services.',
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
      body: 'These Terms are governed by the laws of [Insert Jurisdiction]. Disputes shall be resolved through negotiation, mediation, or binding arbitration, as applicable.'
    },
    {
      title: 'Changes to Terms',
      body: 'HSOCIETY may update these Terms periodically. Users are responsible for reviewing the latest version. Continued use constitutes acceptance.'
    }
  ]
};

/* ── icon rotation ─────────────────────────────── */
const SECTION_ICONS = [FiClipboard, FiUsers, FiShield, FiAlertCircle, FiFileText];

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
          lastUpdated:   data.lastUpdated   || FALLBACK_TERMS.lastUpdated,
          jurisdiction:  data.jurisdiction  || FALLBACK_TERMS.jurisdiction,
          sections: Array.isArray(data.sections) && data.sections.length
            ? data.sections
            : FALLBACK_TERMS.sections,
        });
      }
      setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  const sections = useMemo(() => terms.sections || [], [terms.sections]);

  if (loading) return <PageLoader message="Loading terms..." durationMs={0} />;

  return (
    <div className="trm-page">

      {/* ── PAGE HEADER ─────────────────────────────── */}
      <header className="trm-page-header">
        <div className="trm-page-header-inner">
          <div className="trm-header-left">
            <div className="trm-header-icon-wrap">
              <FiFileText size={20} className="trm-header-icon" />
            </div>
            <div>
              <div className="trm-header-breadcrumb">
                <span className="trm-breadcrumb-org">HSOCIETY</span>
                <span className="trm-breadcrumb-sep">/</span>
                <span className="trm-breadcrumb-page">terms</span>
                <span className="trm-header-visibility">Public</span>
              </div>
              <p className="trm-header-desc">
                Terms and conditions governing access to HSOCIETY training,
                services, and community platforms.
              </p>
            </div>
          </div>
        </div>

        {/* Meta pills */}
        <div className="trm-header-meta">
          <span className="trm-meta-pill">
            <FiCalendar size={13} className="trm-meta-icon" />
            <span className="trm-meta-label">Last updated</span>
            <strong className="trm-meta-value">{terms.lastUpdated}</strong>
          </span>
          <span className="trm-meta-pill">
            <FiCalendar size={13} className="trm-meta-icon" />
            <span className="trm-meta-label">Effective</span>
            <strong className="trm-meta-value">{terms.effectiveDate}</strong>
          </span>
          <span className="trm-meta-pill">
            <FiGlobe size={13} className="trm-meta-icon" />
            <span className="trm-meta-label">Jurisdiction</span>
            <strong className="trm-meta-value">{terms.jurisdiction}</strong>
          </span>
          <span className="trm-meta-pill">
            <FiShield size={13} className="trm-meta-icon" />
            <span>Applies to all HSOCIETY users</span>
          </span>
        </div>
      </header>

      {/* ── TWO-COLUMN LAYOUT ───────────────────────── */}
      <div className="trm-layout">

        {/* ── MAIN COLUMN — sections list ─────────── */}
        <main className="trm-main">
          {sections.map((section, index) => {
            const Icon = SECTION_ICONS[index % SECTION_ICONS.length];
            const isGoverningLaw = String(section.title || '').toLowerCase().includes('governing law');
            const bodyText = isGoverningLaw
              ? (section.body || '').replace('[Insert Jurisdiction]', terms.jurisdiction || '—')
              : section.body;

            return (
              <article key={`${section.title}-${index}`} className="trm-section">
                {/* Section header row */}
                <div className="trm-section-header">
                  <span className="trm-section-num">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="trm-section-icon-wrap">
                    <Icon size={13} />
                  </span>
                  <h2 className="trm-section-title">{section.title}</h2>
                </div>

                {/* Body text */}
                {bodyText && (
                  <p className="trm-section-body">{bodyText}</p>
                )}

                {/* Bullet list */}
                {Array.isArray(section.bullets) && section.bullets.length > 0 && (
                  <ul className="trm-bullets">
                    {section.bullets.map((bullet, bi) => (
                      <li key={`${section.title}-${bi}`}>
                        <FiCheckCircle size={11} className="trm-bullet-icon" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}

          {/* Effective dates row */}
          <article className="trm-section trm-section--last">
            <div className="trm-section-header">
              <span className="trm-section-num">
                {String(sections.length + 1).padStart(2, '0')}
              </span>
              <span className="trm-section-icon-wrap">
                <FiCalendar size={13} />
              </span>
              <h2 className="trm-section-title">Effective Dates</h2>
            </div>
            <ul className="trm-bullets">
              <li>
                <FiCheckCircle size={11} className="trm-bullet-icon" />
                <span>Effective Date: {terms.effectiveDate}</span>
              </li>
              <li>
                <FiCheckCircle size={11} className="trm-bullet-icon" />
                <span>Last Updated: {terms.lastUpdated}</span>
              </li>
            </ul>
          </article>
        </main>

        {/* ── SIDEBAR ─────────────────────────────── */}
        <aside className="trm-sidebar">

          {/* Table of contents — GitHub wiki sidebar */}
          <div className="trm-sidebar-box">
            <h3 className="trm-sidebar-heading">Table of contents</h3>
            <nav className="trm-toc">
              {sections.map((section, index) => (
                <span key={section.title} className="trm-toc-item">
                  <span className="trm-toc-num">{String(index + 1).padStart(2, '0')}</span>
                  {section.title}
                </span>
              ))}
            </nav>
          </div>

          {/* Meta box */}
          <div className="trm-sidebar-box">
            <h3 className="trm-sidebar-heading">Document info</h3>
            <div className="trm-sidebar-divider" />
            <ul className="trm-sidebar-list">
              <li>
                <FiCalendar size={13} className="trm-sidebar-icon" />
                <span>Updated: <strong>{terms.lastUpdated}</strong></span>
              </li>
              <li>
                <FiCalendar size={13} className="trm-sidebar-icon" />
                <span>Effective: <strong>{terms.effectiveDate}</strong></span>
              </li>
              <li>
                <FiGlobe size={13} className="trm-sidebar-icon" />
                <span>Jurisdiction: <strong>{terms.jurisdiction}</strong></span>
              </li>
              <li>
                <FiShield size={13} className="trm-sidebar-icon" />
                <span>Applies to all users</span>
              </li>
            </ul>
          </div>

          {/* Topics */}
          <div className="trm-sidebar-box">
            <h3 className="trm-sidebar-heading">Topics</h3>
            <div className="trm-topics">
              {['legal', 'terms', 'privacy', 'conduct', 'security', 'hsociety'].map(
                (t) => <span key={t} className="trm-topic">{t}</span>
              )}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
};

export default Terms;