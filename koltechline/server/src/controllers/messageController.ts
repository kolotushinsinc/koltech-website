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
    const { content, parentCommentId } = req.body;
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

    // If parentCommentId is provided, verify it exists and belongs to the same message thread
    if (parentCommentId) {
      const parentComment = await Message.findById(parentCommentId);
      if (!parentComment || parentComment.isDeleted) {
        return next(new AppError('Parent comment not found', 404));
      }
      
      // Verify parent comment belongs to the same message thread
      // Need to traverse up the chain to find the root message
      let currentComment = parentComment;
      let rootMessageId = currentComment.parentMessage?.toString();
      
      // Traverse up to find the root message (max 10 levels to prevent infinite loops)
      let depth = 0;
      while (rootMessageId && depth < 10) {
        const nextParent = await Message.findById(rootMessageId);
        if (!nextParent) break;
        
        // If this parent has no parentMessage, it's the root message
        if (!nextParent.parentMessage) {
          rootMessageId = nextParent._id.toString();
          break;
        }
        
        // Otherwise, keep traversing up
        rootMessageId = nextParent.parentMessage.toString();
        depth++;
      }
      
      // Verify the root message matches the messageId
      if (rootMessageId !== messageId) {
        return next(new AppError('Parent comment does not belong to this message thread', 400));
      }
    }

    // Create comment as a reply message
    // If parentCommentId is provided, this is a nested reply
    // Otherwise, it's a direct reply to the message
    const comment = await Message.create({
      content: content.trim(),
      author: userId,
      wall: parentMessage.wall,
      parentMessage: parentCommentId || messageId, // Use parentCommentId if provided, otherwise messageId
      visibility: parentMessage.visibility
    });

    await comment.populate('author', 'firstName lastName username avatar');

    // Update parent message reply count (only for top-level comments)
    if (!parentCommentId) {
      (parentMessage as any).addReply(comment._id.toString());
      await parentMessage.save();
    }

    // Emit real-time update
    io.to(`wall_${parentMessage.wall}`).emit('new_comment', {
      comment: comment.toObject(),
      parentMessageId: messageId,
      parentCommentId: parentCommentId || null
    });

    // Create notification for message author or parent comment author
    const notificationRecipient = parentCommentId 
      ? (await Message.findById(parentCommentId))?.author.toString()
      : parentMessage.author.toString();
      
    if (notificationRecipient && notificationRecipient !== userId) {
      await (Notification as any).createCommentNotification(
        notificationRecipient,
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
    const userId = req.user?.id;

    const message = await Message.findById(messageId);
    if (!message || message.isDeleted) {
      return next(new AppError('Message not found', 404));
    }

    // Рекурсивная функция для загрузки всех вложенных комментариев
    const loadAllNestedComments = async (parentIds: string[]): Promise<any[]> => {
      if (parentIds.length === 0) return [];
      
      const comments = await Message.find({
        parentMessage: { $in: parentIds },
        isDeleted: false
      })
        .populate('author', 'firstName lastName username avatar')
        .sort({ createdAt: 1 });
      
      if (comments.length === 0) return [];
      
      // Рекурсивно загружаем вложенные комментарии следующего уровня
      const commentIds = comments.map(c => c._id.toString());
      const nestedComments = await loadAllNestedComments(commentIds);
      
      return [...comments, ...nestedComments];
    };
    
    // Сначала загружаем прямые ответы на сообщение
    const directReplies = await Message.find({
      parentMessage: messageId,
      isDeleted: false
    })
      .populate('author', 'firstName lastName username avatar')
      .sort({ createdAt: 1 });

    // Затем рекурсивно загружаем ВСЕ вложенные комментарии
    const directReplyIds = directReplies.map(r => r._id.toString());
    const allNestedReplies = await loadAllNestedComments(directReplyIds);

    // Объединяем все комментарии
    const allComments = [...directReplies, ...allNestedReplies];
    
    // Add user reaction info to each comment if user is logged in
    const commentsWithUserReaction = allComments.map((comment: any) => {
      const commentObj = comment.toObject();
      if (userId) {
        commentObj.userReaction = comment.getUserReaction(userId);
      }
      return commentObj;
    });

    const response: ApiResponse<{ comments: IMessage[] }> = {
      success: true,
      data: { comments: commentsWithUserReaction },
      message: 'Comments retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error getting message comments:', error);
    const errorMessage = error?.message || 'Failed to get message comments';
    next(new AppError(errorMessage, 400));
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

    if (!emoji || typeof emoji !== 'string') {
      return next(new AppError('Emoji is required', 400));
    }

    const comment = await Message.findById(commentId);
    if (!comment || comment.isDeleted) {
      return next(new AppError('Comment not found', 404));
    }

    // Verify this is actually a comment (has parentMessage)
    if (!comment.parentMessage) {
      return next(new AppError('This is not a comment', 400));
    }

    // Toggle reaction
    (comment as any).toggleReaction(userId, emoji);
    await comment.save();

    // Get user's current reaction
    const userReaction = (comment as any).getUserReaction(userId);

    // Create notification for comment author if adding reaction
    if (userReaction && comment.author.toString() !== userId) {
      await (Notification as any).createLikeNotification(
        comment.author.toString(),
        userId,
        commentId
      );
    }

    // Emit real-time update to wall
    io.to(`wall_${comment.wall}`).emit('comment_reaction_updated', {
      commentId,
      parentMessageId: comment.parentMessage,
      reactions: comment.reactions,
      userId,
      userReaction
    });

    const response: ApiResponse<{ 
      comment: IMessage; 
      userReaction: string | null;
      reactions: any[];
    }> = {
      success: true,
      data: { 
        comment, 
        userReaction,
        reactions: comment.reactions || []
      },
      message: userReaction ? 'Reaction added' : 'Reaction removed'
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error toggling comment reaction:', error);
    const errorMessage = error?.message || 'Failed to toggle comment reaction';
    next(new AppError(errorMessage, 400));
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

    const comment = await Message.findById(commentId);
    if (!comment || comment.isDeleted) {
      return next(new AppError('Comment not found', 404));
    }

    // Verify this is actually a comment
    if (!comment.parentMessage) {
      return next(new AppError('This is not a comment', 400));
    }

    // Only author can edit
    if (comment.author.toString() !== userId) {
      return next(new AppError('Only comment author can edit', 403));
    }

    // Update comment
    if (content) comment.content = content.trim();
    await comment.save();

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
    const errorMessage = error?.message || 'Failed to update comment';
    next(new AppError(errorMessage, 400));
  }
};

// @desc    Delete comment
// @route   DELETE /api/messages/comments/:id
// @access  Private (Author or Wall Admin)
export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const commentId = req.params.id;
    const userId = req.user!.id;

    const comment = await Message.findById(commentId);
    if (!comment || comment.isDeleted) {
      return next(new AppError('Comment not found', 404));
    }

    // Verify this is actually a comment
    if (!comment.parentMessage) {
      return next(new AppError('This is not a comment', 400));
    }

    // Check permissions (author or wall admin)
    const wall = await Wall.findById(comment.wall);
    const isAuthor = comment.author.toString() === userId;
    const isWallAdmin = wall && (wall as any).isAdmin(userId);

    if (!isAuthor && !isWallAdmin) {
      return next(new AppError('Not authorized to delete this comment', 403));
    }

    // Get parent message to update reply count
    const parentMessage = await Message.findById(comment.parentMessage);
    
    // Soft delete
    (comment as any).softDelete(userId);
    await comment.save();

    // Update parent message reply count
    if (parentMessage) {
      (parentMessage as any).removeReply(commentId);
      await parentMessage.save();
    }

    // Emit real-time update
    io.to(`wall_${comment.wall}`).emit('comment_deleted', {
      commentId,
      parentMessageId: comment.parentMessage,
      deletedBy: userId
    });

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Comment deleted successfully' },
      message: 'Comment deleted successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    const errorMessage = error?.message || 'Failed to delete comment';
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
