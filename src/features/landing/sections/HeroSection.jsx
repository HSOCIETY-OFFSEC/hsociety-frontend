import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiAlertTriangle,
  FiArrowRight,
  FiArrowUpRight,
  FiCheckCircle,
  FiLock,
  FiMessageSquare,
  FiShield,
  FiTerminal
} from 'react-icons/fi';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import '../../../styles/features/landing/hero.css';

const HeroSection = ({ content }) => {
  const navigate = useNavigate();
  const { badge, title, description, highlights, ctas, trust } = content;

  return (
    <section className="hero-section">
      <div className="hero-video-bg" aria-hidden="true">
        <span className="hero-bg-layer layer-1" />
        <span className="hero-bg-layer layer-2" />
        <span className="hero-bg-layer layer-3" />
      </div>
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            {badge}
          </div>
          
          <h1 className="hero-title">{title}</h1>
          
          <p className="hero-description">{description}</p>

          <div className="hero-highlights">
            {highlights.map((item) => (
              <div key={item} className="hero-highlight">
                <FiCheckCircle size={16} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="hero-cta">
            {ctas.map((cta, index) => (
              <Button
                key={cta.label}
                variant={cta.variant}
                size="large"
                onClick={() => navigate(cta.route)}
              >
                {cta.label}
                {index === 0 ? <FiArrowUpRight size={18} /> : <FiArrowRight size={18} />}
              </Button>
            ))}
          </div>

          <div className="hero-proof">
            <div className="hero-proof-item">
              <span className="proof-value">500+</span>
              <span className="proof-label">validated findings</span>
            </div>
            <div className="hero-proof-item">
              <span className="proof-value">96%</span>
              <span className="proof-label">remediation success</span>
            </div>
            <div className="hero-proof-item">
              <span className="proof-value">12</span>
              <span className="proof-label">countries supported</span>
            </div>
          </div>

          <div className="trust-indicators">
            {trust.map((item, index) => (
              <div key={item} className="trust-item">
                <span className="trust-icon">
                  {index === 0 && <FiShield size={18} />}
                  {index === 1 && <FiCheckCircle size={18} />}
                  {index === 2 && <FiLock size={18} />}
                </span>
                <span className="trust-text">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <Card hover3d={true} padding="large" className="hero-card">
            <div className="terminal">
              <div className="terminal-header">
                <span className="terminal-dot red"></span>
                <span className="terminal-dot yellow"></span>
                <span className="terminal-dot green"></span>
                <span className="terminal-title">hsociety_ops.sh</span>
              </div>
              <div className="terminal-body">
                <div className="terminal-line command">
                  <span className="prompt">root@kali:~#</span> ./launch --target edge-api.company
                </div>
                <div className="terminal-line success">
                  <span className="icon"><FiCheckCircle size={16} /></span> nmap -sV -Pn edge-api.company
                </div>
                <div className="terminal-line success">
                  <span className="icon"><FiCheckCircle size={16} /></span> httpx <span className="terminal-arrow"><FiArrowRight size={14} /></span> 4 endpoints, 2 auth surfaces
                </div>
                <div className="terminal-line warning critical">
                  <span className="icon"><FiAlertTriangle size={16} /></span> sqlmap: injectable param `id` (critical)
                </div>
                <div className="terminal-line warning">
                  <span className="icon"><FiAlertTriangle size={16} /></span> lateral: weak JWT signing key (high)
                </div>
                <div className="terminal-line command">
                  <span className="prompt">root@kali:~#</span> chain: auth bypass <span className="terminal-arrow"><FiArrowRight size={14} /></span> data exfil <span className="terminal-arrow"><FiArrowRight size={14} /></span> report
                </div>
                <div className="terminal-cursor">▊</div>
              </div>
            </div>
            <div className="terminal-footer">
              <div className="terminal-chip">
                <FiTerminal size={14} />
                <span>Live Attack Simulation</span>
              </div>
              <div className="terminal-chip subtle">
                <FiMessageSquare size={14} />
                <span>Remediation Advisory</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
