import { Router } from 'express';
import { login, getMe } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// @route   POST /api/auth/login
// @desc    Login admin
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get current admin
// @access  Private
router.get('/me', authenticate, getMe);

export default router;