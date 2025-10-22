import { Router } from 'express';
import Joi from 'joi';
import {
  getPosts,
  getFeed,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleReaction,
  trackView,
  getPostComments,
  addComment,
  searchPosts
} from '../controllers/postsController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = Router();

// Validation schemas
const createPostSchema = Joi.object({
  content: Joi.string().trim().min(1).max(2000).optional(),
  images: Joi.array().items(Joi.string()).max(10).optional(),
  videos: Joi.array().items(Joi.string()).max(5).optional(),
  documents: Joi.array().items(Joi.object({
    filename: Joi.string().required(),
    url: Joi.string().required(),
    type: Joi.string().required(),
    size: Joi.number().required()
  })).max(10).optional(),
  type: Joi.string().valid('post', 'project_update', 'achievement', 'announcement').optional(),
  tags: Joi.array().items(Joi.string().trim().max(30)).optional(),
  visibility: Joi.string().valid('public', 'followers', 'private').optional(),
  metadata: Joi.object({
    projectId: Joi.string().optional(),
    location: Joi.string().max(100).optional(),
    linkedUrl: Joi.string().uri().optional(),
    mentions: Joi.array().items(Joi.string()).optional()
  }).optional()
}).custom((value, helpers) => {
  const hasContent = value.content && value.content.trim().length > 0;
  const hasImages = value.images && value.images.length > 0;
  const hasVideos = value.videos && value.videos.length > 0;
  const hasDocuments = value.documents && value.documents.length > 0;

  if (!hasContent && !hasImages && !hasVideos && !hasDocuments) {
    return helpers.error('any.custom', {
      message: 'Post must have at least one of: content, images, videos, or documents'
    });
  }

  return value;
});

const updatePostSchema = Joi.object({
  content: Joi.string().trim().min(1).max(2000).optional(),
  images: Joi.array().items(Joi.string()).max(10).optional(),
  videos: Joi.array().items(Joi.string()).max(5).optional(),
  documents: Joi.array().items(Joi.object({
    filename: Joi.string().required(),
    url: Joi.string().required(),
    type: Joi.string().required(),
    size: Joi.number().required()
  })).max(10).optional(),
  tags: Joi.array().items(Joi.string().trim().max(30)).optional(),
  visibility: Joi.string().valid('public', 'followers', 'private').optional(),
  metadata: Joi.object({
    projectId: Joi.string().optional(),
    location: Joi.string().max(100).optional(),
    linkedUrl: Joi.string().uri().optional(),
    mentions: Joi.array().items(Joi.string()).optional()
  }).optional()
});

const reactionSchema = Joi.object({
  reactionType: Joi.string().valid('like', 'love', 'haha', 'wow', 'sad', 'angry').required()
});

const addCommentSchema = Joi.object({
  content: Joi.string().trim().min(1).max(500).required().messages({
    'string.min': 'Comment content cannot be empty',
    'string.max': 'Comment content cannot exceed 500 characters'
  }),
  parentComment: Joi.string().optional()
});

// Public routes
router.get('/', optionalAuth, getPosts);
router.get('/search', optionalAuth, searchPosts);
router.get('/:id', optionalAuth, getPost);
router.get('/:id/comments', getPostComments);

// Protected routes
router.get('/feed/personal', protect, getFeed);
router.post('/', protect, validateRequest(createPostSchema), createPost);
router.put('/:id', protect, validateRequest(updatePostSchema), updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/react', protect, validateRequest(reactionSchema), toggleReaction);
router.post('/:id/view', protect, trackView);
router.post('/:id/comments', protect, validateRequest(addCommentSchema), addComment);

export default router;