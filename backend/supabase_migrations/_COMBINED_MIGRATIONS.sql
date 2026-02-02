
-- ============================================================================
-- MIGRACIÓN: 000_EJECUTAR_COMPLETO.sql
-- ============================================================================

-- ================================================
-- SCRIPT DE MIGRACIONES COMPLETO PARA PQ TRADER
-- Ejecutar en Supabase SQL Editor
-- ================================================

-- ================================================
-- 1. FUNCIONES DE ENROLLMENT (Migración 005)
-- ================================================

-- Función para incrementar el contador de enrollments en un curso
CREATE OR REPLACE FUNCTION increment_course_enrollment(course_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE courses
  SET enrollment_count = COALESCE(enrollment_count, 0) + 1
  WHERE id = course_id;
END;
$$ LANGUAGE plpgsql;

-- Función para decrementar el contador de enrollments en un curso
CREATE OR REPLACE FUNCTION decrement_course_enrollment(course_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE courses
  SET enrollment_count = GREATEST(COALESCE(enrollment_count, 0) - 1, 0)
  WHERE id = course_id;
END;
$$ LANGUAGE plpgsql;

-- Función trigger para actualizar automáticamente enrollment_count
CREATE OR REPLACE FUNCTION update_course_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM increment_course_enrollment(NEW.course_id);
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM decrement_course_enrollment(OLD.course_id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger si no existe
DROP TRIGGER IF EXISTS trigger_update_course_enrollment_count ON enrollments;
CREATE TRIGGER trigger_update_course_enrollment_count
AFTER INSERT OR DELETE ON enrollments
FOR EACH ROW EXECUTE FUNCTION update_course_enrollment_count();

-- Función para obtener cursos de un usuario
CREATE OR REPLACE FUNCTION get_user_courses(user_id_param INTEGER)
RETURNS TABLE (
  course_id INTEGER,
  course_title VARCHAR,
  course_description TEXT,
  enrollment_status VARCHAR,
  progress INTEGER,
  enrolled_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.description,
    e.status,
    e.progress,
    e.enrolled_at
  FROM enrollments e
  JOIN courses c ON e.course_id = c.id
  WHERE e.user_id = user_id_param
  ORDER BY e.enrolled_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- 2. TABLA LESSONS (Migración 006)
-- ================================================

-- Crear tabla lessons si no existe
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration INTEGER DEFAULT 0,
  video_url TEXT,
  content TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course_order ON lessons(course_id, order_index);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_lessons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_lessons_updated_at ON lessons;
CREATE TRIGGER trigger_update_lessons_updated_at
BEFORE UPDATE ON lessons
FOR EACH ROW EXECUTE FUNCTION update_lessons_updated_at();

-- Comentarios
COMMENT ON TABLE lessons IS 'Lecciones/videos de los cursos';
COMMENT ON COLUMN lessons.course_id IS 'ID del curso al que pertenece';
COMMENT ON COLUMN lessons.title IS 'Título de la lección';
COMMENT ON COLUMN lessons.description IS 'Descripción de la lección';
COMMENT ON COLUMN lessons.duration IS 'Duración en minutos';
COMMENT ON COLUMN lessons.video_url IS 'URL del video (YouTube, Vimeo, etc.)';
COMMENT ON COLUMN lessons.content IS 'Contenido adicional en texto/markdown';
COMMENT ON COLUMN lessons.order_index IS 'Orden de la lección en el curso';
COMMENT ON COLUMN lessons.is_free IS 'Si la lección es de preview gratuito';

-- ================================================
-- 3. TABLAS DE MENTORSHIP SESSIONS (Migración 007)
-- ================================================

-- Crear tabla mentorship_sessions
CREATE TABLE IF NOT EXISTS mentorship_sessions (
  id SERIAL PRIMARY KEY,
  mentorship_id INTEGER NOT NULL REFERENCES mentorships(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (end_time - start_time)) / 60
  ) STORED,
  max_participants INTEGER DEFAULT 1,
  current_participants INTEGER DEFAULT 0,
  meeting_link TEXT,
  status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'booked', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla mentorship_bookings
CREATE TABLE IF NOT EXISTS mentorship_bookings (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES mentorship_sessions(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  payment_id INTEGER REFERENCES transactions(id),
  booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  UNIQUE(session_id, user_id)
);

-- Índices para mentorship_sessions
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_mentorship_id ON mentorship_sessions(mentorship_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_date ON mentorship_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_status ON mentorship_sessions(status);

-- Índices para mentorship_bookings
CREATE INDEX IF NOT EXISTS idx_mentorship_bookings_session_id ON mentorship_bookings(session_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_bookings_user_id ON mentorship_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_bookings_status ON mentorship_bookings(status);

-- Función para actualizar contadores de participantes
CREATE OR REPLACE FUNCTION update_session_participants_count()
RETURNS TRIGGER AS $$
DECLARE
  session_row RECORD;
BEGIN
  -- Obtener la sesión afectada
  IF TG_OP = 'DELETE' THEN
    SELECT * INTO session_row FROM mentorship_sessions WHERE id = OLD.session_id;
  ELSE
    SELECT * INTO session_row FROM mentorship_sessions WHERE id = NEW.session_id;
  END IF;

  -- Recalcular current_participants
  UPDATE mentorship_sessions
  SET current_participants = (
    SELECT COUNT(*)
    FROM mentorship_bookings
    WHERE session_id = session_row.id
      AND status IN ('confirmed', 'completed')
  )
  WHERE id = session_row.id;

  -- Actualizar estado de la sesión
  UPDATE mentorship_sessions
  SET status = CASE
    WHEN current_participants >= max_participants THEN 'booked'
    WHEN current_participants < max_participants AND status = 'booked' THEN 'available'
    ELSE status
  END
  WHERE id = session_row.id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar participantes
DROP TRIGGER IF EXISTS trigger_update_session_participants ON mentorship_bookings;
CREATE TRIGGER trigger_update_session_participants
AFTER INSERT OR UPDATE OR DELETE ON mentorship_bookings
FOR EACH ROW EXECUTE FUNCTION update_session_participants_count();

-- ================================================
-- 4. COLUMNAS DE PRODUCTO EN TRANSACTIONS (Migración 008)
-- ================================================

-- Agregar columnas de producto a transactions
ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS product_id INTEGER,
ADD COLUMN IF NOT EXISTS product_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS product_type VARCHAR(50);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_transactions_product_id ON transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_transactions_product_type ON transactions(product_type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

-- Comentarios
COMMENT ON COLUMN transactions.product_id IS 'ID del producto comprado (curso, mentoría, etc.)';
COMMENT ON COLUMN transactions.product_name IS 'Nombre del producto comprado';
COMMENT ON COLUMN transactions.product_type IS 'Tipo de producto: course, mentorship, portfolio, etc.';

-- ================================================
-- 5. ACTUALIZAR TRANSACCIONES EXISTENTES
-- ================================================

-- Actualizar transacciones existentes con información de metadata
UPDATE transactions
SET 
  product_id = NULLIF((metadata->>'productId')::INTEGER, 0),
  product_name = COALESCE(metadata->>'productName', metadata->>'product_name'),
  product_type = COALESCE(metadata->>'productType', metadata->>'product_type')
WHERE product_id IS NULL 
  AND metadata IS NOT NULL
  AND (metadata->>'productId' IS NOT NULL OR metadata->>'product_name' IS NOT NULL);

-- ================================================
-- 6. VERIFICACIÓN
-- ================================================

-- Verificar que todo se creó correctamente
DO $$
BEGIN
  RAISE NOTICE '✅ Migraciones completadas exitosamente';
  RAISE NOTICE '📊 Tablas creadas:';
  RAISE NOTICE '   - lessons';
  RAISE NOTICE '   - mentorship_sessions';
  RAISE NOTICE '   - mentorship_bookings';
  RAISE NOTICE '🔧 Funciones creadas:';
  RAISE NOTICE '   - increment_course_enrollment()';
  RAISE NOTICE '   - decrement_course_enrollment()';
  RAISE NOTICE '   - update_course_enrollment_count()';
  RAISE NOTICE '   - get_user_courses()';
  RAISE NOTICE '   - update_session_participants_count()';
  RAISE NOTICE '💳 Columnas agregadas a transactions:';
  RAISE NOTICE '   - product_id, product_name, product_type';
END $$;

-- Mostrar resumen de tablas
SELECT 
  'lessons' as tabla,
  COUNT(*) as registros
FROM lessons
UNION ALL
SELECT 
  'mentorship_sessions' as tabla,
  COUNT(*) as registros
FROM mentorship_sessions
UNION ALL
SELECT 
  'mentorship_bookings' as tabla,
  COUNT(*) as registros
FROM mentorship_bookings
UNION ALL
SELECT 
  'transactions' as tabla,
  COUNT(*) as registros
FROM transactions;



-- ============================================================================
-- MIGRACIÓN: 001_create_courses.sql
-- ============================================================================

-- Insertar datos de cursos actualizados
-- Tabla courses ya existe con columnas: id, title, slug, description, long_description, instructor_id, 
-- category, level, duration_hours, thumbnail, video_url, price, discount_price, is_published, 
-- enrollment_count, rating, created_at, updated_at

INSERT INTO courses (title, slug, description, long_description, level, price, duration_hours, thumbnail, is_published, enrollment_count, rating, category) VALUES
(
  'Curso Básico de Trading Algorítmico', 
  'curso-basico-trading-algoritmico', 
  'Este curso está diseñado para guiarte desde los fundamentos del mercado hasta la puesta en marcha de sistemas automáticos. Aprenderás a eliminar el factor emocional, validar tus estrategias con rigor estadístico y dominar las herramientas profesionales que utilizan los traders cuantitativos.', 
  'Este curso está diseñado para guiarte desde los fundamentos del mercado hasta la puesta en marcha de sistemas automáticos. Aprenderás a eliminar el factor emocional, validar tus estrategias con rigor estadístico y dominar las herramientas profesionales que utilizan los traders cuantitativos.

Módulos:
• Módulo 1: Fundamentos del enfoque cuantitativo y microestructura
• Módulo 2: Operativa técnica y gestión de plataforma (MT5)
• Módulo 3: Construcción lógica de estrategias y gestión de riesgo
• Módulo 4: Evaluación estadística y análisis de métricas de rendimiento
• Módulo 5: Pruebas de robustez y validación de datos no vistos
• Módulo 6: Implementación en real, monitoreo y mejora continua

El objetivo: Pasar de la intuición a la evidencia estadística mediante la automatización.', 
  'beginner', 
  290.00, 
  6, 
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3', 
  TRUE, 
  245, 
  4.9, 
  'Trading Algorítmico'
),
(
  'StrategyQuant Masterclass', 
  'strategyquant-masterclass', 
  'Aprende a crear estrategias de trading algorítmico sin necesidad de programar. En este curso introductorio conocerás StrategyQuant desde cero: su interfaz, lógica de generación de estrategias, evaluación de resultados y exportación a plataformas de trading.', 
  'Aprende a crear estrategias de trading algorítmico sin necesidad de programar. En este curso introductorio conocerás StrategyQuant desde cero: su interfaz, lógica de generación de estrategias, evaluación de resultados y exportación a plataformas de trading. Ideal para traders que quieren dar sus primeros pasos en la automatización de forma práctica y estructurada.

Módulos:
• Módulo 1: Fundamentos y Flujo de Trabajo - Introducción al ecosistema de StrategyQuant y la lógica de generación automática de estrategias
• Módulo 2: Configuración y Gestión de Datos - Manejo de la interfaz, carga de datos históricos de calidad y configuración técnica del entorno
• Módulo 3: Motor de Generación - Uso de bloques lógicos, indicadores y reglas de entrada/salida para la creación autónoma de sistemas
• Módulo 4: Evaluación y Robustez - Funciones básicas del retester y optimizador
• Módulo 5: Exportación e Implementación - Paso de la estrategia al mercado real mediante la exportación a MetaTrader o TradeStation', 
  'intermediate', 
  300.00, 
  5, 
  'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f', 
  TRUE, 
  189, 
  4.9, 
  'StrategyQuant'
),
(
  'FXDreema Masterclass', 
  'fxdreema-masterclass', 
  'Transforma tus ideas en sistemas de trading automatizados profesionales sin necesidad de programar código complejo.', 
  'Transforma tus ideas en sistemas de trading automatizados profesionales sin necesidad de programar código complejo.

Este curso integral te guía paso a paso a través de tres niveles clave para dominar fxDreema:

• Fundamentos y Lógica: Aprende los conceptos básicos de programación, tipos de variables (Bool, Double, Int) y el desarrollo de indicadores personalizados mediante señales de buffer

• Mecánicas Operativas: Domina el funcionamiento de fxDreema a través de sus eventos (On Tick, On Trade, On Timer) y el uso de bloques esenciales como filtros de tiempo, acciones de trading y gestión de riesgos (Trailing Stop y Breakeven)

• Estrategias Avanzadas: Diseña estrategias compuestas (Trend Follow, Scalping, Grid) con un enfoque en el mercado real, considerando factores críticos como el spread, el slippage y la optimización para obtener un edge estadístico sólido

Objetivo del curso: Al finalizar, serás capaz de construir, conectar y optimizar EAs robustos listos para operar con fundamentos técnicos y realistas en el mercado en vivo.', 
  'beginner', 
  600.00, 
  10, 
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f', 
  TRUE, 
  156, 
  4.8, 
  'fxDreema'
),
(
  'De la teoría al mercado real: Datos, Optimización y Robustez', 
  'teoria-mercado-real-datos-optimizacion-robustez', 
  'Evoluciona del simple desarrollo de algoritmos hacia la arquitectura de sistemas validados bajo procesos de rigor estadístico y robustez técnica', 
  'Evoluciona del simple desarrollo de algoritmos hacia la arquitectura de sistemas validados bajo procesos de rigor estadístico y robustez técnica.

Este curso avanzado está diseñado para traders que buscan profesionalizar sus sistemas mediante el rigor estadístico y la validación de datos. Aprenderás a diferenciar una curva de beneficios "maquillada" de un sistema verdaderamente robusto.

• Optimización Profesional y WFA: Domina el Walk Forward Analysis para validar tus estrategias y evitar el overfitting (sobreoptimización), asegurando que tu sistema funcione fuera del histórico

• Calidad de Datos y Robustez: Aprende a trabajar con datos de alta precisión y utiliza Tests de Montecarlo para medir la probabilidad de éxito y la resistencia de tu edge estadístico

• Gestión de Portafolios: Utiliza herramientas como QuantAnalyzer para combinar sistemas, analizar correlaciones y construir carteras diversificadas que minimicen el riesgo

• Implementación en Vivo: Todo lo necesario para el salto al mercado real: configuración de VPS, auditoría de cuentas y análisis de performance en tiempo real

El objetivo: Desarrollar un criterio analítico avanzado para validar la viabilidad de estrategias algorítmicas, mitigando el sesgo de sobreajuste (overfitting) y optimizando la gestión de carteras bajo estándares profesionales.', 
  'advanced', 
  600.00, 
  10, 
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71', 
  TRUE, 
  98, 
  4.9, 
  'Análisis Avanzado'
)
ON CONFLICT (slug) DO NOTHING;



-- ============================================================================
-- MIGRACIÓN: 002_create_portfolios.sql
-- ============================================================================

-- Crear tabla portfolios con datos del frontend
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  strategy VARCHAR(255) NOT NULL,
  roi DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_trades INTEGER DEFAULT 0,
  win_rate DECIMAL(5, 2) DEFAULT 0,
  sharpe_ratio DECIMAL(5, 2) DEFAULT 0,
  drawdown DECIMAL(5, 2) DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_portfolios_status ON portfolios(status);
CREATE INDEX IF NOT EXISTS idx_portfolios_roi ON portfolios(roi DESC);

-- Insert portfolios from frontend (Darwinex section)
INSERT INTO portfolios (name, description, strategy, roi, total_trades, win_rate, sharpe_ratio, drawdown, status) VALUES
('PQT.Alpha', 'Estrategia Alpha con enfoque en momentum y mean reversion', 'Alpha Strategy', 24.5, 342, 68.4, 2.45, -8.2, 'active'),
('PQT.Momentum', 'Estrategia de momentum puro en acciones y futuros', 'Momentum', 18.3, 289, 64.2, 2.12, -6.1, 'active'),
('PQT.Conservative', 'Estrategia conservadora con bajo riesgo', 'Conservative', 12.7, 156, 59.8, 1.85, -4.3, 'active'),
('Scalping EUR/USD', 'Estrategia de scalping en pares mayores', 'Scalping', 23.5, 1247, 68.2, 2.10, -9.5, 'active'),
('Swing Trading S&P500', 'Trading de mediano plazo en índices', 'Swing Trading', 45.8, 89, 72.5, 2.80, -12.3, 'active'),
('Day Trading Bitcoin', 'Operativa intradía en criptomonedas', 'Day Trading', -5.2, 234, 58.1, 0.45, -18.7, 'archived')
ON CONFLICT DO NOTHING;



-- ============================================================================
-- MIGRACIÓN: 003_create_mentorships.sql
-- ============================================================================

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
    (admin_id, user_id, 'Mentoría 1 a 1: Trading en General', 'Sesión individual personalizada sobre fundamentos de trading, análisis técnico, gestión de riesgo y psicología del trading. Adaptado a tu nivel y objetivos.', 'individual', 60, 150.00, NOW() + INTERVAL '7 days', 'scheduled', 'https://meet.pqtrader.com/trading-general'),
    (admin_id, user_id, 'Mentoría 1 a 1: fxDreema', 'Sesión personalizada de desarrollo con fxDreema Builder. Revisión de estrategias, optimización de EAs y resolución de dudas técnicas.', 'individual', 60, 150.00, NOW() + INTERVAL '8 days', 'scheduled', 'https://meet.pqtrader.com/fxdreema'),
    (admin_id, user_id, 'Mentoría 1 a 1: StrategyQuant X', 'Sesión individual sobre StrategyQuant X: generación de estrategias, optimización, WFA y exportación a plataformas de trading.', 'individual', 60, 150.00, NOW() + INTERVAL '9 days', 'scheduled', 'https://meet.pqtrader.com/sqx'),
    (admin_id, user_id, 'Mentoría 1 a 1: MetaTrader 4/5', 'Sesión personalizada sobre MetaTrader 4/5: configuración, uso de EAs, backtesting y operativa en real.', 'individual', 60, 150.00, NOW() + INTERVAL '10 days', 'scheduled', 'https://meet.pqtrader.com/metatrader'),
    (admin_id, user_id, 'Mentoría 1 a 1: Python para Trading', 'Sesión individual de Python aplicado al trading: análisis de datos, backtesting, APIs de brokers y automatización.', 'individual', 60, 150.00, NOW() + INTERVAL '11 days', 'scheduled', 'https://meet.pqtrader.com/python'),
    (admin_id, user_id, 'Mentoría 1 a 1: PineScript y TradingView', 'Sesión personalizada de PineScript: creación de indicadores personalizados, estrategias automatizadas y alerts en TradingView.', 'individual', 60, 150.00, NOW() + INTERVAL '12 days', 'scheduled', 'https://meet.pqtrader.com/pinescript'),
    (admin_id, user_id, 'Mentoría 1 a 1: MQL5', 'Sesión individual de programación en MQL5: desarrollo de EAs, indicadores personalizados y optimización de código.', 'individual', 60, 150.00, NOW() + INTERVAL '13 days', 'scheduled', 'https://meet.pqtrader.com/mql5'),
    (admin_id, user_id, 'Mentoría 1 a 1: Performance, Darwinex y Zero', 'Sesión personalizada de revisión de performance, análisis de métricas y auditoría de cuentas. Incluye orientación sobre Darwinex y Darwinex Zero.', 'individual', 60, 150.00, NOW() + INTERVAL '14 days', 'scheduled', 'https://meet.pqtrader.com/darwinex');
  END IF;
END $$;



-- ============================================================================
-- MIGRACIÓN: 004_create_transactions.sql
-- ============================================================================

-- Insertar transacciones de ejemplo (tabla ya existe en schema)
-- Schema existente: id, user_id, amount, currency, type (stripe/paypal/other), 
-- status (pending/completed/failed/refunded), payment_intent_id, subscription_id,
-- paypal_order_id, paypal_capture_id, metadata, paid_at, refunded_at, created_at, updated_at

DO $$
BEGIN
  -- Solo insertar si hay usuarios
  IF EXISTS (SELECT 1 FROM users LIMIT 1) THEN
    -- Insertar transacciones de ejemplo si no existen
    IF NOT EXISTS (SELECT 1 FROM transactions LIMIT 1) THEN
      INSERT INTO transactions (user_id, amount, currency, type, status, payment_intent_id, paid_at, created_at, metadata) 
      SELECT 
        users.id,
        CASE (ROW_NUMBER() OVER ()) % 3
          WHEN 0 THEN 99.00
          WHEN 1 THEN 500.00
          ELSE 29.99
        END,
        'USD',
        CASE (ROW_NUMBER() OVER ()) % 2
          WHEN 0 THEN 'stripe'
          ELSE 'paypal'
        END::transaction_type,
        'completed'::transaction_status,
        'pi_' || substr(md5(random()::text), 1, 24),
        NOW() - (ROW_NUMBER() OVER ()) * INTERVAL '1 day',
        NOW() - (ROW_NUMBER() OVER ()) * INTERVAL '1 day',
        jsonb_build_object(
          'product_type', CASE (ROW_NUMBER() OVER ()) % 3
            WHEN 0 THEN 'course'
            WHEN 1 THEN 'mentorship'
            ELSE 'subscription'
          END,
          'product_name', CASE (ROW_NUMBER() OVER ()) % 3
            WHEN 0 THEN 'Trading para Principiantes'
            WHEN 1 THEN 'Mentoría 1-on-1'
            ELSE 'Premium Subscription'
          END
        )
      FROM users
      LIMIT 10;
    END IF;
  END IF;
END $$;



-- ============================================================================
-- MIGRACIÓN: 005_add_enrollment_functions.sql
-- ============================================================================

-- Función para incrementar el contador de enrollments de un curso
CREATE OR REPLACE FUNCTION increment_course_enrollment(course_id INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE courses
  SET enrollment_count = COALESCE(enrollment_count, 0) + 1
  WHERE id = course_id;
END;
$$ LANGUAGE plpgsql;

-- Función para decrementar el contador de enrollments de un curso
CREATE OR REPLACE FUNCTION decrement_course_enrollment(course_id INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE courses
  SET enrollment_count = GREATEST(COALESCE(enrollment_count, 0) - 1, 0)
  WHERE id = course_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar el contador automáticamente cuando se crea un enrollment
CREATE OR REPLACE FUNCTION update_course_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM increment_course_enrollment(NEW.course_id);
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM decrement_course_enrollment(OLD.course_id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger si no existe
DROP TRIGGER IF EXISTS trigger_update_course_enrollment_count ON enrollments;
CREATE TRIGGER trigger_update_course_enrollment_count
  AFTER INSERT OR DELETE ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_course_enrollment_count();

-- Función para obtener los cursos de un usuario
CREATE OR REPLACE FUNCTION get_user_courses(user_id_param INTEGER)
RETURNS TABLE (
  course_id INTEGER,
  title VARCHAR,
  description TEXT,
  thumbnail VARCHAR,
  progress INTEGER,
  status VARCHAR,
  enrolled_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as course_id,
    c.title,
    c.description,
    c.thumbnail,
    e.progress,
    e.status::VARCHAR,
    e.enrolled_at
  FROM enrollments e
  JOIN courses c ON c.id = e.course_id
  WHERE e.user_id = user_id_param
  ORDER BY e.enrolled_at DESC;
END;
$$ LANGUAGE plpgsql;



-- ============================================================================
-- MIGRACIÓN: 005_create_admin_user.sql
-- ============================================================================

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



-- ============================================================================
-- MIGRACIÓN: 006_create_admin_user.sql
-- ============================================================================

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



-- ============================================================================
-- MIGRACIÓN: 006_create_lessons_table.sql
-- ============================================================================

-- Crear tabla de lecciones
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration INTEGER DEFAULT 0, -- Duración en minutos
  video_url VARCHAR(500),
  content TEXT, -- Contenido adicional (texto, markdown, etc.)
  order_index INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT FALSE, -- Si la lección es gratuita (vista previa)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_lessons_order_index ON lessons(course_id, order_index);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_lessons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lessons_updated_at_trigger
BEFORE UPDATE ON lessons
FOR EACH ROW
EXECUTE FUNCTION update_lessons_updated_at();

-- Comentarios para documentación
COMMENT ON TABLE lessons IS 'Lecciones de los cursos';
COMMENT ON COLUMN lessons.course_id IS 'ID del curso al que pertenece la lección';
COMMENT ON COLUMN lessons.title IS 'Título de la lección';
COMMENT ON COLUMN lessons.description IS 'Descripción breve de la lección';
COMMENT ON COLUMN lessons.duration IS 'Duración de la lección en minutos';
COMMENT ON COLUMN lessons.video_url IS 'URL del video embebido (YouTube, Vimeo, etc.)';
COMMENT ON COLUMN lessons.content IS 'Contenido adicional en texto/markdown';
COMMENT ON COLUMN lessons.order_index IS 'Orden de la lección dentro del curso';
COMMENT ON COLUMN lessons.is_free IS 'Si la lección es gratuita y puede verse sin comprar el curso';



-- ============================================================================
-- MIGRACIÓN: 007_create_mentorship_sessions.sql
-- ============================================================================

-- Tabla de sesiones/horarios de mentorías (los espacios disponibles que crea el admin)
CREATE TABLE IF NOT EXISTS mentorship_sessions (
  id SERIAL PRIMARY KEY,
  mentorship_id INTEGER NOT NULL REFERENCES mentorships(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  max_participants INTEGER DEFAULT 1, -- Para mentorías grupales
  current_participants INTEGER DEFAULT 0,
  meeting_link VARCHAR(500), -- Link de Zoom, Google Meet, etc.
  status VARCHAR(50) DEFAULT 'available', -- available, booked, completed, cancelled
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reservas (bookings) de usuarios
CREATE TABLE IF NOT EXISTS mentorship_bookings (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES mentorship_sessions(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, completed, cancelled, no_show
  notes TEXT, -- Notas del usuario al reservar
  payment_id INTEGER REFERENCES transactions(id), -- Referencia al pago
  booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  UNIQUE(session_id, user_id) -- Un usuario no puede reservar la misma sesión dos veces
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_mentorship_sessions_mentorship_id ON mentorship_sessions(mentorship_id);
CREATE INDEX idx_mentorship_sessions_date ON mentorship_sessions(session_date);
CREATE INDEX idx_mentorship_sessions_status ON mentorship_sessions(status);
CREATE INDEX idx_mentorship_bookings_session_id ON mentorship_bookings(session_id);
CREATE INDEX idx_mentorship_bookings_user_id ON mentorship_bookings(user_id);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_mentorship_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_mentorship_sessions_updated_at_trigger
BEFORE UPDATE ON mentorship_sessions
FOR EACH ROW
EXECUTE FUNCTION update_mentorship_sessions_updated_at();

-- Función para actualizar el contador de participantes al crear/eliminar una reserva
CREATE OR REPLACE FUNCTION update_session_participants_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
    -- Incrementar contador al confirmar reserva
    UPDATE mentorship_sessions
    SET current_participants = current_participants + 1,
        status = CASE 
          WHEN current_participants + 1 >= max_participants THEN 'booked'
          ELSE status
        END
    WHERE id = NEW.session_id;
  ELSIF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND NEW.status = 'cancelled' AND OLD.status = 'confirmed') THEN
    -- Decrementar contador al cancelar
    UPDATE mentorship_sessions
    SET current_participants = GREATEST(current_participants - 1, 0),
        status = CASE
          WHEN current_participants - 1 < max_participants AND status = 'booked' THEN 'available'
          ELSE status
        END
    WHERE id = COALESCE(NEW.session_id, OLD.session_id);
  END IF
;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_session_participants_trigger
AFTER INSERT OR UPDATE OR DELETE ON mentorship_bookings
FOR EACH ROW
EXECUTE FUNCTION update_session_participants_count();

-- Comentarios para documentación
COMMENT ON TABLE mentorship_sessions IS 'Sesiones/horarios disponibles para las mentorías';
COMMENT ON TABLE mentorship_bookings IS 'Reservas de usuarios para las sesiones de mentorías';
COMMENT ON COLUMN mentorship_sessions.max_participants IS 'Máximo de participantes (1 para individual, más para grupal)';
COMMENT ON COLUMN mentorship_sessions.current_participants IS 'Cantidad actual de participantes reservados';
COMMENT ON COLUMN mentorship_sessions.meeting_link IS 'Enlace de la reunión (Zoom, Google Meet, etc.)';
COMMENT ON COLUMN mentorship_bookings.payment_id IS 'ID de la transacción de pago si aplica';



-- ============================================================================
-- MIGRACIÓN: 008_add_product_columns_to_transactions.sql
-- ============================================================================

-- Agregar columnas de producto a la tabla transactions
-- Para mostrar información detallada en el dashboard de admin

ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS product_id INTEGER,
ADD COLUMN IF NOT EXISTS product_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS product_type VARCHAR(50);

-- Crear índice para búsqueda por producto
CREATE INDEX IF NOT EXISTS idx_transactions_product_id ON transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_transactions_product_type ON transactions(product_type);

-- Comentarios
COMMENT ON COLUMN transactions.product_id IS 'ID del producto comprado (curso, mentoría, etc.)';
COMMENT ON COLUMN transactions.product_name IS 'Nombre del producto comprado';
COMMENT ON COLUMN transactions.product_type IS 'Tipo de producto: course, mentorship, portfolio, etc.';



-- ============================================================================
-- MIGRACIÓN: 009_create_mentor_schedules.sql
-- ============================================================================

-- Create mentor schedules table for managing availability
CREATE TABLE IF NOT EXISTS mentor_schedules (
  id BIGSERIAL PRIMARY KEY,
  mentor_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Schedule details
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_sessions_per_day INTEGER DEFAULT 5,
  session_duration_minutes INTEGER DEFAULT 60,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  break_start TIME,
  break_end TIME,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_time CHECK (start_time < end_time)
);

-- Create mentor unavailability table for blackout dates
CREATE TABLE IF NOT EXISTS mentor_unavailability (
  id BIGSERIAL PRIMARY KEY,
  mentor_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Unavailable period
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason VARCHAR(255),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_period CHECK (start_date <= end_date)
);

-- Update mentorships table to include time slot info
ALTER TABLE IF EXISTS mentorships 
ADD COLUMN IF NOT EXISTS time_slot_start TIME,
ADD COLUMN IF NOT EXISTS time_slot_end TIME;

-- Create indices for better performance
CREATE INDEX IF NOT EXISTS idx_mentor_schedules_mentor_id ON mentor_schedules(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_schedules_day ON mentor_schedules(day_of_week);
CREATE INDEX IF NOT EXISTS idx_mentor_unavailability_mentor_id ON mentor_unavailability(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_unavailability_dates ON mentor_unavailability(start_date, end_date);

-- RLS Policies for mentor_schedules
ALTER TABLE mentor_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors can view their own schedules"
  ON mentor_schedules FOR SELECT
  USING (auth.uid()::text::INTEGER = mentor_id OR 
         EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text::INTEGER AND role = 'admin'));

CREATE POLICY "Mentors can update their own schedules"
  ON mentor_schedules FOR UPDATE
  USING (auth.uid()::text::INTEGER = mentor_id);

CREATE POLICY "Mentors can insert their own schedules"
  ON mentor_schedules FOR INSERT
  WITH CHECK (auth.uid()::text::INTEGER = mentor_id);

-- RLS Policies for mentor_unavailability
ALTER TABLE mentor_unavailability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors can view their own unavailability"
  ON mentor_unavailability FOR SELECT
  USING (auth.uid()::text::INTEGER = mentor_id OR 
         EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text::INTEGER AND role = 'admin'));

CREATE POLICY "Mentors can manage their own unavailability"
  ON mentor_unavailability FOR ALL
  USING (auth.uid()::text::INTEGER = mentor_id);



-- ============================================================================
-- MIGRACIÓN: 010_enable_rls_policies.sql
-- ============================================================================

-- ============================================================================
-- RLS (Row Level Security) Policies para PQ Trader
-- Soluciona las vulnerabilidades detectadas en Supabase
-- ============================================================================

-- ENABLE RLS EN TODAS LAS TABLAS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_blacklist ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 1. USERS TABLE - Políticas de Seguridad
-- ============================================================================

-- Usuarios pueden ver su propio perfil
CREATE POLICY "Users can view their own profile"
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- Usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update their own profile"
ON public.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admins pueden ver todos los usuarios
CREATE POLICY "Admins can view all users"
ON public.users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admins pueden actualizar cualquier usuario
CREATE POLICY "Admins can update any user"
ON public.users
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Public: Solo mostrar información no sensible (nombre, avatar)
CREATE POLICY "Public profile visibility"
ON public.users
FOR SELECT
USING (true)
WITH CHECK (false);

-- ============================================================================
-- 2. COURSES TABLE - Acceso a Cursos
-- ============================================================================

-- Todos pueden ver cursos publicados
CREATE POLICY "Everyone can view published courses"
ON public.courses
FOR SELECT
USING (is_published = true OR auth.uid() IN (
  SELECT id FROM public.users WHERE role IN ('admin', 'instructor')
));

-- Solo instructores/admins pueden crear cursos
CREATE POLICY "Only instructors can create courses"
ON public.courses
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role IN ('admin', 'instructor')
  )
);

-- Solo propietario o admin puede actualizar curso
CREATE POLICY "Instructors can update their own courses"
ON public.courses
FOR UPDATE
USING (
  instructor_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  instructor_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- 3. ENROLLMENTS TABLE - Inscripciones
-- ============================================================================

-- Los usuarios pueden ver sus propias inscripciones
CREATE POLICY "Users can view their own enrollments"
ON public.enrollments
FOR SELECT
USING (user_id = auth.uid());

-- Los instructores pueden ver inscripciones en sus cursos
CREATE POLICY "Instructors can view enrollments in their courses"
ON public.enrollments
FOR SELECT
USING (
  course_id IN (
    SELECT id FROM public.courses WHERE instructor_id = auth.uid()
  )
);

-- Admins ven todas las inscripciones
CREATE POLICY "Admins can view all enrollments"
ON public.enrollments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Los usuarios pueden inscribirse en cursos
CREATE POLICY "Users can create their own enrollments"
ON public.enrollments
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 4. LESSONS TABLE - Lecciones
-- ============================================================================

-- Usuarios pueden ver lecciones de cursos donde están inscritos
CREATE POLICY "Users can view lessons of enrolled courses"
ON public.lessons
FOR SELECT
USING (
  course_id IN (
    SELECT course_id FROM public.enrollments WHERE user_id = auth.uid()
  ) OR
  course_id IN (
    SELECT id FROM public.courses WHERE is_published = true
  ) OR
  EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor')
  )
);

-- ============================================================================
-- 5. MENTORSHIPS TABLE - Mentorías
-- ============================================================================

-- Usuarios pueden ver su propio perfil de mentor
CREATE POLICY "Mentors can view their own profile"
ON public.mentorships
FOR SELECT
USING (mentor_id = auth.uid());

-- Estudiantes pueden ver perfiles de mentores (sin datos sensibles)
CREATE POLICY "Students can view mentor profiles"
ON public.mentorships
FOR SELECT
USING (is_available = true);

-- Admins ven todo
CREATE POLICY "Admins can view all mentorships"
ON public.mentorships
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- 6. MENTORSHIP_BOOKINGS TABLE - Reservas de Mentorías
-- ============================================================================

-- Los usuarios pueden ver sus propias reservas
CREATE POLICY "Users can view their own bookings"
ON public.mentorship_bookings
FOR SELECT
USING (student_id = auth.uid());

-- Los mentores pueden ver sus reservas
CREATE POLICY "Mentors can view their bookings"
ON public.mentorship_bookings
FOR SELECT
USING (mentor_id = auth.uid());

-- Admins ven todas las reservas
CREATE POLICY "Admins can view all bookings"
ON public.mentorship_bookings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Los estudiantes pueden crear reservas
CREATE POLICY "Students can create bookings"
ON public.mentorship_bookings
FOR INSERT
WITH CHECK (student_id = auth.uid());

-- Los usuarios pueden actualizar sus propias reservas
CREATE POLICY "Users can update their own bookings"
ON public.mentorship_bookings
FOR UPDATE
USING (student_id = auth.uid() OR mentor_id = auth.uid())
WITH CHECK (student_id = auth.uid() OR mentor_id = auth.uid());

-- Los usuarios pueden cancelar sus propias reservas
CREATE POLICY "Users can delete their own bookings"
ON public.mentorship_bookings
FOR DELETE
USING (student_id = auth.uid() OR mentor_id = auth.uid());

-- ============================================================================
-- 7. MENTORSHIP_SESSIONS TABLE - Sesiones
-- ============================================================================

-- Participantes pueden ver sus sesiones
CREATE POLICY "Users can view their sessions"
ON public.mentorship_sessions
FOR SELECT
USING (
  student_id = auth.uid() OR
  mentor_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- 8. PORTFOLIOS TABLE - Portafolios
-- ============================================================================

-- Los usuarios pueden ver sus propios portafolios
CREATE POLICY "Users can view their own portfolios"
ON public.portfolios
FOR SELECT
USING (user_id = auth.uid());

-- Portafolios públicos pueden verse
CREATE POLICY "Everyone can view public portfolios"
ON public.portfolios
FOR SELECT
USING (is_public = true);

-- Admins ven todo
CREATE POLICY "Admins can view all portfolios"
ON public.portfolios
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Usuarios solo pueden crear/editar sus propios portafolios
CREATE POLICY "Users can manage their own portfolios"
ON public.portfolios
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own portfolios"
ON public.portfolios
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 9. TRANSACTIONS TABLE - Transacciones
-- ============================================================================

-- Los usuarios pueden ver sus propias transacciones
CREATE POLICY "Users can view their own transactions"
ON public.transactions
FOR SELECT
USING (user_id = auth.uid());

-- Admins pueden ver todas las transacciones
CREATE POLICY "Admins can view all transactions"
ON public.transactions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Solo sistema (con credenciales especiales) puede crear transacciones
CREATE POLICY "Only system can create transactions"
ON public.transactions
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- 10. SECURITY_LOGS TABLE - Logs de Seguridad
-- ============================================================================

-- Admins pueden ver todos los logs
CREATE POLICY "Admins can view security logs"
ON public.security_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Solo sistema puede escribir logs
CREATE POLICY "System can create security logs"
ON public.security_logs
FOR INSERT
WITH CHECK (true);

-- ============================================================================
-- 11. TOKEN_BLACKLIST TABLE - Tokens Revocados
-- ============================================================================

-- Solo sistema puede ver y crear blacklist
CREATE POLICY "System can manage token blacklist"
ON public.token_blacklist
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "System can create blacklist entries"
ON public.token_blacklist
FOR INSERT
WITH CHECK (true);

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================

-- Índices para RLS queries
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON public.courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_is_published ON public.courses(is_published);
CREATE INDEX IF NOT EXISTS idx_mentorships_mentor_id ON public.mentorships(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorships_is_available ON public.mentorships(is_available);
CREATE INDEX IF NOT EXISTS idx_mentorship_bookings_student_id ON public.mentorship_bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_bookings_mentor_id ON public.mentorship_bookings(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_bookings_status ON public.mentorship_bookings(status);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_is_public ON public.portfolios(is_public);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);

-- ============================================================================
-- COMENTARIOS
-- ============================================================================

COMMENT ON POLICY "Users can view their own profile" ON public.users IS
'Cada usuario solo ve su propio perfil (email, contraseña hasheada, etc)';

COMMENT ON POLICY "Users can view their own bookings" ON public.mentorship_bookings IS
'Los estudiantes solo ven sus propias reservas, no las de otros';

COMMENT ON POLICY "Mentors can view their bookings" ON public.mentorship_bookings IS
'Los mentores ven solo sus propias reservas con estudiantes';

COMMENT ON POLICY "Admins can view all bookings" ON public.mentorship_bookings IS
'Los admins pueden ver y gestionar todas las reservas del sistema';

-- ============================================================================
-- FIN - RLS POLICIES
-- ============================================================================



-- ============================================================================
-- MIGRACIÓN: 010_enable_rls_policies_fixed.sql
-- ============================================================================

-- ============================================================================
-- RLS (Row Level Security) Policies para PQ Trader - VERSIÓN FINAL
-- Basada en estructura REAL de tablas de Supabase
-- ============================================================================

-- VERIFICAR QUE LAS TABLAS EXISTEN ANTES DE HABILITAR RLS
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'courses' AND table_schema = 'public') THEN
    ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'enrollments' AND table_schema = 'public') THEN
    ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'lessons' AND table_schema = 'public') THEN
    ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mentorships' AND table_schema = 'public') THEN
    ALTER TABLE public.mentorships ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mentorship_sessions' AND table_schema = 'public') THEN
    ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mentorship_bookings' AND table_schema = 'public') THEN
    ALTER TABLE public.mentorship_bookings ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'portfolios' AND table_schema = 'public') THEN
    ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'transactions' AND table_schema = 'public') THEN
    ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- ============================================================================
-- 1. USERS TABLE - Políticas de Seguridad
-- ============================================================================

-- ELIMINAR POLÍTICAS PREVIAS
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update any user" ON public.users;

-- Usuarios pueden ver su propio perfil
CREATE POLICY "users_view_own"
ON public.users
FOR SELECT
USING (id::text = auth.uid()::text);

-- Usuarios pueden actualizar su propio perfil
CREATE POLICY "users_update_own"
ON public.users
FOR UPDATE
USING (id::text = auth.uid()::text)
WITH CHECK (id::text = auth.uid()::text);

-- Admins pueden ver todos los usuarios
CREATE POLICY "admins_view_all_users"
ON public.users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
);

-- Admins pueden actualizar cualquier usuario
CREATE POLICY "admins_update_users"
ON public.users
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
);

-- ============================================================================
-- 2. COURSES TABLE - Acceso a Cursos
-- ============================================================================

DROP POLICY IF EXISTS "Everyone can view published courses" ON public.courses;
DROP POLICY IF EXISTS "Only mentors can create courses" ON public.courses;
DROP POLICY IF EXISTS "Mentors can update their own courses" ON public.courses;

-- Todos pueden ver cursos publicados
CREATE POLICY "courses_view_published"
ON public.courses
FOR SELECT
USING (is_published = true);

-- Instructores pueden ver sus propios cursos
CREATE POLICY "courses_view_own"
ON public.courses
FOR SELECT
USING (instructor_id::text = auth.uid()::text);

-- Admins pueden ver todos los cursos
CREATE POLICY "courses_admins_view_all"
ON public.courses
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
);

-- Solo mentores/admins pueden crear cursos
CREATE POLICY "courses_mentors_create"
ON public.courses
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id::text = auth.uid()::text AND u.role::text IN ('admin', 'mentor')
  )
);

-- Propietario o admin puede actualizar curso
CREATE POLICY "courses_update_own"
ON public.courses
FOR UPDATE
USING (
  instructor_id::text = auth.uid()::text OR
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
)
WITH CHECK (
  instructor_id::text = auth.uid()::text OR
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
);

-- ============================================================================
-- 3. ENROLLMENTS TABLE - Inscripciones
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Mentors can view enrollments in their courses" ON public.enrollments;
DROP POLICY IF EXISTS "Admins can view all enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Users can create their own enrollments" ON public.enrollments;

-- Los usuarios pueden ver sus propias inscripciones
CREATE POLICY "enrollments_view_own"
ON public.enrollments
FOR SELECT
USING (user_id::text = auth.uid()::text);

-- Los mentores pueden ver inscripciones en sus cursos
CREATE POLICY "enrollments_mentors_view"
ON public.enrollments
FOR SELECT
USING (
  course_id IN (
    SELECT id FROM public.courses WHERE instructor_id::text = auth.uid()::text
  )
);

-- Admins ven todas las inscripciones
CREATE POLICY "enrollments_admins_view_all"
ON public.enrollments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
);

-- Los usuarios pueden inscribirse en cursos
CREATE POLICY "enrollments_users_create"
ON public.enrollments
FOR INSERT
WITH CHECK (user_id::text = auth.uid()::text);

-- ============================================================================
-- 4. LESSONS TABLE - Lecciones
-- ============================================================================

DROP POLICY IF EXISTS "Users can view lessons of enrolled courses" ON public.lessons;

-- Usuarios pueden ver lecciones de cursos donde están inscritos o son públicos
CREATE POLICY "lessons_view_enrolled"
ON public.lessons
FOR SELECT
USING (
  course_id IN (
    SELECT course_id FROM public.enrollments WHERE user_id::text = auth.uid()::text
  ) OR
  course_id IN (
    SELECT id FROM public.courses WHERE is_published = true
  )
);

-- Instructores/admins pueden ver todas las lecciones
CREATE POLICY "lessons_view_all_admin"
ON public.lessons
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text IN ('admin', 'mentor')
  )
);

-- ============================================================================
-- 5. MENTORSHIPS TABLE - Mentorías
-- ============================================================================

DROP POLICY IF EXISTS "Mentors can view their own mentorships" ON public.mentorships;
DROP POLICY IF EXISTS "Students can view their own mentorships" ON public.mentorships;
DROP POLICY IF EXISTS "Admins can view all mentorships" ON public.mentorships;

-- Mentores pueden ver sus propias mentorías
CREATE POLICY "mentorships_view_mentor"
ON public.mentorships
FOR SELECT
USING (mentor_id::text = auth.uid()::text);

-- Estudiantes pueden ver sus mentorías
CREATE POLICY "mentorships_view_student"
ON public.mentorships
FOR SELECT
USING (student_id::text = auth.uid()::text);

-- Admins ven todo
CREATE POLICY "mentorships_view_admin"
ON public.mentorships
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
);

-- ============================================================================
-- 6. MENTORSHIP_SESSIONS TABLE - Sesiones Disponibles
-- ============================================================================

DROP POLICY IF EXISTS "Users can view available sessions" ON public.mentorship_sessions;
DROP POLICY IF EXISTS "Mentors can manage their sessions" ON public.mentorship_sessions;

-- Los usuarios pueden ver sesiones no canceladas o de sus mentorías
CREATE POLICY "sessions_view_available"
ON public.mentorship_sessions
FOR SELECT
USING (
  status::text != 'cancelled' OR 
  mentorship_id IN (
    SELECT id FROM public.mentorships 
    WHERE mentor_id::text = auth.uid()::text OR student_id::text = auth.uid()::text
  )
);

-- Mentores pueden crear/editar sus propias sesiones
CREATE POLICY "sessions_mentors_create"
ON public.mentorship_sessions
FOR INSERT
WITH CHECK (
  mentorship_id IN (
    SELECT id FROM public.mentorships WHERE mentor_id::text = auth.uid()::text
  )
);

-- ============================================================================
-- 7. MENTORSHIP_BOOKINGS TABLE - Reservas de Sesiones
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own bookings" ON public.mentorship_bookings;
DROP POLICY IF EXISTS "Mentors can view bookings in their sessions" ON public.mentorship_bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.mentorship_bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.mentorship_bookings;
DROP POLICY IF EXISTS "Users can delete their own bookings" ON public.mentorship_bookings;

-- Los usuarios pueden ver sus propias reservas
CREATE POLICY "bookings_view_own"
ON public.mentorship_bookings
FOR SELECT
USING (user_id::text = auth.uid()::text);

-- Mentores pueden ver reservas en sus sesiones
CREATE POLICY "bookings_mentors_view"
ON public.mentorship_bookings
FOR SELECT
USING (
  session_id IN (
    SELECT id FROM public.mentorship_sessions 
    WHERE mentorship_id IN (
      SELECT id FROM public.mentorships WHERE mentor_id::text = auth.uid()::text
    )
  )
);

-- Admins ven todas las reservas
CREATE POLICY "bookings_view_admin"
ON public.mentorship_bookings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
);

