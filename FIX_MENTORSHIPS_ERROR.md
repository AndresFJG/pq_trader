# 🔧 FIX: Error al cargar mentorías en Dashboard

## 📋 Problema Identificado

El dashboard de administración muestra **"Error al cargar las mentorías"** con múltiples errores 500 en la consola:

```
GET https://pq-trader-backend-production.up.railway.app/api/mentorships 500 (Internal Server Error)
```

### Causa Raíz

**Dos problemas principales:**

1. **Políticas RLS (Row Level Security)** de la tabla `mentorships` solo permiten acceso a:
   - Mentores (donde `mentor_id = auth.uid()`)
   - Estudiantes (donde `student_id = auth.uid()`)
   - Administradores
   - **NO existe** política para ver el catálogo completo de mentorías activas

2. **Inconsistencia de campos:**
   - La tabla tiene: `duration_minutes` (INTEGER)
   - El código backend usa: `duration` (no existía en la tabla)
   - El frontend espera: `duration` o `duration_minutes`
   - El campo `is_active` **no existía** pero el código lo estaba usando

**Error en Supabase:**
```
Could not find the 'duration' column of 'mentorships' in the schema cache
```

## ✅ Solución Implementada

### 1. Migración SQL Creada

**Archivo:** `backend/supabase_migrations/018_fix_mentorships_public_access.sql`

**Cambios:**
- ✅ Agrega campo `is_active` (BOOLEAN) a la tabla `mentorships`
- ✅ Agrega campo `enrolled_count` (INTEGER) para featured mentorships
- ✅ **Agrega campo `duration` (INTEGER) como compatibilidad** con el código existente
- ✅ **Sincroniza `duration` con `duration_minutes`** para datos existentes
- ✅ Crea política RLS pública: `mentorships_public_view`
- ✅ Permite a TODOS ver mentorías donde `is_active = true`
- ✅ Agrega índices para mejor performance

### 2. Backend Actualizado

**Archivo:** `backend/src/controllers/mentorship.controller.ts`

**Cambios:**
- ✅ `createMentorship()` ahora acepta tanto `duration` como `duration_minutes`
- ✅ Sincroniza automáticamente ambos campos al crear/actualizar
- ✅ Establece `is_active: true` por defecto al crear mentorías
- ✅ `updateMentorship()` maneja correctamente ambos campos de duración

### 3. Frontend Actualizado

**Archivos modificados:**
- `frontend/src/components/admin/mentorships/MentorshipsTable.tsx`
- `frontend/src/components/admin/mentorships/MentorshipFormDialog.tsx`
- `frontend/src/services/mentorshipService.ts`

**Cambios:**
- ✅ Interfaces TypeScript actualizadas para soportar `duration` y `duration_minutes`
- ✅ Campos `is_active` y `enrolled_count` agregados a interfaces
- ✅ Tabla muestra duración usando `duration || duration_minutes || 60`
- ✅ Formulario maneja correctamente ambos formatos de duración
- ✅ Todos los tipos son opcionales para máxima compatibilidad

### 2. Políticas RLS Después de la Migración

| Política | Quién puede ver | Condición |
|----------|-----------------|-----------|
| `mentorships_view_mentor` | Mentores | `mentor_id = auth.uid()` |
| `mentorships_view_student` | Estudiantes | `student_id = auth.uid()` |
| `mentorships_view_admin` | Admins | `role = 'admin'` |
| **`mentorships_public_view`** | **TODOS** | **`is_active = true`** |

## 🚀 Pasos para Aplicar la Solución

### Paso 1: Ejecutar Migración en Supabase

1. Abre **Supabase Dashboard**: https://app.supabase.com
2. Selecciona tu proyecto: **pq_trader**
3. Ve a **SQL Editor** (icono de código en la sidebar)
4. Crea un nuevo query
5. Copia y pega el contenido de: `backend/supabase_migrations/018_fix_mentorships_public_access.sql`
6. Click en **Run** (o presiona `Ctrl + Enter`)

