import React, { useEffect, useState } from 'react';
import Logo from '../common/Logo';
import BinaryLoader from './BinaryLoader';

/**
 * Page Loader
 * Location: src/shared/components/ui/PageLoader.jsx
 *
 * Lightweight full-page loader with brand emphasis.
 */

const PageLoader = ({
  message = 'Initializing secure workspace...',
  durationMs = 33,
  onComplete
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!durationMs) return undefined;
    const timeout = setTimeout(() => {
      setVisible(false);
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }, Math.max(0, durationMs));

    return () => clearTimeout(timeout);
  }, [durationMs, onComplete]);

  if (!visible) return null;

   return (
    <div className="page-loader" role="status" aria-live="polite">
      <div className="page-loader-inner">
        <Logo size="large" className="page-loader-logo" />
        <BinaryLoader size="md" message={message} />
        <div className="page-loader-bar" />
        <p className="page-loader-text">Establishing secure link...</p>
      </div>
    </div>
  );
};

export default PageLoader;
