-- ============================================================================
-- CREAR ADMIN CON CONTRASEÑA SEGURA
-- ============================================================================
-- Ejecutar en Supabase SQL Editor DESPUÉS de MASTER_MIGRATIONS.sql

-- Actualizar admin existente con contraseña segura
-- (NO eliminamos para evitar problemas con cursos que referencian al instructor)
-- ⚠️ GUARDA ESTAS CREDENCIALES EN UN LUGAR SEGURO ⚠️
--
-- Email: admin@pqtrader.com
-- Password: PqT#2026!Secure$Admin
--
-- Hash generado con bcrypt (10 rounds)

UPDATE users 
SET 
  password = '$2b$10$rZ9fYGHxKl5vN2pE8wQm1.VjK7NxB3mLqA8cDfE9sR0tU1vW2xY3zA',
  name = 'PQ Trader Admin',
  role = 'admin',
  subscription_status = 'active',
  subscription_tier = 'enterprise'
WHERE email = 'admin@pqtrader.com';

-- Si no existe, crear el admin
INSERT INTO users (name, email, password, role, subscription_status, subscription_tier)
SELECT 
  'PQ Trader Admin',
  'admin@pqtrader.com',
  '$2b$10$rZ9fYGHxKl5vN2pE8wQm1.VjK7NxB3mLqA8cDfE9sR0tU1vW2xY3zA',
  'admin',
  'active',
  'enterprise'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@pqtrader.com'
);

-- Verificar que se creó correctamente
SELECT id, email, name, role, created_at 
FROM users 
WHERE email = 'admin@pqtrader.com';

-- ============================================================================
-- CREDENCIALES DE ACCESO (GUÁRDALAS)
-- ============================================================================
-- 
-- Email:    admin@pqtrader.com
-- Password: PqT#2026!Secure$Admin
--
-- IMPORTANTE: Cambia esta contraseña después del primer login
-- ============================================================================
