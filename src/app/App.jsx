import React from 'react';
import { AuthProvider } from '../core/auth/AuthContext';
import { ThemeProvider } from './providers';
import AppRouter from './router';

// Import global styles
import '../styles/shared/common.css';
import '../styles/shared/layout.css';
import '../styles/shared/ui.css';

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
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;