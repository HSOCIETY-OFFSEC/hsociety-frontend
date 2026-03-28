import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCpu,
  FiCrosshair,
  FiMessageSquare,
  FiShield,
  FiTarget,
  FiUsers,
  FiCheckCircle,
  FiArrowUpRight,
} from 'react-icons/fi';
import {
  FaDiscord,
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaTelegram,
  FaXTwitter,
  FaYoutube,
  FaGlobe,
} from 'react-icons/fa6';
import ImageWithLoader from '../../../shared/components/ui/ImageWithLoader';
import teamContent from '../../../data/static/team.json';
import { getTeamContent } from '../services/team.service';
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
  publicPill,
  publicPillRow,
  publicSection,
} from '../../../shared/styles/publicClasses';

const ensureArray = (v, fallback = []) => (Array.isArray(v) ? v : fallback);

const normalizeTeamContent = (base, incoming = {}) => ({
  ...base,
  ...incoming,
  hero: { ...base.hero, ...(incoming.hero || {}) },
  leadership: {
    ...base.leadership,
    ...(incoming.leadership || {}),
    members: ensureArray(incoming.leadership?.members, base.leadership?.members || []).map(
      (member) => ({
        ...member,
        socials: ensureArray(member?.socials, []).map((s) => ({
          platform: String(s?.platform || '').trim(),
          url: String(s?.url || '').trim(),
        })),
      })
    ),
  },
  groups: {
    ...base.groups,
    ...(incoming.groups || {}),
    items: ensureArray(incoming.groups?.items, base.groups?.items || []),
  },
  cta: { ...base.cta, ...(incoming.cta || {}) },
});

const Team = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(teamContent);

  const iconMap = useMemo(() => ({
    FiCrosshair,
    FiCpu,
    FiTarget,
    FiShield,
    FiUsers,
    FiMessageSquare,
  }), []);

  const socialIconMap = useMemo(() => ({
    linkedin: FaLinkedinIn,
    github: FaGithub,
    x: FaXTwitter,
    twitter: FaXTwitter,
    youtube: FaYoutube,
    telegram: FaTelegram,
    discord: FaDiscord,
    instagram: FaInstagram,
    facebook: FaFacebookF,
    website: FaGlobe,
  }), []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const response = await getTeamContent();
      if (!mounted || !response?.success) return;
      setContent(normalizeTeamContent(teamContent, response.data?.team));
    };
    load();
    return () => { mounted = false; };
  }, []);

  const leadership = ensureArray(content.leadership?.members).map((m) => ({
    ...m,
    icon: iconMap[m.icon] || FiUsers,
  }));

  const teams = ensureArray(content.groups?.items).map((g) => ({
    ...g,
    icon: iconMap[g.icon] || FiShield,
  }));

  return (
    <div className={`${publicPage} text-text-primary`}>
      {/* ── HERO ─────────────────────────────────── */}
      <section className={`hero-section reveal-on-scroll ${publicHeroSection}`}>
        <div className={`section-container ${publicHeroGrid}`}>
          <div>
            <p className={publicHeroKicker}>
              <span className="eyebrow-dot" />
              HSOCIETY OFFSEC / Team
            </p>
            <h1 className={publicHeroTitle}>{content.hero?.title || 'Meet the operators.'}</h1>
            <p className={publicHeroDesc}>
              {content.hero?.subtitle || 'The team behind HSOCIETY OFFSEC’s security programs and community.'}
            </p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate(content.hero?.route || '/feedback')}
              >
                {content.hero?.button || 'Work with us'}
                <FiArrowUpRight size={14} />
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="bg-transparent px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate('/careers')}
              >
                View careers
              </Button>
            </div>
            <div className={publicPillRow}>
              <span className={publicPill}>
                <FiUsers size={12} />
                Leadership {leadership.length}
              </span>
              <span className={publicPill}>
                <FiShield size={12} />
                Teams {teams.length}
              </span>
            </div>
          </div>
          <div className={publicHeroPanel}>
            <div className="hs-signature" aria-hidden="true" />
            <p className={publicBadge}>Operator culture</p>
            <div className={publicList}>
              <div className={publicListItem}>
                <FiCheckCircle size={14} />
                <span>Offensive security focus.</span>
              </div>
              <div className={publicListItem}>
                <FiCheckCircle size={14} />
                <span>Community-driven execution.</span>
              </div>
              <div className={publicListItem}>
                <FiCheckCircle size={14} />
                <span>Remote-first collaboration.</span>
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
              Leadership
            </p>
            <h2 className="section-title">{content.leadership?.title || 'Leadership'}</h2>
            {content.leadership?.subtitle && (
              <p className="section-subtitle">{content.leadership.subtitle}</p>
            )}
          </div>
          <PublicCardGrid className="tm-leadership-grid">
            {leadership.map((member, i) => (
              <article key={`${member.name}-${i}`} className={`${publicCard} grid gap-4`}>
                <div className="hs-signature" aria-hidden="true" />
                <div className="overflow-hidden rounded-md">
                  <ImageWithLoader
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    loaderMessage="Loading profile..."
                    className="h-[220px] w-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--primary-color)_18%,var(--bg-secondary))] text-brand">
                      <member.icon size={14} />
                    </div>
                    <div>
                      <strong className="block font-semibold text-text-primary">{member.name}</strong>
                      <span className="block text-sm text-text-tertiary">{member.role}</span>
                    </div>
                  </div>
                  {member.focus && <p className="mt-2 text-sm text-text-secondary">{member.focus}</p>}
                  {!!member.socials?.length && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {member.socials.map((social, si) => {
                        if (!social?.url) return null;
                        const key = String(social?.platform || '').toLowerCase().trim();
                        const Icon = socialIconMap[key] || FaGlobe;
                        return (
                          <a
                            key={`${key}-${si}`}
                            href={social.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-border px-2.5 py-1 text-xs text-text-secondary"
                            aria-label={`${member.name} on ${social.platform || 'social'}`}
                          >
                            <Icon size={13} />
                            <span>{social.platform || 'Website'}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
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
              Teams
            </p>
            <h2 className="section-title">{content.groups?.title || 'Teams'}</h2>
            {content.groups?.subtitle && (
              <p className="section-subtitle">{content.groups.subtitle}</p>
            )}
          </div>
          <PublicCardGrid>
            {teams.map((group, i) => (
              <article
                key={`${group.title}-${i}`}
                className={publicCard}
                style={{ '--public-card-media': `url(${getPublicCardMedia(i)})` }}
              >
                <div className="hs-signature" aria-hidden="true" />
                <div className={publicCardMeta}>
                  <span className={publicChip}>{group.title}</span>
                </div>
                <h3 className={publicCardTitle}>{group.title}</h3>
                <p className={publicCardDesc}>{group.description}</p>
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
              {content.cta?.title || 'Join the team'}
            </p>
            <h2 className="section-title">{content.cta?.subtitle || 'We are always looking for operators.'}</h2>
            <p className="section-subtitle">Build with us across research, training, and community.</p>
            <div className={publicHeroActions}>
              <Button
                size="small"
                className="px-[1.1rem] text-[0.9rem]"
                onClick={() => navigate(content.cta?.route || '/feedback')}
              >
                {content.cta?.button || 'Open roles'}
                <FiArrowUpRight size={13} />
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
          <div className={publicCtaCard}>
            <div className="hs-signature" aria-hidden="true" />
            <h3 className={publicCardTitle}>Operators, educators, builders.</h3>
            <p className={publicCardDesc}>HSOCIETY OFFSEC is built by practitioners with real engagement experience.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;
