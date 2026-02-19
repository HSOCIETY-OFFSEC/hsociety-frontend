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
  FiTerminal,
  FiZap
} from 'react-icons/fi';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import '../../../styles/features/landing/hero.css';

const HeroSection = () => {
  const navigate = useNavigate();

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
            Offensive Security Training + Delivery
          </div>
          
          <h1 className="hero-title">
            Build Real Offensive Security Talent. Deliver Real Penetration Testing.
          </h1>
          
          <p className="hero-description">
            HSOCIETY is a cycle-based cybersecurity platform that trains beginners, integrates them into a community,
            deploys them into supervised real-world engagements, and converts them into professional penetration testers.
          </p>

          <div className="hero-highlights">
            <div className="hero-highlight">
              <FiCheckCircle size={16} />
              <span>Paid training designed for complete beginners</span>
            </div>
            <div className="hero-highlight">
              <FiShield size={16} />
              <span>Supervised real-world engagements with reporting</span>
            </div>
            <div className="hero-highlight">
              <FiZap size={16} />
              <span>Professional pathway from student to pentester</span>
            </div>
          </div>

          <div className="hero-cta">
            <Button 
              variant="primary" 
              size="large"
              onClick={() => navigate('/register')}
            >
              Start Learning Offensive Security
              <FiArrowUpRight size={18} />
            </Button>
            <Button 
              variant="secondary" 
              size="large"
              onClick={() => navigate('/corporate/pentest')}
            >
              Request a Penetration Test
              <FiArrowRight size={18} />
            </Button>
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
            <div className="trust-item">
              <span className="trust-icon">
                <FiShield size={18} />
              </span>
              <span className="trust-text">Two clear paths: Students + Companies</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">
                <FiCheckCircle size={18} />
              </span>
              <span className="trust-text">Supervised by senior offensive operators</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">
                <FiLock size={18} />
              </span>
              <span className="trust-text">Engagements delivered with verified evidence</span>
            </div>
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
