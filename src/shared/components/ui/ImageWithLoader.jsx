import React, { useState } from 'react';
import BinaryLoader from './BinaryLoader';
import '../../../styles/shared/components/ui/ImageWithLoader.css';

const ImageWithLoader = ({
  src,
  alt,
  className = '',
  loaderMessage = 'Loading image...',
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`image-with-loader ${loaded ? 'is-loaded' : ''} ${error ? 'is-error' : ''} ${className}`}>
      {!loaded && !error && (
        <div className="image-loader">
          <BinaryLoader size="sm" message={loaderMessage} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        {...props}
      />
    </div>
  );
};

export default ImageWithLoader;
