import { Request, Response, NextFunction } from 'express';
import Chat, { IChat, IChatMessage } from '../models/Chat.js';
import Contact from '../models/Contact.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { ApiResponse } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { io } from '../index.js';

// @desc    Create or get private chat
// @route   POST /api/chats/private
// @access  Private
export const createOrGetPrivateChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { recipientId } = req.body;
    const userId = req.user!.id;

    console.log('🚀 createOrGetPrivateChat called:', { userId, recipientId });

    if (!recipientId) {
      return next(new AppError('Recipient ID is required', 400));
    }

    if (userId === recipientId) {
      return next(new AppError('Cannot create chat with yourself', 400));
    }

    // Skip all complex checks - just create/find chat
    console.log('💬 Looking for existing private chat...');
    
    // Simple direct query without using static method
    let chat = await Chat.findOne({
      type: 'private',
      participants: { $all: [userId, recipientId] },
      isActive: true
    });

    if (!chat) {
      console.log('🆕 Creating new private chat...');
      chat = await Chat.create({
        type: 'private',
        participants: [userId, recipientId],
        creator: userId,
        admins: [userId, recipientId],
        messages: [],
        settings: {
          maxParticipants: 2,
          allowInvites: false,
          requireApproval: false,
          allowFileSharing: true,
          allowKolophone: true
        }
      });
    }

    // Simple populate
    await chat.populate('participants', 'firstName lastName username avatar');
    
    console.log('✅ Returning chat:', chat._id);

    const response: ApiResponse<{ chat: IChat }> = {
      success: true,
      data: { chat },
      message: 'Private chat ready'
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('❌ Error in createOrGetPrivateChat:', error);
    next(new AppError(error.message || 'Failed to create chat', 400));
  }
};

