import express from 'express';
import Joi from 'joi';
import {
  createWall,
  getWalls,
  getWall,
  joinWall,
  leaveWall,
  updateWall,
  deleteWall,
  getMyWalls,
  promoteToAdmin,
  getWallJoinRequests,
  respondToJoinRequest,
  removeMember
} from '../controllers/wallController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Validation schemas
const createWallSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),
  description: Joi.string().trim().min(10).max(500).required(),
  category: Joi.string().valid('freelance', 'startups', 'investments', 'technology', 'custom').default('custom'),
  tags: Joi.array().items(Joi.string().trim().min(1).max(50)).default([]),
  isPublic: Joi.boolean().default(true),
  allowKolophone: Joi.boolean().default(true),
  allowMemberKolophone: Joi.boolean().default(false),
  settings: Joi.object({
    requireApproval: Joi.boolean().default(false),
    allowInvites: Joi.boolean().default(true),
    maxMembers: Joi.number().integer().min(1).max(200000).default(200000),
    postPermissions: Joi.string().valid('all', 'admins', 'members').default('members'),
    commentPermissions: Joi.string().valid('all', 'members').default('members')
  }).default({})
});

const updateWallSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100),
  description: Joi.string().trim().min(10).max(500),
  tags: Joi.array().items(Joi.string().trim().min(1).max(50)),
  isPublic: Joi.boolean(),
  allowKolophone: Joi.boolean(),
  allowMemberKolophone: Joi.boolean(),
  settings: Joi.object({
    requireApproval: Joi.boolean(),
    allowInvites: Joi.boolean(),
    maxMembers: Joi.number().integer().min(1).max(200000),
    postPermissions: Joi.string().valid('all', 'admins', 'members'),
    commentPermissions: Joi.string().valid('all', 'members')
  }),
  avatar: Joi.string().uri(),
  banner: Joi.string().uri()
});

const getWallsSchema = Joi.object({
  category: Joi.string().valid('all', 'freelance', 'startups', 'investments', 'technology', 'custom'),
  tags: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string())
  ),
  search: Joi.string().trim().min(1).max(100),
  isPublic: Joi.string().valid('true', 'false'),
  limit: Joi.number().integer().min(1).max(50).default(20),
  page: Joi.number().integer().min(1).default(1)
});

const wallIdSchema = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
});

const userIdSchema = Joi.object({
  userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
});

// Public routes
router.get(
  '/',
  validateRequest(getWallsSchema, 'query'),
  getWalls
);

router.get(
  '/:id',
  validateRequest(wallIdSchema, 'params'),
  getWall
);

// Protected routes
router.use(protect);

router.post(
  '/',
  validateRequest(createWallSchema),
  createWall
);

router.get(
  '/my/walls',
  getMyWalls
);

router.post(
  '/:id/join',
  validateRequest(wallIdSchema, 'params'),
  joinWall
);

router.post(
  '/:id/leave',
  validateRequest(wallIdSchema, 'params'),
  leaveWall
);

router.put(
  '/:id',
  validateRequest(wallIdSchema, 'params'),
  validateRequest(updateWallSchema),
  updateWall
);

router.delete(
  '/:id',
  validateRequest(wallIdSchema, 'params'),
  deleteWall
);

router.post(
  '/:id/promote/:userId',
  validateRequest(Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }), 'params'),
  promoteToAdmin
);

// Wall join request management
router.get(
  '/:id/requests',
  validateRequest(wallIdSchema, 'params'),
  getWallJoinRequests
);

router.post(
  '/:id/requests/:requestId/respond',
  validateRequest(Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    requestId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }), 'params'),
  validateRequest(Joi.object({
    action: Joi.string().valid('approve', 'reject').required(),
    reviewMessage: Joi.string().trim().max(500).optional()
  })),
  respondToJoinRequest
);

// Member management
router.delete(
  '/:id/members/:userId',
  validateRequest(Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }), 'params'),
  removeMember
);

export default router;