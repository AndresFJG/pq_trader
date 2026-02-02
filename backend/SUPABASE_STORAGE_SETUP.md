# 🚀 Configuración de Supabase Storage para Archivos Multimedia

## ⚠️ IMPORTANTE: Configuración Requerida

Antes de usar la funcionalidad de subida de archivos, debes configurar Supabase Storage.

## 📋 Paso 1: Crear Bucket en Supabase

1. **Accede a tu proyecto de Supabase:**
   - Ve a: https://supabase.com/dashboard/project/YOUR_PROJECT_ID

2. **Navega a Storage:**
   - En el menú lateral, click en **"Storage"**

3. **Crear nuevo bucket:**
   - Click en **"New bucket"**
   - **Nombre:** `lesson-media`
   - **Public bucket:** ✅ **Marcar como público** (para que los videos sean accesibles)
   - Click en **"Create bucket"**

4. **Configurar políticas de seguridad (RLS):**

   Ve a **Policies** y crea las siguientes políticas:

   ### Política 1: Permitir subida solo a admins
   ```sql
   CREATE POLICY "Admins can upload files"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (
     bucket_id = 'lesson-media' 
     AND auth.jwt() ->> 'role' = 'admin'
   );
   ```

   ### Política 2: Permitir lectura pública
   ```sql
   CREATE POLICY "Public read access"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'lesson-media');
   ```

   ### Política 3: Permitir eliminar solo a admins
   ```sql
   CREATE POLICY "Admins can delete files"
   ON storage.objects FOR DELETE
   TO authenticated
   USING (
     bucket_id = 'lesson-media'
     AND auth.jwt() ->> 'role' = 'admin'
   );
   ```

## 📋 Paso 2: Verificar Configuración

Ejecuta este script para verificar que el bucket está correctamente configurado:

```bash
cd backend
npm run test:storage
```

O prueba manualmente desde el código:

```typescript
import { supabase } from './config/supabase';

async function testStorage() {
  // Listar buckets
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Buckets disponibles:', buckets);
  
  // Verificar que existe 'lesson-media'
  const lessonMediaBucket = buckets.find(b => b.name === 'lesson-media');
  
  if (lessonMediaBucket) {
    console.log('✅ Bucket lesson-media configurado correctamente');
    console.log('   - Público:', lessonMediaBucket.public);
  } else {
    console.error('❌ Bucket lesson-media NO encontrado');
  }
}

testStorage();
```

## 📋 Paso 3: Variables de Entorno

Verifica que tu archivo `.env` tenga las credenciales de Supabase:

```bash
# Supabase
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_KEY=YOUR_SUPABASE_ANON_KEY
```

## 🎯 Estructura de Archivos en Storage

Los archivos se organizarán así:

```
lesson-media (bucket)
└── lessons/
    ├── 1737654321000-123456789.mp4
    ├── 1737654322000-987654321.pdf
    └── 1737654323000-456789123.jpg
```

## 🔗 URLs Públicas

Los archivos tendrán URLs públicas como:

```
https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/lesson-media/lessons/1737654321000-123456789.mp4
```

Estas URLs se guardan automáticamente en la base de datos en el campo `video_url` de la tabla `lessons`.

## ✅ Verificación de Funcionamiento

1. **Crear una lección con archivo:**
   - Ve a Admin → Cursos → Lecciones
   - Click en "Nueva Lección"
   - Selecciona "Subir Archivo"
   - Elige un video/PDF/imagen
   - Guarda

2. **Verificar en Supabase:**
   - Ve a Storage → lesson-media → lessons
   - Deberías ver el archivo subido

3. **Verificar en la base de datos:**
   ```sql
   SELECT id, title, video_url 
   FROM lessons 
   WHERE video_url LIKE '%supabase%'
   ORDER BY created_at DESC 
   LIMIT 5;
   ```

## 🔧 Troubleshooting

### Error: "Bucket lesson-media not found"
**Solución:** Crea el bucket siguiendo el Paso 1

### Error: "new row violates row-level security policy"
**Solución:** Configura las políticas RLS del Paso 1

### Error: "Could not upload file"
**Solución:** 
- Verifica que el bucket sea público
- Verifica las credenciales en `.env`
- Revisa los logs del backend en `logs/error.log`

### Los archivos se suben pero no se ven
**Solución:** 
- Verifica que el bucket esté marcado como **público**
- Verifica la política "Public read access"

## 📊 Límites de Supabase Storage

| Plan | Almacenamiento | Transferencia/mes |
|------|----------------|-------------------|
| Free | 1 GB | 2 GB |
| Pro | 100 GB | 200 GB |
| Team | 100 GB | 200 GB |

Para producción con muchos videos, considera el plan Pro.

## 🚀 Migración desde Sistema de Archivos Local

Si ya tienes archivos en `backend/uploads/lessons/`, puedes migrarlos a Supabase Storage:

```bash
cd backend
npm run migrate:storage
```

(Script pendiente de implementación)

## 📝 Notas Importantes

1. **Los archivos son públicos:** Cualquiera con la URL puede acceder
2. **Sin autenticación en lectura:** No se requiere token JWT para ver archivos
3. **Solo admins pueden subir/eliminar:** Protegido por RLS
4. **CDN incluido:** Supabase Storage usa CDN de Cloudflare
5. **Caché configurado:** Headers Cache-Control: 3600 (1 hora)

## 🎉 ¡Listo!

Una vez completados estos pasos, el sistema de subida de archivos multimedia estará completamente funcional y listo para producción.

---

**¿Necesitas ayuda?** Revisa los logs en `logs/error.log` o contacta al equipo de desarrollo.
