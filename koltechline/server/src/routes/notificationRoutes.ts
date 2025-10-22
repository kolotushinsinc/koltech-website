import express from 'express';
import Joi from 'joi';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
  getUnreadCount,
  createTestNotification,
  clearOldNotifications
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// All notification routes require authentication
router.use(protect);

// Validation schemas
const getNotificationsSchema = Joi.object({
  type: Joi.string().valid(
    'wall_post', 'wall_author_post', 'comment', 'reply', 'like', 
    'contact_request', 'contact_accepted', 'wall_invite', 'wall_admin', 
    'kolophone_call', 'private_message', 'group_message', 'report_resolved'
  ).optional(),
  isRead: Joi.string().valid('true', 'false').optional(),
  priority: Joi.string().valid('low', 'normal', 'high', 'urgent').optional(),
  limit: Joi.number().integer().min(1).max(100).default(20),
  page: Joi.number().integer().min(1).default(1)
});

const notificationIdSchema = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
});

const preferencesSchema = Joi.object({
  preferences: Joi.object({
    email: Joi.object({
      wallPosts: Joi.boolean().optional(),
      wallAuthorPosts: Joi.boolean().optional(),
      comments: Joi.boolean().optional(),
      likes: Joi.boolean().optional(),
      contactRequests: Joi.boolean().optional(),
      kolophoneCalls: Joi.boolean().optional(),
      privateMessages: Joi.boolean().optional(),
      groupMessages: Joi.boolean().optional(),
      reports: Joi.boolean().optional()
    }).optional(),
    push: Joi.object({
      wallPosts: Joi.boolean().optional(),
      wallAuthorPosts: Joi.boolean().optional(),
      comments: Joi.boolean().optional(),
      likes: Joi.boolean().optional(),
      contactRequests: Joi.boolean().optional(),
      kolophoneCalls: Joi.boolean().optional(),
      privateMessages: Joi.boolean().optional(),
      groupMessages: Joi.boolean().optional(),
      reports: Joi.boolean().optional()
    }).optional(),
    inApp: Joi.object({
      wallPosts: Joi.boolean().optional(),
      wallAuthorPosts: Joi.boolean().optional(),
      comments: Joi.boolean().optional(),
      likes: Joi.boolean().optional(),
      contactRequests: Joi.boolean().optional(),
      kolophoneCalls: Joi.boolean().optional(),
      privateMessages: Joi.boolean().optional(),
      groupMessages: Joi.boolean().optional(),
      reports: Joi.boolean().optional()
    }).optional()
  }).required()
});

const testNotificationSchema = Joi.object({
  type: Joi.string().valid(
    'wall_post', 'wall_author_post', 'comment', 'reply', 'like', 
    'contact_request', 'contact_accepted', 'wall_invite', 'wall_admin', 
    'kolophone_call', 'private_message', 'group_message', 'report_resolved'
  ).optional(),
  title: Joi.string().trim().max(100).optional(),
  message: Joi.string().trim().max(500).optional()
});

const clearOldSchema = Joi.object({
  olderThanDays: Joi.number().integer().min(1).max(365).default(30)
});

// Routes
router.get(
  '/',
  validateRequest(getNotificationsSchema, 'query'),
  getNotifications
);

router.get(
  '/unread-count',
  getUnreadCount
);

router.get(
  '/preferences',
  getNotificationPreferences
);

router.put(
  '/preferences',
  validateRequest(preferencesSchema),
  updateNotificationPreferences
);

router.put(
  '/read-all',
  markAllNotificationsAsRead
);

router.put(
  '/:id/read',
  validateRequest(notificationIdSchema, 'params'),
  markNotificationAsRead
);

router.delete(
  '/:id',
  validateRequest(notificationIdSchema, 'params'),
  deleteNotification
);

router.delete(
  '/clear-old',
  validateRequest(clearOldSchema, 'query'),
  clearOldNotifications
);

// Development only
if (process.env.NODE_ENV !== 'production') {
  router.post(
    '/test',
    validateRequest(testNotificationSchema),
    createTestNotification
  );
}

export default router;