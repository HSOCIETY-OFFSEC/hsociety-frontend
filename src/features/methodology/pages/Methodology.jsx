import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiClipboard, FiSearch, FiShield, FiTarget, FiTool } from 'react-icons/fi';
import methodologyContent from '../../../data/static/methodology.json';
import PublicCardGrid from '../../../shared/components/public/PublicCardGrid';
import Button from '../../../shared/components/ui/Button';
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

const Methodology = () => {
  const navigate = useNavigate();
  const iconMap = useMemo(() => ({
    FiClipboard,
    FiSearch,
    FiTarget,
    FiShield,
    FiTool,
    FiCheckCircle,
  }), []);

  const phases = methodologyContent.phases.map((phase) => ({
    ...phase,
    icon: iconMap[phase.icon],
  }));

  return (
    <div className={`${publicPage} text-text-primary`}>
      {/* ── HERO ─────────────────────────────────── */}
      <section className={`hero-section reveal-on-scroll ${publicHeroSection}`}>
        <div className={`section-container ${publicHeroGrid}`}>
          <div>
            <p className={publicHeroKicker}>
              <span className="eyebrow-dot" />
              HSOCIETY OFFSEC / Methodology
            </p>
            <h1 className={publicHeroTitle}>{methodologyContent.hero.title}</h1>
            <p className={publicHeroDesc}>{methodologyContent.hero.subtitle}</p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/contact')}
              >
                Start an engagement
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
            <p className={publicBadge}>Operator workflow</p>
            <div className={publicList}>
              {phases.slice(0, 4).map((phase) => (
                <div key={phase.title} className={publicListItem}>
                  {phase.icon && <phase.icon size={14} />}
                  <span>{phase.title}</span>
                </div>
              ))}
            </div>
            <div className={publicHeroStats}>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">{phases.length}</strong> phases
              </span>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">Repeatable</strong> cycle
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
              Process map
            </p>
            <h2 className="section-title">A repeatable security cycle.</h2>
            <p className="section-subtitle">Every phase is designed to surface risk and ship fixes.</p>
          </div>
          <PublicCardGrid>
            {phases.map((phase, index) => (
              <article
                key={phase.title}
                className={publicCard}
                style={{ '--public-card-media': `url(${getPublicCardMedia(index)})` }}
              >
                <div className={publicCardMeta}>
                  <span className={publicChip}>{phase.title}</span>
                </div>
                <h3 className={publicCardTitle}>{phase.title}</h3>
                <p className={publicCardDesc}>{phase.detail}</p>
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
              Ready to execute
            </p>
            <h2 className="section-title">Let’s apply this methodology to your stack.</h2>
            <p className="section-subtitle">Scope a pentest or training cycle with the HSOCIETY OFFSEC team.</p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/contact')}
              >
                Book a briefing
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
            <h3 className={publicCardTitle}>Cycle-based, evidence-first.</h3>
            <p className={publicCardDesc}>Continuous validation, clear remediation paths, and operator-grade output.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Methodology;
