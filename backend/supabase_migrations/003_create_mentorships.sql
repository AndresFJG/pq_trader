-- Insertar datos de mentorías actualizadas (sesiones 1 a 1)
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
  
  -- Insertar mentorías individuales 1 a 1 si no existen
  -- El enfoque principal es sesiones individuales personalizadas en distintas áreas
  IF NOT EXISTS (SELECT 1 FROM mentorships LIMIT 1) THEN
    INSERT INTO mentorships (mentor_id, student_id, title, description, type, duration_minutes, price, scheduled_at, status, meeting_url) VALUES
    (admin_id, user_id, 'Mentoría 1 a 1: Trading en General', 'Sesión individual personalizada sobre fundamentos de trading, análisis técnico, gestión de riesgo y psicología del trading. Adaptado a tu nivel y objetivos.', 'individual', 60, 150.00, NOW() + INTERVAL '7 days', 'scheduled', 'https://meet.pqtrader.com/trading-general')
    ON CONFLICT (mentor_id, student_id) DO NOTHING;
    
    -- Crear sesiones específicas para diferentes temas
    INSERT INTO mentorship_sessions (mentorship_id, title, description, session_date, start_time, end_time, duration_minutes, meeting_link, status)
    SELECT 
      m.id,
      topic.title,
      topic.description,
      CURRENT_DATE + (topic.days_offset || ' days')::INTERVAL,
      '10:00:00'::TIME,
      '11:00:00'::TIME,
      60,
      topic.meeting_url,
      'available'
    FROM mentorships m
    CROSS JOIN (VALUES
      ('fxDreema', 'Desarrollo con fxDreema Builder. Revisión de estrategias y optimización de EAs.', 8, 'https://meet.pqtrader.com/fxdreema'),
      ('StrategyQuant X', 'StrategyQuant X: generación de estrategias, optimización, WFA.', 9, 'https://meet.pqtrader.com/sqx'),
      ('MetaTrader 4/5', 'MetaTrader: configuración, uso de EAs, backtesting.', 10, 'https://meet.pqtrader.com/metatrader'),
      ('Python para Trading', 'Python aplicado al trading: análisis de datos, backtesting, APIs.', 11, 'https://meet.pqtrader.com/python'),
      ('PineScript y TradingView', 'PineScript: indicadores personalizados y estrategias automatizadas.', 12, 'https://meet.pqtrader.com/pinescript'),
      ('MQL5', 'Programación en MQL5: desarrollo de EAs e indicadores.', 13, 'https://meet.pqtrader.com/mql5'),
      ('Performance y Darwinex', 'Revisión de performance, métricas y auditoría de cuentas.', 14, 'https://meet.pqtrader.com/darwinex')
    ) AS topic(title, description, days_offset, meeting_url)
    WHERE m.mentor_id = admin_id AND m.student_id = user_id
    LIMIT 7
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
