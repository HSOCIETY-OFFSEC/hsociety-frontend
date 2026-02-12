import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';
import Logo from '../../shared/components/common/Logo';
import ThemeToggle from '../../shared/components/common/ThemeToggle';
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
  const { isAuthenticated } = useAuth();

  const services = [
    {
      icon: '🔒',
      title: 'Penetration Testing',
      description: 'Comprehensive security assessments to identify vulnerabilities before attackers do.',
      features: ['Web Applications', 'Mobile Apps', 'Network Infrastructure', 'API Security']
    },
    {
      icon: '📋',
      title: 'Security Audits',
      description: 'In-depth analysis and reporting of your security posture with actionable remediation steps.',
      features: ['Compliance Checks', 'Risk Assessment', 'Detailed Reports', 'Remediation Support']
    },
    {
      icon: '🛡️',
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
      icon: '🎯',
      title: 'Real-World Experience',
      description: 'Our team has hands-on experience with actual offensive security operations.'
    },
    {
      icon: '🌍',
      title: 'African-Centric Approach',
      description: 'Understanding local contexts, threats, and compliance requirements.'
    },
    {
      icon: '🔬',
      title: 'Thorough Methodology',
      description: 'We follow OWASP, PTES, and other industry-standard testing frameworks.'
    },
    {
      icon: '📊',
      title: 'Detailed Reporting',
      description: 'Clear, actionable reports with step-by-step remediation guidance.'
    },
    {
      icon: '🤝',
      title: 'Community-Driven',
      description: 'Training and deploying the next generation of security professionals.'
    },
    {
      icon: '⚡',
      title: 'Fast Response',
      description: 'Critical security issues are addressed within 24 hours.'
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <Logo size="medium" />
          
          <div className="nav-actions">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button variant="primary" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button variant="primary" onClick={() => navigate('/login')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Offensive Security Platform
            </div>
            
            <h1 className="hero-title">
              Real Attacks.
              <br />
              <span className="hero-title-accent">Real Fixes.</span>
            </h1>
            
            <p className="hero-description">
              Professional penetration testing and security audits that go beyond compliance.
              We find vulnerabilities before the bad actors do.
            </p>
            
            <div className="hero-cta">
              <Button 
                variant="primary" 
                size="large"
                onClick={() => navigate('/login')}
              >
                Request Pentest
              </Button>
              <Button 
                variant="secondary" 
                size="large"
                onClick={() => navigate('/feedback')}
              >
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="trust-indicators">
              <div className="trust-item">
                <span className="trust-icon">🔒</span>
                <span className="trust-text">ISO 27001 Compliant</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">✓</span>
                <span className="trust-text">OWASP Certified</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🛡️</span>
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
                  <span className="terminal-title">security_scan.sh</span>
                </div>
                <div className="terminal-body">
                  <div className="terminal-line">
                    <span className="prompt">$</span> ./scan --target webapp.com
                  </div>
                  <div className="terminal-line success">
                    <span className="icon">✓</span> Port scan complete: 5 open ports
                  </div>
                  <div className="terminal-line success">
                    <span className="icon">✓</span> Vulnerability scan: 12 issues found
                  </div>
                  <div className="terminal-line warning">
                    <span className="icon">⚠</span> Critical: SQL Injection detected
                  </div>
                  <div className="terminal-line warning">
                    <span className="icon">⚠</span> High: XSS vulnerability found
                  </div>
                  <div className="terminal-line">
                    <span className="prompt">$</span> Generating report...
                  </div>
                  <div className="terminal-cursor">▊</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="section-container">
          <div className="section-header-center">
            <h2 className="section-title-large">Our Services</h2>
            <p className="section-subtitle-large">
              Comprehensive security testing tailored to your needs
            </p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <Card key={index} hover3d={true} padding="large" className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>
                      <span className="feature-check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" fullWidth style={{ marginTop: 'auto' }}>
                  Learn More →
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-section">
        <div className="section-container">
          <div className="section-header-center">
            <h2 className="section-title-large">Why Choose HSOCIETY?</h2>
            <p className="section-subtitle-large">
              Execution over marketing. Proof over promises.
            </p>
          </div>

          <div className="why-grid">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="why-item">
                <div className="why-icon">{item.icon}</div>
                <h4 className="why-title">{item.title}</h4>
                <p className="why-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <Card padding="large" className="cta-card">
            <div className="cta-content">
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
                  variant="secondary" 
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
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <Logo size="medium" />
              <p className="footer-tagline">
                Real, in-depth, African-centric offensive security.
              </p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Services</h4>
                <a href="#services">Penetration Testing</a>
                <a href="#services">Security Audits</a>
                <a href="#services">Red Team Ops</a>
              </div>

              <div className="footer-column">
                <h4>Company</h4>
                <a href="#about">About Us</a>
                <a href="/feedback">Contact</a>
                <a href="#careers">Careers</a>
              </div>

              <div className="footer-column">
                <h4>Legal</h4>
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
                <a href="#security">Security</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2025 HSOCIETY. All rights reserved.</p>
            <p>Execution over marketing. Proof over promises.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;