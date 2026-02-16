import express from 'express';
import {
  getNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notification.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Todas las rutas requieren autenticación y rol de admin
router.use(protect);
router.use(authorize('admin'));

// GET /api/notifications - Obtener todas las notificaciones
router.get('/', getNotifications);

// GET /api/notifications/unread - Obtener notificaciones no leídas
router.get('/unread', getUnreadNotifications);

// GET /api/notifications/unread/count - Obtener conteo de no leídas
router.get('/unread/count', getUnreadCount);

// PUT /api/notifications/read-all - Marcar todas como leídas
router.put('/read-all', markAllAsRead);

// PUT /api/notifications/:id/read - Marcar como leída
router.put('/:id/read', markAsRead);

// DELETE /api/notifications/:id - Eliminar notificación
router.delete('/:id', deleteNotification);

export default router;
