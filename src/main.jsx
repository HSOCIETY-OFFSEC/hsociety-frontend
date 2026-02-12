// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App.jsx';
import Providers from './app/providers.jsx';
import './styles/shared/ui.css';
import './styles/shared/layout.css';
import './styles/core/auth.css';
import './styles/features/dashboard.css';
import './styles/features/audits.css';
import './styles/features/feedback.css';
import './styles/features/pentest.css';
import './styles/shared/common.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Wrap App with Providers for theme, auth, etc.
root.render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);
