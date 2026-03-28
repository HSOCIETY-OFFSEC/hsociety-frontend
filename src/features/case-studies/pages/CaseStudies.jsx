import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBarChart2, FiCheckCircle, FiShield, FiArrowUpRight } from 'react-icons/fi';
import Button from '../../../shared/components/ui/Button';
import PublicCardGrid from '../../../shared/components/public/PublicCardGrid';
import { getPublicCardMedia } from '../../../shared/data/publicCardMedia';
import {
  publicBadge,
  publicCard,
  publicCardDesc,
  publicCardMeta,
  publicCardTitle,
  publicChip,
  publicCtaCard,
  publicCtaInner,
  publicCtaSection,
  publicHeroActions,
  publicHeroDesc,
  publicHeroGrid,
  publicHeroKicker,
  publicHeroPanel,
  publicHeroSection,
  publicHeroStat,
  publicHeroStats,
  publicHeroTitle,
  publicList,
  publicListItem,
  publicPage,
  publicSection,
} from '../../../shared/styles/publicClasses';

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
    <div className={`${publicPage} text-text-primary`}>
      {/* ── HERO ─────────────────────────────────── */}
      <section className={`hero-section reveal-on-scroll ${publicHeroSection}`}>
        <div className={`section-container ${publicHeroGrid}`}>
          <div>
            <p className={publicHeroKicker}>
              <span className="eyebrow-dot" />
              HSOCIETY OFFSEC / Case Studies
            </p>
            <h1 className={publicHeroTitle}>Outcome-driven security work.</h1>
            <p className={publicHeroDesc}>
              Real engagements with measurable results. Every project ends with a clear remediation path.
            </p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/contact')}
              >
                Request a briefing
                <FiArrowUpRight size={14} />
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="bg-transparent px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/services')}
              >
                Explore services
              </Button>
            </div>
          </div>
          <div className={publicHeroPanel}>
            <div className="hs-signature" aria-hidden="true" />
            <p className={publicBadge}>Impact metrics</p>
            <div className={publicList}>
              <div className={publicListItem}>
                <FiBarChart2 size={14} />
                <span>74% average risk reduction.</span>
              </div>
              <div className={publicListItem}>
                <FiCheckCircle size={14} />
                <span>30-day median fix cycle.</span>
              </div>
              <div className={publicListItem}>
                <FiShield size={14} />
                <span>100% report completeness.</span>
              </div>
            </div>
            <div className={publicHeroStats}>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">30d</strong> median fix
              </span>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">74%</strong> reduction
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CARDS ────────────────────────────────── */}
      <section className={`reveal-on-scroll ${publicSection}`}>
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
            {studies.map((study, index) => (
              <article
                key={study.title}
                className={publicCard}
                style={{ '--public-card-media': `url(${getPublicCardMedia(index)})` }}
              >
                <div className="hs-signature" aria-hidden="true" />
                <div className={publicCardMeta}>
                  <span className={publicChip}>
                    {study.title}
                  </span>
                </div>
                <h3 className={publicCardTitle}>{study.title}</h3>
                <p className={publicCardDesc}>{study.focus}</p>
                <div className={publicCardMeta}>
                  <span>{study.outcome}</span>
                </div>
              </article>
            ))}
          </PublicCardGrid>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className={`reveal-on-scroll ${publicCtaSection}`}>
        <div className={`section-container ${publicCtaInner}`}>
          <div>
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Ready to start
            </p>
            <h2 className="section-title">Bring your environment. We’ll bring the operators.</h2>
            <p className="section-subtitle">Let’s scope the right engagement for your team.</p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/contact')}
              >
                Contact security team
                <FiArrowUpRight size={14} />
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="bg-transparent px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/pricing')}
              >
                View pricing
              </Button>
            </div>
          </div>
          <div className={publicCtaCard}>
            <div className="hs-signature" aria-hidden="true" />
            <h3 className={publicCardTitle}>Evidence-first reports.</h3>
            <p className={publicCardDesc}>Reproduce-ready findings, prioritized remediation, and operator notes.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;
