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
