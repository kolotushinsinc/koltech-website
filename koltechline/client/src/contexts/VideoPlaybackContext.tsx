import React, { createContext, useContext, useState, useCallback } from 'react';

interface VideoPlaybackContextType {
  isModalOpen: boolean;
  isSidebarOpen: boolean;
  setModalOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  pauseAllBackgroundVideos: () => void;
  resumeAllBackgroundVideos: () => void;
}

const VideoPlaybackContext = createContext<VideoPlaybackContextType | undefined>(undefined);

export const VideoPlaybackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const setModalOpen = useCallback((open: boolean) => {
    setIsModalOpen(open);
    
    if (open) {
      // Pause all background videos when modal opens
      pauseAllBackgroundVideos();
    } else if (!isSidebarOpen) {
      // Resume background videos when modal closes (only if sidebar is not open)
      resumeAllBackgroundVideos();
    }
  }, [isSidebarOpen]);

  const setSidebarOpen = useCallback((open: boolean) => {
    setIsSidebarOpen(open);
    
    if (open) {
      // Pause all background videos when sidebar opens
      pauseAllBackgroundVideos();
    } else if (!isModalOpen) {
      // Resume background videos when sidebar closes (only if modal is not open)
      resumeAllBackgroundVideos();
    }
  }, [isModalOpen]);

  const pauseAllBackgroundVideos = useCallback(() => {
    // Dispatch custom event to pause all VideoPreview components
    window.dispatchEvent(new CustomEvent('pauseBackgroundVideos'));
  }, []);

  const resumeAllBackgroundVideos = useCallback(() => {
    // Dispatch custom event to resume all VideoPreview components
    window.dispatchEvent(new CustomEvent('resumeBackgroundVideos'));
  }, []);

  return (
    <VideoPlaybackContext.Provider
      value={{
        isModalOpen,
        isSidebarOpen,
        setModalOpen,
        setSidebarOpen,
        pauseAllBackgroundVideos,
        resumeAllBackgroundVideos,
      }}
    >
      {children}
    </VideoPlaybackContext.Provider>
  );
};

export const useVideoPlayback = () => {
  const context = useContext(VideoPlaybackContext);
  if (!context) {
    throw new Error('useVideoPlayback must be used within VideoPlaybackProvider');
  }
  return context;
};
