# PASOS PARA ARREGLAR LAS NOTIFICACIONES

## Problema Identificado
La tabla `notifications` tiene columnas `user_id` y `related_id` de tipo **UUID**, pero todos los IDs en el sistema son tipo **INTEGER** (SERIAL). Esto causa que las inserciones fallen silenciosamente.

## Solución Implementada

### 1. Backend: Código Actualizado ✅
- **auth.controller.ts**: No pasa `user_id` ni `related_id`, solo metadata
- **course.controller.ts**: No pasa `related_id`, usa metadata
- **stripe.controller.ts**: No pasa `related_id`, usa metadata  
- **notification.service.ts**: Mejorado logging para detectar errores

### 2. Base de Datos: Migración SQL Requerida ⚠️

**DEBES EJECUTAR EN SUPABASE:**

```sql
-- Ir a: Supabase Dashboard → SQL Editor → New Query

-- 1. Limpiar notificaciones existentes
TRUNCATE TABLE notifications CASCADE;

-- 2. Eliminar foreign key constraint (apunta a auth.users UUID)
ALTER TABLE notifications 
  DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

-- 3. Cambiar user_id y related_id de UUID a TEXT
ALTER TABLE notifications 
  ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT,
  ALTER COLUMN related_id TYPE TEXT USING related_id::TEXT;

-- 4. Asegurar que son nullable
ALTER TABLE notifications 
  ALTER COLUMN user_id DROP NOT NULL,
  ALTER COLUMN related_id DROP NOT NULL;

-- 5. Verificar
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'notifications';
```

### 3. Deploy del Backend 🚀

```bash
# Desde la raíz del proyecto:
git add .
git commit -m "fix: corregir tipos de datos en notificaciones (UUID -> metadata)"
git push origin production-clean
```

### 4. Verificar en Producción ✅

Después del deploy:
1. Crear un nuevo usuario en `/register`
2. Ver logs del backend en Railway
3. Deberías ver: `✅ Notification created successfully: <id>`
4. Verificar en Supabase → Table Editor → notifications

## Archivos Modificados

### Backend
- ✅ `backend/src/controllers/auth.controller.ts`
- ✅ `backend/src/controllers/course.controller.ts`  
- ✅ `backend/src/controllers/stripe.controller.ts`
- ✅ `backend/src/services/notification.service.ts`

### Frontend
- ✅ `frontend/src/components/admin/AdminHeader.tsx` (sistema de polling mejorado)
- ✅ `frontend/src/services/notification.service.ts` (nuevo método getRecent)

### Migraciones
- ✅ `backend/supabase_migrations/024_fix_notifications_id_types.sql`

## Testing

### Opción 1: Crear Usuario Nuevo
```bash
# En el navegador:
1. Ir a http://localhost:3000/register (o pqtraders.com/register)
2. Crear usuario: test@example.com / Password123!
3. Ver logs del backend
4. Verificar en Supabase → notifications table
```

### Opción 2: Script de Verificación
```powershell
# En PowerShell (raíz del proyecto):
.\verificar-notificaciones-tiempo-real.ps1
```

## Logs Esperados

### ✅ Éxito:
```
[NotificationService] Creating notification: {
  type: 'new_user',
  title: 'Nuevo usuario registrado',
  has_user_id: false,
  has_related_id: false
}
✅ Notification created successfully: 123e4567-e89b-12d3-a456-426614174000
```

### ❌ Error (antes de la migración):
```
❌ Error creating notification: {
  error: 'invalid input syntax for type uuid: "4"',
  code: '22P02',
  notification_type: 'new_user'
}
```

## Próximos Pasos

1. ✅ **EJECUTAR MIGRACIÓN SQL EN SUPABASE** (crítico)
2. ✅ **HACER DEPLOY DEL BACKEND** a Railway
3. ✅ **PROBAR CREACIÓN DE USUARIO** nuevo
4. ✅ **VERIFICAR TABLA** notifications en Supabase

## Notas Importantes

- ⚠️ La migración borra todas las notificaciones existentes (`TRUNCATE`)
- ✅ Los campos `user_id` y `related_id` ahora son TEXT nullable
- ✅ Toda la información importante está en `metadata` (JSONB)
- ✅ El frontend actualiza cada 10 segundos + al abrir dropdown
- ✅ Las notificaciones se marcan como leídas después de 5 segundos

---

**Autor:** PQ Trader Team  
**Fecha:** 18 de febrero de 2026  
**Issue:** Notificaciones no se crean por incompatibilidad UUID vs INTEGER
