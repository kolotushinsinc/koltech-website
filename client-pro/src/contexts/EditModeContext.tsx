import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { AlertTriangle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface EditModeContextType {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  showExitWarning: (callback: () => void) => void;
  handleNavigation: (path: string) => boolean;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle beforeunload event (page reload/close)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isEditMode) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isEditMode]);
  
  // Handle location changes
  useEffect(() => {
    if (pendingPath && pendingPath !== location.pathname) {
      setPendingPath(null);
    }
  }, [location, pendingPath]);
  
  // Show exit warning modal
  const showExitWarning = (callback: () => void) => {
    if (isEditMode) {
      setShowExitModal(true);
      setPendingCallback(() => callback);
      return;
    }
    
    // If not in edit mode, execute callback immediately
    callback();
  };
  
  // Handle confirming exit
  const handleConfirmExit = () => {
    setShowExitModal(false);
    setIsEditMode(false);
    
    // Execute the pending callback if exists
    if (pendingCallback) {
      pendingCallback();
      setPendingCallback(null);
    }
    
    // Navigate to pending path if exists
    if (pendingPath) {
      // Use setTimeout to ensure state updates before navigation
      setTimeout(() => {
        navigate(pendingPath);
        setPendingPath(null);
      }, 0);
    }
  };
  
  // Handle canceling exit
  const handleCancelExit = () => {
    setShowExitModal(false);
    setPendingCallback(null);
    setPendingPath(null);
  };
  
  // Handle navigation with warning
  const handleNavigation = (path: string) => {
    if (isEditMode) {
      // Store the path for navigation after confirmation
      setShowExitModal(true);
      setPendingPath(path);
      return false; // Prevent navigation
    }
    
    navigate(path);
    return true; // Allow navigation
  };
  
  return (
    <EditModeContext.Provider value={{ 
      isEditMode, 
      setIsEditMode, 
      showExitWarning,
      handleNavigation
    }}>
      {children}
      
      {/* Exit edit mode confirmation modal */}
      {showExitModal && (
        <Modal isOpen={true} onClose={handleCancelExit} title="Подтверждение" maxWidth="md">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-center">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-medium text-white">Выход из режима редактирования</h3>
                <p className="text-dark-300">
                  Вы уверены, что хотите выйти из режима редактирования? Все несохраненные изменения будут потеряны.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="btn btn-secondary" 
                onClick={handleCancelExit}
              >
                Отмена
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleConfirmExit}
              >
                Выйти
              </button>
            </div>
          </div>
        </Modal>
      )}
    </EditModeContext.Provider>
  );
}

// Custom hook to use the edit mode context
export function useEditMode() {
  const context = useContext(EditModeContext);
  
  if (context === undefined) {
    throw new Error('useEditMode must be used within an EditModeProvider');
  }
  
  return context;
}
