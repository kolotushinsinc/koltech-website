import React, { useState } from 'react';

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  className?: string;
  skeletonClassName?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({
  src,
  alt,
  className = '',
  skeletonClassName = '',
  onClick,
  style
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="relative overflow-hidden">
      {isLoading && (
        <div
          className={`absolute inset-0 bg-dark-800 animate-pulse-slow ${skeletonClassName}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 animate-shimmer"></div>
        </div>
      )}
      
      {hasError ? (
        <div className={`flex items-center justify-center bg-dark-800 ${className}`}>
          <div className="text-center p-4">
            <div className="text-gray-400 mb-2">Изображение не загрузилось</div>
            <button 
              onClick={() => {
                setIsLoading(true);
                setHasError(false);
              }}
              className="text-primary-500 hover:text-primary-400 text-sm"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
          onClick={onClick}
          style={style}
        />
      )}
    </div>
  );
};

export default ImageWithLoader;