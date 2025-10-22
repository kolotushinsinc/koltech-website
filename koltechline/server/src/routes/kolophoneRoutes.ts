import express from 'express';
import Joi from 'joi';
import {
  startKolophoneCall,
  joinKolophoneCall,
  leaveKolophoneCall,
  endKolophoneCall,
  getKolophoneCall,
  getActiveCalls,
  getCallHistory,
  updateCallSettings,
  getCallStats
} from '../controllers/kolophoneController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// All Kolophone routes require authentication
router.use(protect);

// Validation schemas
const startCallSchema = Joi.object({
  type: Joi.string().valid('wall', 'private', 'group').required(),
  targetId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  participants: Joi.array().items(
    Joi.string().regex(/^[0-9a-fA-F]{24}$/)
  ).optional(),
  settings: Joi.object({
    videoEnabled: Joi.boolean().optional(),
    audioEnabled: Joi.boolean().optional(),
    screenShareEnabled: Joi.boolean().optional(),
    chatEnabled: Joi.boolean().optional(),
    recordingEnabled: Joi.boolean().optional(),
    waitingRoom: Joi.boolean().optional()
  }).optional()
});

const callIdSchema = Joi.object({
  callId: Joi.string().required()
});

const updateSettingsSchema = Joi.object({
  settings: Joi.object({
    videoEnabled: Joi.boolean().optional(),
    audioEnabled: Joi.boolean().optional(),
    screenShareEnabled: Joi.boolean().optional(),
    chatEnabled: Joi.boolean().optional(),
    recordingEnabled: Joi.boolean().optional(),
    waitingRoom: Joi.boolean().optional()
  }).required()
});

const historyQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(20)
});

// Routes
router.post(
  '/start',
  validateRequest(startCallSchema),
  startKolophoneCall
);

router.post(
  '/:callId/join',
  validateRequest(callIdSchema, 'params'),
  joinKolophoneCall
);

router.post(
  '/:callId/leave',
  validateRequest(callIdSchema, 'params'),
  leaveKolophoneCall
);

router.post(
  '/:callId/end',
  validateRequest(callIdSchema, 'params'),
  endKolophoneCall
);

router.get(
  '/:callId',
  validateRequest(callIdSchema, 'params'),
  getKolophoneCall
);

router.get(
  '/active',
  getActiveCalls
);

router.get(
  '/history',
  validateRequest(historyQuerySchema, 'query'),
  getCallHistory
);

router.put(
  '/:callId/settings',
  validateRequest(callIdSchema, 'params'),
  validateRequest(updateSettingsSchema),
  updateCallSettings
);

router.get(
  '/stats',
  getCallStats
);

export default router;