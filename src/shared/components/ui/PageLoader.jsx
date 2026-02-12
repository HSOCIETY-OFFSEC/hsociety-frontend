import React from 'react';
import Logo from '../common/Logo';

/**
 * Page Loader
 * Location: src/shared/components/ui/PageLoader.jsx
 *
 * Lightweight full-page loader with brand emphasis.
 */

const PageLoader = ({ message = 'Initializing secure workspace...' }) => {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <div className="page-loader-inner">
        <Logo size="large" className="page-loader-logo" />
        <div className="page-loader-bar" />
        <p className="page-loader-text">{message}</p>
      </div>
    </div>
  );
};

export default PageLoader;
