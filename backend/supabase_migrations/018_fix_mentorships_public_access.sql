-- ============================================================================
-- FIX: Permitir acceso público a catálogo de mentorías
-- ============================================================================
-- Fecha: 2026-02-16
-- Problema: Las políticas RLS de mentorships solo permiten acceso a mentores,
-- estudiantes y admins. Usuarios regulares no pueden ver el catálogo.
-- Solución: Agregar campo is_active y política RLS para acceso público.
-- ============================================================================

-- 1. Agregar campo is_active si no existe
ALTER TABLE public.mentorships 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2. Agregar campo enrolled_count si no existe (para featured mentorships)
ALTER TABLE public.mentorships 
ADD COLUMN IF NOT EXISTS enrolled_count INTEGER DEFAULT 0;

-- 3. Agregar campo duration si no existe (alias de duration_minutes para compatibilidad)
ALTER TABLE public.mentorships 
ADD COLUMN IF NOT EXISTS duration INTEGER;

-- 4. Sincronizar duration con duration_minutes
UPDATE public.mentorships 
SET duration = duration_minutes 
WHERE duration IS NULL AND duration_minutes IS NOT NULL;

-- 5. Actualizar mentorías existentes a activas
UPDATE public.mentorships 
SET is_active = true 
WHERE is_active IS NULL;

-- 6. Crear política para acceso público a catálogo de mentorías activas
-- Esta política permite a CUALQUIER usuario (autenticado o no) ver mentorías activas
DROP POLICY IF EXISTS "mentorships_public_view" ON public.mentorships;

CREATE POLICY "mentorships_public_view"
ON public.mentorships
FOR SELECT
USING (is_active = true);

-- 7. Crear índice para mejor performance en queries de catálogo
CREATE INDEX IF NOT EXISTS idx_mentorships_is_active 
ON public.mentorships(is_active) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_mentorships_enrolled_count 
ON public.mentorships(enrolled_count DESC);

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================
DO $$
BEGIN
  -- Verificar que el campo existe
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mentorships' 
    AND column_name = 'is_active'
    AND table_schema = 'public'
  ) THEN
    RAISE NOTICE '✓ Campo is_active agregado correctamente a mentorships';
  ELSE
    RAISE WARNING '✗ Campo is_active NO fue agregado';
  END IF;

  -- Verificar que la política existe
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'mentorships' 
    AND policyname = 'mentorships_public_view'
  ) THEN
    RAISE NOTICE '✓ Política RLS pública creada correctamente';
  ELSE
    RAISE WARNING '✗ Política RLS pública NO fue creada';
  END IF;

  -- Mostrar count de mentorías activas
  RAISE NOTICE 'Total de mentorías activas: %', (SELECT COUNT(*) FROM public.mentorships WHERE is_active = true);
END $$;
