-- Migration 021: Limpiar notificaciones de prueba
-- Descripción: Elimina todas las notificaciones existentes para que solo aparezcan
-- notificaciones de interacciones reales (compras Stripe, registros reales, etc.)

-- Eliminar todas las notificaciones actuales
DELETE FROM notifications;

-- Resetear el contador de secuencia (opcional, para empezar desde 1)
-- ALTER SEQUENCE notifications_id_seq RESTART WITH 1;

-- Verificación
DO $$
DECLARE
    notification_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO notification_count FROM notifications;
    RAISE NOTICE 'Notificaciones restantes: %', notification_count;
    
    IF notification_count = 0 THEN
        RAISE NOTICE '✓ Todas las notificaciones de prueba han sido eliminadas exitosamente';
    ELSE
        RAISE WARNING '⚠ Aún existen % notificaciones en la tabla', notification_count;
    END IF;
END $$;
