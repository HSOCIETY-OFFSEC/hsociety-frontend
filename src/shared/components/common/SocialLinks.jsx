import React from 'react';
import { getSocialLinks } from '../../../config/social.config';
import '../../../styles/shared/social-links.css';

const SocialLinks = ({ className = '', size = 18, showLabels = false, variant = 'inline' }) => {
  const links = getSocialLinks();
  if (!links.length) return null;

  return (
    <div className={`social-links social-links-${variant} ${className}`.trim()}>
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.key}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label}
            className="social-link"
          >
            <Icon size={size} />
            {showLabels && <span>{link.label}</span>}
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
