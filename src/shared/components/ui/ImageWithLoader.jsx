import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import './ImageWithLoader.css';

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
    <div className={`image-with-loader ${loaded ? 'is-loaded' : ''} ${error ? 'is-error' : ''} ${className}`}>
      {!loaded && !error && (
        <div className="image-loader">
          <Loader size="sm" label={loaderMessage} />
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={imgClassName}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

export default ImageWithLoader;
