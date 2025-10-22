import { Request, Response, NextFunction } from 'express';
import Message, { IMessage } from '../models/Message.js';
import Wall from '../models/Wall.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { ApiResponse } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { io } from '../index.js';

// @desc    Create message in wall
// @route   POST /api/messages
// @access  Private
export const createMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, wallId, attachments, tags, visibility } = req.body;
    const userId = req.user!.id;

    // Validate input data - allow either content or attachments
    const hasContent = content && typeof content === 'string' && content.trim();
    const hasAttachments = Array.isArray(attachments) && attachments.length > 0;
    
    if (!hasContent && !hasAttachments) {
      return next(new AppError('Message must have either content or attachments', 400));
    }

    if (!wallId) {
      return next(new AppError('Wall ID is required', 400));
    }

    // Check if wall exists and user can post
    const wall = await Wall.findById(wallId);
    if (!wall || !wall.isActive) {
      return next(new AppError('Wall not found', 404));
    }

    // Ensure wall has settings
    const wallSettings = wall.settings || {
      postPermissions: 'members',
      commentPermissions: 'members'
    };

    // Check posting permissions
    if (wallSettings.postPermissions === 'admins' && !(wall as any).isAdmin(userId)) {
      return next(new AppError('Only wall admins can post in this wall', 403));
    }

    if (wallSettings.postPermissions === 'members' && !(wall as any).isMember(userId)) {
      return next(new AppError('Only wall members can post', 403));
    }

    // Sanitize attachments and tags
    const sanitizedAttachments = Array.isArray(attachments) ? attachments : [];
    const sanitizedTags = Array.isArray(tags) ? tags.filter(tag => tag && typeof tag === 'string') : [];

    console.log('Creating message with data:', {
      content: content.trim(),
      author: userId,
      wall: wallId,
      attachments: sanitizedAttachments,
      tags: sanitizedTags,
      visibility: visibility || 'members'
    });

    // Create message
    const message = await Message.create({
      content: hasContent ? content.trim() : '',
      author: userId,
      wall: wallId,
      attachments: sanitizedAttachments,
      tags: sanitizedTags,
      visibility: visibility || 'members'
    });

    await message.populate('author', 'firstName lastName username avatar');
    await message.populate('wall', 'name');

    console.log('✅ Message created successfully with attachments:', {
      messageId: message._id,
      attachments: message.attachments,
      attachmentsCount: message.attachments?.length || 0
    });

    // Emit to wall participants - using 'message_received' to match client expectations
    io.to(`wall_${wallId}`).emit('message_received', {
      type: 'new_message',
      message: message.toObject(),
      wallId
    });

    // Create notifications for wall followers (if enabled)
    // This would be implemented based on user notification preferences

    const messageObject = message.toObject();
    const response: ApiResponse<{ message: IMessage }> = {
      success: true,
      data: { message: messageObject }, // Ensure we return the full object with attachments
      message: 'Message posted successfully'
    };

    console.log('📤 Sending response with message data:', {
      messageId: messageObject._id,
      hasAttachments: !!messageObject.attachments,
      attachmentsCount: messageObject.attachments?.length || 0
    });

    res.status(201).json(response);
  } catch (error: any) {
    console.error('Error creating message:', error);
    const errorMessage = error?.message || 'Failed to create message';
    next(new AppError(errorMessage, 400));
  }
};

// @desc    Get messages from wall
// @route   GET /api/messages/wall/:wallId
// @access  Public/Private (based on wall visibility)
export const getWallMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { wallId } = req.params;
    const { limit = 20, page = 1 } = req.query;
    const userId = req.user?.id;

    const wall = await Wall.findById(wallId);
    if (!wall || !wall.isActive) {
      return next(new AppError('Wall not found', 404));
    }

    // Check access permissions
    if (!wall.isPublic && !userId) {
      return next(new AppError('Authentication required for private walls', 401));
    }

    if (!wall.isPublic && userId && !(wall as any).isMember(userId)) {
      return next(new AppError('Access denied to this private wall', 403));
    }

    const messages = await (Message as any).findByWall(wallId, {
      limit: Number(limit),
      skip: (Number(page) - 1) * Number(limit)
    });

    const response: ApiResponse<{ messages: IMessage[] }> = {
      success: true,
      data: { messages },
      message: 'Messages retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error getting wall messages:', error);
    const errorMessage = error?.message || 'Failed to get wall messages';
    next(new AppError(errorMessage, 400));
  }
};

