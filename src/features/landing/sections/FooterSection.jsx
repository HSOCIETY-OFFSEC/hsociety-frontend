import React from 'react';
import {
  FiBarChart2,
  FiClipboard,
  FiCode,
  FiFileText,
  FiGithub,
  FiGlobe,
  FiLayers,
  FiLinkedin,
  FiMessageSquare,
  FiPhone,
  FiShield,
  FiTarget,
  FiTerminal,
  FiTwitter,
  FiUsers,
  FiZap
} from 'react-icons/fi';
import Logo from '../../../shared/components/common/Logo';
import '../../../styles/features/landing/footer.css';

const FooterSection = () => (
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
              <FiFileText size={14} />
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
            <FiTerminal size={16} />
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
);

export default FooterSection;
