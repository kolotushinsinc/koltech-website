import express from 'express';
import Joi from 'joi';
import {
  createMessage,
  getWallMessages,
  toggleMessageLike,
  toggleMessageReaction,
  addComment,
  getMessageComments,
  updateMessage,
  deleteMessage,
  toggleMessagePin,
  reportMessage
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Validation schemas
const createMessageSchema = Joi.object({
  content: Joi.string().trim().max(5000).allow('').optional(),
  wallId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  attachments: Joi.array().items(
    Joi.object({
      type: Joi.string().valid('image', 'video', 'gif', 'sticker', 'file').required(),
      url: Joi.string().required(), // Allow relative paths, not just URIs
      filename: Joi.string().optional(),
      size: Joi.number().integer().min(0).optional(),
      mimetype: Joi.string().optional()
    })
  ).optional(),
  tags: Joi.array().items(
    Joi.string().trim().min(1).max(50)
  ).optional(),
  visibility: Joi.string().valid('public', 'members', 'admins').default('members')
}).custom((value, helpers) => {
  // Custom validation: require either content or attachments
  const hasContent = value.content && value.content.trim();
  const hasAttachments = value.attachments && value.attachments.length > 0;
  
  if (!hasContent && !hasAttachments) {
    return helpers.error('any.custom', { message: 'Message must have either content or attachments' });
  }
  
  return value;
});

const getWallMessagesSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(50).default(20),
  page: Joi.number().integer().min(1).default(1)
});

const wallIdSchema = Joi.object({
  wallId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
});

const messageIdSchema = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
});

const addCommentSchema = Joi.object({
  content: Joi.string().trim().min(1).max(2000).required()
});

const updateMessageSchema = Joi.object({
  content: Joi.string().trim().min(1).max(5000).optional(),
  tags: Joi.array().items(
    Joi.string().trim().min(1).max(50)
  ).optional()
});

const reportMessageSchema = Joi.object({
  reason: Joi.string().trim().min(1).max(500).required()
});

const reactionSchema = Joi.object({
  emoji: Joi.string().trim().min(1).max(10).required()
});

const getCommentsSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(50).default(10),
  page: Joi.number().integer().min(1).default(1)
});

// Public routes
router.get(
  '/wall/:wallId',
  validateRequest(wallIdSchema, 'params'),
  validateRequest(getWallMessagesSchema, 'query'),
  getWallMessages
);

router.get(
  '/:id/comments',
  validateRequest(messageIdSchema, 'params'),
  validateRequest(getCommentsSchema, 'query'),
  getMessageComments
);

// Protected routes
router.use(protect);

router.post(
  '/',
  validateRequest(createMessageSchema),
  createMessage
);

router.post(
  '/:id/like',
  validateRequest(messageIdSchema, 'params'),
  toggleMessageLike
);

router.post(
  '/:id/react',
  validateRequest(messageIdSchema, 'params'),
  validateRequest(reactionSchema),
  toggleMessageReaction
);

router.post(
  '/:id/comments',
  validateRequest(messageIdSchema, 'params'),
  validateRequest(addCommentSchema),
  addComment
);

router.put(
  '/:id',
  validateRequest(messageIdSchema, 'params'),
  validateRequest(updateMessageSchema),
  updateMessage
);

router.delete(
  '/:id',
  validateRequest(messageIdSchema, 'params'),
  deleteMessage
);

router.post(
  '/:id/pin',
  validateRequest(messageIdSchema, 'params'),
  toggleMessagePin
);

router.post(
  '/:id/report',
  validateRequest(messageIdSchema, 'params'),
  validateRequest(reportMessageSchema),
  reportMessage
);

export default router;
