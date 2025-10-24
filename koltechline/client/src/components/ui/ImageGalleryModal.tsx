import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ExternalLink, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import CustomVideoPlayer from '../CustomVideoPlayer';
import { useVideoPlayback } from '../../contexts/VideoPlaybackContext';

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: {
    url: string;
    filename?: string;
    type: 'image' | 'video';
  }[];
  initialIndex?: number;
  author?: {
    username: string;
    avatar: string;
  };
  onDownloadSuccess?: () => void;
  autoRotate?: boolean; // Control auto-rotation behavior
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  author,
  onDownloadSuccess,
  autoRotate = false
}) => {
  const { setModalOpen } = useVideoPlayback();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [initialIndex]);

  // Notify context when modal opens/closes
  useEffect(() => {
    setModalOpen(isOpen);
    
    return () => {
      // Cleanup when component unmounts
      setModalOpen(false);
    };
  }, [isOpen, setModalOpen]);

  // Reset zoom when changing images
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  // Auto-rotation effect (only if enabled)
  useEffect(() => {
    if (!isOpen || !autoRotate || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, autoRotate, images.length]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          handleResetZoom();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentImage = images[currentIndex];
    if (currentImage) {
      const fullUrl = currentImage.url.startsWith('http') ? currentImage.url : `http://localhost:5005${currentImage.url}`;
      
      try {
        const response = await fetch(fullUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = currentImage.filename || `image_${currentIndex + 1}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        if (onDownloadSuccess) {
          onDownloadSuccess();
        }
      } catch (error) {
        console.error('Download failed:', error);
        // Fallback: open in new tab
        window.open(fullUrl, '_blank');
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (zoom > 1) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setPosition({
        x: (x - 0.5) * (zoom - 1) * -100,
        y: (y - 0.5) * (zoom - 1) * -100
      });
    }
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const imageUrl = currentImage.url.startsWith('http') ? currentImage.url : `http://localhost:5005${currentImage.url}`;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Header */}
      <div
        className="absolute top-0 left-0 right-0 bg-dark-800/80 backdrop-blur-sm border-b border-dark-700 p-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            {author && (
              <>
                <img
                  src={author.avatar}
                  alt={author.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-medium text-sm">{author.username}</p>
                  <p className="text-gray-400 text-xs">
                    {images.length} {images.length === 1 ? 'attachment' : 'attachments'}
                  </p>
                </div>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-white text-sm">
              {currentIndex + 1} / {images.length}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                disabled={zoom <= 0.5}
                className="p-2 bg-dark-700 text-gray-400 rounded-lg hover:text-white hover:bg-dark-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleResetZoom();
                }}
                className="p-2 bg-dark-700 text-gray-400 rounded-lg hover:text-white hover:bg-dark-600 transition-colors"
                title="Reset Zoom (0)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                disabled={zoom >= 5}
                className="p-2 bg-dark-700 text-gray-400 rounded-lg hover:text-white hover:bg-dark-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              
              <div className="text-white text-xs px-2 bg-dark-600 rounded">
                {Math.round(zoom * 100)}%
              </div>
            </div>
            
            <button
              onClick={handleDownload}
              className="p-2 bg-dark-700 text-gray-400 rounded-lg hover:text-white hover:bg-dark-600 transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                const fullUrl = imageUrl;
                window.open(fullUrl, '_blank');
              }}
              className="p-2 bg-dark-700 text-gray-400 rounded-lg hover:text-white hover:bg-dark-600 transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-2 bg-dark-700 text-gray-400 rounded-lg hover:text-white hover:bg-dark-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-dark-800/80 backdrop-blur-sm text-white p-3 rounded-full hover:bg-dark-700 transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-dark-800/80 backdrop-blur-sm text-white p-3 rounded-full hover:bg-dark-700 transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main content */}
      <div className="flex items-center justify-center w-full h-full p-20">
        <div
          className="max-w-5xl max-h-full w-full h-full flex items-center justify-center overflow-hidden"
          onMouseMove={handleMouseMove}
        >
          {currentImage.type === 'image' ? (
            <img
              src={imageUrl}
              alt={currentImage.filename || 'Image'}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-200"
              style={{
                transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                cursor: zoom > 1 ? 'move' : 'zoom-in'
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (zoom === 1) handleZoomIn();
              }}
            />
          ) : (
            <div 
              className="max-w-full max-h-full w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <CustomVideoPlayer
                src={imageUrl}
                className="w-full h-full max-h-[80vh]"
                autoPlay={true}
              />
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          className="absolute bottom-0 left-0 right-0 bg-dark-800/80 backdrop-blur-sm border-t border-dark-700 p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center space-x-2 overflow-x-auto max-w-6xl mx-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-primary-500 opacity-100'
                    : 'border-transparent opacity-60 hover:opacity-80'
                }`}
              >
                {image.type === 'image' ? (
                  <img
                    src={image.url.startsWith('http') ? image.url : `http://localhost:5005${image.url}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={image.url.startsWith('http') ? image.url : `http://localhost:5005${image.url}`}
                    className="w-full h-full object-cover"
                    muted
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ImageGalleryModal;
