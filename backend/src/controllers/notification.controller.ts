import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { NotificationService } from '../services/notification.service';

/**
 * @desc    Obtener todas las notificaciones
 * @route   GET /api/notifications
 * @access  Private (Admin)
 */
export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const { data, count } = await NotificationService.getAll(limit, offset);

    res.json({
      success: true,
      data,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: offset + limit < count,
      },
    });
  } catch (error: any) {
    console.error('Error in getNotifications:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener notificaciones',
    });
  }
};

/**
 * @desc    Obtener notificaciones no leídas
 * @route   GET /api/notifications/unread
 * @access  Private (Admin)
 */
export const getUnreadNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await NotificationService.getUnread();

    res.json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error: any) {
    console.error('Error in getUnreadNotifications:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener notificaciones no leídas',
    });
  }
};

/**
 * @desc    Obtener cantidad de notificaciones no leídas
 * @route   GET /api/notifications/unread/count
 * @access  Private (Admin)
 */
export const getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const count = await NotificationService.getUnreadCount();

    res.json({
      success: true,
      count,
    });
  } catch (error: any) {
    console.error('Error in getUnreadCount:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener conteo de notificaciones',
    });
  }
};

/**
 * @desc    Marcar notificación como leída
 * @route   PUT /api/notifications/:id/read
 * @access  Private (Admin)
 */
export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const success = await NotificationService.markAsRead(id);

    if (!success) {
      res.status(404).json({
        success: false,
        error: 'Notificación no encontrada o no pudo ser actualizada',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Notificación marcada como leída',
    });
  } catch (error: any) {
    console.error('Error in markAsRead:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al marcar notificación como leída',
    });
  }
};

/**
 * @desc    Marcar todas las notificaciones como leídas
 * @route   PUT /api/notifications/read-all
 * @access  Private (Admin)
 */
export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const success = await NotificationService.markAllAsRead();

    if (!success) {
      res.status(500).json({
        success: false,
        error: 'No se pudieron marcar las notificaciones como leídas',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Todas las notificaciones marcadas como leídas',
    });
  } catch (error: any) {
    console.error('Error in markAllAsRead:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al marcar notificaciones como leídas',
    });
  }
};

/**
 * @desc    Eliminar notificación
 * @route   DELETE /api/notifications/:id
 * @access  Private (Admin)
 */
export const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const success = await NotificationService.delete(id);

    if (!success) {
      res.status(404).json({
        success: false,
        error: 'Notificación no encontrada o no pudo ser eliminada',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Notificación eliminada correctamente',
    });
  } catch (error: any) {
    console.error('Error in deleteNotification:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al eliminar notificación',
    });
  }
};
