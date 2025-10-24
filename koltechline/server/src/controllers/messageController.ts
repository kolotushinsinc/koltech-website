import { Request, Response, NextFunction } from 'express';
import Message, { IMessage } from '../models/Message.js';
import Wall from '../models/Wall.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { ApiResponse } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { io } from '../index.js';
import CommentService from '../services/CommentService.js';
import ReactionService from '../services/ReactionService.js';
import NotificationService from '../services/NotificationService.js';
import VideoProcessingService from '../services/VideoProcessingService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

    // Process video attachments in background
    if (sanitizedAttachments.length > 0) {
      sanitizedAttachments.forEach(async (attachment: any, index: number) => {
        if (attachment.type === 'video' && attachment.url) {
          try {
            // Generate unique video ID
            const videoId = `${message._id}-${index}-${Date.now()}`;
            
            // Get full path to video file
            const videoPath = path.join(__dirname, '../../', attachment.url);
            
            console.log(`🎬 Processing video: ${videoPath} → ${videoId}`);
            
            // Process video to HLS (async, don't wait)
            VideoProcessingService.processVideoToHLS(videoPath, videoId)
              .then(async (hlsPath) => {
                console.log(`✅ Video processed successfully: ${hlsPath}`);
                
                // Update message attachment with HLS path
                const updatedMessage = await Message.findById(message._id);
                if (updatedMessage && updatedMessage.attachments) {
                  updatedMessage.attachments[index] = {
                    ...attachment,
                    url: hlsPath,
                    originalUrl: attachment.url, // Keep original for fallback
                    isHLS: true
                  };
                  await updatedMessage.save();
                  
                  // Emit update to clients
                  io.to(`wall_${wallId}`).emit('message_video_processed', {
                    messageId: message._id,
                    attachmentIndex: index,
                    hlsPath,
                    videoId
                  });
                  
                  console.log(`📤 Emitted video processing complete for message ${message._id}`);
                }
              })
              .catch((error) => {
                console.error(`❌ Error processing video ${videoId}:`, error);
                // Video processing failed, but message is still created with original video
              });
          } catch (error) {
            console.error('Error initiating video processing:', error);
          }
        }
      });
    }

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

    // Get current reaction before toggle
    const hadReaction = (message as any).getUserReaction(userId);

    // Toggle reaction
    (message as any).toggleReaction(userId, emoji);
    await message.save();

    // Get user's current reaction after toggle
    const userReaction = (message as any).getUserReaction(userId);
    const action = userReaction ? 'added' : 'removed';

    // Create notification for message author if adding reaction
    if (userReaction && message.author.toString() !== userId) {
      await NotificationService.createLikeNotification(
        message.author.toString(),
        userId,
        messageId,
        'message'
      );
    }

    // Emit real-time update with enhanced data
    const eventData = {
      messageId,
      reactions: message.reactions || [],
      userId,
      userReaction,
      action,
      wallId: message.wall.toString()
    };

    console.log('📤 Emitting message_reaction_updated:', eventData);
    io.to(`wall_${message.wall}`).emit('message_reaction_updated', eventData);

    const response: ApiResponse<{ 
      message: IMessage; 
      userReaction: string | null;
      reactions: any[];
      action: string;
    }> = {
      success: true,
      data: { 
        message, 
        userReaction,
        reactions: message.reactions || [],
        action
      },
      message: userReaction ? 'Reaction added' : 'Reaction removed'
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error toggling message reaction:', error);
    next(error);
  }
};

