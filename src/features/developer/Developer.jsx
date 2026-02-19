import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiActivity, FiCode, FiCpu, FiGitBranch, FiGithub, FiMessageSquare, FiShield, FiTool } from 'react-icons/fi';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import Logo from '../../shared/components/common/Logo';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import developerContent from '../../data/developer.json';
import '../../styles/features/developer.css';

const Developer = () => {
  const navigate = useNavigate();
  useScrollReveal();

  const iconMap = useMemo(() => ({
    FiCode,
    FiTool,
    FiShield,
    FiCpu,
    FiGitBranch,
    FiGithub
  }), []);

  const stack = developerContent.stack.items.map((item) => ({
    ...item,
    icon: iconMap[item.icon]
  }));

  const contributions = developerContent.contributions.items.map((item) => ({
    ...item,
    icon: iconMap[item.icon]
  }));

  return (
    <div className="developer-page">
      <header className="developer-hero reveal-on-scroll">
        <div className="developer-hero-content">
          <Logo size="large" />
          <div>
            <p className="developer-kicker">{developerContent.hero.kicker}</p>
            <h1>{developerContent.hero.title}</h1>
            <p>{developerContent.hero.subtitle}</p>
          </div>
          <Button variant="primary" size="large" onClick={() => navigate(developerContent.hero.route)}>
            {developerContent.hero.button}
          </Button>
        </div>
      </header>

      <section className="developer-stack reveal-on-scroll">
        <div className="developer-section-header">
          <Logo size="small" />
          <h2>{developerContent.stack.title}</h2>
          <p>{developerContent.stack.subtitle}</p>
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
          <h2>{developerContent.contributions.title}</h2>
          <p>{developerContent.contributions.subtitle}</p>
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
              <h3>{developerContent.cta.title}</h3>
              <p>{developerContent.cta.subtitle}</p>
            </div>
            <Button variant="secondary" size="large" onClick={() => navigate(developerContent.cta.route)}>
              {developerContent.cta.button}
            </Button>
          </div>
        </Card>
        <div className="developer-contact">
          <FiMessageSquare size={18} />
          <span>{developerContent.cta.contact}</span>
        </div>
      </section>
    </div>
  );
};

export default Developer;
