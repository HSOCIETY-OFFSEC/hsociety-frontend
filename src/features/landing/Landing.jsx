import React from 'react';
import { useNavigate } from 'react-router-dom';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import { FiActivity, FiAlertTriangle, FiArrowRight, FiArrowUpRight, FiBarChart2, FiBookOpen, FiCheck, FiCheckCircle, FiClipboard, FiCode, FiCpu, FiFileText, FiGlobe, FiGithub, FiLayers, FiLinkedin, FiLock, FiMessageSquare, FiPhone, FiSearch, FiShield, FiTarget, FiTerminal, FiTwitter, FiUsers, FiZap } from 'react-icons/fi';
import Logo from '../../shared/components/common/Logo';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import '../../styles/features/landing.css';

/**
 * Landing Page Component
 * Location: src/features/landing/Landing.jsx
 * 
 * Features:
 * - Hero section with CTA
 * - Services showcase
 * - Why choose us section
 * - Security-focused design
 * - Smooth animations
 */

const Landing = () => {
  const navigate = useNavigate();
  useScrollReveal();

  const services = [
    {
      icon: FiShield,
      title: 'Penetration Testing',
      description: 'Comprehensive security assessments to identify vulnerabilities before attackers do.',
      features: ['Web Applications', 'Mobile Apps', 'Network Infrastructure', 'API Security']
    },
    {
      icon: FiFileText,
      title: 'Security Audits',
      description: 'In-depth analysis and reporting of your security posture with actionable remediation steps.',
      features: ['Compliance Checks', 'Risk Assessment', 'Detailed Reports', 'Remediation Support']
    },
    {
      icon: FiTarget,
      title: 'Red Team Operations',
      description: 'Real-world attack simulations to test your defenses and incident response capabilities.',
      features: ['Social Engineering', 'Physical Security', 'Threat Simulation', 'Custom Scenarios']
    }
  ];

  const stats = [
    { value: '500+', label: 'Vulnerabilities Found' },
    { value: '50+', label: 'Clients Secured' },
    { value: '100%', label: 'Success Rate' },
    { value: '24/7', label: 'Support Available' }
  ];

  const whyChooseUs = [
    {
      icon: FiTarget,
      title: 'Real-World Experience',
      description: 'Our team has hands-on experience with actual offensive security operations.'
    },
    {
      icon: FiGlobe,
      title: 'African-Centric Approach',
      description: 'Understanding local contexts, threats, and compliance requirements.'
    },
    {
      icon: FiCpu,
      title: 'Thorough Methodology',
      description: 'We follow OWASP, PTES, and other industry-standard testing frameworks.'
    },
    {
      icon: FiBarChart2,
      title: 'Detailed Reporting',
      description: 'Clear, actionable reports with step-by-step remediation guidance.'
    },
    {
      icon: FiUsers,
      title: 'Community-Driven',
      description: 'Training and deploying the next generation of security professionals.'
    },
    {
      icon: FiZap,
      title: 'Fast Response',
      description: 'Critical security issues are addressed within 24 hours.'
    }
  ];

  const engagementSteps = [
    {
      icon: FiClipboard,
      title: 'Scope & Threat Model',
      description: 'Define assets, access paths, and crown-jewel risks before testing begins.',
      meta: '1-2 days'
    },
    {
      icon: FiSearch,
      title: 'Recon & Exploitation',
      description: 'Enumerate the attack surface and validate exploitable weaknesses.',
      meta: '3-10 days'
    },
    {
      icon: FiLayers,
      title: 'Privilege & Impact',
      description: 'Demonstrate real-world impact through controlled privilege escalation.',
      meta: '2-5 days'
    },
    {
      icon: FiCheckCircle,
      title: 'Report & Retest',
      description: 'Deliver fix-ready guidance with optional verification of remediation.',
      meta: '3-5 days'
    }
  ];

  const deliverables = [
    {
      icon: FiFileText,
      title: 'Executive Narrative',
      description: 'Risk framing, business impact, and a board-ready summary.'
    },
    {
      icon: FiTerminal,
      title: 'Proof-of-Exploit Pack',
      description: 'Repro steps, evidence, and safe PoC artifacts.'
    },
    {
      icon: FiLock,
      title: 'Retest Validation',
      description: 'Verification of fixes with updated risk scoring.'
    },
    {
      icon: FiMessageSquare,
      title: 'Remediation Workshop',
      description: 'Live walkthroughs and fix guidance with your engineers.'
    }
  ];

  const learningModules = [
    {
      title: 'Foundation: Hacker Mindset',
      description: 'Linux, networking, and tooling fundamentals with guided labs.',
      level: 'Starter',
      duration: '2 weeks'
    },
    {
      title: 'Web App Exploitation',
      description: 'OWASP Top 10, API testing, and real bug chains in sandboxes.',
      level: 'Intermediate',
      duration: '4 weeks'
    },
    {
      title: 'Cloud & Infrastructure',
      description: 'IAM attacks, misconfigurations, and lateral movement drills.',
      level: 'Advanced',
      duration: '3 weeks'
    },
    {
      title: 'Red Team Labs',
      description: 'End-to-end simulations with reporting and remediation.',
      level: 'Elite',
      duration: '4 weeks'
    }
  ];

  const trustSignals = [
    {
      title: 'African-Centric Threat Modeling',
      description: 'We map regional attack patterns and compliance realities.'
    },
    {
      title: 'Affordable, High-Value Engagements',
      description: 'Premium expertise without the global-enterprise price tag.'
    },
    {
      title: 'Proof-Driven Reporting',
      description: 'Every finding includes evidence, impact, and fix-ready steps.'
    }
  ];

  const pathways = [
    {
      title: 'Learners',
      description: 'Join structured modules, weekly challenges, and mentorship.',
      cta: 'Start Learning',
      path: '/student-dashboard'
    },
    {
      title: 'Corporate Teams',
      description: 'Get offensive security that matches your real-world risk.',
      cta: 'Request Pentest',
      path: '/login'
    }
  ];

  const cycleSteps = [
    { title: 'Recon', description: 'Map assets, attack surface, and risk hotspots.' },
    { title: 'Exploit', description: 'Validate weaknesses with controlled proof.' },
    { title: 'Report', description: 'Deliver evidence, impact, and fixes.' },
    { title: 'Remediate', description: 'Patch, harden, and retest.' },
    { title: 'Verify', description: 'Confirm closure and updated risk score.' }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-video-bg" aria-hidden="true">
          <span className="hero-bg-layer layer-1" />
          <span className="hero-bg-layer layer-2" />
          <span className="hero-bg-layer layer-3" />
        </div>
        <div className="hero-container">
          <div className="hero-content">
            {/* <div className="hero-brand">
              <Logo size="xlarge" className="hero-logo" />
              <div>
                <p className="hero-brand-kicker">HSOCIETY OffSec</p>
                <p className="hero-brand-sub">Elite offensive security for fast-moving teams.</p>
              </div>
            </div> */}

            <div className="hero-badge">
              <span className="badge-dot"></span>
              Zero-Trust Offensive Operations
            </div>
            
            <h1 className="hero-title">
              HSOCIETY
              <br />
              <span>REAL HACKING.</span>
              <br />
              <span className="hero-title-accent">REAL SECURITY </span>
            </h1>
            
            <p className="hero-description">
              Professional penetration testing and security audits that go beyond compliance.
              We find vulnerabilities before the bad actors do.
            </p>

            <div className="hero-highlights">
              <div className="hero-highlight">
                <FiCheckCircle size={16} />
                <span>Executive-ready reporting in 7-14 days</span>
              </div>
              <div className="hero-highlight">
                <FiShield size={16} />
                <span>Risk reduction mapped to CVSS and MITRE</span>
              </div>
              <div className="hero-highlight">
                <FiZap size={16} />
                <span>Critical findings escalated within 24 hours</span>
              </div>
            </div>

            <div className="hero-cta">
              <Button 
                variant="primary" 
                size="large"
                onClick={() => navigate('/login')}
              >
                Request Pentest
                <FiArrowUpRight size={18} />
              </Button>
              <Button 
                variant="secondary" 
                size="large"
                onClick={() => navigate('/feedback')}
              >
                Learn More
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

            {/* Trust Indicators */}
            <div className="trust-indicators">
              <div className="trust-item">
                <span className="trust-icon">
                  <FiShield size={18} />
                </span>
                <span className="trust-text">ISO 27001 Compliant</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">
                  <FiCheckCircle size={18} />
                </span>
                <span className="trust-text">OWASP Certified</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">
                  <FiLock size={18} />
                </span>
                <span className="trust-text">100% Confidential</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
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

      {/* Stats Section */}
      <section className="stats-section reveal-on-scroll">
        <div className="stats-container">
          <div className="stats-brand">
            <Logo size="small" className="stats-logo" />
            <p>Trusted offensive security partner</p>
          </div>
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section reveal-on-scroll">
        <div className="section-container">
          <div className="section-header-center">
            <div className="section-eyebrow">
              <Logo size="small" />
              <span>Offensive Capabilities</span>
            </div>
            <h2 className="section-title-large">Our Services</h2>
            <p className="section-subtitle-large">
              Comprehensive security testing tailored to your needs
            </p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <Card
                key={index}
                hover3d={true}
                padding="large"
                className={`service-card reveal-on-scroll service-card-${index + 1}`}
              >
                <div className="service-icon">
                  <service.icon size={28} />
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>
                      <span className="feature-check">
                        <FiCheck size={16} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="card" size="small" fullWidth style={{ marginTop: 'auto' }}>
                  Learn More <FiArrowRight className='service-btn-arrow' size={16} />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-section reveal-on-scroll">
        <div className="section-container">
          <div className="section-header-center">
            <div className="section-eyebrow">
              <Logo size="small" />
              <span>Why HSOCIETY</span>
            </div>
            <h2 className="section-title-large">Why Choose HSOCIETY?</h2>
            <p className="section-subtitle-large">
              Execution over marketing. Proof over promises.
            </p>
          </div>

          <div className="why-grid">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="why-item reveal-on-scroll">
                <div className="why-icon">
                  <item.icon size={28} />
                </div>
                <h4 className="why-title">{item.title}</h4>
                <p className="why-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Process Section */}
      <section className="process-section reveal-on-scroll">
        <div className="section-container">
          <div className="section-header-center">
            <div className="section-eyebrow">
              <Logo size="small" />
              <span>Engagement Flow</span>
            </div>
            <h2 className="section-title-large">Built for Clarity and Speed</h2>
            <p className="section-subtitle-large">
              Every engagement follows a structured, evidence-driven process.
            </p>
          </div>

          <div className="process-grid">
            {engagementSteps.map((step, index) => (
              <Card key={index} padding="large" className="process-card reveal-on-scroll">
                <div className="process-header">
                  <div className="process-icon">
                    <step.icon size={26} />
                  </div>
                  <div className="process-meta">{step.meta}</div>
                </div>
                <h3 className="process-title">{step.title}</h3>
                <p className="process-description">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables Section */}
      <section className="deliverables-section reveal-on-scroll">
        <div className="section-container">
          <div className="section-header-center">
            <div className="section-eyebrow">
              <Logo size="small" />
              <span>Outcome Driven</span>
            </div>
            <h2 className="section-title-large">What You Receive</h2>
            <p className="section-subtitle-large">
              Clear documentation and hands-on guidance for lasting fixes.
            </p>
          </div>

          <div className="deliverables-grid">
            {deliverables.map((item, index) => (
              <Card key={index} padding="large" className="deliverable-card reveal-on-scroll">
                <div className="deliverable-icon">
                  <item.icon size={26} />
                </div>
                <h3 className="deliverable-title">{item.title}</h3>
                <p className="deliverable-description">{item.description}</p>
              </Card>
            ))}
          </div>

          <div className="deliverables-highlight">
            <div className="highlight-item">
              <FiActivity size={18} />
              <span>Live status updates during testing</span>
            </div>
            <div className="highlight-item">
              <FiShield size={18} />
              <span>Risk scoring aligned with CVSS and MITRE</span>
            </div>
            <div className="highlight-item">
              <FiCheck size={18} />
              <span>Actionable fixes prioritized by impact</span>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Modules Section */}
      <section className="modules-section reveal-on-scroll">
        <div className="section-container">
          <div className="section-header-center">
            <div className="section-eyebrow">
              <Logo size="small" />
              <span>Learning Modules</span>
            </div>
            <h2 className="section-title-large">Hands-On Hacker Curriculum</h2>
            <p className="section-subtitle-large">
              Structured modules designed to build real offensive security skills with African context.
            </p>
          </div>

          <div className="modules-grid">
            {learningModules.map((module, index) => (
              <Card key={module.title} padding="large" className="module-card reveal-on-scroll">
                <div className="module-meta">
                  <span className="module-level">{module.level}</span>
                  <span className="module-duration">{module.duration}</span>
                </div>
                <h3 className="module-title">{module.title}</h3>
                <p className="module-description">{module.description}</p>
                <div className="module-footer">
                  <FiTerminal size={16} />
                  <span>Interactive labs + CTFs</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section reveal-on-scroll">
        <div className="section-container">
          <div className="section-header-center">
            <div className="section-eyebrow">
              <Logo size="small" />
              <span>Why Trust HSOCIETY</span>
            </div>
            <h2 className="section-title-large">Real Hacking For African Companies</h2>
            <p className="section-subtitle-large">
              We deliver high-value, affordable offensive security for teams that need clarity, speed, and proof.
            </p>
          </div>

          <div className="trust-grid">
            {trustSignals.map((item) => (
              <Card key={item.title} padding="large" className="trust-card reveal-on-scroll">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pathways Section */}
      <section className="pathways-section reveal-on-scroll">
        <div className="section-container">
          <div className="pathways-grid">
            {pathways.map((pathway) => (
              <Card key={pathway.title} padding="large" className="pathway-card reveal-on-scroll">
                <h3>{pathway.title}</h3>
                <p>{pathway.description}</p>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => navigate(pathway.path)}
                >
                  {pathway.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pentest Cycle Section */}
      <section className="cycle-section reveal-on-scroll">
        <div className="section-container">
          <div className="section-header-center">
            <div className="section-eyebrow">
              <Logo size="small" />
              <span>Pentest Cycle</span>
            </div>
            <h2 className="section-title-large">From Penetration to Fix, End-to-End</h2>
            <p className="section-subtitle-large">
              A continuous loop that moves findings into verified remediation.
            </p>
          </div>

          <div className="cycle-layout">
            <div className="cycle-orbit">
              <div className="cycle-ring">
                {cycleSteps.map((step, index) => (
                  <div key={step.title} className={`cycle-node cycle-node-${index + 1}`}>
                    <span>{step.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cycle-list">
              {cycleSteps.map((step, index) => (
                <div key={step.title} className="cycle-item">
                  <div className="cycle-index">{index + 1}</div>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section reveal-on-scroll">
        <div className="cta-container">
          <Card padding="large" className="cta-card">
            <div className="cta-content">
              <div className="cta-logo">
                <Logo size="large" />
              </div>
              <h2 className="cta-title">Ready to Secure Your Systems?</h2>
              <p className="cta-description">
                Get started with a free consultation and discover your security vulnerabilities
                before attackers do.
              </p>
              <div className="cta-buttons">
                <Button 
                  variant="primary" 
                  size="large"
                  onClick={() => navigate('/login')}
                >
                  Request Pentest
                </Button>
                <Button 
                  variant="ghost" 
                  size="large"
                  onClick={() => navigate('/feedback')}
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer reveal-on-scroll">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <Logo size="medium" />
              <p className="footer-tagline">
                Real, in-depth, African-centric offensive security.
              </p>
              <div className="footer-status">
                <span className="status-chip">
                  <FiShield size={14} />
                  Zero-Trust Ops
                </span>
                <span className="status-chip">
                  <FiCheckCircle size={14} />
                  Verified Reporting
                </span>
                <span className="status-chip">
                  <FiZap size={14} />
                  24h Critical Response
                </span>
              </div>
            </div>

            <div className="footer-newsletter">
              <h4>Get the Offensive Brief</h4>
              <p>Monthly tactics, case studies, and critical advisories.</p>
              <div className="footer-newsletter-form">
                <input
                  type="email"
                  placeholder="you@company.com"
                  aria-label="Email address"
                />
                <button type="button" className="footer-newsletter-button">
                  Subscribe
                </button>
              </div>
              <p className="footer-privacy">No spam. Unsubscribe anytime.</p>
            </div>
          </div>

          <div className="footer-content">
            <div className="footer-column">
              <h4>Services</h4>
              <a href="/pentest">
                <FiShield size={16} />
                Penetration Testing
              </a>
              <a href="/audits">
                <FiFileText size={16} />
                Security Audits
              </a>
              <a href="/pentest">
                <FiTarget size={16} />
                Red Team Ops
              </a>
              <a href="/pentest">
                <FiGlobe size={16} />
                API & Cloud Testing
              </a>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <a href="/about">
                <FiUsers size={16} />
                About Us
              </a>
              <a href="/team">
                <FiUsers size={16} />
                Meet the Team
              </a>
              <a href="/community">
                <FiMessageSquare size={16} />
                Community
              </a>
              <a href="/student-dashboard">
                <FiBookOpen size={16} />
                Student Dashboard
              </a>
              <a href="/feedback">
                <FiMessageSquare size={16} />
                Contact
              </a>
              <a href="/developer">
                <FiCode size={16} />
                Meet the Developer
              </a>
              <a href="/careers">
                <FiClipboard size={16} />
                Careers & Opportunities
              </a>
              <a href="/community">
                <FiZap size={16} />
                Community
              </a>
            </div>

            <div className="footer-column">
              <h4>Resources</h4>
              <a href="/case-studies">
                <FiFileText size={16} />
                Case Studies
              </a>
              <a href="/methodology">
                <FiLayers size={16} />
                Testing Methodology
              </a>
              <a href="/blog">
                <FiBarChart2 size={16} />
                Field Notes
              </a>
              <a href="/student-dashboard">
                <FiTerminal size={16} />
                Student Dashboard
              </a>
            </div>

            <div className="footer-column">
              <h4>Contact</h4>
              <a href="mailto:ops@hsociety.africa">
                <FiMessageSquare size={16} />
                ops@hsociety.africa
              </a>
              <a href="tel:+254700000000">
                <FiPhone size={16} />
                +254 700 000 000
              </a>
              <span className="footer-address">
                <FiGlobe size={16} />
                Remote-first across Africa
              </span>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 HSOCIETY. All rights reserved.</p>
            <p>Execution over marketing. Proof over promises.</p>
            <div className="footer-socials">
              <a href="#linkedin" aria-label="LinkedIn">
                <FiLinkedin size={18} />
              </a>
              <a href="#twitter" aria-label="Twitter">
                <FiTwitter size={18} />
              </a>
              <a href="#github" aria-label="GitHub">
                <FiGithub size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
