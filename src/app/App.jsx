import React from 'react';
import { AuthProvider } from '../core/auth/AuthContext';
import { ThemeProvider } from './providers';
import AppRouter from './router';
import PwaUpdatePrompt from '../shared/components/ui/PwaUpdatePrompt';
import FloatingUpdateButton from '../shared/components/ui/FloatingUpdateButton';
import { runSecurityScan } from '../core/security-tests/scan.runner';

// Import global styles
import '../styles/shared/common.css';
import '../styles/shared/layout.css';
import '../styles/shared/ui.css';
import '../styles/shared/components/layout/AppShell.css';

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
    runSecurityScan();
    const interval = window.setInterval(() => {
      runSecurityScan();
    }, 10 * 60 * 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="app-shell">
          <AppRouter />
          <PwaUpdatePrompt />
          <FloatingUpdateButton />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
