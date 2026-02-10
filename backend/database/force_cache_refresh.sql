-- ==================================================
-- FORZAR ACTUALIZACIÓN DE CACHE POSTGREST
-- ==================================================
--
-- Ejecutar en Supabase SQL Editor después de actualizar datos
--
-- ==================================================

-- 1. Verificar que los datos están actualizados en la BD
SELECT 
  id,
  name,
  title,
  students,
  rating,
  sessions,
  highlights
FROM public.mentors
ORDER BY id;

-- 2. Refrescar schema cache de PostgREST
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- 3. Verificar las funciones RPC existen
SELECT 
  routine_name, 
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public' 
  AND routine_name LIKE '%mentor%';

-- ==================================================
-- DESPUÉS DE EJECUTAR:
-- - Esperar 10-15 segundos
-- - Probar el endpoint: /api/mentors
-- - Si no funciona, reiniciar el proyecto Supabase
-- ==================================================
