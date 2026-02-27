import React from 'react';
import { FiArrowUpRight, FiBriefcase, FiClock, FiCompass, FiFlag, FiMapPin } from 'react-icons/fi';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import '../../styles/sections/careers/index.css';

const Careers = () => {
  useScrollReveal();

  const roles = [
    {
      title: 'Junior Security Analyst',
      location: 'Remote - Africa',
      type: 'Full-time',
      level: 'Entry',
      focus: 'SOC, incident response, triage.'
    },
    {
      title: 'Offensive Security Intern',
      location: 'Remote - Africa',
      type: 'Internship',
      level: 'Student',
      focus: 'Recon, tooling, module development.'
    },
    {
      title: 'Red Team Operator',
      location: 'Remote - Africa',
      type: 'Contract',
      level: 'Senior',
      focus: 'Adversary simulation, opsec.'
    }
  ];

  return (
    <div className="careers-page">
        <header className="careers-hero reveal-on-scroll">
          <div>
            <p className="careers-kicker">Careers</p>
            <h1>Build offensive security from Africa, for the world.</h1>
            <p>Join teams that ship real work, grow real talent, and build resilience.</p>
            <div className="careers-hero-meta">
              <div>
                <span className="meta-value">Remote-first</span>
                <span className="meta-label">across Africa</span>
              </div>
              <div>
                <span className="meta-value">Training</span>
                <span className="meta-label">module delivery</span>
              </div>
              <div>
                <span className="meta-value">Impact</span>
                <span className="meta-label">critical infrastructure</span>
              </div>
            </div>
          </div>
          <Button variant="primary" size="large">
            <FiCompass size={18} />
            See Open Roles
          </Button>
        </header>

        <section className="careers-grid reveal-on-scroll">
          {roles.map((role) => (
            <Card key={role.title} padding="large" className="careers-card">
              <div className="careers-card-header">
                <FiBriefcase size={20} />
                <h3>{role.title}</h3>
              </div>
              <p>{role.focus}</p>
              <div className="careers-meta">
                <span><FiMapPin size={14} /> {role.location}</span>
                <span><FiClock size={14} /> {role.type}</span>
                <span><FiFlag size={14} /> {role.level}</span>
              </div>
              <Button variant="ghost" size="small">
                Apply Now <FiArrowUpRight size={16} />
              </Button>
            </Card>
          ))}
        </section>
    </div>
  );
};

export default Careers;
