-- Script para crear usuarios faltantes en Supabase Local
-- Ejecutar en: Supabase Dashboard > SQL Editor

-- 1. Verificar usuarios actuales
SELECT id, name, email, role FROM users ORDER BY id;

-- 2. Crear usuario: Andres Jaramillo (grupoetercapital@gmail.com)
-- Contraseña: Password123! (hasheado con bcrypt)
INSERT INTO users (name, email, password, role, subscription_tier, subscription_status, is_email_verified)
VALUES (
  'Andres Jaramillo',
  'grupoetercapital@gmail.com',
  '$2b$10$2G6m4t/FCKp7Qi8e2UGSWePeu.jizu2eRER9/tUiy3CyvrnRC0ZLK',
  'admin',
  'premium',
  'active',
  true
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  subscription_tier = EXCLUDED.subscription_tier,
  subscription_status = EXCLUDED.subscription_status;

-- 3. Crear usuario: Amador (amador@pqtraders.com)
-- Contraseña: Password123! (hasheado con bcrypt)
INSERT INTO users (name, email, password, role, subscription_tier, subscription_status, is_email_verified)
VALUES (
  'Amador',
  'amador@pqtraders.com',
  '$2b$10$2G6m4t/FCKp7Qi8e2UGSWePeu.jizu2eRER9/tUiy3CyvrnRC0ZLK',
  'admin',
  'premium',
  'active',
  true
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  subscription_tier = EXCLUDED.subscription_tier,
  subscription_status = EXCLUDED.subscription_status;

-- 4. Verificar que se crearon correctamente
SELECT id, name, email, role, subscription_status FROM users ORDER BY id;

-- Ahora puedes hacer login con:
-- Email: grupoetercapital@gmail.com
-- Password: Password123!
--
-- Email: amador@pqtraders.com 
-- Password: Password123!
