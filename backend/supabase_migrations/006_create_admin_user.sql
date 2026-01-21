-- Crear usuario administrador directamente en Supabase
-- Password: Admin123! (hasheada con bcrypt)

INSERT INTO users (
  name,
  email,
  password,
  role,
  subscription_tier,
  subscription_status,
  created_at,
  updated_at
)
VALUES (
  'Administrador PQ Trader',
  'admin@pqtrader.com',
  '$2b$10$FvUgyo/.zNcg.zAJ/ADQzuOXsnlMeS4Yqz2Op87MKfpYASHNHaLYq',
  'admin',
  'enterprise',
  'active',
  NOW(),
  NOW()
)
ON CONFLICT (email) 
DO UPDATE SET 
  password = EXCLUDED.password,
  updated_at = NOW();