// @desc    Add comment to message
// @route   POST /api/messages/:id/comments
// @access  Private
export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.id;
    const { content, parentCommentId, attachments } = req.body;
    const userId = req.user!.id;

    // Use CommentService to create comment
    const comment = await CommentService.createComment({
      content,
      authorId: userId,
      messageId,
      parentCommentId,
      attachments: attachments || []
    });

    // Get parent message for wall ID
    const parentMessage = await Message.findById(messageId);
    
    // Emit real-time update with enhanced data
    if (parentMessage) {
      const eventData = {
        comment: comment.toObject(),
        parentMessageId: messageId,
        parentCommentId: parentCommentId || null,
        wallId: parentMessage.wall.toString(),
        isNestedReply: !!parentCommentId
      };
      
      // Emit to wall room
      io.to(`wall_${parentMessage.wall}`).emit('new_comment', eventData);
      
      // Also emit specific event for nested replies
      if (parentCommentId) {
        io.to(`wall_${parentMessage.wall}`).emit('nested_reply_added', eventData);
      }
    }

    const response: ApiResponse<{ comment: IMessage }> = {
      success: true,
      data: { comment },
      message: 'Comment added successfully'
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error('Error adding comment:', error);
    next(error);
  }
};

// @desc    Get comments for message
// @route   GET /api/messages/:id/comments
// @access  Public/Private (based on message visibility)
export const getMessageComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.id;
    const userId = req.user?.id;

    // Use CommentService to get comments (returns flat list for backward compatibility)
    const comments = await CommentService.getCommentsList(messageId, userId);

    const response: ApiResponse<{ comments: IMessage[] }> = {
      success: true,
      data: { comments },
      message: 'Comments retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error getting message comments:', error);
    next(error);
  }
};

// @desc    Add/Remove reaction to comment
// @route   POST /api/messages/comments/:id/react
// @access  Private
export const toggleCommentReaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const commentId = req.params.id;
    const { emoji } = req.body;
    const userId = req.user!.id;

    // Use CommentService to toggle reaction
    const result = await CommentService.toggleCommentReaction(commentId, userId, emoji);

    // Get comment for wall ID
    const comment = await Message.findById(commentId);
    
    // Emit real-time update to wall
    if (comment) {
      io.to(`wall_${comment.wall}`).emit('comment_reaction_updated', {
        commentId,
        parentMessageId: comment.parentMessage,
        reactions: result.comment.reactions,
        userId,
        userReaction: result.userReaction
      });
    }

    const response: ApiResponse<{ 
      comment: IMessage; 
      userReaction: string | null;
      reactions: any[];
    }> = {
      success: true,
      data: { 
        comment: result.comment, 
        userReaction: result.userReaction,
        reactions: result.comment.reactions || []
      },
      message: result.userReaction ? 'Reaction added' : 'Reaction removed'
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error toggling comment reaction:', error);
    next(error);
  }
};

// @desc    Update comment
// @route   PUT /api/messages/comments/:id
// @access  Private (Author only)
export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const commentId = req.params.id;
    const { content } = req.body;
    const userId = req.user!.id;

    // Use CommentService to update comment
    const comment = await CommentService.updateComment(commentId, userId, { content });

    // Emit real-time update
    io.to(`wall_${comment.wall}`).emit('comment_updated', {
      commentId,
      parentMessageId: comment.parentMessage,
      content: comment.content,
      isEdited: comment.isEdited,
      editedAt: comment.editedAt
    });

    const response: ApiResponse<{ comment: IMessage }> = {
      success: true,
      data: { comment },
      message: 'Comment updated successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error updating comment:', error);
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/messages/comments/:id
// @access  Private (Author or Wall Admin)
export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const commentId = req.params.id;
    const userId = req.user!.id;

    // Get comment for wall ID before deletion
    const comment = await Message.findById(commentId);
    const wallId = comment?.wall;
    const parentMessageId = comment?.parentMessage;

    // Use CommentService to delete comment
    await CommentService.deleteComment(commentId, userId);

    // Emit real-time update
    if (wallId) {
      io.to(`wall_${wallId}`).emit('comment_deleted', {
        commentId,
        parentMessageId,
        deletedBy: userId
      });
    }

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Comment deleted successfully' },
      message: 'Comment deleted successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    next(error);
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
