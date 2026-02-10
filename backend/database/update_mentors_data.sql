-- ==================================================
-- ACTUALIZAR DATOS DE MENTORES EN SUPABASE
-- ==================================================
--
-- Este script actualiza la información completa de los mentores
-- con los datos profesionales más recientes.
--
-- CÓMO EJECUTAR:
-- 1. Ir a Supabase Dashboard -> SQL Editor
-- 2. Copiar y pegar este script completo
-- 3. Click en "Run" o presionar Ctrl+Enter
-- ==================================================

-- PRIMERO: Agregar columnas faltantes si no existen
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS linkedin VARCHAR(500);
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS students INTEGER DEFAULT 0;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 5.0;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS sessions INTEGER DEFAULT 0;

-- Actualizar Marco Andrés (ID: 1)
UPDATE public.mentors
SET
  name = 'Marco Andrés',
  email = 'marco.andres@pqtrader.com',
  title = 'Trader & tutor',
  subtitle = 'Trader Algorítmico de enfoque práctico',
  description = 'Más de 5 años de trayectoria en MQL5 y 100% de éxito en Upwork. Profesor de Trading Algorítmico y experto en el desarrollo de Expert Advisors (EAs) para la plataforma MT4. Ha validado sistemas con esperanza matemática positiva en tiempo real y cuenta con certificaciones oficiales en pruebas de fondeo. Tutor de traders Top 1 en Darwinex Zero.',
  phrase = 'El trading es la forma más difícil de hacer dinero fácil',
  linkedin = 'https://www.mql5.com/es/users/marcotisma/news',
  students = 50,
  rating = 4.9,
  sessions = 100,
  highlights = '[
    "Localizador de ventajas estadísticas",
    "Métodos personalizados de optimización",
    "Estrategias de volatilidad extrema",
    "MQL5, fxDremma, EAbuilder"
  ]'::jsonb,
  updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Actualizar Jeremias (ID: 2)
UPDATE public.mentors
SET
  name = 'Jeremias',
  email = 'jeremias@pqtrader.com',
  title = 'Especialista en Trading Algorítmico',
  subtitle = '5+ años en desarrollo y optimización de estrategias',
  description = 'Más de cinco años de experiencia en el desarrollo, optimización y automatización de sistemas de trading algorítmico. Trabajo orientado a la construcción de estrategias sistemáticas sostenibles en el tiempo. Formado en el Programa Quant de UCEMA y con una Diplomatura en Asesoramiento Financiero (Universidad Blas Pascal), combina fundamentos académicos con experiencia operativa. Cuenta con experiencia en Darwinex y Darwinex Zero, incluyendo diseño de estrategias adaptadas al motor de riesgo de la plataforma y acompañamiento técnico en cuentas de fondeo y acceso a capital.',
  phrase = 'El trading algorítmico exige evidencia y robustez',
  linkedin = '',
  students = 150,
  rating = 4.9,
  sessions = 200,
  highlights = '[
    "Backtesting y optimización (WFA)",
    "Tests de robustez (Montecarlo)",
    "Portafolios algorítmicos"
  ]'::jsonb,
  updated_at = CURRENT_TIMESTAMP
WHERE id = 2;

-- Verificar los cambios
SELECT 
  id,
  name,
  title,
  subtitle,
  students,
  rating,
  sessions,
  highlights,
  updated_at
FROM public.mentors
ORDER BY id;

-- ==================================================
-- NOTAS:
-- - Los campos highlights están en formato JSONB
-- - Las imágenes se gestionan desde Supabase Storage
-- - El rating está en escala de 0 a 5 con 2 decimales
-- ==================================================
