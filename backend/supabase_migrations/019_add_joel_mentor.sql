-- ============================================================================
-- AGREGAR NUEVO MENTOR: Joel Pasapera Pinto
-- ============================================================================
-- Fecha: 2026-02-16
-- Descripción: Insertar nuevo mentor especializado en Python, MQL5 y Pine Script
-- ============================================================================

-- Verificar si el mentor ya existe, si no existe, insertarlo
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.mentors WHERE name = 'Joel Pasapera Pinto') THEN
    INSERT INTO public.mentors (
      name,
      email,
      phone,
      title,
      subtitle,
      description,
      phrase,
      linkedin,
      students,
      rating,
      sessions,
      highlights,
      achievements,
      image_url
    ) VALUES (
      'Joel Pasapera Pinto',
      'joel.pasapera@pqtrader.com',
      NULL,
      'Desarrollador Python, Pine Script y MQL5',
      'Especialista en Trading Algorítmico de Alto Rendimiento',
      'Programador y trader algorítmico especializado en el desarrollo de estrategias automatizadas en MQL5 y Pine Script, e implemento frameworks de backtesting y análisis masivo de datos en Python (NumPy, Polars, Numba) priorizando rendimiento y eficiencia computacional. Cuento con experiencia en desarrollo de bots de trading para entornos reales de mercado y automatización del flujo de investigación cuantitativa.',
      'El trabajo de un operador es resumir el mercado en movimientos repetitivos y respaldados por estadísticas.',
      '',
      0,
      5.0,
      0,
      '[
        "Programación de alto rendimiento aplicado al trading con Python",
        "Desarrollo de Expert Advisors en MQL5",
        "Arquitectura de sistemas de trading escalables",
        "Integración Python + MQL5",
        "Frameworks de backtesting y análisis masivo",
        "Automatización de flujos cuantitativos"
      ]'::jsonb,
      '[
        "Especialista en NumPy, Polars y Numba",
        "Frameworks de backtesting profesionales",
        "Automatización de investigación cuantitativa",
        "Expert Advisors en MQL5",
        "Bots de trading para entornos reales"
      ]'::jsonb,
      'joel-pasapera.jpg'
    );
    RAISE NOTICE '✓ Mentor Joel Pasapera Pinto insertado correctamente';
  ELSE
    -- Si ya existe, actualizar los datos
    UPDATE public.mentors SET
      email = 'joel.pasapera@pqtrader.com',
      title = 'Desarrollador Python, Pine Script y MQL5',
      subtitle = 'Especialista en Trading Algorítmico de Alto Rendimiento',
      description = 'Programador y trader algorítmico especializado en el desarrollo de estrategias automatizadas en MQL5 y Pine Script, e implemento frameworks de backtesting y análisis masivo de datos en Python (NumPy, Polars, Numba) priorizando rendimiento y eficiencia computacional. Cuento con experiencia en desarrollo de bots de trading para entornos reales de mercado y automatización del flujo de investigación cuantitativa.',
      phrase = 'El trabajo de un operador es resumir el mercado en movimientos repetitivos y respaldados por estadísticas.',
      linkedin = '',
      highlights = '[
        "Programación de alto rendimiento aplicado al trading con Python",
        "Desarrollo de Expert Advisors en MQL5",
        "Arquitectura de sistemas de trading escalables",
        "Integración Python + MQL5",
        "Frameworks de backtesting y análisis masivo",
        "Automatización de flujos cuantitativos"
      ]'::jsonb,
      achievements = '[
        "Especialista en NumPy, Polars y Numba",
        "Frameworks de backtesting profesionales",
        "Automatización de investigación cuantitativa",
        "Expert Advisors en MQL5",
        "Bots de trading para entornos reales"
      ]'::jsonb,
      image_url = 'joel-pasapera.jpg',
      updated_at = CURRENT_TIMESTAMP
    WHERE name = 'Joel Pasapera Pinto';
    RAISE NOTICE '⚠ Mentor Joel Pasapera Pinto ya existía - datos actualizados';
  END IF;
END $$;

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================
DO $$
DECLARE
  mentor_count INTEGER;
  joel_exists BOOLEAN;
BEGIN
  -- Contar mentores totales
  SELECT COUNT(*) INTO mentor_count FROM public.mentors;
  
  -- Verificar si Joel existe
  SELECT EXISTS (
    SELECT 1 FROM public.mentors 
    WHERE name = 'Joel Pasapera Pinto'
  ) INTO joel_exists;
  
  IF joel_exists THEN
    RAISE NOTICE '✓ Mentor Joel Pasapera Pinto agregado exitosamente';
    RAISE NOTICE '  Total de mentores en la base de datos: %', mentor_count;
  ELSE
    RAISE WARNING '✗ Error: Joel Pasapera Pinto NO fue agregado';
  END IF;
  
  -- Mostrar información del mentor
  RAISE NOTICE '';
  RAISE NOTICE '=== Información del Mentor ===';
  RAISE NOTICE 'Nombre: Joel Pasapera Pinto';
  RAISE NOTICE 'Título: Desarrollador Python, Pine Script y MQL5';
  RAISE NOTICE 'Especialidades: 6 áreas de expertise';
END $$;

-- Mostrar el registro insertado
SELECT 
  id,
  name,
  title,
  students,
  rating,
  sessions,
  jsonb_array_length(highlights) as num_highlights,
  created_at
FROM public.mentors 
WHERE name = 'Joel Pasapera Pinto';

-- ============================================================================
-- NOTAS ADICIONALES
-- ============================================================================
-- 
-- Para actualizar la imagen del mentor, usar Supabase Storage:
-- 1. Ir a Storage -> mentors bucket
-- 2. Subir imagen con nombre: joel-pasapera.jpg
-- 3. La URL será: https://[PROJECT_ID].supabase.co/storage/v1/object/public/mentors/joel-pasapera.jpg
--
-- Para agregar LinkedIn más adelante:
-- UPDATE public.mentors 
-- SET linkedin = 'https://linkedin.com/in/joel-pasapera' 
-- WHERE name = 'Joel Pasapera Pinto';
--
-- Para actualizar estadísticas:
-- UPDATE public.mentors 
-- SET students = 50, sessions = 100 
-- WHERE name = 'Joel Pasapera Pinto';
--
-- ============================================================================
