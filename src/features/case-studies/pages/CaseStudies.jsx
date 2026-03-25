import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBarChart2, FiCheckCircle, FiShield, FiArrowUpRight } from 'react-icons/fi';
import PublicCardGrid from '../../../shared/components/public/PublicCardGrid';
import '../../public/styles/public-landing.css';
import '../styles/case-studies.css';

const CaseStudies = () => {
  const navigate = useNavigate();

  const studies = [
    {
      title: 'Fintech API Exposure',
      outcome: 'Reduced exploitability by 74% in 30 days.',
      focus: 'Auth bypass, token replay, CI/CD secrets.',
      icon: FiShield,
    },
    {
      title: 'Telecom Phishing Response',
      outcome: 'Cut incident time by 46% and improved detection.',
      focus: 'Awareness playbooks, SOC triage workflow.',
      icon: FiCheckCircle,
    },
    {
      title: 'Critical Infrastructure Review',
      outcome: 'Validated segmentation and access controls.',
      focus: 'Network pivoting, lateral movement controls.',
      icon: FiBarChart2,
    },
  ];

  return (
    <div className="public-page public-page-inner case-studies-page">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero-section public-hero reveal-on-scroll">
        <div className="section-container">
          <div>
            <p className="public-hero-kicker">
              <span className="eyebrow-dot" />
              HSOCIETY OFFSEC / Case Studies
            </p>
            <h1 className="public-hero-title">Outcome-driven security work.</h1>
            <p className="public-hero-desc">
              Real engagements with measurable results. Every project ends with a clear remediation path.
            </p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={() => navigate('/contact')}>
                Request a briefing
                <FiArrowUpRight size={14} />
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/services')}>
                Explore services
              </button>
            </div>
          </div>
          <div className="public-hero-panel">
            <div className="hs-signature" aria-hidden="true" />
            <p className="public-badge">Impact metrics</p>
            <div className="public-list">
              <div className="public-list-item">
                <FiBarChart2 size={14} />
                <span>74% average risk reduction.</span>
              </div>
              <div className="public-list-item">
                <FiCheckCircle size={14} />
                <span>30-day median fix cycle.</span>
              </div>
              <div className="public-list-item">
                <FiShield size={14} />
                <span>100% report completeness.</span>
              </div>
            </div>
            <div className="public-hero-stats">
              <span className="public-hero-stat">
                <strong>30d</strong> median fix
              </span>
              <span className="public-hero-stat">
                <strong>74%</strong> reduction
              </span>
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
              Highlights
            </p>
            <h2 className="section-title">Select engagements and outcomes.</h2>
            <p className="section-subtitle">Each case study includes evidence, findings, and remediation guidance.</p>
          </div>
          <PublicCardGrid>
            {studies.map((study) => (
              <article key={study.title} className="public-card">
                <div className="hs-signature" aria-hidden="true" />
                <div className="public-card-meta">
                  <span className="public-chip">{study.title}</span>
                </div>
                <h3 className="public-card-title">{study.title}</h3>
                <p className="public-card-desc">{study.focus}</p>
                <div className="public-card-meta">
                  <span>{study.outcome}</span>
                </div>
              </article>
            ))}
          </PublicCardGrid>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className="public-cta reveal-on-scroll">
        <div className="section-container public-cta-inner">
          <div>
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Ready to start
            </p>
            <h2 className="section-title">Bring your environment. We’ll bring the operators.</h2>
            <p className="section-subtitle">Let’s scope the right engagement for your team.</p>
            <div className="public-hero-actions">
              <button className="public-btn public-btn--primary" onClick={() => navigate('/contact')}>
                Contact security team
                <FiArrowUpRight size={14} />
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/pricing')}>
                View pricing
              </button>
            </div>
          </div>
          <div className="public-cta-card">
            <div className="hs-signature" aria-hidden="true" />
            <h3 className="public-card-title">Evidence-first reports.</h3>
            <p className="public-card-desc">Reproduce-ready findings, prioritized remediation, and operator notes.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;
