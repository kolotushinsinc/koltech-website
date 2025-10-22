import express from 'express';
import Joi from 'joi';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import {
  createProject,
  getMyProjects,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  toggleLike,
  applyToProject
} from '../controllers/projectController.js';

const router = express.Router();

// Validation schemas
const createProjectSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required(),
  description: Joi.string().trim().min(10).max(5000).required(),
  category: Joi.string().valid('web_development', 'mobile_app', 'ai_ml', 'design', 'marketing', 'blockchain', 'iot', 'other').required(),
  type: Joi.string().valid('freelance', 'crowdfunding', 'internal').default('internal'),
  tags: Joi.array().items(Joi.string().trim().max(30)).optional(),
  skills: Joi.array().items(Joi.string().trim().max(50)).optional(),
  images: Joi.array().items(Joi.string()).max(7).optional(),
  videos: Joi.array().items(Joi.string()).max(7).optional(),
  externalLinks: Joi.array().items(Joi.object({
    title: Joi.string().trim().max(100).required(),
    url: Joi.string().uri().required()
  })).optional(),
  budget: Joi.object({
    type: Joi.string().valid('fixed', 'hourly').required(),
    amount: Joi.number().min(0).required(),
    currency: Joi.string().valid('USD', 'EUR', 'GBP', 'CAD', 'AUD').default('USD'),
    hourlyRate: Joi.number().min(0).when('type', {
      is: 'hourly',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
  }).optional(),
  timeline: Joi.object({
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    estimatedHours: Joi.number().min(1).optional()
  }).optional(),
  funding: Joi.object({
    goal: Joi.number().min(100).required(),
    currency: Joi.string().valid('USD', 'EUR', 'GBP', 'CAD', 'AUD').default('USD'),
    deadline: Joi.date().required(),
    tiers: Joi.array().items(Joi.object({
      name: Joi.string().max(100).required(),
      amount: Joi.number().min(1).required(),
      description: Joi.string().max(500).required(),
      rewards: Joi.array().items(Joi.string().max(200)).optional(),
      maxBackers: Joi.number().min(1).optional()
    })).optional()
  }).when('type', {
    is: 'crowdfunding',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  visibility: Joi.string().valid('public', 'private', 'invited_only').default('public'),
  location: Joi.string().max(100).optional(),
  urgency: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').default('intermediate')
});

const updateProjectSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).optional(),
  description: Joi.string().trim().min(10).max(5000).optional(),
  category: Joi.string().valid('web_development', 'mobile_app', 'ai_ml', 'design', 'marketing', 'blockchain', 'iot', 'other').optional(),
  status: Joi.string().valid('draft', 'active', 'in_progress', 'review', 'completed', 'cancelled', 'funded').optional(),
  tags: Joi.array().items(Joi.string().trim().max(30)).optional(),
  skills: Joi.array().items(Joi.string().trim().max(50)).optional(),
  images: Joi.array().items(Joi.string()).max(7).optional(),
  videos: Joi.array().items(Joi.string()).max(7).optional(),
  externalLinks: Joi.array().items(Joi.object({
    title: Joi.string().trim().max(100).required(),
    url: Joi.string().uri().required()
  })).optional(),
  budget: Joi.object({
    type: Joi.string().valid('fixed', 'hourly').required(),
    amount: Joi.number().min(0).required(),
    currency: Joi.string().valid('USD', 'EUR', 'GBP', 'CAD', 'AUD').default('USD'),
    hourlyRate: Joi.number().min(0).optional()
  }).optional(),
  timeline: Joi.object({
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    estimatedHours: Joi.number().min(1).optional()
  }).optional(),
  visibility: Joi.string().valid('public', 'private', 'invited_only').optional(),
  location: Joi.string().max(100).optional(),
  urgency: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
  difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').optional(),
  allowApplications: Joi.boolean().optional()
});

const applyToProjectSchema = Joi.object({
  proposal: Joi.string().trim().min(10).max(2000).required(),
  budget: Joi.number().min(0).required(),
  timeline: Joi.string().trim().min(5).max(500).required()
});

// Public routes
router.get('/', getProjects);
router.get('/:id', getProject);

// Protected routes
router.use(protect);
router.post('/', validateRequest(createProjectSchema), createProject);
router.get('/user/my', getMyProjects);
router.put('/:id', validateRequest(updateProjectSchema), updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/like', toggleLike);
router.post('/:id/apply', validateRequest(applyToProjectSchema), applyToProject);

export default router;