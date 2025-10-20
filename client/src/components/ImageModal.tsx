import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';
import ReactDOM from 'react-dom';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  baseUrl?: string;
}

export function ImageModal({ isOpen, onClose, images, initialIndex = 0, baseUrl = 'http://localhost:5006' }: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  // Create a modal root element if it doesn't exist
  useEffect(() => {
    let root = document.getElementById('modal-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'modal-root';
      document.body.appendChild(root);
    }
    setModalRoot(root);

    return () => {
      // Clean up only if we created it
      if (document.getElementById('modal-root') && !document.getElementById('modal-root')?.childElementCount) {
        document.body.removeChild(root!);
      }
    };
  }, []);

  // Handle body scroll locking
  useEffect(() => {
    if (isOpen) {
      // Save the current scroll position and body styles
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      const bodyStyle = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        width: document.body.style.width,
        overflow: document.body.style.overflow
      };

      // Lock the body in place
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = `-${scrollX}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore the body styles and scroll position
        document.body.style.position = bodyStyle.position;
        document.body.style.top = bodyStyle.top;
        document.body.style.left = bodyStyle.left;
        document.body.style.width = bodyStyle.width;
        document.body.style.overflow = bodyStyle.overflow;
        window.scrollTo(scrollX, scrollY);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
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
    if (!imagePath) return '';
    
    if (imagePath.startsWith('/uploads')) {
      return `${baseUrl}${imagePath}`;
    } else if (imagePath.startsWith('http')) {
      return imagePath;
    } else {
      return `${baseUrl}/uploads${imagePath}`;
    }
  };

  if (!isOpen || !images.length || !modalRoot) return null;

  // Use portal to render the modal outside the normal DOM hierarchy
  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 w-screen h-screen bg-black z-[9999999]"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9999999
      }}
    >
      {/* Top controls */}
      <div 
        className="flex justify-between items-center p-4"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 10000000
        }}
      >
        {/* Image Counter */}
        {images.length > 1 && (
          <div className="bg-black/80 text-white px-3 py-1.5 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="bg-black/80 text-white p-3 rounded-full hover:bg-black/90 transition"
          aria-label="Закрыть"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      {/* Main content area */}
      <div 
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        style={{ zIndex: 10000000 }}
      >
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => navigateImage(-1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-black p-3 rounded-full hover:bg-gray-200 transition shadow-lg"
              style={{ 
                zIndex: 10000001,
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
              }}
              aria-label="Предыдущее изображение"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigateImage(1)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-black p-3 rounded-full hover:bg-gray-200 transition shadow-lg"
              style={{ 
                zIndex: 10000001,
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
              }}
              aria-label="Следующее изображение"
            >
              <ChevronRight className="w-6 h-6" />
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
          style={{ cursor: zoomLevel > 1 ? 'grab' : 'default' }}
        >
          <img
            src={getImageUrl(images[currentIndex])}
            alt={`Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            style={{
              transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease',
              cursor: isDragging ? 'grabbing' : zoomLevel > 1 ? 'grab' : 'default'
            }}
            draggable="false"
          />
        </div>
      </div>
      
      {/* Bottom controls */}
      <div 
        className="flex justify-between items-center p-4"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 10000000
        }}
      >
        {/* Download Button */}
        <a
          href={getImageUrl(images[currentIndex])}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black/80 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-black/90 transition"
          onClick={(e) => e.stopPropagation()}
        >
          <Download className="w-5 h-5" />
          <span className="text-sm">Скачать</span>
        </a>
        
        {/* Zoom Controls */}
        <div className="flex items-center space-x-3 bg-black/80 px-4 py-2 rounded-full">
          <button
            onClick={() => handleZoom(-0.1)}
            disabled={zoomLevel <= 0.5}
            className="text-white p-1.5 rounded-full hover:bg-black/50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Уменьшить"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-white text-sm min-w-[40px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => handleZoom(0.1)}
            disabled={zoomLevel >= 3}
            className="text-white p-1.5 rounded-full hover:bg-black/50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Увеличить"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
}
