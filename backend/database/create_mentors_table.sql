-- ==================================================
-- CREAR TABLA MENTORS EN SUPABASE
-- ==================================================
--
-- Esta tabla almacena información de los mentores
-- que se mostrarán en la página de mentorías.
--
-- CÓMO EJECUTAR:
-- 1. Ir a Supabase Dashboard -> SQL Editor
-- 2. Copiar y pegar este script completo
-- 3. Click en "Run" o presionar Ctrl+Enter
-- ==================================================

-- Crear tabla mentors
CREATE TABLE IF NOT EXISTS public.mentors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  title VARCHAR(255),
  subtitle VARCHAR(255),
  description TEXT,
  phrase TEXT,
  linkedin VARCHAR(500),
  students INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 5.0,
  sessions INTEGER DEFAULT 0,
  highlights JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_mentors_name ON public.mentors(name);
CREATE INDEX IF NOT EXISTS idx_mentors_email ON public.mentors(email);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

-- Crear política de lectura pública
DROP POLICY IF EXISTS "Permitir lectura pública de mentores" ON public.mentors;

CREATE POLICY "Permitir lectura pública de mentores"
ON public.mentors
FOR SELECT
TO anon, authenticated
USING (true);

-- ==================================================
-- INSERTAR DATOS DE EJEMPLO (OPCIONAL)
-- ==================================================
-- Descomenta las siguientes líneas si quieres datos de ejemplo:

/*
INSERT INTO public.mentors (name, title, subtitle, description, phrase, linkedin, students, rating, sessions, highlights)
VALUES 
(
  'Marco Andrés',
  'Trader & tutor',
  'Trader Algorítmico de enfoque practico',
  'Más de 5 años de trayectoria en MQL5 y Python. Especializado en desarrollo de estrategias automatizadas y análisis cuantitativo.',
  'El trading es la forma más difícil de hacer dinero fácil',
  '',
  150,
  4.9,
  200,
  '["Tutor de traders top 1%", "Creador del mejor curso de MQL5", "+5 años programando estrategias"]'::jsonb
),
(
  'Andrés J',
  'Especialista en Trading Algorítmico',
  'Especialista en Trading Algorítmico',
  'Más de cinco años de experiencia en el desarrollo de sistemas automatizados de trading. Experto en Python, StrategyQuant y gestión de riesgo.',
  'El éxito en trading viene de la disciplina y el análisis constante',
  '',
  150,
  5.0,
  180,
  '["150+ estudiantes", "Consultor de trading", "+5 años de experiencia"]'::jsonb
);
*/

-- ==================================================
-- VERIFICACIÓN
-- ==================================================
-- Para verificar que la tabla se creó correctamente:
-- SELECT * FROM public.mentors;
-- 
-- Para ver las políticas RLS:
-- SELECT * FROM pg_policies WHERE tablename = 'mentors';
-- ==================================================
