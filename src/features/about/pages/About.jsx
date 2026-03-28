import React from 'react';
import { useNavigate } from 'react-router-dom';
import aboutContent from '../../../data/static/about.json';
import SocialLinks from '../../../shared/components/common/SocialLinks';
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

const About = () => {
  const navigate = useNavigate();
  const { hero, cycle, experience, principle } = aboutContent;

  return (
    <div className={`${publicPage} text-text-primary`}>
      {/* ── HERO ─────────────────────────────────── */}
      <section className={`hero-section reveal-on-scroll ${publicHeroSection}`}>
        <div className={`section-container ${publicHeroGrid}`}>
          <div>
            <p className={publicHeroKicker}>
              <span className="eyebrow-dot" />
              HSOCIETY OFFSEC / About
            </p>
            <h1 className={publicHeroTitle}>{hero.title}</h1>
            <p className={publicHeroDesc}>{hero.description}</p>
            <div className={publicHeroActions}>
              {/* Enhancement: SPA navigation */}
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/services')}
              >
                Explore services
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="bg-transparent px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/contact')}
              >
                Contact the team
              </Button>
            </div>
          </div>
          <div className={publicHeroPanel}>
            <div className="hs-signature" aria-hidden="true" />
            <p className={publicBadge}>Cycle overview</p>
            <div className={publicList}>
              {cycle.phases.slice(0, 4).map((phase) => (
                <div key={phase} className={publicListItem}>
                  <span>{phase}</span>
                </div>
              ))}
            </div>
            <div className={publicHeroStats}>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">4</strong> phases
              </span>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">24/7</strong> operator-led
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
              {cycle.title}
            </p>
            <h2 className="section-title">{cycle.title}</h2>
            <p className="section-subtitle">{cycle.subtitle}</p>
          </div>
          <PublicCardGrid>
            {cycle.phases.map((phase, index) => (
              <article
                key={phase}
                className={publicCard}
                style={{ '--public-card-media': `url(${getPublicCardMedia(index)})` }}
              >
                <div className="hs-signature" aria-hidden="true" />
                <div className={publicCardMeta}>
                  <span className={publicChip}>Phase {String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3 className={publicCardTitle}>{phase}</h3>
                <p className={publicCardDesc}>Operational focus within the HSOCIETY OFFSEC cycle.</p>
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
              {experience.title}
            </p>
            <h2 className="section-title">{experience.title}</h2>
            <p className="section-subtitle">{experience.subtitle}</p>
          </div>
          <PublicCardGrid>
            {experience.cards.map((card, index) => (
              <article
                key={card.title}
                className={publicCard}
                style={{ '--public-card-media': `url(${getPublicCardMedia(index)})` }}
              >
                <div className="hs-signature" aria-hidden="true" />
                <h3 className={publicCardTitle}>{card.title}</h3>
                <p className={publicCardDesc}>{card.description}</p>
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
              {principle.title}
            </p>
            <h2 className="section-title">{principle.title}</h2>
            <p className="section-subtitle">{principle.subtitle}</p>
          </div>
          <PublicCardGrid>
            {principle.bullets.map((item, i) => (
              <article
                key={item}
                className={publicCard}
                style={{ '--public-card-media': `url(${getPublicCardMedia(i)})` }}
              >
                <div className="hs-signature" aria-hidden="true" />
                <div className={publicCardMeta}>
                  <span className={publicChip}>Principle {i + 1}</span>
                </div>
                <p className={publicCardDesc}>{item}</p>
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
              Connect
            </p>
            <h2 className="section-title">Follow the HSOCIETY OFFSEC cycle.</h2>
            <p className="section-subtitle">Training, community, and live engagements — all in one place.</p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/contact')}
              >
                Contact us
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="bg-transparent px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/services')}
              >
                View services
              </Button>
            </div>
          </div>
          <div className={publicCtaCard}>
            <div className="hs-signature" aria-hidden="true" />
            <h3 className={publicCardTitle}>Stay in the loop</h3>
            <p className={publicCardDesc}>Follow the latest research and community updates.</p>
            <SocialLinks className="flex flex-wrap gap-3" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
