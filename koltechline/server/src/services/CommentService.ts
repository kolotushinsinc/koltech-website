import mongoose from 'mongoose';
import Message, { IMessage } from '../models/Message.js';
import Wall from '../models/Wall.js';
import { AppError } from '../middleware/errorHandler.js';
import NotificationService from './NotificationService.js';

interface CreateCommentDTO {
  content: string;
  authorId: string;
  messageId: string;
  parentCommentId?: string;
}

interface UpdateCommentDTO {
  content?: string;
}

interface CommentTreeNode extends IMessage {
  nestedReplies?: CommentTreeNode[];
}

class CommentService {
  /**
   * Create a new comment or nested reply
   */
  async createComment(dto: CreateCommentDTO): Promise<IMessage> {
    const { content, authorId, messageId, parentCommentId } = dto;

    // Validate content
    if (!content || !content.trim()) {
      throw new AppError('Comment content is required', 400);
    }

    // Get parent message
    const parentMessage = await Message.findById(messageId);
    if (!parentMessage || parentMessage.isDeleted) {
      throw new AppError('Message not found', 404);
    }

    // Verify wall exists and check permissions
    const wall = await Wall.findById(parentMessage.wall);
    if (!wall || !wall.isActive) {
      throw new AppError('Wall not found', 404);
    }

    // Check comment permissions
    if (wall.settings?.commentPermissions === 'members' && !(wall as any).isMember(authorId)) {
      throw new AppError('Only wall members can comment', 403);
    }

    // If parentCommentId provided, verify it exists and belongs to same thread
    if (parentCommentId) {
      await this.validateParentComment(parentCommentId, messageId);
    }

    // Create comment
    const comment = await Message.create({
      content: content.trim(),
      author: authorId,
      wall: parentMessage.wall,
      parentMessage: parentCommentId || messageId,
      visibility: parentMessage.visibility
    });

    await comment.populate('author', 'firstName lastName username avatar');

    // Update parent message reply count (only for top-level comments)
    if (!parentCommentId) {
      (parentMessage as any).addReply(comment._id.toString());
      await parentMessage.save();
    }

    // Create notification
    const notificationRecipient = parentCommentId
      ? (await Message.findById(parentCommentId))?.author.toString()
      : parentMessage.author.toString();

    if (notificationRecipient && notificationRecipient !== authorId) {
      await NotificationService.createCommentNotification(
        notificationRecipient,
        authorId,
        comment._id.toString(),
        messageId
      );
    }

    return comment;
  }

  /**
   * Get all comments for a message with nested structure
   */
  async getCommentsTree(messageId: string, userId?: string): Promise<CommentTreeNode[]> {
    const message = await Message.findById(messageId);
    if (!message || message.isDeleted) {
      throw new AppError('Message not found', 404);
    }

    // Get all comment IDs first
    const allCommentIds = await this.getAllCommentIds(messageId);
    
    // Load all comments in one query for better performance
    const allComments = await Message.find({
      _id: { $in: allCommentIds },
      isDeleted: false
    })
      .populate('author', 'firstName lastName username avatar')
      .sort({ createdAt: 1 })
      .lean();

    // Build tree structure
    const commentsMap = new Map<string, CommentTreeNode>();
    const rootComments: CommentTreeNode[] = [];

    // First pass: create map of all comments
    allComments.forEach((comment: any) => {
      const commentNode: CommentTreeNode = {
        ...comment,
        nestedReplies: []
      };

      // Add user reaction if userId provided
      if (userId && comment.reactions) {
        const userReaction = comment.reactions.find((r: any) =>
          r.users.some((id: any) => id.toString() === userId)
        );
        (commentNode as any).userReaction = userReaction?.emoji || null;
      }

      commentsMap.set(comment._id.toString(), commentNode);
    });

    // Second pass: build tree structure
    commentsMap.forEach((comment) => {
      const parentId = comment.parentMessage?.toString();

      if (parentId === messageId) {
        // Top-level comment
        rootComments.push(comment);
      } else if (parentId && commentsMap.has(parentId)) {
        // Nested reply
        const parent = commentsMap.get(parentId)!;
        if (!parent.nestedReplies) {
          parent.nestedReplies = [];
        }
        parent.nestedReplies.push(comment);
      }
    });

    return rootComments;
  }

