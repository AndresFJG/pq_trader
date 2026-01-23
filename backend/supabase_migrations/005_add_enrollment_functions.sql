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
