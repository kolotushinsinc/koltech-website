import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
  showCloseButton?: boolean;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'md',
  showCloseButton = true
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;
  
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      case '2xl': return 'max-w-2xl';
      case '3xl': return 'max-w-3xl';
      case '4xl': return 'max-w-4xl';
      case '5xl': return 'max-w-5xl';
      case '6xl': return 'max-w-6xl';
      case '7xl': return 'max-w-7xl';
      default: return 'max-w-md';
    }
  };
  
  // Create portal to render modal outside of the component hierarchy
  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className={`bg-dark-800 border border-dark-700 rounded-xl p-6 w-full ${getMaxWidthClass()} max-h-[90vh] overflow-y-auto shadow-xl animate-scale`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-dark-300 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        )}
        
        <div>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
