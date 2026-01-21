-- Insertar datos de mentorías del frontend
-- Primero obtener IDs de usuarios para asignar como mentores

DO $$
DECLARE
  admin_id INTEGER;
  user_id INTEGER;
BEGIN
  -- Obtener admin user
  SELECT id INTO admin_id FROM users WHERE role = 'admin' OR email = 'admin@pqtrader.com' LIMIT 1;
  
  -- Obtener primer user regular
  SELECT id INTO user_id FROM users WHERE role = 'user' LIMIT 1;
  
  -- Si no hay usuarios, usar NULL y dejar que falle (necesitamos usuarios primero)
  IF admin_id IS NULL THEN
    RAISE EXCEPTION 'No hay usuarios admin. Crea un usuario admin primero usando el script 005_create_admin_user.sql';
  END IF;
  
  -- Usar admin como fallback para student si no hay users
  IF user_id IS NULL THEN
    user_id := admin_id;
  END IF;
  
  -- Insertar mentorías si no existen
  IF NOT EXISTS (SELECT 1 FROM mentorships LIMIT 1) THEN
    INSERT INTO mentorships (mentor_id, student_id, title, description, type, duration_minutes, price, scheduled_at, status, meeting_url) VALUES
    (admin_id, user_id, 'Mentoría 1-1 Trading Avanzado', 'Sesión personalizada para traders con experiencia que buscan optimizar sus estrategias', 'individual', 60, 499.00, NOW() + INTERVAL '7 days', 'scheduled', 'https://meet.pqtrader.com/advanced-1'),
    (admin_id, user_id, 'Grupo: Análisis de Mercados', 'Sesiones grupales semanales de análisis de mercado en tiempo real', 'group', 90, 199.00, NOW() + INTERVAL '3 days', 'scheduled', 'https://meet.pqtrader.com/market-analysis'),
    (admin_id, user_id, 'Workshop: Estrategias Intraday', 'Taller intensivo de estrategias intradía con práctica en vivo', 'workshop', 120, 299.00, NOW() + INTERVAL '14 days', 'pending', NULL),
    (admin_id, user_id, 'Mentoría: Python para Trading', 'Aprende a automatizar tu trading con Python', 'individual', 90, 150.00, NOW() + INTERVAL '10 days', 'scheduled', 'https://meet.pqtrader.com/python'),
    (admin_id, user_id, 'Workshop: StrategyQuant Avanzado', 'Masterclass de optimización y robustez en StrategyQuant', 'workshop', 180, 350.00, NOW() + INTERVAL '21 days', 'pending', NULL);
  END IF;
END $$;
