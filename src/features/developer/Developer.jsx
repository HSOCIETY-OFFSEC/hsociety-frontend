import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiActivity, FiCode, FiCpu, FiGitBranch, FiGithub, FiMessageSquare, FiShield, FiTool } from 'react-icons/fi';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import Logo from '../../shared/components/common/Logo';
import Navbar from '../../shared/components/layout/Navbar';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import '../../styles/features/developer.css';

const Developer = () => {
  const navigate = useNavigate();
  useScrollReveal();

  const stack = [
    { title: 'Web', detail: 'React, Vite, Tailwind-free custom CSS', icon: FiCode },
    { title: 'Ops', detail: 'Docker, GitHub Actions, IaC pipelines', icon: FiTool },
    { title: 'Security', detail: 'OWASP, MITRE, offensive validation', icon: FiShield }
  ];

  const contributions = [
    { title: 'Tooling', detail: 'Automated recon and evidence capture.', icon: FiCpu },
    { title: 'Reporting', detail: 'Templates that translate technical risk.', icon: FiGitBranch },
    { title: 'Community', detail: 'Mentorship and open-source contributions.', icon: FiGithub }
  ];

  return (
    <div className="developer-page">
      <Navbar />
      <header className="developer-hero reveal-on-scroll">
        <div className="developer-hero-content">
          <Logo size="large" />
          <div>
            <p className="developer-kicker">Meet the Developer</p>
            <h1>Building secure, fast, and focused products.</h1>
            <p>
              This page highlights the engineering approach that powers HSOCIETY OffSec.
            </p>
          </div>
          <Button variant="primary" size="large" onClick={() => navigate('/feedback')}>
            Reach Out
          </Button>
        </div>
      </header>

      <section className="developer-stack reveal-on-scroll">
        <div className="developer-section-header">
          <Logo size="small" />
          <h2>Technical Stack</h2>
          <p>Modern, composable tooling built for speed and clarity.</p>
        </div>
        <div className="developer-grid">
          {stack.map((item, index) => (
            <Card key={index} padding="large" className="developer-card">
              <div className="developer-card-icon">
                <item.icon size={26} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="developer-contributions reveal-on-scroll">
        <div className="developer-section-header">
          <Logo size="small" />
          <h2>Engineering Contributions</h2>
          <p>Focused on reliability, automation, and security outcomes.</p>
        </div>
        <div className="developer-grid">
          {contributions.map((item, index) => (
            <Card key={index} padding="large" className="developer-card">
              <div className="developer-card-icon">
                <item.icon size={26} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="developer-cta reveal-on-scroll">
        <Card padding="large" className="developer-cta-card">
          <div className="developer-cta-content">
            <div className="developer-cta-icon">
              <FiActivity size={22} />
            </div>
            <div>
              <h3>Want to collaborate?</h3>
              <p>We welcome partnerships, talks, and research contributions.</p>
            </div>
            <Button variant="secondary" size="large" onClick={() => navigate('/feedback')}>
              Start a Conversation
            </Button>
          </div>
        </Card>
        <div className="developer-contact">
          <FiMessageSquare size={18} />
          <span>ops@hsociety.africa</span>
        </div>
      </section>
    </div>
  );
};

export default Developer;
