import { supabase } from '../config/supabase';

export interface NotificationData {
  type: 'new_user' | 'payment_processed' | 'new_course' | 'new_enrollment' | 'contact_message' | 'new_mentorship_booking' | 'course_updated';
  title: string;
  message?: string;
  user_id?: string;
  related_id?: string;
  metadata?: Record<string, any>;
}

export interface Notification extends NotificationData {
  id: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export class NotificationService {
  /**
   * Crear una nueva notificación
   */
  static async create(data: NotificationData): Promise<Notification | null> {
    try {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          type: data.type,
          title: data.title,
          message: data.message || null,
          user_id: data.user_id || null,
          related_id: data.related_id || null,
          metadata: data.metadata || {},
          is_read: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating notification:', error);
        return null;
      }

      return notification;
    } catch (error) {
      console.error('Error in NotificationService.create:', error);
      return null;
    }
  }

  /**
   * Obtener todas las notificaciones (con paginación)
   */
  static async getAll(limit = 50, offset = 0): Promise<{ data: Notification[]; count: number }> {
    try {
      const { data, error, count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching notifications:', error);
        return { data: [], count: 0 };
      }

      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error('Error in NotificationService.getAll:', error);
      return { data: [], count: 0 };
    }
  }

  /**
   * Obtener notificaciones no leídas
   */
  static async getUnread(): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching unread notifications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in NotificationService.getUnread:', error);
      return [];
    }
  }

  /**
   * Obtener cantidad de notificaciones no leídas
   */
  static async getUnreadCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

      if (error) {
        console.error('Error fetching unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in NotificationService.getUnreadCount:', error);
      return 0;
    }
  }

  /**
   * Marcar notificación como leída
   */
  static async markAsRead(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in NotificationService.markAsRead:', error);
      return false;
    }
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  static async markAllAsRead(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in NotificationService.markAllAsRead:', error);
      return false;
    }
  }

  /**
   * Eliminar notificación
   */
  static async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in NotificationService.delete:', error);
      return false;
    }
  }

  /**
   * Eliminar notificaciones antiguas (más de 30 días)
   */
  static async deleteOld(days = 30): Promise<number> {
    try {
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - days);

      const { data, error } = await supabase
        .from('notifications')
        .delete()
        .lt('created_at', dateLimit.toISOString())
        .select();

      if (error) {
        console.error('Error deleting old notifications:', error);
        return 0;
      }

      return data?.length || 0;
    } catch (error) {
      console.error('Error in NotificationService.deleteOld:', error);
      return 0;
    }
  }

  /**
   * Eliminar TODAS las notificaciones (usar con precaución)
   */
  static async clearAll(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Dummy condition to delete all
        .select();

      if (error) {
        console.error('Error clearing all notifications:', error);
        return 0;
      }

      return data?.length || 0;
    } catch (error) {
      console.error('Error in NotificationService.clearAll:', error);
      return 0;
    }
  }
}
