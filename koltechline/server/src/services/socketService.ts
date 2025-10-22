import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { IUser } from '../types/index.js';

interface AuthenticatedSocket extends Socket {
  user?: IUser;
}

export const setupSocketIO = (io: Server): void => {
  // Authentication middleware for Socket.IO
  io.use(async (socket: any, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await User.findById(decoded.userId).select('-password -codePhrases');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`🔌 User connected: ${socket.user?.username || 'Unknown'}`);

    // Join user to their personal room for notifications
    if (socket.user) {
      socket.join(`user_${socket.user._id}`);
      socket.join(`notifications_${socket.user._id}`);
    }

    // ======================
    // WALL & MESSAGING EVENTS
    // ======================

    // Join wall for real-time updates
    socket.on('join_wall', (wallId: string) => {
      socket.join(`wall_${wallId}`);
      console.log(`🏠 User joined wall: ${wallId}`);
    });

    socket.on('leave_wall', (wallId: string) => {
      socket.leave(`wall_${wallId}`);
      console.log(`🏠 User left wall: ${wallId}`);
    });

    // Handle wall message events
    socket.on('wall_message_typing', (data: { wallId: string; isTyping: boolean }) => {
      socket.to(`wall_${data.wallId}`).emit('user_typing_wall', {
        userId: socket.user?._id,
        username: socket.user?.username,
        wallId: data.wallId,
        isTyping: data.isTyping
      });
    });

    // ======================
    // PRIVATE & GROUP CHAT EVENTS
    // ======================

    socket.on('join_chat', (chatId: string) => {
      socket.join(`chat_${chatId}`);
      console.log(`💬 User joined chat: ${chatId}`);
    });

    socket.on('leave_chat', (chatId: string) => {
      socket.leave(`chat_${chatId}`);
      console.log(`💬 User left chat: ${chatId}`);
    });

    // Chat typing indicators
    socket.on('chat_typing_start', (chatId: string) => {
      socket.to(`chat_${chatId}`).emit('user_typing', {
        userId: socket.user?._id,
        username: socket.user?.username,
        chatId,
        isTyping: true
      });
    });

    socket.on('chat_typing_stop', (chatId: string) => {
      socket.to(`chat_${chatId}`).emit('user_typing', {
        userId: socket.user?._id,
        username: socket.user?.username,
        chatId,
        isTyping: false
      });
    });

    // ======================
    // KOLOPHONE VIDEO CALLING
    // ======================

    // Start Kolophone call
    socket.on('kolophone_start_call', (data: {
      type: 'wall' | 'private' | 'group';
      targetId: string; // wallId, chatId, or userId
      callId: string;
    }) => {
      const roomName = data.type === 'wall' ? `wall_${data.targetId}` : `chat_${data.targetId}`;
      
      socket.to(roomName).emit('kolophone_incoming_call', {
        callId: data.callId,
        caller: {
          id: socket.user?._id,
          name: `${socket.user?.firstName} ${socket.user?.lastName}`,
          username: socket.user?.username,
          avatar: socket.user?.avatar
        },
        type: data.type,
        targetId: data.targetId
      });

      console.log(`📞 Kolophone call started: ${data.callId}`);
    });

    // Join Kolophone call
    socket.on('kolophone_join_call', (callId: string) => {
      socket.join(`kolophone_${callId}`);
      socket.to(`kolophone_${callId}`).emit('kolophone_user_joined', {
        userId: socket.user?._id,
        name: `${socket.user?.firstName} ${socket.user?.lastName}`,
        username: socket.user?.username,
        avatar: socket.user?.avatar
      });
      console.log(`📞 User joined Kolophone call: ${callId}`);
    });

    // Leave Kolophone call
    socket.on('kolophone_leave_call', (callId: string) => {
      socket.to(`kolophone_${callId}`).emit('kolophone_user_left', {
        userId: socket.user?._id
      });
      socket.leave(`kolophone_${callId}`);
      console.log(`📞 User left Kolophone call: ${callId}`);
    });

    // Handle WebRTC signaling for Kolophone
    socket.on('kolophone_offer', (data: { callId: string; offer: any; targetUserId?: string }) => {
      if (data.targetUserId) {
        socket.to(`user_${data.targetUserId}`).emit('kolophone_offer', {
          callId: data.callId,
          offer: data.offer,
          fromUserId: socket.user?._id
        });
      } else {
        socket.to(`kolophone_${data.callId}`).emit('kolophone_offer', {
          callId: data.callId,
          offer: data.offer,
          fromUserId: socket.user?._id
        });
      }
    });

    socket.on('kolophone_answer', (data: { callId: string; answer: any; targetUserId: string }) => {
      socket.to(`user_${data.targetUserId}`).emit('kolophone_answer', {
        callId: data.callId,
        answer: data.answer,
        fromUserId: socket.user?._id
      });
    });

    socket.on('kolophone_ice_candidate', (data: { callId: string; candidate: any; targetUserId?: string }) => {
      if (data.targetUserId) {
        socket.to(`user_${data.targetUserId}`).emit('kolophone_ice_candidate', {
          callId: data.callId,
          candidate: data.candidate,
          fromUserId: socket.user?._id
        });
      } else {
        socket.to(`kolophone_${data.callId}`).emit('kolophone_ice_candidate', {
          callId: data.callId,
          candidate: data.candidate,
          fromUserId: socket.user?._id
        });
      }
    });

    socket.on('kolophone_end_call', (callId: string) => {
      socket.to(`kolophone_${callId}`).emit('kolophone_call_ended', {
        endedBy: socket.user?._id
      });
      io.in(`kolophone_${callId}`).socketsLeave(`kolophone_${callId}`);
      console.log(`📞 Kolophone call ended: ${callId}`);
    });

    // ======================
    // REAL-TIME INTERACTIONS
    // ======================

    // Handle likes in real-time
    socket.on('message_liked', (data: { messageId: string; wallId?: string; chatId?: string; likesCount: number }) => {
      const room = data.wallId ? `wall_${data.wallId}` : `chat_${data.chatId}`;
      socket.to(room).emit('message_like_updated', {
        messageId: data.messageId,
        likesCount: data.likesCount,
        likedBy: socket.user?._id
      });
    });

    socket.on('message_unliked', (data: { messageId: string; wallId?: string; chatId?: string; likesCount: number }) => {
      const room = data.wallId ? `wall_${data.wallId}` : `chat_${data.chatId}`;
      socket.to(room).emit('message_like_updated', {
        messageId: data.messageId,
        likesCount: data.likesCount,
        unlikedBy: socket.user?._id
      });
    });

    // Handle comments in real-time
    socket.on('comment_added', (data: { messageId: string; wallId?: string; chatId?: string; comment: any }) => {
      const room = data.wallId ? `wall_${data.wallId}` : `chat_${data.chatId}`;
      socket.to(room).emit('new_comment', {
        messageId: data.messageId,
        comment: data.comment
      });
    });

    // ======================
    // USER STATUS EVENTS
    // ======================

    socket.on('user_status_change', (status: 'online' | 'away' | 'busy' | 'offline') => {
      // Broadcast to all user's contacts
      socket.broadcast.emit('contact_status_changed', {
        userId: socket.user?._id,
        status
      });
    });

    // ======================
    // NOTIFICATION EVENTS
    // ======================

    socket.on('mark_notification_read', (notificationId: string) => {
      // Could update notification status in database here
      console.log(`📢 Notification marked as read: ${notificationId}`);
    });

    socket.on('mark_all_notifications_read', () => {
      console.log(`📢 All notifications marked as read for user: ${socket.user?._id}`);
    });

    // ======================
    // CONTACT EVENTS
    // ======================

    socket.on('contact_request_sent', (data: { recipientId: string; request: any }) => {
      socket.to(`user_${data.recipientId}`).emit('new_contact_request', {
        request: data.request,
        from: {
          id: socket.user?._id,
          name: `${socket.user?.firstName} ${socket.user?.lastName}`,
          username: socket.user?.username,
          avatar: socket.user?.avatar
        }
      });
    });

    // ======================
    // DISCONNECT HANDLING
    // ======================

    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.user?.username || 'Unknown'}`);
      
      // Broadcast offline status to contacts
      socket.broadcast.emit('contact_status_changed', {
        userId: socket.user?._id,
        status: 'offline'
      });
    });
  });

  console.log('🚀 Socket.IO server initialized with KolTech features');
};

// Helper function to send notification to specific user
export const sendNotificationToUser = (io: Server, userId: string, notification: any): void => {
  io.to(`notifications_${userId}`).emit('new_notification', notification);
};

// Helper function to send update to project participants
export const sendProjectUpdate = (io: Server, projectId: string, update: any): void => {
  io.to(`project_${projectId}`).emit('project_updated', update);
};