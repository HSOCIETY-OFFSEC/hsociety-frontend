import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';

/**
 * Main Entry Point
 * Location: src/main.jsx
 * 
 * Initializes the React application and mounts it to the DOM
 */

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element. Make sure index.html has a div with id="root"');
}

// Create root and render app
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Log successful mount in development
if (import.meta.env.DEV) {
  console.log('HSOCIETY MVP loaded successfully');
  console.log('Environment:', import.meta.env.MODE);
}
