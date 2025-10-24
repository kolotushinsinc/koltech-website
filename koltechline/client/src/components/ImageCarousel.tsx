import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  attachments: {
    type: 'image' | 'video' | 'gif' | 'sticker';
    url: string;
    filename?: string;
  }[];
  onImageClick: (index: number) => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ attachments, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? attachments.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === attachments.length - 1 ? 0 : prev + 1));
  };

  const currentAttachment = attachments[currentIndex];
  const imageUrl = currentAttachment.url.startsWith('http') 
    ? currentAttachment.url 
    : `http://localhost:5005${currentAttachment.url}`;

  return (
    <div className="mt-4 relative group">
      {/* Carousel Container with Blur Background */}
      <div 
        className="relative rounded-xl overflow-hidden bg-dark-900 cursor-pointer"
        style={{ height: '400px' }}
        onClick={() => onImageClick(currentIndex)}
      >
        {/* Blurred Background */}
        <div 
          className="absolute inset-0 blur-2xl opacity-50 scale-110"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Main Image/Video - Centered with object-contain */}
        <div className="relative w-full h-full flex items-center justify-center">
          {currentAttachment.type === 'image' ? (
            <img
              src={imageUrl}
              alt={currentAttachment.filename || 'Attachment'}
              className="max-w-full max-h-full object-contain relative z-10"
            />
          ) : (
            <video
              src={imageUrl}
              className="max-w-full max-h-full object-contain relative z-10"
              preload="metadata"
            />
          )}
        </div>

        {/* Navigation Arrows - Only show if more than 1 image */}
        {attachments.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-dark-900/80 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-dark-900 z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-dark-900/80 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-dark-900 z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Counter - Top Right */}
        {attachments.length > 1 && (
          <div className="absolute top-3 right-3 bg-dark-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium z-20">
            {currentIndex + 1}/{attachments.length}
          </div>
        )}

        {/* Dots Indicator - Bottom Center */}
        {attachments.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-20">
            {attachments.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-white w-6' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;