// @desc    Create group chat
// @route   POST /api/chats/group
// @access  Private
export const createGroupChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, participantIds, avatar } = req.body;
    const userId = req.user!.id;

    // Validate participants
    if (!participantIds || participantIds.length < 1) {
      return next(new AppError('Group chat must have at least 2 participants', 400));
    }

    if (participantIds.length > 200000) {
      return next(new AppError('Group chat cannot exceed 200,000 participants', 400));
    }

    // Ensure creator is included in participants
    const allParticipants = [...new Set([userId, ...participantIds])];

    // Verify all participants exist
    const participants = await User.find({ 
      _id: { $in: allParticipants },
      isActive: true 
    });

    if (participants.length !== allParticipants.length) {
      return next(new AppError('Some participants not found or inactive', 400));
    }

    // Create group chat
    const chat = await Chat.create({
      type: 'group',
      name,
      description,
      avatar,
      participants: allParticipants,
      creator: userId,
      admins: [userId]
    });

    await chat.populate('participants creator admins', 'firstName lastName username avatar');

    // Notify participants
    const notifications = allParticipants
      .filter(id => id !== userId)
      .map(participantId => ({
        recipient: participantId,
        sender: userId,
        type: 'group_message',
        title: 'Added to Group Chat',
        message: `You were added to the group chat "${name}"`,
        data: { chatId: chat._id.toString() }
      }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    // Emit to socket rooms
    allParticipants.forEach(participantId => {
      io.to(`user_${participantId}`).emit('chat_created', {
        chat: chat.toObject(),
        type: 'group'
      });
    });

    const response: ApiResponse<{ chat: IChat }> = {
      success: true,
      data: { chat },
      message: 'Group chat created successfully'
    };

    res.status(201).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get user's chats
// @route   GET /api/chats
// @access  Private
export const getUserChats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { type, limit = 50 } = req.query;

    const chats = await (Chat as any).findByParticipant(userId, {
      type: type as string,
      limit: Number(limit)
    });

    // Add unread count for each chat
    const chatsWithUnread = chats.map((chat: any) => {
      const unreadCount = (chat as any).getUnreadCount(userId);
      return {
        ...chat.toObject(),
        unreadCount
      };
    });

    const response: ApiResponse<{ chats: any[] }> = {
      success: true,
      data: { chats: chatsWithUnread },
      message: 'Chats retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get chat messages
// @route   GET /api/chats/:id/messages
// @access  Private
export const getChatMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chatId = req.params.id;
    const userId = req.user!.id;
    const { limit = 50, page = 1 } = req.query;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return next(new AppError('Chat not found', 404));
    }

    // Check if user is participant
    if (!(chat as any).isParticipant(userId)) {
      return next(new AppError('Not authorized to access this chat', 403));
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    const messages = chat.messages
      .filter(msg => !msg.isDeleted)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(skip, skip + Number(limit))
      .reverse(); // Reverse to show oldest first in response

    // Populate message authors
    await Chat.populate(messages, {
      path: 'author',
      select: 'firstName lastName username avatar'
    });

    const response: ApiResponse<{ messages: IChatMessage[]; hasMore: boolean }> = {
      success: true,
      data: { 
        messages,
        hasMore: chat.messages.length > skip + Number(limit)
      },
      message: 'Messages retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Send message to chat
// @route   POST /api/chats/:id/messages
// @access  Private
export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chatId = req.params.id;
    const userId = req.user!.id;
    const { content, attachments } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return next(new AppError('Chat not found', 404));
    }

    // Check if user is participant
    if (!(chat as any).isParticipant(userId)) {
      return next(new AppError('Not authorized to send messages to this chat', 403));
    }

    // Add message to chat
    const message = (chat as any).addMessage({
      author: userId,
      content: content.trim(),
      attachments: attachments || []
    });

    await chat.save();

    // Populate message author
    await Chat.populate(message, {
      path: 'author',
      select: 'firstName lastName username avatar'
    });

    // Emit to chat room via socket
    io.to(`chat_${chat._id.toString()}`).emit('new_message', {
      chatId: chat._id.toString(),
      message: message,
      chat: {
        _id: chat._id,
        name: chat.name,
        type: chat.type,
        lastActivity: chat.lastActivity
      }
    });

    console.log('📡 Emitted new_message to chat room:', `chat_${chat._id.toString()}`);

    // Create notifications for other participants
    const otherParticipants = chat.participants.filter(
      (pid: any) => pid.toString() !== userId
    );

    if (otherParticipants.length > 0) {
      const notifications = otherParticipants.map((participantId: any) => ({
        recipient: participantId,
        sender: userId,
        type: chat.type === 'private' ? 'private_message' : 'group_message',
        title: chat.type === 'private' ? 'New Message' : `New message in ${chat.name}`,
        message: content.length > 50 ? content.substring(0, 50) + '...' : content,
        data: { 
          chatId: chat._id.toString(),
          messageId: message._id?.toString()
        }
      }));

      await Notification.insertMany(notifications);
    }

    const response: ApiResponse<{ message: IChatMessage }> = {
      success: true,
      data: { message },
      message: 'Message sent successfully'
    };

    res.status(201).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Mark messages as read
// @route   POST /api/chats/:id/read
// @access  Private
export const markMessagesAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chatId = req.params.id;
    const userId = req.user!.id;
    const { messageId } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return next(new AppError('Chat not found', 404));
    }

    // Check if user is participant
    if (!(chat as any).isParticipant(userId)) {
      return next(new AppError('Not authorized to access this chat', 403));
    }

    // Mark messages as read
    (chat as any).markAsRead(userId, messageId);
    await chat.save();

    // Emit read status to other participants
    chat.participants.forEach((participantId: any) => {
      if (participantId.toString() !== userId) {
        io.to(`user_${participantId.toString()}`).emit('messages_read', {
          chatId: chat._id.toString(),
          userId,
          messageId
        });
      }
    });

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Messages marked as read' },
      message: 'Messages marked as read successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Add participants to group chat
// @route   POST /api/chats/:id/participants
// @access  Private
export const addParticipants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chatId = req.params.id;
    const userId = req.user!.id;
    const { participantIds } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return next(new AppError('Chat not found', 404));
    }

    if (chat.type !== 'group') {
      return next(new AppError('Can only add participants to group chats', 400));
    }

    // Check if user is admin
    if (!(chat as any).isAdmin(userId)) {
      return next(new AppError('Only admins can add participants', 403));
    }

    // Check if adding participants would exceed limit
    const newTotalCount = chat.participants.length + participantIds.length;
    if (newTotalCount > chat.settings.maxParticipants) {
      return next(new AppError(`Chat would exceed maximum of ${chat.settings.maxParticipants} participants`, 400));
    }

    // Verify participants exist
    const newParticipants = await User.find({
      _id: { $in: participantIds },
      isActive: true
    });

    if (newParticipants.length !== participantIds.length) {
      return next(new AppError('Some participants not found or inactive', 400));
    }

    // Add participants
    participantIds.forEach((participantId: string) => {
      (chat as any).addParticipant(participantId);
    });

    await chat.save();

    // Notify new participants
    const notifications = participantIds.map((participantId: string) => ({
      recipient: participantId,
      sender: userId,
      type: 'group_message',
      title: 'Added to Group Chat',
      message: `You were added to the group chat "${chat.name}"`,
      data: { chatId: chat._id.toString() }
    }));

    await Notification.insertMany(notifications);

    // Emit to all participants
    chat.participants.forEach((participantId: any) => {
      io.to(`user_${participantId.toString()}`).emit('participants_added', {
        chatId: chat._id.toString(),
        newParticipants: newParticipants.map(p => ({
          _id: p._id,
          firstName: p.firstName,
          lastName: p.lastName,
          username: p.username,
          avatar: p.avatar
        }))
      });
    });

    const response: ApiResponse<{ chat: IChat }> = {
      success: true,
      data: { chat },
      message: 'Participants added successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Leave chat
// @route   POST /api/chats/:id/leave
// @access  Private
export const leaveChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chatId = req.params.id;
    const userId = req.user!.id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return next(new AppError('Chat not found', 404));
    }

    if (chat.type === 'private') {
      return next(new AppError('Cannot leave private chats', 400));
    }

    // Check if user is participant
    if (!(chat as any).isParticipant(userId)) {
      return next(new AppError('You are not a participant in this chat', 400));
    }

    // Remove participant
    (chat as any).removeParticipant(userId);

    // If creator leaves, transfer ownership to another admin or delete chat
    if (chat.creator.toString() === userId) {
      if (chat.admins.length > 1) {
        // Transfer to another admin
        const newCreator = chat.admins.find((adminId: any) => adminId.toString() !== userId);
        if (newCreator) {
          chat.creator = newCreator;
        }
      } else if (chat.participants.length > 0) {
        // Make first participant the new creator and admin
        chat.creator = chat.participants[0];
        (chat as any).addAdmin(chat.participants[0].toString());
      } else {
        // No participants left, deactivate chat
        chat.isActive = false;
      }
    }

    await chat.save();

    // Notify remaining participants
    chat.participants.forEach((participantId: any) => {
      io.to(`user_${participantId.toString()}`).emit('participant_left', {
        chatId: chat._id.toString(),
        userId
      });
    });

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Left chat successfully' },
      message: 'Left chat successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};