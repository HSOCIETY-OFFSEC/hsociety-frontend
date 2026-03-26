import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LuBriefcase,
  LuChevronRight,
  LuFileText,
  LuHouse,
  LuMail,
  LuShield,
  LuUsers,
  LuLayers,
} from 'react-icons/lu';
import Logo from '../../../../shared/components/common/Logo';
import { getSocialLinks } from '../../../../config/app/social.config';
import '../../styles/sections/footer.css';

const FooterSection = () => {
  const navigate = useNavigate();

  const groups = [
    {
      title: 'Platform',
      links: [
        { label: 'Home', path: '/', icon: LuHouse },
        { label: 'Courses', path: '/courses', icon: LuLayers },
        { label: 'Services', path: '/services', icon: LuShield },
        { label: 'Leaderboard', path: '/leaderboard', icon: LuUsers },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', path: '/about', icon: LuBriefcase },
        { label: 'Team', path: '/team', icon: LuUsers },
        { label: 'Careers', path: '/careers', icon: LuBriefcase },
        { label: 'Contact', path: '/contact', icon: LuMail },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms', path: '/terms', icon: LuFileText },
        { label: 'Privacy', path: '/privacy', icon: LuShield },
        { label: 'Feedback', path: '/feedback', icon: LuMail },
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
                        {link.icon ? <link.icon size={14} /> : null}
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
          <span>© {new Date().getFullYear()} HSOCIETY OFFSEC. All rights reserved.</span>
          <button type="button" className="footer-cta" onClick={() => navigate('/register')}>
            Join as Student <LuChevronRight size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
