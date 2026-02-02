# Sistema de Subida de Archivos Multimedia

## Descripción General

El sistema permite a los administradores subir archivos multimedia (videos, audio, PDFs, imágenes) directamente desde el ordenador al crear o editar lecciones de cursos.

## Características

### ✅ Tipos de Archivo Soportados

**Videos:**
- MP4 (`.mp4`)
- WebM (`.webm`)
- OGG (`.ogg`)
- QuickTime (`.mov`)
- AVI (`.avi`)

**Audio:**
- MP3 (`.mp3`)
- WAV (`.wav`)
- OGG (`.ogg`)

**Documentos:**
- PDF (`.pdf`)
- Word (`.doc`, `.docx`)
- PowerPoint (`.ppt`, `.pptx`)

**Imágenes:**
- JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- GIF (`.gif`)
- WebP (`.webp`)
- SVG (`.svg`)

### 📦 Límites

- **Tamaño máximo por archivo:** 500 MB
- **Validación de tipos:** Automática en frontend y backend
- **Almacenamiento:** Local en `backend/uploads/lessons/`

## Cómo Usar

### 1. Crear/Editar Lección

1. Ir a **Admin → Cursos**
2. Click en el botón **"Lecciones"** o menú de tres puntos → **"Gestionar Lecciones"**
3. Click en **"Nueva Lección"** o editar una existente

### 2. Subir Archivo

En el formulario de lección, verás dos opciones:

#### Opción A: URL Externa (YouTube, Vimeo, etc.)
1. Click en el botón **"URL Externa"**
2. Pegar la URL embebida del video
3. Ejemplo: `https://www.youtube.com/embed/VIDEO_ID`

#### Opción B: Subir Archivo desde el Ordenador
1. Click en el botón **"Subir Archivo"**
2. Click en la zona de "Drop" o seleccionar archivo
3. Elegir el archivo multimedia
4. El sistema validará:
   - Tipo de archivo permitido
   - Tamaño menor a 500 MB
5. Ver preview del archivo con:
   - Icono según tipo (video, audio, PDF, imagen)
   - Nombre del archivo
   - Tamaño en MB
6. **Barra de progreso** durante la subida

### 3. Guardar Lección

- Click en **"Crear Lección"** o **"Actualizar"**
- El archivo se sube automáticamente al guardar
- Se muestra notificación de éxito/error

## API Endpoints

### Subir Archivo

```http
POST /api/upload/lesson-media
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body (form-data):
  file: [archivo multimedia]
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "filename": "video-1234567890-123456789.mp4",
    "originalName": "mi-video.mp4",
    "mimetype": "video/mp4",
    "size": 52428800,
    "url": "/uploads/lessons/video-1234567890-123456789.mp4",
    "path": "/path/to/uploads/lessons/video-1234567890-123456789.mp4"
  },
  "message": "Archivo subido correctamente"
}
```

**Errores comunes:**
```json
{
  "success": false,
  "error": "El archivo es demasiado grande. Tamaño máximo: 500 MB"
}

{
  "success": false,
  "error": "Tipo de archivo no permitido: video/x-matroska"
}
```

### Eliminar Archivo

```http
DELETE /api/upload/lesson-media/:filename
Authorization: Bearer {token}
```

### Obtener Información del Archivo

```http
GET /api/upload/lesson-media/:filename
Authorization: Bearer {token}
```

## Estructura de Archivos

```
backend/
├── uploads/
│   └── lessons/
│       ├── .gitkeep
│       ├── video-1234567890-123456789.mp4
│       ├── audio-1234567890-123456789.mp3
│       └── documento-1234567890-123456789.pdf
├── src/
│   ├── controllers/
│   │   └── upload.controller.ts
│   ├── middleware/
│   │   └── upload.middleware.ts
│   └── routes/
│       └── upload.routes.ts
```

## Seguridad

### ✅ Validaciones Implementadas

1. **Autenticación requerida:** Solo admins pueden subir archivos
2. **Validación de tipos:** Solo archivos multimedia permitidos
3. **Límite de tamaño:** 500 MB máximo
4. **Nombres seguros:** Sanitización automática de nombres
5. **Nombres únicos:** Timestamp + random para evitar colisiones

### 🔒 Middleware de Seguridad

```typescript
// Tipos permitidos
const allowedMimeTypes = [
  'video/mp4', 'video/webm', 'video/ogg',
  'audio/mpeg', 'audio/wav',
  'application/pdf',
  'image/jpeg', 'image/png'
];

// Validación en multer
fileFilter: (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'));
  }
}
```

## Acceso a Archivos

Los archivos subidos son accesibles públicamente a través de:

```
http://localhost:4000/uploads/lessons/{filename}
```

En producción:

```
https://api.pqtrader.com/uploads/lessons/{filename}
```

## Consideraciones para Producción

### ☁️ Almacenamiento en la Nube (Recomendado)

Para producción, considera usar servicios de almacenamiento en la nube:

1. **Supabase Storage**
   - Integración nativa
   - CDN incluido
   - Control de acceso granular

2. **AWS S3**
   - Escalable
   - CDN con CloudFront
   - Versioning de archivos

3. **Cloudinary**
   - Optimización automática
   - Transformaciones de video/imagen
   - CDN global

### 📝 Variables de Entorno para Producción

```bash
# .env
UPLOAD_MAX_SIZE=524288000  # 500 MB en bytes
UPLOAD_DIR=./uploads/lessons
USE_CLOUD_STORAGE=true
CLOUD_STORAGE_PROVIDER=supabase  # supabase | s3 | cloudinary
```

## Troubleshooting

### Error: "Archivo demasiado grande"
- Verificar tamaño del archivo (max 500 MB)
- Comprimir video con herramientas como HandBrake

### Error: "Tipo de archivo no permitido"
- Verificar extensión del archivo
- Asegurarse de que esté en la lista de tipos permitidos

### Error: "Error al subir el archivo"
- Verificar permisos de escritura en carpeta `uploads/`
- Verificar espacio en disco disponible
- Revisar logs del backend en `logs/error.log`

### Archivos no se muestran
- Verificar que Express está sirviendo la carpeta `uploads/` como estática
- Verificar configuración CORS para permitir acceso a archivos

## Mantenimiento

### Limpieza de Archivos Huérfanos

Script para eliminar archivos no vinculados a lecciones:

```bash
cd backend
npm run cleanup-orphaned-files
```

(Nota: Script pendiente de implementación)

### Backup de Archivos

Recomendación: Configurar backup automático de la carpeta `uploads/` a:
- AWS S3
- Google Drive
- Backblaze B2

## Mejoras Futuras

- [ ] Compresión automática de videos
- [ ] Generación de thumbnails
- [ ] Soporte para subtítulos (`.srt`, `.vtt`)
- [ ] Streaming adaptativo (HLS, DASH)
- [ ] Watermark en videos
- [ ] Migración a Supabase Storage
- [ ] Sistema de caché con CDN
- [ ] Análisis de duración automático
- [ ] Transcripción automática de audio
