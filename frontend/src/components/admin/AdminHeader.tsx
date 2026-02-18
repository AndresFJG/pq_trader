'use client';

import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { notificationService, Notification } from '@/services/notification.service';

export function AdminHeader() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Cargar notificaciones no leídas
  const loadNotifications = async () => {
    setLoading(true);
    try {
      console.log('[AdminHeader] Loading notifications...');
      const response = await notificationService.getUnread();
      console.log('[AdminHeader] Notifications response:', response);
      
      if (response.success) {
        const notificationsList = response.data || [];
        console.log('[AdminHeader] Setting notifications:', notificationsList);
        setNotifications(notificationsList.slice(0, 5)); // Mostrar solo las 5 más recientes
        setUnreadCount(response.count || notificationsList.length || 0);
      } else {
        // Asegurar que se limpie el estado si no hay éxito
        console.log('[AdminHeader] Response not successful, clearing notifications');
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('[AdminHeader] Error loading notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    loadNotifications();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(loadNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Marcar notificación como leída
  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    loadNotifications(); // Recargar notificaciones
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notificaciones</span>
              {unreadCount > 0 && (
                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Cargando...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No hay notificaciones nuevas
              </div>
            ) : (
              <>
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-base">
                          {notificationService.getIcon(notification.type)}
                        </span>
                        <p className="text-sm font-medium flex-1">{notification.title}</p>
                      </div>
                      {notification.message && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {notification.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {notificationService.formatRelativeTime(notification.created_at)}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
                
                {unreadCount > 5 && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="p-2 text-center">
                      <button
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        onClick={loadNotifications}
                      >
                        Ver todas las notificaciones ({unreadCount})
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
