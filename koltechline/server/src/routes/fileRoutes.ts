import express from 'express';
import Joi from 'joi';
import {
  uploadImage,
  uploadAvatar,
  uploadVideo,
  uploadDocument,
  uploadMultipleFiles,
  deleteFile,
  getFileInfo,
  getUploadConfig
} from '../controllers/fileController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Validation schemas
const uploadQuerySchema = Joi.object({
  compress: Joi.string().valid('true', 'false').default('true'),
  width: Joi.number().integer().min(10).max(4000).optional(),
  height: Joi.number().integer().min(10).max(4000).optional(),
  quality: Joi.number().integer().min(1).max(100).default(80)
});

const deleteFileSchema = Joi.object({
  filename: Joi.string().required()
});

const getFileInfoSchema = Joi.object({
  filename: Joi.string().required()
});

const fileQuerySchema = Joi.object({
  type: Joi.string().valid('images', 'videos', 'documents', 'avatars').default('images')
});

const uploadTypeSchema = Joi.object({
  type: Joi.string().valid('image', 'video', 'document').required()
});

// Public routes
router.get(
  '/config',
  getUploadConfig
);

router.get(
  '/info/:filename',
  validateRequest(getFileInfoSchema, 'params'),
  validateRequest(fileQuerySchema, 'query'),
  getFileInfo
);

// Single file uploads - no auth required for basic uploads
router.post(
  '/image',
  validateRequest(uploadQuerySchema, 'query'),
  uploadImage
);

router.post(
  '/video',
  uploadVideo
);

// Protected routes
router.post(
  '/avatar',
  protect,
  uploadAvatar
);

router.post(
  '/document',
  protect,
  uploadDocument
);

// Multiple files upload
router.post(
  '/multiple/:type',
  protect,
  validateRequest(uploadTypeSchema, 'params'),
  uploadMultipleFiles
);

// File operations
router.delete(
  '/:filename',
  protect,
  validateRequest(deleteFileSchema, 'params'),
  validateRequest(fileQuerySchema, 'query'),
  deleteFile
);

export default router;