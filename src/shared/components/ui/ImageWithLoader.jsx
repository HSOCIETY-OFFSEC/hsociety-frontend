import React, { useEffect, useState } from 'react';
import Loader from './Loader';

const ImageWithLoader = ({
  src,
  alt,
  fallbackSrc = '',
  className = '',
  imgClassName = '',
  loaderMessage = 'Loading image...',
  onLoad,
  onError,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
    setLoaded(false);
    setError(false);
  }, [src]);

  const handleLoad = (event) => {
    setLoaded(true);
    if (onLoad) onLoad(event);
  };

  const handleError = (event) => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setLoaded(false);
      setError(false);
      return;
    }
    setError(true);
    setLoaded(true);
    if (onError) onError(event);
  };

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-md bg-[color-mix(in_srgb,var(--input-bg)_85%,transparent)] ${className}`}
    >
      {!loaded && !error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[linear-gradient(140deg,rgb(var(--brand-rgb)/0.08),rgb(var(--brand-rgb)/0.04))] p-4">
          <Loader size="sm" label={loaderMessage} />
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={`block h-full w-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

export default ImageWithLoader;
