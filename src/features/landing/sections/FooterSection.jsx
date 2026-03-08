import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBarChart2,
  FiClipboard,
  FiCode,
  FiFileText,
  FiGlobe,
  FiLayers,
  FiMessageSquare,
  FiPhone,
  FiShield,
  FiTarget,
  FiTerminal,
  FiUsers,
  FiZap
} from 'react-icons/fi';
import { getSocialLinks } from '../../../config/social.config';
import Logo from '../../../shared/components/common/Logo';
import landingContent from '../../../data/landing.json';
import { slugify } from '../../../shared/utils/slugify';
import '../../../styles/landing/footer.css';
import { subscribeNewsletter } from '../landing.service';
import { getPublicErrorMessage } from '../../../shared/utils/publicError';

const FooterSection = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleSubscribe = async (event) => {
    event.preventDefault();
    setStatus(null);

    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    if (!trimmedEmail) {
      setStatus({ type: 'error', message: 'Please provide an email address.' });
      return;
    }

    setLoading(true);
    try {
      const response = await subscribeNewsletter({ email: trimmedEmail, source: 'landing' });
      if (!response.success) {
        setStatus({
          type: 'error',
          message: getPublicErrorMessage({ action: 'submit', response })
        });
        return;
      }

      setStatus({ type: 'success', message: response.data?.message || 'Subscribed successfully.' });
      setEmail('');
    } catch (err) {
      setStatus({
        type: 'error',
        message: getPublicErrorMessage({ action: 'submit', response: err })
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="you@company.com"
              aria-label="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="footer-newsletter-button"
              disabled={loading}
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {status && (
            <p
              className={`footer-newsletter-status ${status.type}`}
              role="status"
              aria-live="polite"
            >
              {status.message}
            </p>
          )}
          <p className="footer-privacy">No spam. Unsubscribe anytime.</p>
        </div>
      </div>

      <div className="footer-content">
        <div className="footer-column">
          <h4>Services</h4>
          {landingContent.services.slice(0, 4).map((service) => (
            <Link key={service.title} to={`/services/${slugify(service.title)}`}>
              <FiShield size={16} />
              {service.title}
            </Link>
          ))}
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          <Link to="/about">
            <FiUsers size={16} />
            About Us
          </Link>
          <Link to="/team">
            <FiUsers size={16} />
            Meet the Team
          </Link>
          <Link to="/student-dashboard">
            <FiTerminal size={16} />
            Student Dashboard
          </Link>
          <Link to="/contact">
            <FiMessageSquare size={16} />
            Contact
          </Link>
          <Link to="/developer">
            <FiCode size={16} />
            Meet the Developer
          </Link>
          <Link to="/careers">
            <FiClipboard size={16} />
            Careers & Opportunities
          </Link>
          <Link to="/pricing">
            <FiBarChart2 size={16} />
            Pricing
          </Link>
          <Link to="/courses">
            <FiTerminal size={16} />
            Courses
          </Link>
        </div>

        <div className="footer-column">
          <h4>Resources</h4>
          <Link to="/case-studies">
            <FiFileText size={16} />
            Case Studies
          </Link>
          <Link to="/methodology">
            <FiLayers size={16} />
            Testing Methodology
          </Link>
          <Link to="/blog">
            <FiBarChart2 size={16} />
            Field Notes
          </Link>
          <Link to="/leaderboard">
            <FiBarChart2 size={16} />
            Leaderboard
          </Link>
          <Link to="/courses">
            <FiLayers size={16} />
            Courses
          </Link>
          <Link to="/student-dashboard">
            <FiTerminal size={16} />
            Student Dashboard
          </Link>
          <Link to="/terms">
            <FiFileText size={16} />
            Terms & Conditions
          </Link>
        </div>

        <div className="footer-column">
          <h4>Contact</h4>
          <a href="mailto:hsocietyoffsec@gmail.com">
            <FiMessageSquare size={16} />
            hsocietyoffsec@gmail.com
          </a>
          <a href="tel:+233 504 500 337">
            <FiPhone size={16} />
            +233 504 500 337
          </a>
          <span className="footer-address">
            <FiGlobe size={16} />
            Remote-first across Africa
          </span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 HSOCIETY. All rights reserved.</p>
        <p>Train Like A Hacker. Prepare For Hackers</p>
        <div className="footer-build" />
        <div className="footer-socials">
          {getSocialLinks().map((link) => {
            const Icon = link.icon;
            return (
              <a key={link.key} href={link.href} aria-label={link.label} target="_blank" rel="noreferrer">
                <Icon size={18} />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  </footer>
  );
};

export default FooterSection;