### Paso 2: Verificar la Migración

El script incluye verificaciones automáticas. Deberías ver en los logs:

```
✓ Campo is_active agregado correctamente a mentorships
✓ Política RLS pública creada correctamente
Total de mentorías activas: X
```

### Paso 3: Verificar en la Consola

```sql
-- Ver todas las políticas de mentorships
SELECT * FROM pg_policies WHERE tablename = 'mentorships';

-- Ver columnas de la tabla mentorships
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'mentorships';

-- Ver mentorías activas (debería funcionar sin autenticación)
SELECT id, title, is_active, enrolled_count 
FROM mentorships 
WHERE is_active = true;
```

### Paso 4: Probar el Dashboard

1. Recarga la página del dashboard de mentorías
2. El error **"Error al cargar las mentorías"** debería desaparecer
3. Deberías ver la tabla de mentorías cargando correctamente

## 📊 Estructura de la Tabla Mentorships (Actualizada)

```sql
mentorships (
  id SERIAL PRIMARY KEY,
  mentor_id INTEGER NOT NULL REFERENCES users(id),
  student_id INTEGER REFERENCES users(id),
  title VARCHAR(255),
  description TEXT,
  type mentorship_type DEFAULT 'individual',
  duration INTEGER,                         -- ✅ NUEVO (sincronizado con duration_minutes)
  duration_minutes INTEGER,                 -- Existente
  price DECIMAL(10, 2),
  scheduled_at TIMESTAMP,
  completed_at TIMESTAMP,
  meeting_url TEXT,
  status mentorship_status DEFAULT 'pending',
  notes TEXT,
  is_active BOOLEAN DEFAULT true,           -- ✅ NUEVO
  enrolled_count INTEGER DEFAULT 0,         -- ✅ NUEVO
  time_slot_start TIME,
  time_slot_end TIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Campos Sincronizados

- **`duration`** y **`duration_minutes`**: Ambos almacenan la duración en minutos
- Se sincronizan automáticamente en el backend al crear/actualizar
- El frontend puede usar cualquiera de los dos
- Valor por defecto: 60 minutos si ninguno está presente

## 🔍 Endpoints Afectados (Ahora Funcionan)

| Endpoint | Método | Descripción | RLS Policy |
|----------|--------|-------------|------------|
| `/api/mentorships` | GET | Lista todas las mentorías activas | `mentorships_public_view` |
| `/api/mentorships/featured` | GET | Top 3 mentorías por enrolled_count | `mentorships_public_view` |
| `/api/mentorships/:id` | GET | Detalles de una mentoría | `mentorships_public_view` |

## 🛡️ Seguridad

Esta política pública **solo permite lectura** (`FOR SELECT`) de mentorías **activas** (`is_active = true`).

- ✅ Usuarios pueden **ver** catálogo de mentorías
- ❌ Usuarios **NO pueden crear** mentorías (requiere admin)
- ❌ Usuarios **NO pueden editar** mentorías (requiere admin/mentor)
- ❌ Usuarios **NO pueden eliminar** mentorías (requiere admin)

## 📝 Comandos de Verificación Post-Migración

```bash
# Backend - Verificar que no hay errores
cd backend
npm run dev

# Frontend - Verificar que carga correctamente
cd frontend
npm run dev

# Abrir dashboard
# http://localhost:3000/admin/mentorships
```

## 🐛 Troubleshooting

### Error persiste después de la migración

1. **Verificar que RLS está habilitado:**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'mentorships';
-- rowsecurity debe ser 'true'
```

2. **Verificar políticas activas:**
```sql
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'mentorships';
-- Debe aparecer 'mentorships_public_view'
```

3. **Verificar que hay mentorías activas:**
```sql
UPDATE mentorships SET is_active = true;
```

