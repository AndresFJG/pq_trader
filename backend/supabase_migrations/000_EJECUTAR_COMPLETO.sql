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
