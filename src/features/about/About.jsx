import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiActivity, FiBookOpen, FiCheckCircle, FiGlobe, FiSearch, FiTarget, FiFileText } from 'react-icons/fi';
import { FaGraduationCap, FaUsers, FaShieldAlt, FaRocket } from 'react-icons/fa';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import Logo from '../../shared/components/common/Logo';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import '../../styles/features/about.css';

const About = () => {
  const navigate = useNavigate();
  useScrollReveal();

  const principles = [
    { icon: FaGraduationCap, title: 'Hands-On Training', description: 'Practical, project-based training rooted in real-world offensive security engagements.' },
    { icon: FaUsers, title: 'Community & Mentorship', description: 'Join an active community to collaborate, get guidance, and continuously sharpen your skills.' },
    { icon: FaShieldAlt, title: 'Evidence-First Approach', description: 'All engagements are backed by reproducible proof to ensure measurable risk reduction.' },
    { icon: FaRocket, title: 'Career-Ready Pathway', description: 'From beginner to professional penetration tester, our programs build skills, experience, and credibility.' }
  ];

  const milestones = [
    { year: '2024', title: 'Platform Build', detail: 'Developed HSOCIETY’s training tools and foundational platform.' },
    { year: '2025', title: 'Community Formation', detail: 'Started the African offensive security group, mentoring local talent.' },
    { year: '2026', title: 'Website & Company Launch', detail: 'Official launch of HSOCIETY online and full service offerings.' }
  ];

  return (
    <div className="about-page">

      {/* Hero */}
      <header className="about-hero reveal-on-scroll">
        <div className="about-hero-content">
          <div className="about-hero-brand">
            <Logo size="large" />
            <div>
              <p className="about-kicker">About HSOCIETY</p>
              <h1>Real-World Offensive Security, Built for Africa.</h1>
              <p>
                HSOCIETY transforms beginners into skilled penetration testers through a cycle of training,
                community collaboration, and supervised real-world engagements. We prioritize execution, measurable results, and career-ready outcomes.
              </p>
            </div>
          </div>
          <div className="about-hero-actions">
            <Button variant="primary" size="large" onClick={() => navigate('/feedback')}>Start a Conversation</Button>
            <Button variant="ghost" size="large" onClick={() => navigate('/team')}>Meet the Team</Button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="about-stats reveal-on-scroll">
        <div className="about-stats-grid">
          <div className="stat-card">
            <FiActivity size={22} />
            <div><h3>500+</h3><span>Critical findings validated</span></div>
          </div>
          <div className="stat-card">
            <FiGlobe size={22} />
            <div><h3>12</h3><span>Countries supported</span></div>
          </div>
          <div className="stat-card">
            <FiCheckCircle size={22} />
            <div><h3>96%</h3><span>Remediation success rate</span></div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="about-principles reveal-on-scroll">
        <div className="about-section-header">
          <Logo size="small" />
          <h2>Our Principles</h2>
          <p>Execution, evidence, and career-impacting outcomes drive every decision we make.</p>
        </div>
        <div className="about-principles-grid">
          {principles.map((item, index) => (
            <Card key={index} padding="large" className="about-principle-card">
              <div className="principle-icon"><item.icon size={26} /></div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Security Cycle */}
     {/* Security Cycle */}
      <section className="about-cycle reveal-on-scroll">
        <div className="about-section-header">
          <Logo size="small" />
          <h2>Our Security Cycle</h2>
          <p>Every engagement follows a continuous loop of reconnaissance, exploitation, reporting, and remediation.</p>
        </div>

        <div className="cycle-container">

          {/* Center label */}
          <div className="cycle-center-label">
            <span>H·SOCIETY</span>
            <span style={{ fontSize: '0.55rem', opacity: 0.5 }}>SEC·OPS</span>
          </div>

          {/* SVG connector lines drawn between the four clock positions */}
          {/* Container is 540×540; nodes sit at: top(270,0) right(540,270) bottom(270,540) left(0,270) */}
          <svg className="cycle-svg" viewBox="0 0 540 540" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="cyc-arrow" markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto">
                <path d="M0,1 L6,3.5 L0,6 Z" fill="rgba(45,212,191,0.75)" />
              </marker>
            </defs>

            {/* Static dashed background edges (clockwise ring) */}
            <line className="topo-edge-bg" x1="270" y1="32"  x2="508" y2="270" />
            <line className="topo-edge-bg" x1="508" y1="270" x2="270" y2="508" />
            <line className="topo-edge-bg" x1="270" y1="508" x2="32"  y2="270" />
            <line className="topo-edge-bg" x1="32"  y1="270" x2="270" y2="32"  />

            {/* Animated flow packets */}
            <line className="topo-edge-flow e1" x1="270" y1="32"  x2="508" y2="270" markerEnd="url(#cyc-arrow)" />
            <line className="topo-edge-flow e2" x1="508" y1="270" x2="270" y2="508" markerEnd="url(#cyc-arrow)" />
            <line className="topo-edge-flow e3" x1="270" y1="508" x2="32"  y2="270" markerEnd="url(#cyc-arrow)" />
            <line className="topo-edge-flow e4" x1="32"  y1="270" x2="270" y2="32"  markerEnd="url(#cyc-arrow)" />
          </svg>

          {/* Nodes */}
          <div className="cycle-step step1">
            <div className="cycle-icon" data-step="01"><FiSearch size={26} /></div>
            <h4>Recon</h4>
            <p>Map assets, attack surface, and risk hotspots.</p>
          </div>

          <div className="cycle-step step2">
            <div className="cycle-icon" data-step="02"><FiTarget size={26} /></div>
            <h4>Exploit</h4>
            <p>Validate weaknesses with controlled proof.</p>
          </div>

          <div className="cycle-step step3">
            <div className="cycle-icon" data-step="03"><FiFileText size={26} /></div>
            <h4>Report</h4>
            <p>Deliver evidence, impact, and fixes.</p>
          </div>

          <div className="cycle-step step4">
            <div className="cycle-icon" data-step="04"><FiCheckCircle size={26} /></div>
            <h4>Remediate</h4>
            <p>Patch, harden, and retest to close gaps.</p>
          </div>

        </div>
      </section>

      {/* Milestones */}
      <section className="about-journey reveal-on-scroll">
        <div className="about-section-header">
          <Logo size="small" />
          <h2>Our Journey</h2>
          <p>Focused milestones that shaped our African offensive security ecosystem.</p>
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

      {/* CTA */}
      <section className="about-cta reveal-on-scroll">
        <Card padding="large" className="about-cta-card">
          <div className="about-cta-content">
            <div className="about-cta-icon"><FiBookOpen size={22} /></div>
            <div>
              <h3>Want a Sample Report?</h3>
              <p>See a redacted engagement to understand the quality and depth of our offensive security work.</p>
            </div>
            <Button variant="secondary" size="large" onClick={() => navigate('/feedback')}>Request Sample</Button>
          </div>
        </Card>
      </section>

    </div>
  );
};

export default About;
