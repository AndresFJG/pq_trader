-- FORZAR ACTUALIZACIÓN COMPLETA DEL SCHEMA CACHE

-- 1. Verificar que la tabla existe
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE tablename = 'mentors';

-- 2. Verificar columnas de la tabla
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'mentors'
ORDER BY ordinal_position;

-- 3. Ver si hay datos
SELECT COUNT(*) as total FROM public.mentors;

-- 4. Forzar reload del schema con múltiples métodos
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- 5. Verificar permisos de la tabla
SELECT 
  table_schema,
  table_name,
  privilege_type,
  grantee
FROM information_schema.table_privileges 
WHERE table_name = 'mentors';

-- 6. Dar permisos explícitos de SELECT
GRANT SELECT ON public.mentors TO anon;
GRANT SELECT ON public.mentors TO authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 7. Verificar RLS
SELECT 
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'mentors';

-- 8. Confirmar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'mentors';