// @desc    Like/Unlike message (legacy - kept for backward compatibility)
// @route   POST /api/messages/:id/like
// @access  Private
export const toggleMessageLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.id;
    const userId = req.user!.id;

    const message = await Message.findById(messageId);
    if (!message || message.isDeleted) {
      return next(new AppError('Message not found', 404));
    }

    const hasLiked = (message as any).hasLiked(userId);
    
    if (hasLiked) {
      (message as any).removeLike(userId);
    } else {
      (message as any).addLike(userId);
      
      // Create notification for message author
      if (message.author.toString() !== userId) {
        await (Notification as any).createLikeNotification(
          message.author.toString(),
          userId,
          messageId
        );
      }
    }

    await message.save();

    // Emit real-time update
    io.to(`wall_${message.wall}`).emit('message_like_updated', {
      messageId,
      likesCount: message.likesCount,
      hasLiked: !hasLiked,
      userId
    });

    const response: ApiResponse<{ 
      message: IMessage; 
      hasLiked: boolean; 
      likesCount: number 
    }> = {
      success: true,
      data: { 
        message, 
        hasLiked: !hasLiked, 
        likesCount: message.likesCount 
      },
      message: hasLiked ? 'Message unliked' : 'Message liked'
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error toggling message like:', error);
    const errorMessage = error?.message || 'Failed to toggle message like';
    next(new AppError(errorMessage, 400));
  }
};

// @desc    Add/Remove reaction to message
// @route   POST /api/messages/:id/react
// @access  Private
export const toggleMessageReaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.id;
    const { emoji } = req.body;
    const userId = req.user!.id;

    if (!emoji || typeof emoji !== 'string') {
      return next(new AppError('Emoji is required', 400));
    }

    const message = await Message.findById(messageId);
    if (!message || message.isDeleted) {
      return next(new AppError('Message not found', 404));
    }

    // Toggle reaction
    (message as any).toggleReaction(userId, emoji);
    await message.save();

    // Get user's current reaction
    const userReaction = (message as any).getUserReaction(userId);

    // Create notification for message author if adding reaction
    if (userReaction && message.author.toString() !== userId) {
      await (Notification as any).createLikeNotification(
        message.author.toString(),
        userId,
        messageId
      );
    }

    // Emit real-time update
    io.to(`wall_${message.wall}`).emit('message_reaction_updated', {
      messageId,
      reactions: message.reactions,
      userId,
      userReaction
    });

    const response: ApiResponse<{ 
      message: IMessage; 
      userReaction: string | null;
      reactions: any[];
    }> = {
      success: true,
      data: { 
        message, 
        userReaction,
        reactions: message.reactions || []
      },
      message: userReaction ? 'Reaction added' : 'Reaction removed'
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error toggling message reaction:', error);
    const errorMessage = error?.message || 'Failed to toggle message reaction';
    next(new AppError(errorMessage, 400));
  }
};

// @desc    Add comment to message
// @route   POST /api/messages/:id/comments
// @access  Private
export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.id;
    const { content } = req.body;
    const userId = req.user!.id;

    const parentMessage = await Message.findById(messageId);
    if (!parentMessage || parentMessage.isDeleted) {
      return next(new AppError('Message not found', 404));
    }

    // Check if wall allows comments
    const wall = await Wall.findById(parentMessage.wall);
    if (!wall || !wall.isActive) {
      return next(new AppError('Wall not found', 404));
    }

    if (wall.settings.commentPermissions === 'members' && !(wall as any).isMember(userId)) {
      return next(new AppError('Only wall members can comment', 403));
    }

    // Create comment as a reply message
    const comment = await Message.create({
      content: content.trim(),
      author: userId,
      wall: parentMessage.wall,
      parentMessage: messageId,
      visibility: parentMessage.visibility
    });

    await comment.populate('author', 'firstName lastName username avatar');

    // Update parent message reply count
    (parentMessage as any).addReply(comment._id.toString());
    await parentMessage.save();

    // Emit real-time update
    io.to(`wall_${parentMessage.wall}`).emit('new_comment', {
      comment: comment.toObject(),
      parentMessageId: messageId
    });

    // Create notification for message author
    if (parentMessage.author.toString() !== userId) {
      await (Notification as any).createCommentNotification(
        parentMessage.author.toString(),
        userId,
        comment._id.toString(),
        messageId
      );
    }

    const response: ApiResponse<{ comment: IMessage }> = {
      success: true,
      data: { comment },
      message: 'Comment added successfully'
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error('Error adding comment:', error);
    const errorMessage = error?.message || 'Failed to add comment';
    next(new AppError(errorMessage, 400));
  }
};

// @desc    Get comments for message
// @route   GET /api/messages/:id/comments
// @access  Public/Private (based on message visibility)
export const getMessageComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.id;
    const { limit = 10, page = 1 } = req.query;

    const message = await Message.findById(messageId);
    if (!message || message.isDeleted) {
      return next(new AppError('Message not found', 404));
    }

    const comments = await (Message as any).findReplies(messageId);

    const response: ApiResponse<{ comments: IMessage[] }> = {
      success: true,
      data: { comments },
      message: 'Comments retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error getting message comments:', error);
    const errorMessage = error?.message || 'Failed to get message comments';
    next(new AppError(errorMessage, 400));
  }
};

