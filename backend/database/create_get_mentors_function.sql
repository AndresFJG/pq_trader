-- Función SQL para obtener mentores (bypass PostgREST cache)
-- Ejecutar esto en el SQL Editor de Supabase

-- Función para obtener todos los mentores
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
    m.created_at,
    m.updated_at
  FROM mentors m
  ORDER BY m.id ASC;
END;
$$;

-- Función para obtener un mentor por ID
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
    m.created_at,
    m.updated_at
  FROM mentors m
  WHERE m.id = mentor_id;
END;
$$;

-- Dar permisos públicos para ejecutar las funciones
GRANT EXECUTE ON FUNCTION get_all_mentors() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_mentor_by_id(INTEGER) TO anon, authenticated;

-- Verificar que se crearon correctamente
SELECT proname, proargtypes 
FROM pg_proc 
WHERE proname LIKE 'get_%mentor%';
