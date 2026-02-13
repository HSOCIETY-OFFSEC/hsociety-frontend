import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCpu, FiCrosshair, FiMessageSquare, FiShield, FiTarget, FiUsers } from 'react-icons/fi';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import Logo from '../../shared/components/common/Logo';
import Navbar from '../../shared/components/layout/Navbar';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import '../../styles/features/team.css';

const Team = () => {
  const navigate = useNavigate();
  useScrollReveal();

  const leadership = [
    {
      name: 'Wsuits6',
      role: 'Offensive Security Engineer',
      focus: 'Adversary simulation and enterprise compromise chains.',
      icon: FiCrosshair,
      //Use Image form src/assets foler
      image: ''
    },
    {
      name: 'Shine',
      role: 'Principal Pentester',
      focus: 'Network Security Expert',
      icon: FiCpu,
      //Use Image form src/assets foler
      image: ''
    },
    {
      name: 'Non-Conformist',
      role: 'Governance, Complaince and Risk Managment Officer (GRC)',
      focus: 'Covert access, privilege escalation, and opsec.',
      icon: FiTarget,
      // Use Image form /src/assets folder
      image: ''
    }
  ];

  const teams = [
    {
      title: 'Offensive Research',
      description: 'Exploit development, attack tooling, and custom tradecraft.',
      icon: FiShield
    },
    {
      title: 'Engagement Delivery',
      description: 'Execution, reporting, and remediation partnership.',
      icon: FiUsers
    },
    {
      title: 'Client Success',
      description: 'Post-engagement retests and continuous validation.',
      icon: FiMessageSquare
    }
  ];

  return (
    <div className="team-page">
      <Navbar />
      <header className="team-hero reveal-on-scroll">
        <div className="team-hero-content">
          <Logo size="large" />
          <div>
            <p className="team-kicker">Meet the Team</p>
            <h1>Operators, researchers, and builders.</h1>
            <p>
              A distributed team with deep offensive experience across fintech, telecom, and
              critical infrastructure.
            </p>
          </div>
          <Button variant="primary" size="large" onClick={() => navigate('/feedback')}>
            Work With Us
          </Button>
        </div>
      </header>

      <section className="team-leadership reveal-on-scroll">
        <div className="team-section-header">
          <Logo size="small" />
          <h2>Leadership</h2>
          <p>Hands-on leads who still run ops and guide engagements.</p>
        </div>
        <div className="team-leadership-grid">
          {leadership.map((member, index) => (
            <Card key={index} padding="large" className="team-card">
              <div className="profile-frame">
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.opacity = '0';
                  }}
                />
                <div className="profile-fallback" aria-hidden="true"></div>
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
          <h2>Operational Cells</h2>
          <p>Each engagement is staffed by specialists across the offensive lifecycle.</p>
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
              <h3>Want to join the team?</h3>
              <p>We hire operators with offensive security experience and relentless curiosity.</p>
            </div>
            <Button variant="secondary" size="large" onClick={() => navigate('/feedback')}>
              Open Roles
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Team;
