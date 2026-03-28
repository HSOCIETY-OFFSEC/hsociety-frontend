import React from 'react';
import { getSocialLinks } from '../../../config/app/social.config';

const SocialLinks = ({ className = '', size = 18, showLabels = false, variant = 'inline' }) => {
  const links = getSocialLinks();
  if (!links.length) return null;

  const wrapper =
    variant === 'list'
      ? 'flex flex-col items-start gap-3'
      : 'flex flex-wrap items-center gap-3';

  const linkBase =
    variant === 'list'
      ? 'inline-flex items-center gap-2 text-text-secondary hover:text-text-primary'
      : 'inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-secondary text-text-primary transition-transform duration-150 hover:-translate-y-0.5';

  return (
    <div className={`${wrapper} ${className}`.trim()}>
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.key}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label}
            className={linkBase}
          >
            <Icon size={size} />
            {showLabels && <span className="text-sm">{link.label}</span>}
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
