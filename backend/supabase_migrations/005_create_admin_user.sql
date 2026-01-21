-- Crear usuario administrador
-- IMPORTANTE: Ejecutar esto en Supabase SQL Editor

-- Primero, verificar si existe el usuario admin
DO $$
BEGIN
  -- Insertar usuario admin si no existe
  -- Password: Admin123! (hasheado con bcrypt, cost 10)
  -- NOTA: Reemplaza el hash con el generado por npm run create:admin
  INSERT INTO users (name, email, password, role, subscription_tier, subscription_status)
  VALUES (
    'Administrador',
    'admin@pqtrader.com',
    '$2a$10$YourHashedPasswordHere', -- Reemplazar con hash real del script create-admin.ts
    'admin',
    'enterprise',
    'active'
  )
  ON CONFLICT (email) DO NOTHING;
  
  RAISE NOTICE 'Usuario admin creado o ya existe';
END $$;

-- Ver el usuario creado
SELECT id, name, email, role, subscription_tier, subscription_status, created_at 
FROM users 
WHERE email = 'admin@pqtrader.com';

-- NOTA IMPORTANTE:
-- El hash '$2a$10$YourHashedPasswordHere' es un placeholder.
-- Para obtener el hash real de la contraseña:
-- 1. Usa el endpoint de registro del backend
-- 2. O usa el script crear-admin.ts que se creará a continuación
