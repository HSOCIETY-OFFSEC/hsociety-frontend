/**
 * Team Page
 * Location: src/features/team/Team.jsx
 *
 * GitHub repo-page layout:
 *   page header (breadcrumb + actions) → two-column (main + sidebar)
 */

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
  FiGlobe,
} from 'react-icons/fi';
import {
  FaDiscord,
  FaFacebookF,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedinIn,
  FaTelegram,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import ImageWithLoader from '../../../shared/components/ui/ImageWithLoader';
import teamContent from '../../../data/static/team.json';
import { getTeamContent } from '../services/team.service';
import '../styles/team.css';

/* ── helpers ── */
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
    FiCrosshair, FiCpu, FiTarget, FiShield, FiUsers, FiMessageSquare,
  }), []);

  const socialIconMap = useMemo(() => ({
    linkedin: FaLinkedinIn,
    github:   FaGithub,
    x:        FaXTwitter,
    twitter:  FaXTwitter,
    youtube:  FaYoutube,
    telegram: FaTelegram,
    instagram:FaInstagram,
    facebook: FaFacebookF,
    discord:  FaDiscord,
    website:  FaGlobe,
    web:      FaGlobe,
  }), []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const res = await getTeamContent();
      if (!mounted || !res.success) return;
      setContent(normalizeTeamContent(teamContent, res.data?.team || {}));
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
    <div className="tm-page">

      {/* ── PAGE HEADER ─────────────────────────────── */}
      <header className="tm-page-header">
        <div className="tm-page-header-inner">
          <div className="tm-header-left">
            <div className="tm-header-icon-wrap">
              <FiUsers size={20} className="tm-header-icon" />
            </div>
            <div>
              <div className="tm-header-breadcrumb">
                <span className="tm-breadcrumb-org">HSOCIETY</span>
                <span className="tm-breadcrumb-sep">/</span>
                <span className="tm-breadcrumb-page">team</span>
                <span className="tm-header-visibility">Public</span>
              </div>
              <p className="tm-header-desc">
                {content.hero?.subtitle || 'Meet the operators behind HSOCIETY.'}
              </p>
            </div>
          </div>

          <div className="tm-header-actions">
            <button
              className="tm-btn tm-btn-primary"
              onClick={() => navigate(content.hero?.route || '/feedback')}
            >
              <FiArrowUpRight size={14} />
              {content.hero?.button || 'Work with us'}
            </button>
          </div>
        </div>

        <div className="tm-header-meta">
          <span className="tm-meta-pill">
            <FiUsers size={13} className="tm-meta-icon" />
            <span className="tm-meta-label">Leadership</span>
            <strong className="tm-meta-value">{leadership.length}</strong>
          </span>
          <span className="tm-meta-pill">
            <FiShield size={13} className="tm-meta-icon" />
            <span className="tm-meta-label">Teams</span>
            <strong className="tm-meta-value">{teams.length}</strong>
          </span>
        </div>
      </header>

      {/* ── TWO-COLUMN LAYOUT ───────────────────────── */}
      <div className="tm-layout">

        {/* ── MAIN COLUMN ─────────────────────────── */}
        <main className="tm-main">

          {/* Leadership section */}
          <section className="tm-section">
            <h2 className="tm-section-title">
              <FiUsers size={15} className="tm-section-icon" />
              {content.leadership?.title || 'Leadership'}
            </h2>
            {content.leadership?.subtitle && (
              <p className="tm-section-desc">{content.leadership.subtitle}</p>
            )}

            <div className="tm-member-list">
              {leadership.map((member, i) => (
                <article key={i} className="tm-member-card">
                  {/* Avatar */}
                  <div className="tm-member-avatar">
                    <ImageWithLoader
                      src={member.image}
                      alt={member.name}
                      loading="lazy"
                      loaderMessage="Loading profile..."
                    />
                  </div>

                  {/* Info */}
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
                    {member.focus && (
                      <p className="tm-member-focus">{member.focus}</p>
                    )}
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
          </section>

          <div className="tm-divider" />

          {/* Teams / groups section */}
          <section className="tm-section">
            <h2 className="tm-section-title">
              <FiShield size={15} className="tm-section-icon" />
              {content.groups?.title || 'Teams'}
            </h2>
            {content.groups?.subtitle && (
              <p className="tm-section-desc">{content.groups.subtitle}</p>
            )}

            <div className="tm-group-list">
              {teams.map((group, i) => (
                <article key={i} className="tm-group-card">
                  <div className="tm-group-card-header">
                    <span className="tm-group-icon">
                      <group.icon size={15} />
                    </span>
                    <strong className="tm-group-title">{group.title}</strong>
                  </div>
                  <p className="tm-group-desc">{group.description}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="tm-divider" />

          {/* CTA section */}
          <section className="tm-section tm-cta-section">
            <p className="tm-cta-eyebrow">
              <FiArrowUpRight size={13} />
              {content.cta?.title || 'Join the team'}
            </p>
            <h2 className="tm-cta-title">{content.cta?.subtitle || 'We\'re always looking for operators.'}</h2>
            <button
              className="tm-btn tm-btn-secondary"
              onClick={() => navigate(content.cta?.route || '/feedback')}
            >
              {content.cta?.button || 'Open roles'}
              <FiArrowUpRight size={13} />
            </button>
          </section>

        </main>

        {/* ── SIDEBAR ─────────────────────────────── */}
        <aside className="tm-sidebar">

          <div className="tm-sidebar-box">
            <h3 className="tm-sidebar-heading">About</h3>
            <p className="tm-sidebar-about">
              {content.hero?.subtitle ||
                'HSOCIETY is built by operators, for operators — a collective of security professionals driving real-world impact.'}
            </p>
            <div className="tm-sidebar-divider" />
            <ul className="tm-sidebar-list">
              <li><FiCheckCircle size={13} className="tm-sidebar-icon" />Offensive security focus</li>
              <li><FiCheckCircle size={13} className="tm-sidebar-icon" />Community-driven culture</li>
              <li><FiCheckCircle size={13} className="tm-sidebar-icon" />Remote-first team</li>
              <li><FiCheckCircle size={13} className="tm-sidebar-icon" />Open to collaborations</li>
            </ul>
          </div>

          <div className="tm-sidebar-box tm-status-box">
            <div className="tm-status-row">
              <span className="tm-status-dot" />
              <span className="tm-status-label">HIRING</span>
            </div>
            <strong className="tm-status-value">OPEN</strong>
            <div className="tm-status-track">
              <div className="tm-status-fill" />
            </div>
            <p className="tm-status-note">
              Roles open for operators and contributors.
            </p>
          </div>

          <div className="tm-sidebar-box">
            <h3 className="tm-sidebar-heading">Topics</h3>
            <div className="tm-topics">
              {['team', 'offsec', 'operators', 'leadership', 'community', 'hsociety'].map(
                (t) => <span key={t} className="tm-topic">{t}</span>
              )}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
};

export default Team;