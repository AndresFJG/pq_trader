import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface Notification {
  id: string;
  type: 'new_user' | 'payment_processed' | 'new_course' | 'new_enrollment' | 'contact_message' | 'new_mentorship_booking' | 'course_updated';
  title: string;
  message?: string;
  user_id?: string;
  related_id?: string;
  metadata?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  count?: number;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  count: number;
}

class NotificationService {
  /**
   * Obtener todas las notificaciones
   */
  async getAll(limit = 50, offset = 0): Promise<NotificationsResponse> {
    try {
      const response = await axios.get(`${API_URL}/notifications`, {
        params: { limit, offset },
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
      
      console.log('[NotificationService] getAll response:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching notifications:', error);
      return {
        success: false,
        data: [],
        count: 0,
      };
    }
  }

  /**
   * Obtener notificaciones no leídas
   */
  async getUnread(): Promise<NotificationsResponse> {
    try {
      const response = await axios.get(`${API_URL}/notifications/unread`, {
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
      
      console.log('[NotificationService] getUnread response:', response.data);
      console.log('[NotificationService] Notifications count:', response.data?.data?.length || 0);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching unread notifications:', error);
      return {
        success: false,
        data: [],
        count: 0,
      };
    }
  }

  /**
   * Obtener cantidad de notificaciones no leídas
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await axios.get<UnreadCountResponse>(
        `${API_URL}/notifications/unread/count`,
        { withCredentials: true }
      );
      return response.data.count;
    } catch (error: unknown) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  /**
   * Marcar notificación como leída
   */
  async markAsRead(id: string): Promise<boolean> {
    try {
      const response = await axios.put(
        `${API_URL}/notifications/${id}/read`,
        {},
        { withCredentials: true }
      );
      return response.data.success;
    } catch (error: unknown) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  async markAllAsRead(): Promise<boolean> {
    try {
      const response = await axios.put(
        `${API_URL}/notifications/read-all`,
        {},
        { withCredentials: true }
      );
      return response.data.success;
    } catch (error: unknown) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  /**
   * Eliminar notificación
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await axios.delete(
        `${API_URL}/notifications/${id}`,
        { withCredentials: true }
      );
      return response.data.success;
    } catch (error: unknown) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  /**
   * Obtener el ícono según el tipo de notificación
   */
  getIcon(type: Notification['type']): string {
    const icons = {
      new_user: '👤',
      payment_processed: '💰',
      new_course: '📚',
      new_enrollment: '🎓',
      contact_message: '✉️',
      new_mentorship_booking: '📅',
      course_updated: '📝',
    };
    return icons[type] || '🔔';
  }

  /**
   * Formatear fecha relativa (hace X tiempo)
   */
  formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Hace unos segundos';
    if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} minutos`;
    if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} horas`;
    if (seconds < 604800) return `Hace ${Math.floor(seconds / 86400)} días`;
    if (seconds < 2592000) return `Hace ${Math.floor(seconds / 604800)} semanas`;
    return `Hace ${Math.floor(seconds / 2592000)} meses`;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
