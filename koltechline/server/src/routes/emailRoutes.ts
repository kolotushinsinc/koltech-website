import { Router } from 'express';
import { 
  sendContactEmail, 
  subscribeNewsletter, 
  sendProjectNotification, 
  testEmail 
} from '../controllers/emailController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import Joi from 'joi';

const router = Router();

// Validation schemas
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  subject: Joi.string().min(5).max(200).required(),
  message: Joi.string().min(10).max(2000).required()
});

const newsletterSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(100).optional()
});

const projectNotificationSchema = Joi.object({
  userId: Joi.string().required(),
  projectTitle: Joi.string().min(3).max(200).required(),
  message: Joi.string().min(10).max(1000).required()
});

const testEmailSchema = Joi.object({
  email: Joi.string().email().required(),
  type: Joi.string().valid('welcome', 'verification', 'reset', 'project').default('welcome')
});

// @route   POST /api/email/contact
// @desc    Send contact form email
// @access  Public
router.post('/contact', validateRequest(contactSchema), sendContactEmail);

// @route   POST /api/email/newsletter
// @desc    Subscribe to newsletter
// @access  Public
router.post('/newsletter', validateRequest(newsletterSchema), subscribeNewsletter);

// @route   POST /api/email/project-notification
// @desc    Send project notification to user
// @access  Private
router.post('/project-notification', protect, validateRequest(projectNotificationSchema), sendProjectNotification);

// @route   POST /api/email/test
// @desc    Test email functionality (Admin only)
// @access  Private
router.post('/test', protect, validateRequest(testEmailSchema), testEmail);

export default router;