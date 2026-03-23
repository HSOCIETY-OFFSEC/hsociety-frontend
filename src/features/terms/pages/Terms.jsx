import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiAlertCircle,
  FiClipboard,
  FiFileText,
  FiShield,
  FiUsers,
  FiCheckCircle,
  FiCalendar,
  FiGlobe,
  FiArrowUpRight,
} from 'react-icons/fi';
import PageLoader from '../../../shared/components/ui/PageLoader';
import { getTermsContent } from '../services/terms.service';
import '../../public/styles/public-landing.css';
import '../styles/terms.css';

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
  ]
};

const Terms = () => {
  const navigate = useNavigate();
  const [terms, setTerms] = useState(FALLBACK_TERMS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const response = await getTermsContent();
      if (!mounted) return;
      if (!response.success) {
        setError('Unable to load updated terms. Showing fallback.');
        setLoading(false);
        return;
      }
      setTerms(response.data?.terms || FALLBACK_TERMS);
      setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  const sections = useMemo(() => terms?.sections || [], [terms]);

  if (loading) {
    return <PageLoader message="Loading terms..." durationMs={0} />;
  }

  return (
    <div className="public-page public-page-inner trm-page">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero-section public-hero reveal-on-scroll">
        <div className="section-container">
          <div>
            <p className="public-hero-kicker">
              <span className="eyebrow-dot" />
              HSOCIETY / Terms
            </p>
            <h1 className="public-hero-title">Terms & Conditions</h1>
            <p className="public-hero-desc">
              These terms govern access to HSOCIETY services, including training, community, and professional engagements.
            </p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={() => navigate('/contact')}>
                Contact support
                <FiArrowUpRight size={14} />
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/privacy')}>
                View privacy
              </button>
            </div>
            {error && <p className="trm-error">{error}</p>}
          </div>
          <div className="public-hero-panel">
            <div className="hs-signature" aria-hidden="true" />
            <p className="public-badge">Effective dates</p>
            <div className="public-list">
              <div className="public-list-item">
                <FiCalendar size={14} />
                <span>Effective: {terms.effectiveDate || '—'}</span>
              </div>
              <div className="public-list-item">
                <FiClipboard size={14} />
                <span>Last updated: {terms.lastUpdated || '—'}</span>
              </div>
              <div className="public-list-item">
                <FiGlobe size={14} />
                <span>Jurisdiction: {terms.jurisdiction || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CARDS ────────────────────────────────── */}
      <section className="public-section reveal-on-scroll">
        <div className="section-container">
          <div className="section-header">
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Terms sections
            </p>
            <h2 className="section-title">Review the agreements.</h2>
            <p className="section-subtitle">Each section summarizes the key expectations and responsibilities.</p>
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

      {/* ── CTA ─────────────────────────────────── */}
      <section className="public-cta reveal-on-scroll">
        <div className="section-container public-cta-inner">
          <div>
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Need clarity
            </p>
            <h2 className="section-title">Questions about these terms?</h2>
            <p className="section-subtitle">Contact the HSOCIETY team for clarifications.</p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={() => navigate('/contact')}>
                Reach support
                <FiArrowUpRight size={14} />
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/services')}>
                View services
              </button>
            </div>
          </div>
          <div className="public-cta-card">
            <div className="hs-signature" aria-hidden="true" />
            <h3 className="public-card-title">Compliance-first operations.</h3>
            <p className="public-card-desc">We operate within ethical and legal standards for all engagements.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
