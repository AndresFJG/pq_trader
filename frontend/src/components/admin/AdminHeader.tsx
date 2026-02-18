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
import { useEffect, useState, useRef } from 'react';
import { notificationService, Notification } from '@/services/notification.service';

export function AdminHeader() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const autoMarkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cargar notificaciones recientes (todas, leídas y no leídas)
  const loadNotifications = async () => {
    setLoading(true);
    try {
      console.log('[AdminHeader] Loading recent notifications...');
      
      // Cargar notificaciones recientes (todas)
      const recentResponse = await notificationService.getRecent(10);
      console.log('[AdminHeader] Recent notifications:', recentResponse);
      
      // Cargar contador de no leídas por separado
      const unreadResponse = await notificationService.getUnread();
      console.log('[AdminHeader] Unread count:', unreadResponse);
      
      if (recentResponse.success) {
        const notificationsList = recentResponse.data || [];
        console.log('[AdminHeader] Setting notifications:', notificationsList);
        setNotifications(notificationsList.slice(0, 10)); // Mostrar últimas 10
        setUnreadCount(unreadResponse.count || unreadResponse.data?.length || 0);
      } else {
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
    
    // Actualizar cada 10 segundos para capturar nuevas notificaciones rápidamente
    const interval = setInterval(loadNotifications, 10000);
    
    return () => {
      clearInterval(interval);
      // Limpiar timeout de auto-marcado al desmontar
      if (autoMarkTimeoutRef.current) {
        clearTimeout(autoMarkTimeoutRef.current);
      }
    };
  }, []);

  // Marcar notificación como leída
  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    loadNotifications(); // Recargar notificaciones
  };

  // Marcar todas como leídas
  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      await notificationService.markAllAsRead();
      // Recargar notificaciones para actualizar indicadores visuales
      await loadNotifications();
    } catch (error) {
      console.error('[AdminHeader] Error marking all as read:', error);
    } finally {
      setLoading(false);
    }
  };

  // Marcar como leídas al abrir el dropdown
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    
    // Limpiar timeout anterior si existe
    if (autoMarkTimeoutRef.current) {
      clearTimeout(autoMarkTimeoutRef.current);
      autoMarkTimeoutRef.current = null;
    }
    
    // Recargar notificaciones al abrir para asegurar datos frescos
    if (open) {
      loadNotifications();
      
      // Marcar todas las NO LEÍDAS como leídas después de 5 segundos
      autoMarkTimeoutRef.current = setTimeout(() => {
        if (unreadCount > 0) {
          handleMarkAllAsRead();
        }
        autoMarkTimeoutRef.current = null;
      }, 5000);
    }
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
            aria-label="Buscar en el panel de administración"
            className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-4">
        {/* Notifications */}
        <DropdownMenu onOpenChange={handleOpenChange}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              aria-label={unreadCount > 0 ? `Notificaciones: ${unreadCount} sin leer` : "Notificaciones"}
            >
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
                    className={`cursor-pointer ${
                      !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex items-center gap-2">
                        {!notification.is_read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                        <span className="text-base">
                          {notificationService.getIcon(notification.type)}
                        </span>
                        <p className={`text-sm flex-1 ${
                          !notification.is_read ? 'font-semibold' : 'font-medium'
                        }`}>{notification.title}</p>
                      </div>
                      {notification.message && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 ml-6">
                          {notification.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 ml-6">
                        {notificationService.formatRelativeTime(notification.created_at)}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuSeparator />
                <div className="p-2 text-center">
                  <button
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                    onClick={handleMarkAllAsRead}
                    disabled={loading}
                  >
                    {loading ? 'Limpiando...' : 'Marcar todas como leídas'}
                  </button>
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
