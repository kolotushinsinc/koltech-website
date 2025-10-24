import { useState, useCallback } from 'react';
import axios from 'axios';

interface VideoUploadState {
  isUploading: boolean;
  progress: number;
  status: string;
  videoId: string | null;
  hlsPath: string | null;
  thumbnail: string | null;
  error: string | null;
}

interface UseVideoUploadReturn extends VideoUploadState {
  uploadVideo: (file: File) => Promise<{ hlsPath: string; videoId: string } | null>;
  cancelUpload: () => void;
  extractThumbnail: (file: File) => Promise<string | null>;
  reset: () => void;
}

export const useVideoUpload = (): UseVideoUploadReturn => {
  const [state, setState] = useState<VideoUploadState>({
    isUploading: false,
    progress: 0,
    status: '',
    videoId: null,
    hlsPath: null,
    thumbnail: null,
    error: null
  });

  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  /**
   * Extract thumbnail from video using Canvas API
   */
  const extractThumbnail = useCallback(async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      video.onloadedmetadata = () => {
        // Seek to 1 second or 10% of video duration
        video.currentTime = Math.min(1, video.duration * 0.1);
      };

      video.onseeked = () => {
        // Set canvas size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert to data URL
          const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          // Cleanup
          URL.revokeObjectURL(video.src);
          
          setState(prev => ({ ...prev, thumbnail: thumbnailUrl }));
          resolve(thumbnailUrl);
        } else {
          resolve(null);
        }
      };

      video.onerror = () => {
        console.error('Error loading video for thumbnail');
        URL.revokeObjectURL(video.src);
        resolve(null);
      };

      // Load video
      video.src = URL.createObjectURL(file);
    });
  }, []);

  /**
   * Upload and process video with progress simulation
   */
  const uploadVideo = useCallback(async (file: File): Promise<{ hlsPath: string; videoId: string } | null> => {
    try {
      setState(prev => ({
        ...prev,
        isUploading: true,
        progress: 0,
        status: 'Uploading...',
        error: null
      }));

      // Extract thumbnail first
      await extractThumbnail(file);

      // Create form data
      const formData = new FormData();
      formData.append('video', file);

      // Get auth token from koltech-auth-storage
      const authStorage = localStorage.getItem('koltech-auth-storage');
      if (!authStorage) {
        throw new Error('Not authenticated');
      }
      
      const token = JSON.parse(authStorage).state?.token;
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Simulate progress during upload
      const progressInterval = setInterval(() => {
        setState(prev => {
          const newProgress = Math.min(prev.progress + Math.random() * 15, 90);
          return {
            ...prev,
            progress: newProgress,
            status: newProgress < 30 ? 'Uploading...' : 
                    newProgress < 60 ? 'Processing 1080p...' :
                    newProgress < 80 ? 'Processing 720p...' : 'Processing 480p...'
          };
        });
      }, 500);

      try {
        // Upload and process video
        const response = await axios.post('http://localhost:5005/api/videos/upload', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const uploadPercent = (progressEvent.loaded / progressEvent.total) * 30;
              setState(prev => ({
                ...prev,
                progress: uploadPercent,
                status: 'Uploading...'
              }));
            }
          }
        });

        clearInterval(progressInterval);

        // Parse SSE response
        const lines = response.data.split('\n');
        let hlsPath = '';
        let videoId = '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.type === 'complete') {
                hlsPath = data.hlsPath;
                videoId = data.videoId;
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }

        setState(prev => ({
          ...prev,
          isUploading: false,
          progress: 100,
          status: 'Complete!',
          videoId,
          hlsPath
        }));

        return { hlsPath, videoId };
      } catch (error: any) {
        clearInterval(progressInterval);
        throw error;
      }
    } catch (error: any) {
      console.error('Error uploading video:', error);
      setState(prev => ({
        ...prev,
        isUploading: false,
        error: error.message || 'Upload failed'
      }));
      return null;
    }
  }, [extractThumbnail]);

  /**
   * Cancel ongoing upload
   */
  const cancelUpload = useCallback(async () => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }

    if (state.videoId) {
      try {
        const authStorage = localStorage.getItem('koltech-auth-storage');
        if (authStorage) {
          const token = JSON.parse(authStorage).state?.token;
          if (token) {
            await axios.delete(`http://localhost:5005/api/videos/upload/${state.videoId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
          }
        }
      } catch (error) {
        console.error('Error cancelling upload:', error);
      }
    }

    setState({
      isUploading: false,
      progress: 0,
      status: '',
      videoId: null,
      hlsPath: null,
      thumbnail: null,
      error: null
    });
  }, [eventSource, state.videoId]);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({
      isUploading: false,
      progress: 0,
      status: '',
      videoId: null,
      hlsPath: null,
      thumbnail: null,
      error: null
    });
  }, []);

  return {
    ...state,
    uploadVideo,
    cancelUpload,
    extractThumbnail,
    reset
  };
};
