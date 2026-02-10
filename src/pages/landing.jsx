// src/shared/pages/Landing.jsx

/**
 * Landing Page
 * Public homepage showcasing Hsociety services
 */

import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';
import { 
  HiShieldCheck, 
  HiLightningBolt, 
  HiChartBar,
  HiArrowRight,
  HiCheckCircle
} from 'react-icons/hi';
import { 
  FaBug, 
  FaUserSecret, 
  FaSearch 
} from 'react-icons/fa';
import './landing.css';

const Landing = () => {
  const features = [
    {
      title: 'Penetration Testing',
      description: 'Comprehensive security assessments to identify vulnerabilities before attackers do.',
      icon: <FaBug size={40} />,
      color: '#ff4444',
    },
    {
      title: 'Red Team Operations',
      description: 'Advanced adversary simulation to test your defense capabilities.',
      icon: <FaUserSecret size={40} />,
      color: '#ff8844',
    },
    {
      title: 'Security Audits',
      description: 'In-depth analysis of your security posture and compliance requirements.',
      icon: <FaSearch size={40} />,
      color: '#00ff88',
    },
  ];

  const benefits = [
    'Real-world attack simulations',
    'Comprehensive vulnerability reports',
    'Expert security recommendations',
    '24/7 support and monitoring',
  ];

  return (
    <div className="page landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <HiShieldCheck size={20} />
            <span>Trusted by Security Professionals</span>
          </div>
          
          <div className="hero-logo-container">
            <Logo className="hero-logo" style={{ height: '100px' }} />
          </div>
          
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">Hsociety</span>
          </h1>
          
          <p className="hero-subtitle">
            Elite Offensive Security Solutions
          </p>
          
          <p className="hero-description">
            We specialize in advanced penetration testing, red team operations, and security assessments 
            to help organizations strengthen their security posture against evolving threats.
          </p>
          
          <div className="hero-actions">
            <Link to="/signup">
              <button className="btn btn-primary btn-lg">
                Get Started
                <HiArrowRight size={20} />
              </button>
            </Link>
            <Link to="/login">
              <button className="btn btn-secondary btn-lg">
                <HiLightningBolt size={20} />
                Login
              </button>
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <HiChartBar size={24} style={{ color: 'var(--accent-primary)' }} />
              <div>
                <div className="stat-number">500+</div>
                <div className="stat-text">Projects Completed</div>
              </div>
            </div>
            <div className="hero-stat">
              <HiShieldCheck size={24} style={{ color: 'var(--accent-primary)' }} />
              <div>
                <div className="stat-number">1000+</div>
                <div className="stat-text">Vulnerabilities Found</div>
              </div>
            </div>
            <div className="hero-stat">
              <HiLightningBolt size={24} style={{ color: 'var(--accent-primary)' }} />
              <div>
                <div className="stat-number">99.9%</div>
                <div className="stat-text">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Comprehensive security solutions tailored to your needs
          </p>
        </div>
        
        <div className="grid grid-3">
          {features.map((feature, index) => (
            <div key={index} className="feature-card card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="feature-icon" style={{ color: feature.color }}>
                {feature.icon}
              </div>
              <h3 className="card-title">{feature.title}</h3>
              <p className="card-body">{feature.description}</p>
              <div className="feature-link">
                Learn More <HiArrowRight />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-content">
          <div className="benefits-text">
            <h2 className="section-title">Why Choose Hsociety?</h2>
            <p className="section-subtitle">
              We provide cutting-edge offensive security services to protect your organization
            </p>
            <ul className="benefits-list">
              {benefits.map((benefit, index) => (
                <li key={index} className="benefit-item">
                  <HiCheckCircle size={24} style={{ color: 'var(--accent-primary)' }} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Link to="/signup">
              <button className="btn btn-primary mt-3">
                Start Your Security Journey
                <HiArrowRight size={20} />
              </button>
            </Link>
          </div>
          <div className="benefits-visual">
            <div className="visual-card">
              <HiShieldCheck size={120} style={{ color: 'var(--accent-primary)', opacity: 0.2 }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;