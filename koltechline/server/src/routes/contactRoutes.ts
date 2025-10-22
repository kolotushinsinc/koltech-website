import express from 'express';
import Joi from 'joi';
import {
  sendContactRequest,
  respondToContactRequest,
  getContacts,
  removeContact,
  blockUser,
  unblockUser,
  getContactStatus,
  searchUsers
} from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// All contact routes require authentication
router.use(protect);

// Validation schemas
const sendContactRequestSchema = Joi.object({
  recipientId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  note: Joi.string().trim().max(200).optional()
});

const respondToRequestSchema = Joi.object({
  action: Joi.string().valid('accept', 'decline', 'block').required()
});

const getContactsSchema = Joi.object({
  status: Joi.string().valid('accepted', 'pending', 'sent').default('accepted')
});

const searchUsersSchema = Joi.object({
  query: Joi.string().trim().min(2).max(100).required(),
  limit: Joi.number().integer().min(1).max(50).default(20)
});

const userIdSchema = Joi.object({
  userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
});

const contactIdSchema = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
});

// Routes
router.post(
  '/request',
  validateRequest(sendContactRequestSchema),
  sendContactRequest
);

router.post(
  '/:id/respond',
  validateRequest(contactIdSchema, 'params'),
  validateRequest(respondToRequestSchema),
  respondToContactRequest
);

router.get(
  '/',
  validateRequest(getContactsSchema, 'query'),
  getContacts
);

router.delete(
  '/:id',
  validateRequest(contactIdSchema, 'params'),
  removeContact
);

router.post(
  '/block/:userId',
  validateRequest(userIdSchema, 'params'),
  blockUser
);

router.post(
  '/unblock/:userId',
  validateRequest(userIdSchema, 'params'),
  unblockUser
);

router.get(
  '/status/:userId',
  validateRequest(userIdSchema, 'params'),
  getContactStatus
);

router.get(
  '/search',
  validateRequest(searchUsersSchema, 'query'),
  searchUsers
);

export default router;