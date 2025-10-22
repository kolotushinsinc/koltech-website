import express from 'express';
import Joi from 'joi';
import {
  createOrGetPrivateChat,
  createGroupChat,
  getUserChats,
  getChatMessages,
  sendMessage,
  markMessagesAsRead,
  addParticipants,
  leaveChat
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// All chat routes require authentication
router.use(protect);

// Validation schemas
const createPrivateChatSchema = Joi.object({
  recipientId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
});

const createGroupChatSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  description: Joi.string().trim().max(500).optional(),
  participantIds: Joi.array().items(
    Joi.string().regex(/^[0-9a-fA-F]{24}$/)
  ).min(1).max(200000).required(),
  avatar: Joi.string().uri().optional()
});

const getUserChatsSchema = Joi.object({
  type: Joi.string().valid('private', 'group').optional(),
  limit: Joi.number().integer().min(1).max(100).default(50)
});

const getChatMessagesSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(50),
  page: Joi.number().integer().min(1).default(1)
});

const sendMessageSchema = Joi.object({
  content: Joi.string().trim().min(1).max(2000).required(),
  attachments: Joi.array().items(
    Joi.object({
      type: Joi.string().valid('image', 'video', 'file', 'gif', 'sticker').required(),
      url: Joi.string().uri().required(),
      filename: Joi.string().optional(),
      size: Joi.number().integer().min(0).optional()
    })
  ).optional()
});

const markAsReadSchema = Joi.object({
  messageId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional()
});

const addParticipantsSchema = Joi.object({
  participantIds: Joi.array().items(
    Joi.string().regex(/^[0-9a-fA-F]{24}$/)
  ).min(1).required()
});

const chatIdSchema = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
});

// Routes
router.post(
  '/private',
  // Temporarily disable validation to debug
  // validateRequest(createPrivateChatSchema),
  createOrGetPrivateChat
);

router.post(
  '/group',
  validateRequest(createGroupChatSchema),
  createGroupChat
);

router.get(
  '/',
  validateRequest(getUserChatsSchema, 'query'),
  getUserChats
);

router.get(
  '/:id/messages',
  validateRequest(chatIdSchema, 'params'),
  validateRequest(getChatMessagesSchema, 'query'),
  getChatMessages
);

router.post(
  '/:id/messages',
  validateRequest(chatIdSchema, 'params'),
  validateRequest(sendMessageSchema),
  sendMessage
);

router.post(
  '/:id/read',
  validateRequest(chatIdSchema, 'params'),
  validateRequest(markAsReadSchema),
  markMessagesAsRead
);

router.post(
  '/:id/participants',
  validateRequest(chatIdSchema, 'params'),
  validateRequest(addParticipantsSchema),
  addParticipants
);

router.post(
  '/:id/leave',
  validateRequest(chatIdSchema, 'params'),
  leaveChat
);

export default router;