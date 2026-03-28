import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LuBriefcase,
  LuBookOpen,
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

const FooterSection = () => {
  const navigate = useNavigate();

  const groups = [
    {
      title: 'Platform',
      links: [
        { label: 'Home', path: '/', icon: LuHouse },
        { label: 'Courses', path: '/courses', icon: LuLayers },
        { label: 'Services', path: '/services', icon: LuShield },
        { label: 'ZeroDay Market', path: '/marketplace', icon: LuBookOpen },
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
    <footer className="reveal-on-scroll border-t border-border bg-bg-secondary py-12 text-sm text-text-secondary" id="footer">
      <div className="section-container">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
          <div>
            <Logo size="large" />
            <p className="mt-3 text-text-secondary">Real training. Real engagements. Verified delivery.</p>
            <div className="mt-4 flex gap-2">
              {getSocialLinks().map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.key}
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-bg-tertiary text-text-secondary transition-colors hover:border-brand hover:text-brand motion-reduce:transition-none"
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
            <div key={group.title} className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-brand">{group.title}</span>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => navigate(link.path)}
                      className="group inline-flex items-center gap-1 text-text-secondary transition-colors hover:text-brand"
                    >
                      <span className="inline-flex items-center text-text-tertiary transition-colors group-hover:text-text-primary" aria-hidden="true">
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

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border pt-2 text-text-tertiary md:flex-row">
          <span>© {new Date().getFullYear()} HSOCIETY OFFSEC. All rights reserved.</span>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--primary-color)_35%,var(--border-color))] bg-[color-mix(in_srgb,var(--primary-color)_8%,var(--bg-secondary))] px-3 py-2 text-xs text-brand transition-colors hover:border-brand hover:bg-[color-mix(in_srgb,var(--primary-color)_16%,var(--bg-secondary))]"
            onClick={() => navigate('/register')}
          >
            Join as Student <LuChevronRight size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
