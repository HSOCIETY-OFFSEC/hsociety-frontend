import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCpu, FiCrosshair, FiMessageSquare, FiShield, FiTarget, FiUsers } from 'react-icons/fi';
import {
  FaDiscord,
  FaFacebookF,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedinIn,
  FaTelegram,
  FaXTwitter,
  FaYoutube
} from 'react-icons/fa6';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import Logo from '../../shared/components/common/Logo';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import ImageWithLoader from '../../shared/components/ui/ImageWithLoader';
import teamContent from '../../data/team.json';
import { getTeamContent } from './team.service';
import '../../styles/sections/team/index.css';

const ensureArray = (value, fallback = []) => (Array.isArray(value) ? value : fallback);

const normalizeTeamContent = (base, incoming = {}) => ({
  ...base,
  ...incoming,
  hero: { ...base.hero, ...(incoming.hero || {}) },
  leadership: {
    ...base.leadership,
    ...(incoming.leadership || {}),
    members: ensureArray(incoming.leadership?.members, base.leadership?.members || []).map((member) => ({
      ...member,
      socials: ensureArray(member?.socials, []).map((social) => ({
        platform: String(social?.platform || '').trim(),
        url: String(social?.url || '').trim(),
      })),
    })),
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
  useScrollReveal();
  const [content, setContent] = useState(teamContent);

  const iconMap = useMemo(() => ({
    FiCrosshair,
    FiCpu,
    FiTarget,
    FiShield,
    FiUsers,
    FiMessageSquare
  }), []);

  const socialIconMap = useMemo(
    () => ({
      linkedin: FaLinkedinIn,
      github: FaGithub,
      x: FaXTwitter,
      twitter: FaXTwitter,
      youtube: FaYoutube,
      telegram: FaTelegram,
      instagram: FaInstagram,
      facebook: FaFacebookF,
      discord: FaDiscord,
      website: FaGlobe,
      web: FaGlobe
    }),
    []
  );

  useEffect(() => {
    let mounted = true;
    const loadTeamContent = async () => {
      const response = await getTeamContent();
      if (!mounted || !response.success) return;
      const managedTeam = response.data?.team || {};
      setContent(normalizeTeamContent(teamContent, managedTeam));
    };
    loadTeamContent();
    return () => {
      mounted = false;
    };
  }, []);

  const leadership = ensureArray(content.leadership?.members).map((member) => ({
    ...member,
    icon: iconMap[member.icon] || FiUsers
  }));

  const teams = ensureArray(content.groups?.items).map((group) => ({
    ...group,
    icon: iconMap[group.icon] || FiShield
  }));

  return (
    <div className="team-page">
      <header className="team-hero reveal-on-scroll">
        <div className="team-hero-content">
          <Logo size="large" />
          <div>
            <p className="team-kicker">{content.hero?.kicker}</p>
            <h1>{content.hero?.title}</h1>
            <p>{content.hero?.subtitle}</p>
          </div>
          <Button variant="primary" size="large" onClick={() => navigate(content.hero?.route || '/feedback')}>
            {content.hero?.button || 'Work With Us'}
          </Button>
        </div>
      </header>

      <section className="team-leadership reveal-on-scroll">
        <div className="team-section-header">
          <Logo size="small" />
          <h2>{content.leadership?.title}</h2>
          <p>{content.leadership?.subtitle}</p>
        </div>
        <div className="team-leadership-grid">
          {leadership.map((member, index) => (
            <Card key={index} padding="large" className="team-card">
              <div className="profile-frame">
                <ImageWithLoader
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  loaderMessage="Loading profile..."
                />
              </div>
              <div className="team-card-icon">
                <member.icon size={26} />
              </div>
              <h3>{member.name}</h3>
              <span>{member.role}</span>
              <p>{member.focus}</p>
              {!!member.socials?.length && (
                <div className="team-card-socials" aria-label={`${member.name} social links`}>
                  {member.socials.map((social, socialIndex) => {
                    if (!social?.url) return null;
                    const key = String(social?.platform || '').trim().toLowerCase();
                    const Icon = socialIconMap[key] || FaGlobe;
                    return (
                      <a
                        key={`${key}-${socialIndex}`}
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${member.name} on ${social.platform || 'social'}`}
                        className="team-card-social-link"
                      >
                        <Icon size={14} />
                        <span>{social.platform || 'Website'}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section className="team-groups reveal-on-scroll">
        <div className="team-section-header">
          <Logo size="small" />
          <h2>{content.groups?.title}</h2>
          <p>{content.groups?.subtitle}</p>
        </div>
        <div className="team-group-grid">
          {teams.map((group, index) => (
            <Card key={index} padding="large" className="team-group-card">
              <div className="team-card-icon">
                <group.icon size={26} />
              </div>
              <h3>{group.title}</h3>
              <p>{group.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="team-cta reveal-on-scroll">
        <Card padding="large" className="team-cta-card">
          <div className="team-cta-content">
            <div>
              <h3>{content.cta?.title}</h3>
              <p>{content.cta?.subtitle}</p>
            </div>
            <Button variant="secondary" size="large" onClick={() => navigate(content.cta?.route || '/feedback')}>
              {content.cta?.button || 'Open Roles'}
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Team;
