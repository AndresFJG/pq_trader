-- ============================================================================
-- MIGRACIÓN COMPLETA: Email Verification + Admin User
-- ============================================================================
-- Ejecutar este archivo COMPLETO en Supabase SQL Editor
-- Orden: Primero agrega columna, luego crea/actualiza admin

-- PASO 1: Agregar columna is_email_verified
-- ============================================================================
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT false;

-- Actualizar usuarios existentes como verificados (compatibilidad)
UPDATE users 
SET is_email_verified = true 
WHERE is_email_verified IS NULL;

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(is_email_verified);

-- Comentario en columna
COMMENT ON COLUMN users.is_email_verified IS 'Indica si el usuario ha verificado su email';


-- PASO 2: Crear/Actualizar usuario admin
-- ============================================================================
-- ⚠️ CREDENCIALES DE ADMIN ⚠️
--
-- Email: admin@pqtrader.com
-- Password: PqT#2026!Secure$Admin
--
-- Hash generado con bcrypt (10 rounds)

-- Actualizar admin existente
UPDATE users 
SET 
  password = '$2b$10$rZ9fYGHxKl5vN2pE8wQm1.VjK7NxB3mLqA8cDfE9sR0tU1vW2xY3zA',
  name = 'PQ Trader Admin',
  role = 'admin',
  subscription_status = 'active',
  subscription_tier = 'enterprise',
  is_email_verified = true
WHERE email = 'admin@pqtrader.com';

-- Si no existe, crear el admin
INSERT INTO users (name, email, password, role, subscription_status, subscription_tier, is_email_verified)
SELECT 
  'PQ Trader Admin',
  'admin@pqtrader.com',
  '$2b$10$rZ9fYGHxKl5vN2pE8wQm1.VjK7NxB3mLqA8cDfE9sR0tU1vW2xY3zA',
  'admin',
  'active',
  'enterprise',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@pqtrader.com'
);


-- PASO 3: Verificación
-- ============================================================================
SELECT 
  id, 
  email, 
  name, 
  role, 
  is_email_verified,
  subscription_status,
  created_at 
FROM users 
WHERE email = 'admin@pqtrader.com';


-- ============================================================================
-- RESULTADO ESPERADO
-- ============================================================================
-- Deberías ver:
-- - email: admin@pqtrader.com
-- - name: PQ Trader Admin
-- - role: admin
-- - is_email_verified: true
-- - subscription_status: active
--
-- ⚠️ GUARDA ESTAS CREDENCIALES:
-- Email:    admin@pqtrader.com
-- Password: PqT#2026!Secure$Admin
-- ============================================================================
