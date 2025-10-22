import { Request, Response, NextFunction } from 'express';
import Notification, { INotification } from '../models/Notification.js';
import User from '../models/User.js';
import { ApiResponse } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { io } from '../index.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { 
      type, 
      isRead, 
      limit = 20, 
      page = 1,
      priority
    } = req.query;

    const options = {
      type: type as string,
      isRead: isRead === 'true' ? true : isRead === 'false' ? false : undefined,
      limit: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      priority: priority as string
    };

    const notifications = await (Notification as any).findByUser(userId, options);
    const unreadCount = await (Notification as any).getUnreadCount(userId);

    const response: ApiResponse<{ notifications: INotification[]; unreadCount: number }> = {
      success: true,
      data: { notifications, unreadCount },
      message: 'Notifications retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markNotificationAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user!.id;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }

    if (notification.recipient.toString() !== userId) {
      return next(new AppError('Not authorized to update this notification', 403));
    }

    (notification as any).markAsRead();
    await notification.save();

    const response: ApiResponse<{ notification: INotification }> = {
      success: true,
      data: { notification },
      message: 'Notification marked as read'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllNotificationsAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    await (Notification as any).markAllAsRead(userId);

    // Emit to user's socket
    io.to(`user_${userId}`).emit('notifications_marked_read', {
      allRead: true
    });

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'All notifications marked as read' },
      message: 'All notifications marked as read'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user!.id;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }

    if (notification.recipient.toString() !== userId) {
      return next(new AppError('Not authorized to delete this notification', 403));
    }

    await Notification.findByIdAndDelete(notificationId);

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Notification deleted successfully' },
      message: 'Notification deleted successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get notification preferences
// @route   GET /api/notifications/preferences
// @access  Private
export const getNotificationPreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const user = await User.findById(userId).select('notificationPreferences');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const defaultPreferences = {
      email: {
        wallPosts: true,
        wallAuthorPosts: true,
        comments: true,
        likes: false,
        contactRequests: true,
        kolophoneCalls: true,
        privateMessages: true,
        groupMessages: true,
        reports: true
      },
      push: {
        wallPosts: false,
        wallAuthorPosts: true,
        comments: true,
        likes: false,
        contactRequests: true,
        kolophoneCalls: true,
        privateMessages: true,
        groupMessages: false,
        reports: true
      },
      inApp: {
        wallPosts: true,
        wallAuthorPosts: true,
        comments: true,
        likes: true,
        contactRequests: true,
        kolophoneCalls: true,
        privateMessages: true,
        groupMessages: true,
        reports: true
      }
    };

    const preferences = (user as any).notificationPreferences || defaultPreferences;

    const response: ApiResponse<{ preferences: any }> = {
      success: true,
      data: { preferences },
      message: 'Notification preferences retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Update notification preferences
// @route   PUT /api/notifications/preferences
// @access  Private
export const updateNotificationPreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { preferences } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    (user as any).notificationPreferences = preferences;
    await user.save();

    const response: ApiResponse<{ preferences: any }> = {
      success: true,
      data: { preferences },
      message: 'Notification preferences updated successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const unreadCount = await (Notification as any).getUnreadCount(userId);

    const response: ApiResponse<{ count: number }> = {
      success: true,
      data: { count: unreadCount },
      message: 'Unread count retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Create test notification (for development)
// @route   POST /api/notifications/test
// @access  Private
export const createTestNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return next(new AppError('Test notifications not available in production', 403));
    }

    const userId = req.user!.id;
    const { type = 'wall_post', title, message } = req.body;

    const notification = await (Notification as any).createNotification({
      recipient: userId,
      type,
      title: title || 'Test Notification',
      message: message || 'This is a test notification from KolTech',
      data: { testData: true }
    });

    // Emit to user's socket
    io.to(`user_${userId}`).emit('new_notification', notification);

    const response: ApiResponse<{ notification: INotification }> = {
      success: true,
      data: { notification },
      message: 'Test notification created successfully'
    };

    res.status(201).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Clear old notifications
// @route   DELETE /api/notifications/clear-old
// @access  Private
export const clearOldNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { olderThanDays = 30 } = req.query;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - Number(olderThanDays));

    const result = await Notification.deleteMany({
      recipient: userId,
      createdAt: { $lt: cutoffDate },
      isRead: true
    });

    const response: ApiResponse<{ deletedCount: number }> = {
      success: true,
      data: { deletedCount: result.deletedCount || 0 },
      message: `Cleared ${result.deletedCount || 0} old notifications`
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Helper function to send real-time notification
export const sendRealtimeNotification = async (notification: INotification) => {
  try {
    // Emit to user's notification room
    io.to(`user_${notification.recipient}`).emit('new_notification', {
      id: notification._id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      priority: notification.priority,
      createdAt: notification.createdAt,
      sender: notification.sender
    });

    // Mark as delivered
    (notification as any).markAsDelivered();
    await notification.save();
  } catch (error) {
    console.error('Error sending real-time notification:', error);
  }
};