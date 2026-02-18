-- ======================================
-- COPIAR Y PEGAR ESTO EN SUPABASE
-- ======================================
-- Dashboard → SQL Editor → New Query → Pegar → Run

-- 1. Limpiar tabla
TRUNCATE TABLE notifications CASCADE;

-- 2. Eliminar constraint de foreign key
ALTER TABLE notifications 
  DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

-- 3. Cambiar tipos de UUID a TEXT
ALTER TABLE notifications 
  ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT,
  ALTER COLUMN related_id TYPE TEXT USING related_id::TEXT;

-- 4. Asegurar nullable
ALTER TABLE notifications 
  ALTER COLUMN user_id DROP NOT NULL,
  ALTER COLUMN related_id DROP NOT NULL;

-- 5. Verificar (debería mostrar user_id y related_id como TEXT)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'notifications'
  AND column_name IN ('user_id', 'related_id');

-- ✅ Listo! Ahora deploy tu backend a Railway
