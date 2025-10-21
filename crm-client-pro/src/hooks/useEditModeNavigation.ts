import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook to handle navigation when in edit mode
 * Shows confirmation dialog before navigating away from edit mode
 */
export function useEditModeNavigation() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showExitEditModal, setShowExitEditModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Handle navigation with confirmation if in edit mode
  const handleNavigation = (path: string) => {
    if (isEditMode) {
      setPendingNavigation(path);
      setShowExitEditModal(true);
      return false;
    }
    
    navigate(path);
    return true;
  };
  
  // Handle exiting edit mode
  const exitEditMode = () => {
    setShowExitEditModal(false);
    setIsEditMode(false);
    
    // Navigate if there's pending navigation
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  };
  
  // Cancel exit from edit mode
  const cancelExitEditMode = () => {
    setShowExitEditModal(false);
    setPendingNavigation(null);
  };
  
  return {
    isEditMode,
    setIsEditMode,
    showExitEditModal,
    setShowExitEditModal,
    pendingNavigation,
    handleNavigation,
    exitEditMode,
    cancelExitEditMode
  };
}
