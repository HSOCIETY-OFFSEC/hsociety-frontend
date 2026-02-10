// src/shared/components/layout/Footer.jsx

/**
 * Footer Component
 * Application footer with branding and links
 */

import { HiShieldCheck, HiMail, HiLocationMarker } from 'react-icons/hi';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import './layout.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <HiShieldCheck size={32} style={{ color: 'var(--accent-primary)' }} />
              <span className="footer-brand-name">Hsociety</span>
            </div>
            <p className="footer-tagline">
              Elite Offensive Security Solutions
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-section">
              <h4 className="footer-section-title">Contact</h4>
              <div className="footer-contact">
                <HiMail size={16} />
                <span>contact@hsociety.com</span>
              </div>
              <div className="footer-contact">
                <HiLocationMarker size={16} />
                <span>Global Operations</span>
              </div>
            </div>

            <div className="footer-section">
              <h4 className="footer-section-title">Follow Us</h4>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="GitHub">
                  <FaGithub size={20} />
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <FaTwitter size={20} />
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-text">
            © {currentYear} Hsociety. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;