-- Los usuarios pueden crear sus propias reservas
CREATE POLICY "bookings_users_create"
ON public.mentorship_bookings
FOR INSERT
WITH CHECK (user_id::text = auth.uid()::text);

-- Los usuarios pueden cancelar sus propias reservas
CREATE POLICY "bookings_users_delete"
ON public.mentorship_bookings
FOR DELETE
USING (user_id::text = auth.uid()::text);

-- ============================================================================
-- 8. PORTFOLIOS TABLE - Portafolios
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Everyone can view public portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Admins can view all portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users can manage their own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users can update their own portfolios" ON public.portfolios;

-- Los usuarios pueden ver sus propios portafolios
CREATE POLICY "portfolios_view_own"
ON public.portfolios
FOR SELECT
USING (user_id::text = auth.uid()::text);

-- Portafolios públicos pueden verse
CREATE POLICY "portfolios_view_public"
ON public.portfolios
FOR SELECT
USING (is_public = true);

-- Admins ven todo
CREATE POLICY "portfolios_view_admin"
ON public.portfolios
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
);

-- Usuarios solo pueden crear sus propios portafolios
CREATE POLICY "portfolios_users_create"
ON public.portfolios
FOR INSERT
WITH CHECK (user_id::text = auth.uid()::text);

-- Usuarios pueden actualizar sus propios portafolios
CREATE POLICY "portfolios_users_update"
ON public.portfolios
FOR UPDATE
USING (user_id::text = auth.uid()::text)
WITH CHECK (user_id::text = auth.uid()::text);