// @desc    Update message
// @route   PUT /api/messages/:id
// @access  Private (Author only)
export const updateMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.id;
    const { content, tags } = req.body;
    const userId = req.user!.id;

    const message = await Message.findById(messageId);
    if (!message || message.isDeleted) {
      return next(new AppError('Message not found', 404));
    }

    // Only author can edit
    if (message.author.toString() !== userId) {
      return next(new AppError('Only message author can edit', 403));
    }

    // Update message
    if (content) message.content = content.trim();
    if (tags) message.tags = tags;
    
    await message.save();

    // Emit real-time update
    io.to(`wall_${message.wall}`).emit('message_updated', {
      messageId,
      content: message.content,
      tags: message.tags,
      isEdited: message.isEdited,
      editedAt: message.editedAt
    });

    const response: ApiResponse<{ message: IMessage }> = {
      success: true,
      data: { message },
      message: 'Message updated successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error updating message:', error);
    const errorMessage = error?.message || 'Failed to update message';
    next(new AppError(errorMessage, 400));
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private (Author or Wall Admin)
export const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.id;
    const userId = req.user!.id;

    const message = await Message.findById(messageId);
    if (!message || message.isDeleted) {
      return next(new AppError('Message not found', 404));
    }

    // Check permissions (author or wall admin)
    const wall = await Wall.findById(message.wall);
    const isAuthor = message.author.toString() === userId;
    const isWallAdmin = wall && (wall as any).isAdmin(userId);

    if (!isAuthor && !isWallAdmin) {
      return next(new AppError('Not authorized to delete this message', 403));
    }

    // Soft delete
    (message as any).softDelete(userId);
    await message.save();

    // Emit real-time update
    io.to(`wall_${message.wall}`).emit('message_deleted', {
      messageId,
      deletedBy: userId
    });

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Message deleted successfully' },
      message: 'Message deleted successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error deleting message:', error);
    const errorMessage = error?.message || 'Failed to delete message';
    next(new AppError(errorMessage, 400));
  }
};

// @desc    Pin/Unpin message (Wall admins only)
// @route   POST /api/messages/:id/pin
// @access  Private (Wall Admin only)
export const toggleMessagePin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.id;
    const userId = req.user!.id;

    const message = await Message.findById(messageId);
    if (!message || message.isDeleted) {
      return next(new AppError('Message not found', 404));
    }

    // Check if user is wall admin
    const wall = await Wall.findById(message.wall);
    if (!wall || !(wall as any).isAdmin(userId)) {
      return next(new AppError('Only wall admins can pin messages', 403));
    }

    if (message.isPinned) {
      (message as any).unpin();
    } else {
      (message as any).pin(userId);
    }

    await message.save();

    // Emit real-time update
    io.to(`wall_${message.wall}`).emit('message_pin_updated', {
      messageId,
      isPinned: message.isPinned,
      pinnedBy: userId
    });

    const response: ApiResponse<{ message: IMessage }> = {
      success: true,
      data: { message },
      message: message.isPinned ? 'Message pinned' : 'Message unpinned'
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error toggling message pin:', error);
    const errorMessage = error?.message || 'Failed to toggle message pin';
    next(new AppError(errorMessage, 400));
  }
};

// @desc    Report message
// @route   POST /api/messages/:id/report
// @access  Private
export const reportMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.id;
    const { reason } = req.body;
    const userId = req.user!.id;

    const message = await Message.findById(messageId);
    if (!message || message.isDeleted) {
      return next(new AppError('Message not found', 404));
    }

    // Cannot report own message
    if (message.author.toString() === userId) {
      return next(new AppError('Cannot report your own message', 400));
    }

    (message as any).report();
    await message.save();

    // Create notification for wall admins
    const wall = await Wall.findById(message.wall);
    if (wall) {
      const notifications = wall.admins.map((adminId: any) => ({
        recipient: adminId,
        sender: userId,
        type: 'report_resolved',
        title: 'Message Reported',
        message: `A message has been reported in ${wall.name}`,
        data: { 
          messageId, 
          wallId: wall._id.toString(),
          reason,
          url: `/walls/${wall._id}` 
        },
        priority: 'high'
      }));

      await Notification.insertMany(notifications);
    }

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Message reported successfully' },
      message: 'Message reported successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error reporting message:', error);
    const errorMessage = error?.message || 'Failed to report message';
    next(new AppError(errorMessage, 400));
  }
};
