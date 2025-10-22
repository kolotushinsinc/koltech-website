import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 4000
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'error': return <XCircle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      case 'info': return <Info className="w-5 h-5" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success': 
        return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'error': 
        return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'warning': 
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'info': 
        return 'bg-primary-500/20 border-primary-500/30 text-primary-400';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-6 z-[9999] animate-slide-in-right">
      <div className={`
        min-w-[320px] max-w-md p-4 rounded-xl border backdrop-blur-sm
        bg-dark-800/90 shadow-2xl
        ${getColorClasses()}
        transition-all duration-300 ease-out
      `}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm leading-relaxed">
              {message}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Progress bar */}
        {duration > 0 && (
          <div className="mt-3 w-full bg-dark-600 rounded-full h-1 overflow-hidden">
            <div
              className={`h-full transition-all ease-linear ${
                type === 'success' ? 'bg-green-400' :
                type === 'error' ? 'bg-red-400' :
                type === 'warning' ? 'bg-yellow-400' :
                'bg-primary-400'
              }`}
              style={{
                animation: `toast-progress ${duration}ms linear forwards`,
                width: '100%'
              }}
            />
          </div>
        )}
      </div>
      
      <style>
        {`
          @keyframes slide-in-right {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes toast-progress {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }
          
          .animate-slide-in-right {
            animation: slide-in-right 0.3s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default Toast;