import express from 'express';
import Joi from 'joi';
import {
  globalSearch,
  advancedSearch,
  getSearchSuggestions,
  getTrendingSearches
} from '../controllers/searchController.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Validation schemas
const globalSearchSchema = Joi.object({
  q: Joi.string().trim().min(2).max(100).required(),
  category: Joi.string().valid('freelance', 'startups', 'investments', 'technology', 'general', 'all').optional(),
  limit: Joi.number().integer().min(1).max(50).default(20),
  page: Joi.number().integer().min(1).default(1),
  sortBy: Joi.string().valid('relevance', 'date', 'popularity').default('relevance'),
  dateFrom: Joi.date().optional(),
  dateTo: Joi.date().optional(),
  includeEntities: Joi.string().optional()
});

const advancedSearchSchema = Joi.object({
  query: Joi.string().trim().min(2).max(100).required(),
  entityTypes: Joi.array().items(
    Joi.string().valid('walls', 'messages', 'users', 'tags', 'chats')
  ).default(['walls', 'messages', 'users']),
  filters: Joi.object({
    category: Joi.string().valid('freelance', 'startups', 'investments', 'technology', 'general').optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    minMembers: Joi.number().integer().min(0).optional(),
    maxMembers: Joi.number().integer().min(0).optional(),
    wallId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    hasAttachments: Joi.boolean().optional(),
    minLikes: Joi.number().integer().min(0).optional(),
    role: Joi.string().valid('user', 'freelancer', 'startup', 'admin').optional(),
    location: Joi.string().optional(),
    skills: Joi.array().items(Joi.string()).optional(),
    minRating: Joi.number().min(0).max(5).optional(),
    verified: Joi.boolean().optional(),
    dateFrom: Joi.date().optional(),
    dateTo: Joi.date().optional()
  }).default({}),
  sortBy: Joi.string().valid('relevance', 'date', 'popularity').default('relevance'),
  limit: Joi.number().integer().min(1).max(50).default(20),
  page: Joi.number().integer().min(1).default(1)
});

const suggestionsSchema = Joi.object({
  q: Joi.string().trim().min(1).max(100).required(),
  limit: Joi.number().integer().min(1).max(20).default(10)
});

const trendingSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(20).default(10)
});

// Routes
router.get(
  '/global',
  validateRequest(globalSearchSchema, 'query'),
  globalSearch
);

router.post(
  '/advanced',
  validateRequest(advancedSearchSchema),
  advancedSearch
);

router.get(
  '/suggestions',
  validateRequest(suggestionsSchema, 'query'),
  getSearchSuggestions
);

router.get(
  '/trending',
  validateRequest(trendingSchema, 'query'),
  getTrendingSearches
);

export default router;