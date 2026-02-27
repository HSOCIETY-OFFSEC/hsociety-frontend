import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCpu, FiCrosshair, FiMessageSquare, FiShield, FiTarget, FiUsers } from 'react-icons/fi';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import Logo from '../../shared/components/common/Logo';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import ImageWithLoader from '../../shared/components/ui/ImageWithLoader';
import teamContent from '../../data/team.json';
import '../../styles/sections/team/index.css';

const Team = () => {
  const navigate = useNavigate();
  useScrollReveal();

  const iconMap = useMemo(() => ({
    FiCrosshair,
    FiCpu,
    FiTarget,
    FiShield,
    FiUsers,
    FiMessageSquare
  }), []);

  const leadership = teamContent.leadership.members.map((member) => ({
    ...member,
    icon: iconMap[member.icon]
  }));

  const teams = teamContent.groups.items.map((group) => ({
    ...group,
    icon: iconMap[group.icon]
  }));

  return (
    <div className="team-page">
      <header className="team-hero reveal-on-scroll">
        <div className="team-hero-content">
          <Logo size="large" />
          <div>
            <p className="team-kicker">{teamContent.hero.kicker}</p>
            <h1>{teamContent.hero.title}</h1>
            <p>{teamContent.hero.subtitle}</p>
          </div>
          <Button variant="primary" size="large" onClick={() => navigate(teamContent.hero.route)}>
            {teamContent.hero.button}
          </Button>
        </div>
      </header>

      <section className="team-leadership reveal-on-scroll">
        <div className="team-section-header">
          <Logo size="small" />
          <h2>{teamContent.leadership.title}</h2>
          <p>{teamContent.leadership.subtitle}</p>
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
            </Card>
          ))}
        </div>
      </section>

      <section className="team-groups reveal-on-scroll">
        <div className="team-section-header">
          <Logo size="small" />
          <h2>{teamContent.groups.title}</h2>
          <p>{teamContent.groups.subtitle}</p>
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
              <h3>{teamContent.cta.title}</h3>
              <p>{teamContent.cta.subtitle}</p>
            </div>
            <Button variant="secondary" size="large" onClick={() => navigate(teamContent.cta.route)}>
              {teamContent.cta.button}
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Team;
