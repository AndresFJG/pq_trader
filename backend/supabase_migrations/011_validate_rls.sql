-- ============================================================================
-- Script de Validación - Verificar que RLS está correctamente configurado
-- Ejecutar después de aplicar 010_enable_rls_policies.sql
-- ============================================================================

-- 1. Verificar que RLS está habilitado en todas las tablas
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Resultado esperado: Todas con rowsecurity = TRUE

-- ============================================================================

-- 2. Contar el número de policies
SELECT 
  schemaname,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;

-- Resultado esperado: Múltiples policies por tabla

-- ============================================================================

-- 3. Ver todas las policies en detalle
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Esto te mostrará exactamente qué políticas están activas

-- ============================================================================

-- 4. Verificar índices creados
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%'
ORDER BY tablename;

-- Resultado esperado: 13+ índices para performance

-- ============================================================================

-- 5. Test: Usuario No Autenticado (debería fallar)
-- NOTA: Ejecutar con usuario anónimo (sin JWT)
-- SELECT * FROM public.users LIMIT 1;
-- Esperado: Error violates row-level security

-- ============================================================================

-- 6. Ver tamaño de cada tabla
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Útil para identificar si hay datos (y si RLS funciona)

-- ============================================================================

-- 7. Verificar constraints y relaciones
SELECT 
  constraint_name,
  table_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public'
ORDER BY table_name, constraint_type;

-- Verifica integridad referencial

-- ============================================================================

-- 8. Ver all users por rol (para debugging)
SELECT 
  id,
  email,
  role,
  created_at
FROM public.users
ORDER BY role, created_at DESC;

-- Nota: Esta query fallará si no eres admin y no es tu propio perfil
-- Lo cual es CORRECTO si RLS está funcionando

-- ============================================================================

-- 9. Verificar que transactions no está accesible sin auth
-- SELECT COUNT(*) FROM public.transactions;
-- Esperado: Error si no hay autenticación

-- ============================================================================

-- 10. Audit Trail - Ver logs de seguridad (OPCIONAL - tabla no implementada)
-- SELECT 
--   id,
--   user_id,
--   action,
--   resource_type,
--   resource_id,
--   status,
--   created_at
-- FROM public.security_logs
-- ORDER BY created_at DESC
-- LIMIT 20;

-- Nota: Esta tabla no está implementada en el schema actual
-- Descomenta si decides crear security_logs en el futuro

-- ============================================================================
-- FIN - VALIDACIÓN
-- ============================================================================
