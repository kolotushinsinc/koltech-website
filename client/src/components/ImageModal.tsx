import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  baseUrl?: string;
}

export function ImageModal({ isOpen, onClose, images, initialIndex = 0, baseUrl = 'https://api.koltech.dev' }: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    
    // Блокируем прокрутку страницы при открытии модального окна
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          navigateImage(-1);
          break;
        case 'ArrowRight':
          navigateImage(1);
          break;
        case '+':
        case '=':
          handleZoom(0.1);
          break;
        case '-':
        case '_':
          handleZoom(-0.1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const navigateImage = (direction: number) => {
    setCurrentIndex(prev => {
      const newIndex = prev + direction;
      if (newIndex < 0) return images.length - 1;
      if (newIndex >= images.length) return 0;
      return newIndex;
    });
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => {
      const newZoom = Math.max(0.5, Math.min(3, prev + delta));
      if (newZoom <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    // Prevent event propagation if we're dragging
    if (!isDragging && zoomLevel === 1) {
      // Close the modal when clicking on the image
      onClose();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('/uploads')) {
      return `${baseUrl}${imagePath}`;
    } else if (imagePath.startsWith('http')) {
      return imagePath;
    } else {
      return `${baseUrl}/uploads${imagePath}`;
    }
  };

  if (!isOpen || !images.length) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[99999] flex flex-col" style={{ height: '100vh' }}>
      {/* Top controls */}
      <div className="flex justify-between items-center p-3 sm:p-4 bg-black/70">
        {/* Image Counter */}
        {images.length > 1 && (
          <div className="bg-black/80 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm z-20">
            {currentIndex + 1} / {images.length}
          </div>
        )}
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="bg-black/80 text-white p-2 sm:p-2.5 rounded-full hover:bg-black/90 transition z-20"
          aria-label="Закрыть"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </button>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden p-2 sm:p-4">
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => navigateImage(-1)}
              className="absolute left-1 sm:left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/80 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/90 transition z-20"
              aria-label="Предыдущее изображение"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={() => navigateImage(1)}
              className="absolute right-1 sm:right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/80 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/90 transition z-20"
              aria-label="Следующее изображение"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
          </>
        )}

        {/* Image Container */}
        <div
          className="relative overflow-hidden max-w-full max-h-full flex items-center justify-center"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: zoomLevel > 1 ? 'grab' : 'pointer' }}
        >
          <img
            src={getImageUrl(images[currentIndex])}
            alt={`Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            style={{
              transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease',
              cursor: isDragging ? 'grabbing' : zoomLevel > 1 ? 'grab' : 'pointer'
            }}
            draggable="false"
            onClick={handleImageClick}
          />
        </div>
      </div>
      
      {/* Bottom controls */}
      <div className="flex justify-center p-3 sm:p-4 bg-black/70">
        {/* Zoom Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3 bg-black/80 px-3 sm:px-4 py-2 rounded-full z-20">
          <button
            onClick={() => handleZoom(-0.1)}
            disabled={zoomLevel <= 0.5}
            className="text-white p-1 sm:p-1.5 rounded-full hover:bg-black/50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Уменьшить"
          >
            <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <span className="text-white text-xs sm:text-sm min-w-[35px] sm:min-w-[40px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => handleZoom(0.1)}
            disabled={zoomLevel >= 3}
            className="text-white p-1 sm:p-1.5 rounded-full hover:bg-black/50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Увеличить"
          >
            <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}