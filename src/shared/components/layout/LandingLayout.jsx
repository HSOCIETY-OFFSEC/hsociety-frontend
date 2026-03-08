import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import FloatingUtilityToolbar from '../ui/FloatingUtilityToolbar';
import useScrollReveal from '../../hooks/useScrollReveal';
import '../../../styles/shared/components/layout/LandingLayout.css';

/**
 * Landing Layout
 * Location: src/shared/components/layout/LandingLayout.jsx
 *
 * Full-width layout for marketing and hero pages.
 * - Sticky Navbar stays accessible during long hero scrolls.
 * - .landing-main has no default padding; child <section>s manage their
 *   own vertical spacing so hero sections can bleed full edge-to-edge.
 * - Scroll-reveal hook is scoped to .landing-layout.
 * - FloatingUtilityToolbar overlays the page, rendered outside <main>.
 *
 * Note: LandingLayout does NOT import PageLayout.css because it owns its
 * own root (.landing-layout) rather than using .page-container — this
 * preserves full-bleed control without conflicting with shared styles.
 */
const LandingLayout = () => {
  const location = useLocation();
  useScrollReveal('.reveal-on-scroll', {}, [location.pathname], '.landing-layout');

  return (
    <div className="landing-layout">
      <Navbar sticky={true} />
      <main className="landing-main">
        <Outlet />
      </main>
      <FloatingUtilityToolbar />
    </div>
  );
};

export default LandingLayout;