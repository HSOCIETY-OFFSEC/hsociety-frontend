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
import '../../public/styles/public-landing.css';
import '../styles/team.css';

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
    <div className="landing-page public-page tm-page">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero-section public-hero reveal-on-scroll">
        <div className="section-container">
          <div>
            <p className="public-hero-kicker">
              <span className="eyebrow-dot" />
              HSOCIETY / Team
            </p>
            <h1 className="public-hero-title">{content.hero?.title || 'Meet the operators.'}</h1>
            <p className="public-hero-desc">
              {content.hero?.subtitle || 'The team behind HSOCIETY’s security programs and community.'}
            </p>
            <div className="public-hero-actions">
              <button
                className="public-btn public-btn--primary"
                onClick={() => navigate(content.hero?.route || '/feedback')}
              >
                {content.hero?.button || 'Work with us'}
                <FiArrowUpRight size={14} />
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/careers')}>
                View careers
              </button>
            </div>
            <div className="public-pill-row">
              <span className="public-pill">
                <FiUsers size={12} />
                Leadership {leadership.length}
              </span>
              <span className="public-pill">
                <FiShield size={12} />
                Teams {teams.length}
              </span>
            </div>
          </div>
          <div className="public-hero-panel">
            <p className="public-badge">Operator culture</p>
            <div className="public-list">
              <div className="public-list-item">
                <FiCheckCircle size={14} />
                <span>Offensive security focus.</span>
              </div>
              <div className="public-list-item">
                <FiCheckCircle size={14} />
                <span>Community-driven execution.</span>
              </div>
              <div className="public-list-item">
                <FiCheckCircle size={14} />
                <span>Remote-first collaboration.</span>
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
              Leadership
            </p>
            <h2 className="section-title">{content.leadership?.title || 'Leadership'}</h2>
            {content.leadership?.subtitle && (
              <p className="section-subtitle">{content.leadership.subtitle}</p>
            )}
          </div>
          <div className="public-card-grid tm-leadership-grid">
            {leadership.map((member, i) => (
              <article key={`${member.name}-${i}`} className="public-card tm-member-card">
                <div className="tm-member-avatar">
                  <ImageWithLoader
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    loaderMessage="Loading profile..."
                  />
                </div>
                <div className="tm-member-body">
                  <div className="tm-member-header">
                    <div className="tm-member-icon">
                      <member.icon size={14} />
                    </div>
                    <div>
                      <strong className="tm-member-name">{member.name}</strong>
                      <span className="tm-member-role">{member.role}</span>
                    </div>
                  </div>
                  {member.focus && <p className="tm-member-focus">{member.focus}</p>}
                  {!!member.socials?.length && (
                    <div className="tm-member-socials">
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
                            className="tm-social-link"
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
          </div>
        </div>
      </section>

      {/* ── CARDS ────────────────────────────────── */}
      <section className="public-section reveal-on-scroll">
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
          <div className="public-card-grid">
            {teams.map((group, i) => (
              <article key={`${group.title}-${i}`} className="public-card">
                <div className="public-card-meta">
                  <span className="public-chip">{group.title}</span>
                </div>
                <h3 className="public-card-title">{group.title}</h3>
                <p className="public-card-desc">{group.description}</p>
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
              {content.cta?.title || 'Join the team'}
            </p>
            <h2 className="section-title">{content.cta?.subtitle || 'We are always looking for operators.'}</h2>
            <p className="section-subtitle">Build with us across research, training, and community.</p>
            <div className="public-hero-actions">
              <button
                className="public-btn public-btn--primary"
                onClick={() => navigate(content.cta?.route || '/feedback')}
              >
                {content.cta?.button || 'Open roles'}
                <FiArrowUpRight size={13} />
              </button>
              <button className="public-btn public-btn--ghost" onClick={() => navigate('/contact')}>
                Contact the team
              </button>
            </div>
          </div>
          <div className="public-cta-card">
            <h3 className="public-card-title">Operators, educators, builders.</h3>
            <p className="public-card-desc">HSOCIETY is built by practitioners with real engagement experience.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;
