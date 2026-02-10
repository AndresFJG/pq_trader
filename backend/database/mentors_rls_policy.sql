-- ==================================================
-- POLÍTICA RLS PARA TABLA MENTORS
-- ==================================================
-- 
-- Este script habilita Row Level Security (RLS) en la tabla mentors
-- y crea una política que permite lectura pública a todos los usuarios.
--
-- CÓMO EJECUTAR:
-- 1. Ir a Supabase Dashboard -> SQL Editor
-- 2. Copiar y pegar este script completo
-- 3. Click en "Run" o presionar Ctrl+Enter
-- ==================================================

-- Habilitar RLS en la tabla mentors
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;

-- Eliminar política existente si existe (para re-ejecutar el script)
DROP POLICY IF EXISTS "Permitir lectura pública de mentores" ON mentors;

-- Crear política que permite SELECT (lectura) a todos (anon y authenticated)
CREATE POLICY "Permitir lectura pública de mentores"
ON mentors
FOR SELECT
TO anon, authenticated
USING (true);

-- ==================================================
-- VERIFICACIÓN
-- ==================================================
-- Para verificar que la política funciona, ejecuta:
-- SELECT * FROM mentors;
-- 
-- Si ves los registros, la política está funcionando correctamente.
-- ==================================================

-- Opcional: Ver todas las políticas de la tabla mentors
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'mentors';
