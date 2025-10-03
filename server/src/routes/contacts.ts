import { Router } from 'express';
import {
  getContactMessages,
  getContactMessageById,
  createContactMessage,
  markMessageAsRead
} from '../controllers/contactController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Публичный маршрут для создания контактного сообщения
router.post('/', createContactMessage);

// Защищенные маршруты (только для авторизованных администраторов)
router.get('/', authenticate, getContactMessages);
router.get('/:id', authenticate, getContactMessageById);
router.put('/:id/read', authenticate, markMessageAsRead);

export default router;