  /**
   * Get flat list of all comments (for backward compatibility)
   */
  async getCommentsList(messageId: string, userId?: string): Promise<IMessage[]> {
    const message = await Message.findById(messageId);
    if (!message || message.isDeleted) {
      throw new AppError('Message not found', 404);
    }

    // Get direct replies
    const directReplies = await Message.find({
      parentMessage: messageId,
      isDeleted: false
    })
      .populate('author', 'firstName lastName username avatar')
      .sort({ createdAt: 1 });

    // Get all nested replies recursively
    const directReplyIds = directReplies.map(r => r._id.toString());
    const allNestedReplies = await this.loadAllNestedComments(directReplyIds);

    // Combine all comments
    const allComments = [...directReplies, ...allNestedReplies];

    // Add user reaction info if userId provided
    return allComments.map((comment: any) => {
      const commentObj = comment.toObject ? comment.toObject() : comment;
      if (userId) {
        const userReaction = comment.getUserReaction?.(userId);
        commentObj.userReaction = userReaction;
      }
      return commentObj;
    });
  }

  /**
   * Update comment content
   */
  async updateComment(commentId: string, userId: string, dto: UpdateCommentDTO): Promise<IMessage> {
    const comment = await Message.findById(commentId);
    if (!comment || comment.isDeleted) {
      throw new AppError('Comment not found', 404);
    }

    // Verify this is a comment
    if (!comment.parentMessage) {
      throw new AppError('This is not a comment', 400);
    }

    // Only author can edit
    if (comment.author.toString() !== userId) {
      throw new AppError('Only comment author can edit', 403);
    }

    // Update content
    if (dto.content) {
      comment.content = dto.content.trim();
    }

    await comment.save();

    return comment;
  }

  /**
   * Delete comment (soft delete)
   */
  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await Message.findById(commentId);
    if (!comment || comment.isDeleted) {
      throw new AppError('Comment not found', 404);
    }

    // Verify this is a comment
    if (!comment.parentMessage) {
      throw new AppError('This is not a comment', 400);
    }

    // Check permissions (author or wall admin)
    const wall = await Wall.findById(comment.wall);
    const isAuthor = comment.author.toString() === userId;
    const isWallAdmin = wall && (wall as any).isAdmin(userId);

    if (!isAuthor && !isWallAdmin) {
      throw new AppError('Not authorized to delete this comment', 403);
    }

    // Get parent to update reply count
    const parentMessage = await Message.findById(comment.parentMessage);

    // Soft delete
    (comment as any).softDelete(userId);
    await comment.save();

