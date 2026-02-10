// src/main.jsx

/**
 * Application Entry Point
 * Renders the root App component with all necessary styles
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App.jsx';

// Global styles
import './styles/reset.css';
import './styles/theme.css';
import './styles/global.css';
import './styles/components.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);