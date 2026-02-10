-- Primero verificamos qué columnas tiene la tabla mentors
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'mentors' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Función corregida para obtener todos los mentores (solo columnas que existen)
CREATE OR REPLACE FUNCTION get_all_mentors()
RETURNS TABLE (
  id INTEGER,
  name TEXT,
  phrase TEXT,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  highlights JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.name,
    m.phrase,
    m.title,
    m.subtitle,
    m.description,
    m.highlights
  FROM mentors m
  ORDER BY m.id ASC;
END;
$$;

-- Función corregida para obtener un mentor por ID
CREATE OR REPLACE FUNCTION get_mentor_by_id(mentor_id INTEGER)
RETURNS TABLE (
  id INTEGER,
  name TEXT,
  phrase TEXT,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  highlights JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.name,
    m.phrase,
    m.title,
    m.subtitle,
    m.description,
    m.highlights
  FROM mentors m
  WHERE m.id = mentor_id;
END;
$$;

-- Dar permisos públicos
GRANT EXECUTE ON FUNCTION get_all_mentors() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_mentor_by_id(INTEGER) TO anon, authenticated;

-- Probar que funciona
SELECT * FROM get_all_mentors();
