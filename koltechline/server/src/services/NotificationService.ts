import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

interface CreateNotificationDTO {
  recipient: string;
  sender: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  priority?: 'low' | 'medium' | 'high';
}

class NotificationService {
  /**
   * Create a generic notification
   */
  async createNotification(dto: CreateNotificationDTO): Promise<any> {
    try {
      // Validate recipient and sender exist
      if (!dto.recipient || !dto.sender) {
        console.warn('Skipping notification - missing recipient or sender');
        return null;
      }

      const notification = await Notification.create({
        recipient: dto.recipient,
        sender: dto.sender,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        data: dto.data || {},
        priority: dto.priority || 'medium',
        isRead: false
      });

      return notification;
    } catch (error: any) {
      // Don't throw error, just log it - notifications shouldn't break the main flow
      console.error('Error creating notification (non-critical):', error.message);
      return null;
    }
  }

  /**
   * Create notification for a new comment
   */
  async createCommentNotification(
    recipientId: string,
    senderId: string,
    commentId: string,
    messageId: string
  ): Promise<any> {
    try {
      const sender = await User.findById(senderId).select('firstName lastName username');
      if (!sender) return null;

      const senderName = sender.username || `${sender.firstName} ${sender.lastName}`;

      return await this.createNotification({
        recipient: recipientId,
        sender: senderId,
        type: 'comment',
        title: 'New Comment',
        message: `${senderName} commented on your post`,
        data: {
          commentId,
          messageId,
          url: `/messages/${messageId}#comment-${commentId}`
        },
        priority: 'medium'
      });
    } catch (error: any) {
      console.error('Error creating comment notification:', error);
      return null;
    }
  }

  /**
   * Create notification for a like/reaction
   */
  async createLikeNotification(
    recipientId: string,
    senderId: string,
    targetId: string,
    targetType: 'message' | 'comment' = 'message'
  ): Promise<any> {
    try {
      const sender = await User.findById(senderId).select('firstName lastName username');
      if (!sender) return null;

      const senderName = sender.username || `${sender.firstName} ${sender.lastName}`;

      return await this.createNotification({
        recipient: recipientId,
        sender: senderId,
        type: 'like',
        title: 'New Reaction',
        message: `${senderName} reacted to your ${targetType}`,
        data: {
          targetId,
          targetType,
          url: targetType === 'message' ? `/messages/${targetId}` : `/messages/${targetId}`
        },
        priority: 'low'
      });
    } catch (error: any) {
      console.error('Error creating like notification:', error);
      return null;
    }
  }

  /**
   * Create notification for a reply
   */
  async createReplyNotification(
    recipientId: string,
    senderId: string,
    replyId: string,
    parentId: string
  ): Promise<any> {
    try {
      const sender = await User.findById(senderId).select('firstName lastName username');
      if (!sender) return null;

      const senderName = sender.username || `${sender.firstName} ${sender.lastName}`;

      return await this.createNotification({
        recipient: recipientId,
        sender: senderId,
        type: 'reply',
        title: 'New Reply',
        message: `${senderName} replied to your comment`,
        data: {
          replyId,
          parentId,
          url: `/messages/${parentId}#comment-${replyId}`
        },
        priority: 'medium'
      });
    } catch (error: any) {
      console.error('Error creating reply notification:', error);
      return null;
    }
  }

  /**
   * Create notification for a mention
   */
  async createMentionNotification(
    recipientId: string,
    senderId: string,
    contentId: string,
    contentType: 'message' | 'comment'
  ): Promise<any> {
    try {
      const sender = await User.findById(senderId).select('firstName lastName username');
      if (!sender) return null;

      const senderName = sender.username || `${sender.firstName} ${sender.lastName}`;

      return await this.createNotification({
        recipient: recipientId,
        sender: senderId,
        type: 'mention',
        title: 'You were mentioned',
        message: `${senderName} mentioned you in a ${contentType}`,
        data: {
          contentId,
          contentType,
          url: contentType === 'message' ? `/messages/${contentId}` : `/messages/${contentId}`
        },
        priority: 'high'
      });
    } catch (error: any) {
      console.error('Error creating mention notification:', error);
      return null;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<any> {
    try {
      const notification = await Notification.findOne({
        _id: notificationId,
        recipient: userId
      });

      if (!notification) {
        throw new AppError('Notification not found', 404);
      }

      notification.isRead = true;
      notification.readAt = new Date();
      await notification.save();

      return notification;
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      await Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      throw new AppError('Failed to mark notifications as read', 500);
    }
  }

  /**
   * Get user notifications with pagination
   */
  async getUserNotifications(
    userId: string,
    options: { limit?: number; skip?: number; unreadOnly?: boolean } = {}
  ): Promise<any[]> {
    try {
      const { limit = 20, skip = 0, unreadOnly = false } = options;

      const query: any = { recipient: userId };
      if (unreadOnly) {
        query.isRead = false;
      }

      const notifications = await Notification.find(query)
        .populate('sender', 'firstName lastName username avatar')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      return notifications;
    } catch (error: any) {
      console.error('Error getting user notifications:', error);
      throw new AppError('Failed to get notifications', 500);
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const count = await Notification.countDocuments({
        recipient: userId,
        isRead: false
      });

      return count;
    } catch (error: any) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    try {
      const notification = await Notification.findOne({
        _id: notificationId,
        recipient: userId
      });

      if (!notification) {
        throw new AppError('Notification not found', 404);
      }

      await notification.deleteOne();
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Delete all notifications for a user
   */
  async deleteAllNotifications(userId: string): Promise<void> {
    try {
      await Notification.deleteMany({ recipient: userId });
    } catch (error: any) {
      console.error('Error deleting all notifications:', error);
      throw new AppError('Failed to delete notifications', 500);
    }
  }
}

export default new NotificationService();
