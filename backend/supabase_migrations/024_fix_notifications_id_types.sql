-- Migración: Ajustar tabla notifications para que user_id y related_id soporten INTEGER
-- Problema: La tabla tiene UUID pero todos los IDs del sistema son INTEGER (SERIAL)
-- Solución: Eliminar FK constraint y cambiar los campos a TEXT nullable

-- EJECUTAR EN SUPABASE SQL EDITOR

-- 1. Primero, eliminar notificaciones existentes que pueden estar en estado inconsistente
TRUNCATE TABLE notifications CASCADE;

-- 2. Eliminar el constraint de foreign key (apunta a auth.users que es UUID)
ALTER TABLE notifications 
  DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

-- 3. Modificar columnas para que acepten cualquier tipo de ID como TEXT
ALTER TABLE notifications 
  ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT,
  ALTER COLUMN related_id TYPE TEXT USING related_id::TEXT;

-- 4. Hacer las columnas nullable (ya deberían serlo, pero aseguramos)
ALTER TABLE notifications 
  ALTER COLUMN user_id DROP NOT NULL,
  ALTER COLUMN related_id DROP NOT NULL;

-- 5. Agregar comentarios para documentar
COMMENT ON COLUMN notifications.user_id IS 'ID del usuario relacionado (puede ser INTEGER como string, UUID como string, o NULL) - SIN foreign key';
COMMENT ON COLUMN notifications.related_id IS 'ID del recurso relacionado (course_id, transaction_id, etc. como string o NULL)';

-- 6. Verificar estructura
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'notifications'
ORDER BY ordinal_position;

-- NOTA: Después de ejecutar esta migración:
-- - user_id y related_id son TEXT nullable (sin FK)
-- - Toda la información importante está en metadata (JSONB)
-- - Las notificaciones se crearán correctamente desde el backend
