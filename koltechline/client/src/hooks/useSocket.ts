import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

// Global socket instance to prevent multiple connections
let globalSocket: Socket | null = null;
let isInitialized = false;

export const useSocket = () => {
  const { token, isAuthenticated } = useAuth();
  const currentWallRef = useRef<string | null>(null);

  // Initialize socket only once
  useEffect(() => {
    if (!isAuthenticated || !token || isInitialized) {
      return;
    }

    console.log('🔌 Initializing Socket.IO connection...');
    
    globalSocket = io('http://localhost:5005', {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: false, // Disable auto-reconnection to prevent loops
      timeout: 10000
    });

    isInitialized = true;

    globalSocket.on('connect', () => {
      console.log('🔌 Connected to KolTech Socket.IO server');
    });

    globalSocket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from Socket.IO server:', reason);
      isInitialized = false;
    });

    globalSocket.on('connect_error', (error) => {
      console.error('🔌 Socket connection error:', error);
      isInitialized = false;
    });

    return () => {
      if (globalSocket) {
        console.log('🔌 Cleaning up Socket.IO connection...');
        globalSocket.disconnect();
        globalSocket = null;
        isInitialized = false;
      }
    };
  }, []); // Empty dependencies to run only once

  // Socket utility functions
  const joinWall = useCallback((wallId: string) => {
    if (globalSocket?.connected && wallId !== currentWallRef.current) {
      if (currentWallRef.current) {
        console.log('🏠 Leaving previous wall:', currentWallRef.current);
        globalSocket.emit('leave_wall', currentWallRef.current);
      }
      
      console.log('🏠 Joining wall:', wallId);
      globalSocket.emit('join_wall', wallId);
      currentWallRef.current = wallId;
    }
  }, []);

  const leaveWall = useCallback((wallId: string) => {
    if (globalSocket?.connected && wallId === currentWallRef.current) {
      console.log('🏠 Leaving wall:', wallId);
      globalSocket.emit('leave_wall', wallId);
      currentWallRef.current = null;
    }
  }, []);

  const joinChat = useCallback((chatId: string) => {
    if (globalSocket?.connected) {
      console.log('💬 Joining chat room:', chatId);
      globalSocket.emit('join_chat', chatId);
    }
  }, []);

  const leaveChat = useCallback((chatId: string) => {
    if (globalSocket?.connected) {
      console.log('💬 Leaving chat room:', chatId);
      globalSocket.emit('leave_chat', chatId);
    }
  }, []);

  const emitTyping = useCallback((wallId: string, isTyping: boolean) => {
    if (globalSocket?.connected) {
      globalSocket.emit('wall_message_typing', { wallId, isTyping });
    }
  }, []);

  const joinNotifications = useCallback(() => {
    if (globalSocket?.connected) {
      globalSocket.emit('join_notifications');
    }
  }, []);

  const subscribeToEvents = useCallback((handlers: {
    onMessageReceived?: (data: any) => void;
    onCallReceived?: (data: any) => void;
    onVideoProcessed?: (data: any) => void;
  }) => {
    if (!globalSocket) return;

    // Remove existing listeners to prevent duplicates
    globalSocket.off('message_received'); // New unified event
    globalSocket.off('new_wall_message'); // Legacy support
    globalSocket.off('new_message'); // For chat messages
    globalSocket.off('message_like_updated');
    globalSocket.off('new_comment');
    globalSocket.off('message_video_processed');
    globalSocket.off('kolophone_call_started');
    globalSocket.off('kolophone_incoming_call');

    // Add new listeners
    if (handlers.onMessageReceived) {
      // New unified message event (from server)
      globalSocket.on('message_received', (data) => {
        console.log('📨 Received message_received event:', data);
        handlers.onMessageReceived!(data);
      });
      
      // Legacy wall messages support
      globalSocket.on('new_wall_message', (data) => {
        console.log('📨 Received new_wall_message event (legacy):', data);
        handlers.onMessageReceived!(data);
      });
      
      // Chat messages
      globalSocket.on('new_message', (data) => {
        console.log('📨 Received new_message event:', data);
        handlers.onMessageReceived!(data);
      });
      
      globalSocket.on('message_like_updated', (data) => {
        handlers.onMessageReceived!({ type: 'like_updated', ...data });
      });
      globalSocket.on('new_comment', (data) => {
        handlers.onMessageReceived!({ type: 'new_comment', ...data });
      });
    }

    if (handlers.onVideoProcessed) {
      globalSocket.on('message_video_processed', (data) => {
        console.log('🎬 Video processing completed:', data);
        handlers.onVideoProcessed!(data);
      });
    }

    if (handlers.onCallReceived) {
      globalSocket.on('kolophone_call_started', (data) => {
        handlers.onCallReceived!({ type: 'call_started', ...data });
      });
      globalSocket.on('kolophone_incoming_call', (data) => {
        handlers.onCallReceived!({ type: 'incoming_call', ...data });
      });
    }
  }, []);

  return {
    socket: globalSocket,
    joinWall,
    leaveWall,
    joinChat,
    leaveChat,
    emitTyping,
    joinNotifications,
    subscribeToEvents,
    isConnected: globalSocket?.connected || false
  };
};