-- ============================================================================
-- 9. TRANSACTIONS TABLE - Transacciones
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;

-- Los usuarios pueden ver sus propias transacciones
CREATE POLICY "transactions_view_own"
ON public.transactions
FOR SELECT
USING (user_id::text = auth.uid()::text);

-- Admins pueden ver todas las transacciones
CREATE POLICY "transactions_view_admin"
ON public.transactions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
);

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON public.courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_is_published ON public.courses(is_published);
CREATE INDEX IF NOT EXISTS idx_mentorships_mentor_id ON public.mentorships(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorships_student_id ON public.mentorships(student_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_mentorship_id ON public.mentorship_sessions(mentorship_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_bookings_session_id ON public.mentorship_bookings(session_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_bookings_user_id ON public.mentorship_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_is_public ON public.portfolios(is_public);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);

-- ============================================================================
-- CONFIRMACIÓN
-- ============================================================================

DO $$
DECLARE
  v_message TEXT;
BEGIN
  SELECT STRING_AGG('✅ RLS habilitado: ' || schemaname || '.' || tablename, E'\n')
  INTO v_message
  FROM pg_tables
  WHERE schemaname = 'public'
  AND tablename IN ('users', 'courses', 'enrollments', 'lessons', 'mentorships', 
                    'mentorship_sessions', 'mentorship_bookings', 'portfolios', 'transactions');
  
  RAISE NOTICE '%', COALESCE(v_message, 'No tables found');
  RAISE NOTICE 'RLS Policies aplicadas exitosamente';
END $$;

-- ============================================================================
-- FIN - RLS POLICIES CORREGIDAS
-- ============================================================================



-- ============================================================================
-- MIGRACIÓN: 011_validate_rls.sql
-- ============================================================================

-- ============================================================================
-- Script de Validación - Verificar que RLS está correctamente configurado
-- Ejecutar después de aplicar 010_enable_rls_policies.sql
-- ============================================================================

-- 1. Verificar que RLS está habilitado en todas las tablas
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Resultado esperado: Todas con rowsecurity = TRUE

-- ============================================================================

-- 2. Contar el número de policies
SELECT 
  schemaname,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;

-- Resultado esperado: Múltiples policies por tabla

-- ============================================================================

-- 3. Ver todas las policies en detalle
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Esto te mostrará exactamente qué políticas están activas

-- ============================================================================

-- 4. Verificar índices creados
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%'
ORDER BY tablename;

-- Resultado esperado: 13+ índices para performance

-- ============================================================================

-- 5. Test: Usuario No Autenticado (debería fallar)
-- NOTA: Ejecutar con usuario anónimo (sin JWT)
-- SELECT * FROM public.users LIMIT 1;
-- Esperado: Error violates row-level security

-- ============================================================================

-- 6. Ver tamaño de cada tabla
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Útil para identificar si hay datos (y si RLS funciona)

-- ============================================================================

-- 7. Verificar constraints y relaciones
SELECT 
  constraint_name,
  table_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public'
ORDER BY table_name, constraint_type;

-- Verifica integridad referencial

-- ============================================================================

-- 8. Ver all users por rol (para debugging)
SELECT 
  id,
  email,
  role,
  created_at
FROM public.users
ORDER BY role, created_at DESC;

-- Nota: Esta query fallará si no eres admin y no es tu propio perfil
-- Lo cual es CORRECTO si RLS está funcionando

-- ============================================================================

-- 9. Verificar que transactions no está accesible sin auth
-- SELECT COUNT(*) FROM public.transactions;
-- Esperado: Error si no hay autenticación

-- ============================================================================

-- 10. Audit Trail - Ver logs de seguridad
SELECT 
  id,
  user_id,
  action,
  resource_type,
  resource_id,
  status,
  created_at
FROM public.security_logs
ORDER BY created_at DESC
LIMIT 20;

-- Nota: Solo admins pueden ver esto (gracias a RLS)

-- ============================================================================
-- FIN - VALIDACIÓN
-- ============================================================================


