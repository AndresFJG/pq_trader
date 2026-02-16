-- ============================================================================
-- AGREGAR CAMPOS FALTANTES A LA TABLA MENTORS
-- ============================================================================
-- Fecha: 2026-02-16
-- Descripción: Agregar campos image_url y achievements para completar el schema
-- ============================================================================

-- 1. Agregar campo image_url para almacenar nombre de archivo de imagen
ALTER TABLE public.mentors 
ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- 2. Agregar campo achievements para logros del mentor
ALTER TABLE public.mentors 
ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]'::jsonb;

-- 3. Eliminar funciones RPC existentes (necesario para cambiar tipo de retorno)
DROP FUNCTION IF EXISTS get_all_mentors();
DROP FUNCTION IF EXISTS get_mentor_by_id(INTEGER);

-- 4. Crear función RPC get_all_mentors con todos los campos
CREATE OR REPLACE FUNCTION get_all_mentors()
RETURNS TABLE (
  id INTEGER,
  name TEXT,
  email TEXT,
  phone TEXT,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  phrase TEXT,
  linkedin TEXT,
  students INTEGER,
  rating NUMERIC,
  sessions INTEGER,
  highlights JSONB,
  achievements JSONB,
  image_url TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.name,
    m.email,
    m.phone,
    m.title,
    m.subtitle,
    m.description,
    m.phrase,
    m.linkedin,
    m.students,
    m.rating,
    m.sessions,
    m.highlights,
    m.achievements,
    m.image_url,
    m.created_at,
    m.updated_at
  FROM mentors m
  ORDER BY m.id ASC;
END;
$$;

-- 5. Crear función RPC get_mentor_by_id con todos los campos
CREATE OR REPLACE FUNCTION get_mentor_by_id(mentor_id INTEGER)
RETURNS TABLE (
  id INTEGER,
  name TEXT,
  email TEXT,
  phone TEXT,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  phrase TEXT,
  linkedin TEXT,
  students INTEGER,
  rating NUMERIC,
  sessions INTEGER,
  highlights JSONB,
  achievements JSONB,
  image_url TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.name,
    m.email,
    m.phone,
    m.title,
    m.subtitle,
    m.description,
    m.phrase,
    m.linkedin,
    m.students,
    m.rating,
    m.sessions,
    m.highlights,
    m.achievements,
    m.image_url,
    m.created_at,
    m.updated_at
  FROM mentors m
  WHERE m.id = mentor_id;
END;
$$;

-- 6. Dar permisos públicos a las funciones RPC
GRANT EXECUTE ON FUNCTION get_all_mentors() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_mentor_by_id(INTEGER) TO anon, authenticated;

-- 7. Crear índice para búsqueda por image_url
CREATE INDEX IF NOT EXISTS idx_mentors_image_url ON public.mentors(image_url);

-- ============================================================================
-- VALORES POR DEFECTO PARA MENTORES EXISTENTES
-- ============================================================================

-- Asignar imagen por defecto a mentores sin imagen
UPDATE public.mentors 
SET image_url = 'Martin.jpg' 
WHERE image_url IS NULL OR image_url = '';

-- Asignar achievements vacío a mentores sin achievements
UPDATE public.mentors 
SET achievements = '[]'::jsonb 
WHERE achievements IS NULL;

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================
DO $$
DECLARE
  image_column_exists BOOLEAN;
  achievements_column_exists BOOLEAN;
  total_mentors INTEGER;
BEGIN
  -- Verificar que image_url existe
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mentors' 
    AND column_name = 'image_url'
    AND table_schema = 'public'
  ) INTO image_column_exists;
  
  -- Verificar que achievements existe
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mentors' 
    AND column_name = 'achievements'
    AND table_schema = 'public'
  ) INTO achievements_column_exists;
  
  -- Contar mentores
  SELECT COUNT(*) INTO total_mentors FROM public.mentors;
  
  IF image_column_exists AND achievements_column_exists THEN
    RAISE NOTICE '✓ Campos agregados exitosamente';
    RAISE NOTICE '  - image_url: %', image_column_exists;
    RAISE NOTICE '  - achievements: %', achievements_column_exists;
    RAISE NOTICE '  Total de mentores actualizados: %', total_mentors;
  ELSE
    RAISE WARNING '✗ Error: Algunos campos no fueron agregados';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '✓ Funciones RPC actualizadas:';
  RAISE NOTICE '  - get_all_mentors()';
  RAISE NOTICE '  - get_mentor_by_id()';
END $$;

-- Verificar estructura de la tabla
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'mentors' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================================================
-- NOTAS
-- ============================================================================
-- 
-- Después de ejecutar esta migración:
-- 1. Los nuevos mentores deben incluir image_url y achievements al insertarse
-- 2. El campo image_url debe contener solo el nombre del archivo (ej: "joel-pasapera.jpg")
-- 3. La URL completa se construye en el API route del frontend
-- 4. El campo achievements debe ser un array JSON de strings
--
-- Ejemplo de INSERT con nuevos campos:
-- INSERT INTO mentors (name, title, image_url, achievements, ...)
-- VALUES (
--   'Nombre',
--   'Título',
--   'nombre-apellido.jpg',
--   '["Logro 1", "Logro 2", "Logro 3"]'::jsonb,
--   ...
-- );
--
-- ============================================================================
