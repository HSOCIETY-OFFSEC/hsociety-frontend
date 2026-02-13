import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiActivity, FiBookOpen, FiCheckCircle, FiGlobe, FiShield, FiTarget, FiUsers } from 'react-icons/fi';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import Logo from '../../shared/components/common/Logo';
import Navbar from '../../shared/components/layout/Navbar';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import '../../styles/features/about.css';

const About = () => {
  const navigate = useNavigate();
  useScrollReveal();

  const principles = [
    {
      icon: FiTarget,
      title: 'Evidence-First',
      description: 'We validate every finding with reproducible proof, not theory.'
    },
    {
      icon: FiShield,
      title: 'Operational Security',
      description: 'We protect your environments and data with strict isolation.'
    },
    {
      icon: FiUsers,
      title: 'Team Collaboration',
      description: 'We work alongside your engineers, not above them.'
    }
  ];

  const milestones = [
    // { year: '2021', title: 'First Engagements', detail: 'Launched offensive security for regional fintechs.' },
    // { year: '2022', title: 'Red Team Expansion', detail: 'Built multi-disciplinary adversary simulation squads.' },
    // { year: '2023', title: 'Community Training', detail: 'Sponsored local security workshops across Africa.' },
    { year: '2024', title: 'Platform Build', detail: 'Building of security Tools and plartform Building' },
    { year: '2025', title: 'Initiation', detail: 'Main Hsociety Initiation. Creating of Hacking Group' },
    { year: '2026', title: 'Website Launch and Comapany Launch'}
  ];

  return (
    <div className="about-page">
      <Navbar />
      <header className="about-hero reveal-on-scroll">
        <div className="about-hero-content">
          <div className="about-hero-brand">
            <Logo size="large" />
            <div>
              <p className="about-kicker">About HSOCIETY</p>
              <h1>Built for real-world offensive security.</h1>
              <p>
                We are an African-centric offensive security team focused on measurable risk reduction,
                with engagements that prioritize execution over marketing.
              </p>
            </div>
          </div>
          <div className="about-hero-actions">
            <Button variant="primary" size="large" onClick={() => navigate('/feedback')}>
              Start a Conversation
            </Button>
            <Button variant="ghost" size="large" onClick={() => navigate('/team')}>
              Meet the Team
            </Button>
          </div>
        </div>
      </header>

      <section className="about-stats reveal-on-scroll">
        <div className="about-stats-grid">
          <div className="stat-card">
            <FiActivity size={22} />
            <div>
              <h3>500+</h3>
              <span>Critical findings validated</span>
            </div>
          </div>
          <div className="stat-card">
            <FiGlobe size={22} />
            <div>
              <h3>12</h3>
              <span>Countries supported</span>
            </div>
          </div>
          <div className="stat-card">
            <FiCheckCircle size={22} />
            <div>
              <h3>96%</h3>
              <span>Remediation rate</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-principles reveal-on-scroll">
        <div className="about-section-header">
          <Logo size="small" />
          <h2>Our Principles</h2>
          <p>Decisions are driven by evidence, execution, and practical outcomes.</p>
        </div>
        <div className="about-principles-grid">
          {principles.map((item, index) => (
            <Card key={index} padding="large" className="about-principle-card">
              <div className="principle-icon">
                <item.icon size={26} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="about-journey reveal-on-scroll">
        <div className="about-section-header">
          <Logo size="small" />
          <h2>Our Journey</h2>
          <p>Focused milestones that shaped our offensive security craft.</p>
        </div>
        <div className="about-timeline">
          {milestones.map((item, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-year">{item.year}</div>
              <div className="timeline-content">
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-cta reveal-on-scroll">
        <Card padding="large" className="about-cta-card">
          <div className="about-cta-content">
            <div className="about-cta-icon">
              <FiBookOpen size={22} />
            </div>
            <div>
              <h3>Want a sample report?</h3>
              <p>We can share a redacted sample so your team knows what to expect.</p>
            </div>
            <Button variant="secondary" size="large" onClick={() => navigate('/feedback')}>
              Request Sample
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default About;
