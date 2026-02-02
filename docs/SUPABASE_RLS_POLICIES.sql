-- ============================================
-- SUPABASE STORAGE RLS POLICIES
-- ============================================
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Bucket: lesson-media
-- ============================================

-- 1. POLÍTICA DE LECTURA PÚBLICA
-- Permite a cualquiera leer archivos del bucket
CREATE POLICY "Public read access on lesson-media"
ON storage.objects FOR SELECT
USING (bucket_id = 'lesson-media');

-- 2. POLÍTICA DE UPLOAD PARA USUARIOS AUTENTICADOS
-- Solo usuarios autenticados pueden subir archivos
CREATE POLICY "Authenticated users can upload to lesson-media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'lesson-media' 
  AND auth.role() = 'authenticated'
);

-- 3. POLÍTICA DE ACTUALIZACIÓN PARA USUARIOS AUTENTICADOS
-- Usuarios autenticados pueden actualizar sus propios archivos
CREATE POLICY "Authenticated users can update their files in lesson-media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'lesson-media'
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'lesson-media'
  AND auth.role() = 'authenticated'
);

-- 4. POLÍTICA DE ELIMINACIÓN SOLO PARA ADMINS
-- Solo administradores pueden eliminar archivos
CREATE POLICY "Only admins can delete from lesson-media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'lesson-media'
  AND (
    auth.jwt() ->> 'role' = 'admin'
    OR auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
  )
);

-- ============================================
-- VERIFICAR POLÍTICAS CREADAS
-- ============================================
-- Ejecutar esta query para verificar:
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage';

-- ============================================
-- CONFIGURACIÓN ADICIONAL DEL BUCKET
-- ============================================
-- Asegurar que el bucket tenga las configuraciones correctas

-- Verificar configuración actual:
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE name = 'lesson-media';

-- Si necesitas actualizar la configuración:
UPDATE storage.buckets
SET 
  public = true,  -- Archivos públicamente accesibles
  file_size_limit = 524288000,  -- 500 MB en bytes
  allowed_mime_types = ARRAY[
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ]
WHERE name = 'lesson-media';

-- ============================================
-- HABILITAR RLS SI NO ESTÁ HABILITADO
-- ============================================
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TESTING
-- ============================================
-- Después de crear las políticas, probar:

-- 1. Desde tu app (como admin):
--    - Subir archivo → Debe funcionar ✅
--    - Eliminar archivo → Debe funcionar ✅

-- 2. Desde tu app (como usuario regular):
--    - Subir archivo → Debe funcionar ✅ (si está autenticado)
--    - Eliminar archivo → Debe fallar ❌

-- 3. Sin autenticación:
--    - Ver archivo (GET) → Debe funcionar ✅ (público)
--    - Subir archivo → Debe fallar ❌

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- Si los uploads fallan, verificar:
-- 1. RLS está habilitado:
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- 2. Políticas existen:
SELECT COUNT(*) as policy_count
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage';

-- 3. Usuario tiene rol correcto:
SELECT auth.role();  -- Debe retornar 'authenticated' cuando estás logueado

-- Si necesitas eliminar y recrear políticas:
DROP POLICY IF EXISTS "Public read access on lesson-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to lesson-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their files in lesson-media" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can delete from lesson-media" ON storage.objects;

-- Luego recrear las políticas desde arriba
