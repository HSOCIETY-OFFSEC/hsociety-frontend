import React from 'react';
import { AuthProvider } from '../core/auth/AuthContext';
import { ThemeProvider } from './providers/ThemeProvider';
import AppRouter from './router';
import PwaUpdatePrompt from '../shared/components/ui/PwaUpdatePrompt';
import CookieConsent from '../shared/components/ui/CookieConsent';
import NotificationConsent from '../shared/components/ui/NotificationConsent';
import { runSecurityScan } from '../core/security/scan.runner';
import RankBadgeProvider from '../shared/components/providers/RankBadgeProvider';
import { NotificationProvider } from '../shared/components/providers/NotificationProvider';
import { envConfig } from '../config/app/env.config';
import AnalyticsHead from '../shared/components/seo/AnalyticsHead';

// Import global styles
import '../styles/globals.css';
import '../shared/components/layout/AppShell.css';

/**
 * Main App Component
 * Location: src/app/App.jsx
 * 
 * Features:
 * - Combines all providers
 * - Initializes routing
 * - Loads global styles
 * - Error boundary (future)
 * 
 * Structure:
 * ThemeProvider → AuthProvider → Router → Components
 */

const App = () => {
  React.useEffect(() => {
    const isDev = import.meta.env.DEV;
    const runtimeEnabled = envConfig.security.enableRuntimeScan;
    const sampleRate = Number(envConfig.security.runtimeScanSampleRate || 0);

    if (!isDev && !runtimeEnabled) return undefined;
    if (!isDev && sampleRate > 0 && Math.random() > sampleRate) return undefined;

    runSecurityScan();
    const interval = window.setInterval(() => {
      runSecurityScan();
    }, 30 * 60 * 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <RankBadgeProvider>
          <NotificationProvider>
            <div className="app-shell">
              <AnalyticsHead />
              <AppRouter />
              <PwaUpdatePrompt />
              <CookieConsent />
              <NotificationConsent />
            </div>
          </NotificationProvider>
        </RankBadgeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
