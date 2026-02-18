import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { supabase } from '../config/supabase';

/**
 * @desc    Eliminar TODAS las notificaciones (solo admin, usar con precaución)
 * @route   DELETE /api/notifications/clear-all
 * @access  Private (Admin only)
 */
export const clearAllNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Verificar que el usuario sea admin
    if (req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'No autorizado - Solo administradores',
      });
      return;
    }

    // Eliminar todas las notificaciones
    const { error } = await supabase
      .from('notifications')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (dummy condition)

    if (error) {
      throw error;
    }

    // Contar notificaciones restantes
    const { count, error: countError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    res.json({
      success: true,
      message: 'Todas las notificaciones han sido eliminadas',
      remainingCount: count || 0,
    });
  } catch (error: any) {
    console.error('Error in clearAllNotifications:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al eliminar notificaciones',
    });
  }
};