### Error: "Could not find the 'duration' column"

Este error indica que el campo `duration` no existe en la tabla. La migración 018 lo agrega.

1. **Verificar que el campo duration existe:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'mentorships' 
AND column_name IN ('duration', 'duration_minutes', 'is_active');
-- Deben aparecer los 3 campos
```

2. **Si no existe, ejecutar manualmente:**
```sql
ALTER TABLE public.mentorships 
ADD COLUMN IF NOT EXISTS duration INTEGER;

UPDATE public.mentorships 
SET duration = duration_minutes 
WHERE duration IS NULL;
```

3. **Verificar sincronización:**
```sql
SELECT id, title, duration, duration_minutes 
FROM mentorships 
LIMIT 5;
-- duration y duration_minutes deben tener los mismos valores
```

### Error 500 al guardar/editar mentoría

Puede deberse a campos requeridos faltantes o tipos incorrectos.

1. **Verificar payload enviado:**
```javascript
// El payload debe incluir:
{
  "title": "string",
  "description": "string",
  "duration": 60,           // número en minutos
  "price": 150.00,          // número decimal
  "status": "active"
}
```

2. **Verificar logs del backend:**
```bash
cd backend
npm run dev
# Ver errores en la consola
```

### Error 401 (Unauthorized)

El error 401 en `/api/auth/login` y `/api/auth/refresh` es **independiente** del problema de mentorías. Se debe a:
- Sesión expirada
- Cookies no configuradas correctamente
- CORS issues

**Solución:** Cerrar sesión y volver a iniciar sesión en el dashboard.

## 📚 Archivos Modificados

### Backend
- **Migración SQL:** `backend/supabase_migrations/018_fix_mentorships_public_access.sql` ✅
- **Controller:** `backend/src/controllers/mentorship.controller.ts` ✅
  - Actualizado `createMentorship()` para manejar ambos campos de duración
  - Actualizado `updateMentorship()` para sincronizar duration y duration_minutes
  - Agregado soporte para `is_active`

### Frontend
- **Tabla Admin:** `frontend/src/components/admin/mentorships/MentorshipsTable.tsx` ✅
  - Interface actualizada con campos opcionales
  - Display de duración usando fallback: `duration || duration_minutes || 60`
- **Formulario:** `frontend/src/components/admin/mentorships/MentorshipFormDialog.tsx` ✅
  - Interface actualizada para soportar ambos campos
  - useEffect actualizado para cargar duración correctamente
- **Servicio:** `frontend/src/services/mentorshipService.ts` ✅
  - Interface Mentorship actualizada con todos los campos opcionales
- **Documentación:** `FIX_MENTORSHIPS_ERROR.md` ✅

### Resumen de Cambios

| Componente | Problema | Solución |
|------------|----------|----------|
| **RLS Policies** | Sin acceso público | Política `mentorships_public_view` |
| **Campo is_active** | No existía | Agregado con DEFAULT true |
| **Campo enrolled_count** | No existía | Agregado con DEFAULT 0 |
| **Campo duration** | No existía | Agregado y sincronizado con duration_minutes |
| **Backend Controller** | Usaba campo inexistente | Actualizado para manejar ambos campos |
| **Frontend Interfaces** | Tipos incorrectos | Actualizados con campos opcionales |
| **Display de Duración** | Fallaba sin duration | Fallback a duration_minutes |

## ✨ Próximos Pasos

Después de aplicar esta migración:

1. ✅ Ejecutar migración de notificaciones: `017_create_notifications.sql`
2. ✅ Verificar que hay datos de mentorías en la tabla (o crearlos)
3. ✅ Desplegar backend con los cambios actualizados
4. ✅ Verificar frontend en producción

---

**Fecha:** 16 de febrero de 2026  
**Migración:** 018_fix_mentorships_public_access.sql  
**Prioridad:** 🔴 CRÍTICA (bloquea dashboard de administración)
