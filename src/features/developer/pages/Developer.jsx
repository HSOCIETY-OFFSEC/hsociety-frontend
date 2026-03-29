import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCode, FiCpu, FiGitBranch, FiGithub, FiShield, FiTool, FiArrowUpRight } from 'react-icons/fi';
import developerContent from '../../../data/static/developer.json';
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
  publicHeroTitle,
  publicList,
  publicListItem,
  publicPage,
  publicSection,
} from '../../../shared/styles/publicClasses';

const Developer = () => {
  const navigate = useNavigate();

  const iconMap = useMemo(() => ({
    FiCode,
    FiTool,
    FiShield,
    FiCpu,
    FiGitBranch,
    FiGithub,
  }), []);

  const stack = developerContent.stack.items.map((item) => ({
    ...item,
    icon: iconMap[item.icon],
  }));

  const contributions = developerContent.contributions.items.map((item) => ({
    ...item,
    icon: iconMap[item.icon],
  }));

  return (
    <div className={`${publicPage} text-text-primary`}>
      {/* ── HERO ─────────────────────────────────── */}
      <section className={`hero-section reveal-on-scroll ${publicHeroSection}`}>
        <div className={`section-container ${publicHeroGrid}`}>
          <div>
            <p className={publicHeroKicker}>
              <span className="eyebrow-dot" />
              HSOCIETY OFFSEC / Developers
            </p>
            <h1 className={publicHeroTitle}>{developerContent.hero.title}</h1>
            <p className={publicHeroDesc}>{developerContent.hero.subtitle}</p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate(developerContent.hero.route)}
              >
                {developerContent.hero.button}
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
            <p className={publicBadge}>Dev focus</p>
            <div className={publicList}>
              <div className={publicListItem}>
                <FiCode size={14} />
                <span>Open-source security tooling.</span>
              </div>
              <div className={publicListItem}>
                <FiGitBranch size={14} />
                <span>Contributor-friendly workflows.</span>
              </div>
              <div className={publicListItem}>
                <FiGithub size={14} />
                <span>Ship code with the operator community.</span>
              </div>
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
              Stack focus
            </p>
            <h2 className="section-title">{developerContent.stack.title}</h2>
            <p className="section-subtitle">{developerContent.stack.subtitle}</p>
          </div>
          <PublicCardGrid>
            {stack.map((item, index) => (
              <article
                key={item.title}
                className={publicCard}
                style={{ '--public-card-media': `url(${getPublicCardMedia(index)})` }}
              >
                <div className={publicCardMeta}>
                  <span className={publicChip}>{item.title}</span>
                </div>
                <h3 className={publicCardTitle}>{item.title}</h3>
                <p className={publicCardDesc}>{item.detail}</p>
              </article>
            ))}
          </PublicCardGrid>
        </div>
      </section>

      {/* ── CARDS ────────────────────────────────── */}
      <section className={`reveal-on-scroll ${publicSection}`}>
        <div className="section-container">
          <div className="section-header">
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Contributions
            </p>
            <h2 className="section-title">{developerContent.contributions.title}</h2>
            <p className="section-subtitle">{developerContent.contributions.subtitle}</p>
          </div>
          <PublicCardGrid>
            {contributions.map((item, index) => (
              <article
                key={item.title}
                className={publicCard}
                style={{ '--public-card-media': `url(${getPublicCardMedia(index)})` }}
              >
                <div className={publicCardMeta}>
                  <span className={publicChip}>{item.title}</span>
                </div>
                <h3 className={publicCardTitle}>{item.title}</h3>
                <p className={publicCardDesc}>{item.detail}</p>
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
              Build with HSOCIETY OFFSEC
            </p>
            <h2 className="section-title">Ship tools with the operator community.</h2>
            <p className="section-subtitle">Partner with us on research, tooling, and platform development.</p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/contact')}
              >
                Talk to us
                <FiArrowUpRight size={14} />
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="bg-transparent px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/careers')}
              >
                See careers
              </Button>
            </div>
          </div>
          <div className={publicCtaCard}>
            <h3 className={publicCardTitle}>Open-source alignment.</h3>
            <p className={publicCardDesc}>We ship with transparency, mentorship, and real-world operator feedback.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Developer;
