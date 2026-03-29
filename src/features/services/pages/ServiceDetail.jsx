import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthModal from '../../../shared/hooks/useAuthModal';
import landingContent from '../../../data/static/landing.json';
import PublicCardGrid from '../../../shared/components/public/PublicCardGrid';
import {
  FiArrowUpRight,
  FiCheckCircle,
  FiZap,
} from 'react-icons/fi';
import Button from '../../../shared/components/ui/Button';
import { getPublicCardMedia } from '../../../shared/data/publicCardMedia';
import {
  publicBadge,
  publicCard,
  publicCardDesc,
  publicCardMeta,
  publicCardTitle,
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

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();

  const services = landingContent.services || [];
  const service = services.find((item) => slugify(item.title) === slug);
  const serviceIndex = services.findIndex((item) => slugify(item.title) === slug);
  const prevService = serviceIndex > 0 ? services[serviceIndex - 1] : null;
  const nextService = serviceIndex < services.length - 1 ? services[serviceIndex + 1] : null;

  useEffect(() => {
    if (!service) navigate('/services', { replace: true });
  }, [navigate, service]);

  if (!service) return null;

  return (
    <div className={`${publicPage} text-text-primary`}>
      {/* ── HERO ─────────────────────────────────── */}
      <section className={`hero-section reveal-on-scroll ${publicHeroSection}`}>
        <div className={`section-container ${publicHeroGrid}`}>
          <div>
            <p className={publicHeroKicker}>
              <span className="eyebrow-dot" />
              HSOCIETY OFFSEC / Services
            </p>
            <h1 className={publicHeroTitle}>{service.title}</h1>
            <p className={publicHeroDesc}>{service.description}</p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/contact')}
              >
                <FiZap size={14} />
                Talk to HSOCIETY OFFSEC
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="bg-transparent px-[1.1rem] text-[0.9rem]"
                onClick={() => openAuthModal('login')}
              >
                Join training cycle
              </Button>
            </div>
          </div>
          <div className={publicHeroPanel}>
            <p className={publicBadge}>Coverage summary</p>
            <div className={publicList}>
              {service.features.slice(0, 4).map((item) => (
                <div key={item} className={publicListItem}>
                  <FiCheckCircle size={14} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className={publicHeroStats}>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">{service.features.length}</strong> controls
              </span>
              <span className={publicHeroStat}>
                <strong className="font-semibold text-text-secondary">Rapid</strong> reporting
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
              What we cover
            </p>
            <h2 className="section-title">Evidence-driven coverage areas.</h2>
            <p className="section-subtitle">Every engagement prioritizes clarity, evidence, and impact.</p>
          </div>
          <PublicCardGrid>
            {service.features.map((feature, index) => (
              <article
                key={feature}
                className={publicCard}
                style={{ '--public-card-media': `url(${getPublicCardMedia(index)})` }}
              >
                <h3 className={publicCardTitle}>{feature}</h3>
                <p className={publicCardDesc}>Operator-led coverage with remediation guidance.</p>
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
              Explore more
            </p>
            <h2 className="section-title">Related services</h2>
            <p className="section-subtitle">Jump to another service or go back to the catalog.</p>
          </div>
          <PublicCardGrid>
            {prevService && (
              <article
                className={`${publicCard} cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand`}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/services/${slugify(prevService.title)}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/services/${slugify(prevService.title)}`);
                  }
                }}
                aria-label={`View service ${prevService.title}`}
              >
                <p className={publicCardMeta}>Previous service</p>
                <h3 className={publicCardTitle}>{prevService.title}</h3>
                <p className={publicCardDesc}>{prevService.description}</p>
              </article>
            )}
            {nextService && (
              <article
                className={`${publicCard} cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand`}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/services/${slugify(nextService.title)}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/services/${slugify(nextService.title)}`);
                  }
                }}
                aria-label={`View service ${nextService.title}`}
              >
                <p className={publicCardMeta}>Next service</p>
                <h3 className={publicCardTitle}>{nextService.title}</h3>
                <p className={publicCardDesc}>{nextService.description}</p>
              </article>
            )}
            <article
              className={`${publicCard} cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand`}
              role="button"
              tabIndex={0}
              onClick={() => navigate('/services')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/services');
                }
              }}
              aria-label="View all services"
            >
              <p className={publicCardMeta}>All services</p>
              <h3 className={publicCardTitle}>Service catalog</h3>
              <p className={publicCardDesc}>Browse all HSOCIETY OFFSEC offerings.</p>
            </article>
          </PublicCardGrid>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className={`reveal-on-scroll ${publicCtaSection}`}>
        <div className={`section-container ${publicCtaInner}`}>
          <div>
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Ready to engage
            </p>
            <h2 className="section-title">Start a security engagement.</h2>
            <p className="section-subtitle">Talk to our team about your attack surface and goals.</p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/contact')}
              >
                Book a call
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
            <h3 className={publicCardTitle}>Operator-led delivery.</h3>
            <p className={publicCardDesc}>Supervised pentests, clear findings, and remediation mapping.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
