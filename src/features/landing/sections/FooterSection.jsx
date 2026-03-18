import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LuCircle } from 'react-icons/lu';
import Logo from '../../../shared/components/common/Logo';
import { getSocialLinks } from '../../../config/social.config';
import './footer.css';

const FooterSection = () => {
  const navigate = useNavigate();

  const groups = [
    {
      title: 'Platform',
      links: [
        { label: 'Home', path: '/' },
        { label: 'Courses', path: '/courses' },
        { label: 'Services', path: '/services' },
        { label: 'Leaderboard', path: '/leaderboard' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', path: '/about' },
        { label: 'Team', path: '/team' },
        { label: 'Careers', path: '/careers' },
        { label: 'Contact', path: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms', path: '/terms' },
        { label: 'Feedback', path: '/feedback' },
      ],
    },
  ];

  return (
    <footer className="footer-section reveal-on-scroll" id="footer">
      <div className="section-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo size="large" />
            <p>Real training. Real engagements. Verified delivery.</p>
            <div className="footer-socials">
              {getSocialLinks().map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.key}
                    type="button"
                    className="footer-social"
                    onClick={() => window.open(link.href, '_blank', 'noreferrer')}
                    aria-label={link.label}
                  >
                    <Icon size={16} />
                  </button>
                );
              })}
            </div>
          </div>

          {groups.map((group) => (
            <div key={group.title} className="footer-group">
              <span>{group.title}</span>
              <ul>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <button type="button" onClick={() => navigate(link.path)}>
                      <span className="footer-link-icon" aria-hidden="true">
                        <LuCircle size={10} />
                      </span>
                      <span>{link.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} HSOCIETY. All rights reserved.</span>
          <span className="footer-theme">Theme: System</span>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