    // Update parent reply count if it's a top-level comment
    if (parentMessage && !await this.isNestedReply(commentId)) {
      (parentMessage as any).removeReply(commentId);
      await parentMessage.save();
    }
  }

  /**
   * Add or toggle reaction on comment
   */
  async toggleCommentReaction(commentId: string, userId: string, emoji: string): Promise<{
    comment: IMessage;
    userReaction: string | null;
  }> {
    if (!emoji || typeof emoji !== 'string') {
      throw new AppError('Emoji is required', 400);
    }

    const comment = await Message.findById(commentId);
    if (!comment || comment.isDeleted) {
      throw new AppError('Comment not found', 404);
    }

    // Verify this is a comment
    if (!comment.parentMessage) {
      throw new AppError('This is not a comment', 400);
    }

    // Toggle reaction
    (comment as any).toggleReaction(userId, emoji);
    await comment.save();

    // Get user's current reaction
    const userReaction = (comment as any).getUserReaction(userId);

    // Create notification if adding reaction
    if (userReaction && comment.author.toString() !== userId) {
      await NotificationService.createLikeNotification(
        comment.author.toString(),
        userId,
        commentId
      );
    }

    return {
      comment,
      userReaction
    };
  }

  /**
   * Get comment by ID with author populated
   */
  async getCommentById(commentId: string, userId?: string): Promise<IMessage> {
    const comment = await Message.findById(commentId)
      .populate('author', 'firstName lastName username avatar');

    if (!comment || comment.isDeleted) {
      throw new AppError('Comment not found', 404);
    }

    if (!comment.parentMessage) {
      throw new AppError('This is not a comment', 400);
    }

    // Add user reaction if userId provided
    if (userId) {
      const commentObj = comment.toObject();
      (commentObj as any).userReaction = (comment as any).getUserReaction(userId);
      return commentObj as IMessage;
    }

    return comment;
  }

  // ============ PRIVATE HELPER METHODS ============

  /**
   * Validate parent comment belongs to the same message thread
   */
  private async validateParentComment(parentCommentId: string, messageId: string): Promise<void> {
    const parentComment = await Message.findById(parentCommentId);
    if (!parentComment || parentComment.isDeleted) {
      throw new AppError('Parent comment not found', 404);
    }

    // Traverse up to find root message
    let currentComment = parentComment;
    let rootMessageId = currentComment.parentMessage?.toString();
    let depth = 0;
    const maxDepth = 10;

    while (rootMessageId && depth < maxDepth) {
      const nextParent = await Message.findById(rootMessageId);
      if (!nextParent) break;

      if (!nextParent.parentMessage) {
        rootMessageId = nextParent._id.toString();
        break;
      }

      rootMessageId = nextParent.parentMessage.toString();
      depth++;
    }

    // Verify root message matches
    if (rootMessageId !== messageId) {
      throw new AppError('Parent comment does not belong to this message thread', 400);
    }
  }

  /**
   * Check if comment is a nested reply (not a direct reply to message)
   */
  private async isNestedReply(commentId: string): Promise<boolean> {
    const comment = await Message.findById(commentId);
    if (!comment || !comment.parentMessage) return false;

    const parent = await Message.findById(comment.parentMessage);
    // If parent has a parentMessage, this is a nested reply
    return !!(parent && parent.parentMessage);
  }

  /**
   * Recursively load all nested comments
   */
  private async loadAllNestedComments(parentIds: string[]): Promise<any[]> {
    if (parentIds.length === 0) return [];

    const comments = await Message.find({
      parentMessage: { $in: parentIds },
      isDeleted: false
    })
      .populate('author', 'firstName lastName username avatar')
      .sort({ createdAt: 1 });

    if (comments.length === 0) return [];

    // Recursively load next level
    const commentIds = comments.map(c => c._id.toString());
    const nestedComments = await this.loadAllNestedComments(commentIds);

    return [...comments, ...nestedComments];
  }

  /**
   * Get all comment IDs for a message (for efficient querying)
   */
  private async getAllCommentIds(messageId: string): Promise<string[]> {
    const directComments = await Message.find({
      parentMessage: messageId,
      isDeleted: false
    }).select('_id');

    const directIds = directComments.map(c => c._id.toString());
    const nestedIds = await this.getNestedCommentIds(directIds);

    return [...directIds, ...nestedIds];
  }

  /**
   * Recursively get nested comment IDs
   */
  private async getNestedCommentIds(parentIds: string[]): Promise<string[]> {
    if (parentIds.length === 0) return [];

    const comments = await Message.find({
      parentMessage: { $in: parentIds },
      isDeleted: false
    }).select('_id');

    if (comments.length === 0) return [];

    const commentIds = comments.map(c => c._id.toString());
    const nestedIds = await this.getNestedCommentIds(commentIds);

    return [...commentIds, ...nestedIds];
  }
}

export default new CommentService();
