import express from 'express';
import Joi from 'joi';
import {
  getPopularTags,
  getTrendingTags,
  searchTags,
  getRelatedTags,
  getTagStats,
  createOrUpdateTag,
  updateTrendingTags,
  getTag,
  updateTag,
  deleteTag,
  getAllTags
} from '../controllers/tagController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Validation schemas
const popularTagsSchema = Joi.object({
  category: Joi.string().valid('freelance', 'startups', 'investments', 'technology', 'general', 'all').optional(),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

const trendingTagsSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(50).default(10)
});

const searchTagsSchema = Joi.object({
  q: Joi.string().trim().min(2).max(100).required(),
  limit: Joi.number().integer().min(1).max(50).default(20)
});

const relatedTagsSchema = Joi.object({
  tags: Joi.array().items(
    Joi.string().trim().min(1).max(50)
  ).min(1).max(10).required(),
  limit: Joi.number().integer().min(1).max(20).default(10)
});

const tagStatsSchema = Joi.object({
  category: Joi.string().valid('freelance', 'startups', 'investments', 'technology', 'general', 'all').optional()
});

const createTagSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  category: Joi.string().valid('freelance', 'startups', 'investments', 'technology', 'general').default('general'),
  description: Joi.string().trim().max(200).optional(),
  color: Joi.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  aliases: Joi.array().items(
    Joi.string().trim().min(1).max(50)
  ).optional(),
  relatedTags: Joi.array().items(
    Joi.string().trim().min(1).max(50)
  ).optional()
});

const updateTagSchema = Joi.object({
  description: Joi.string().trim().max(200).optional(),
  category: Joi.string().valid('freelance', 'startups', 'investments', 'technology', 'general').optional(),
  color: Joi.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  isOfficial: Joi.boolean().optional(),
  aliases: Joi.array().items(
    Joi.string().trim().min(1).max(50)
  ).optional(),
  relatedTags: Joi.array().items(
    Joi.string().trim().min(1).max(50)
  ).optional()
});

const getAllTagsSchema = Joi.object({
  category: Joi.string().valid('freelance', 'startups', 'investments', 'technology', 'general', 'all').optional(),
  isOfficial: Joi.string().valid('true', 'false').optional(),
  sortBy: Joi.string().valid('name', 'usageCount', 'createdAt', 'popularityScore').default('usageCount'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
  limit: Joi.number().integer().min(1).max(100).default(50),
  page: Joi.number().integer().min(1).default(1),
  search: Joi.string().trim().min(1).max(100).optional()
});

const tagIdSchema = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
});

const tagIdentifierSchema = Joi.object({
  identifier: Joi.string().trim().min(1).max(50).required()
});

// Public routes
router.get(
  '/',
  validateRequest(getAllTagsSchema, 'query'),
  getAllTags
);

router.get(
  '/popular',
  validateRequest(popularTagsSchema, 'query'),
  getPopularTags
);

router.get(
  '/trending',
  validateRequest(trendingTagsSchema, 'query'),
  getTrendingTags
);

router.get(
  '/search',
  validateRequest(searchTagsSchema, 'query'),
  searchTags
);

router.post(
  '/related',
  validateRequest(relatedTagsSchema),
  getRelatedTags
);

router.get(
  '/stats',
  validateRequest(tagStatsSchema, 'query'),
  getTagStats
);

router.get(
  '/:identifier',
  validateRequest(tagIdentifierSchema, 'params'),
  getTag
);

// Protected routes
router.use(protect);

router.post(
  '/',
  validateRequest(createTagSchema),
  createOrUpdateTag
);

// Admin only routes
router.post(
  '/update-trending',
  updateTrendingTags
);

router.put(
  '/:id',
  validateRequest(tagIdSchema, 'params'),
  validateRequest(updateTagSchema),
  updateTag
);

router.delete(
  '/:id',
  validateRequest(tagIdSchema, 'params'),
  deleteTag
);

export default router;