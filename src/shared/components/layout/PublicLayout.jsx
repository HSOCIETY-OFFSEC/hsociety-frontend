import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import ScrollToTopButton from '../ui/ScrollToTopButton';
import useScrollReveal from '../../hooks/useScrollReveal';
import AnnouncementBanner from '../../../features/landing/components/AnnouncementBanner';
import PublicPageLoader from '../public/PublicPageLoader';

/**
 * Public Layout
 * Location: src/shared/components/layout/PublicLayout.jsx
 *
 * Public informational pages use the landing-style layout.
 * - Announcement banner + transparent sticky nav.
 * - Full-bleed sections controlled by each page.
 * - Scroll-reveal hook scoped to .landing-layout.
 */
const PublicLayout = () => {
  const location = useLocation();
  useScrollReveal('.reveal-on-scroll', { threshold: 0.1 }, [location.pathname], '.landing-layout');

  return (
    <div className="landing-layout relative flex min-h-screen flex-col">
      <AnnouncementBanner />
      <Navbar sticky={true} logoSrc="/logo-nav-banner.png" transparentOnTop={false} />
      <main
        className="landing-main flex w-full flex-1 flex-col"
        style={{ paddingTop: 'calc(var(--navbar-height, 64px) + var(--ann-banner-height, 0px) + 0.5rem)' }}
      >
        <Suspense fallback={<PublicPageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <ScrollToTopButton />
    </div>
  );
};

export default PublicLayout;
