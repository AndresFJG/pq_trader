# 🔴 URGENTE: Ejecutar Migración para Eliminar Notificaciones de Prueba

## El Problema
Las notificaciones que ves en el dashboard son **datos reales en la base de datos**. No son hardcoded, sino que están almacenadas en Supabase y el frontend las está obteniendo correctamente del backend.

---

## ✅ SOLUCIÓN MÁS RÁPIDA: Usar el Backend (RECOMENDADO)

He creado un endpoint especial para que puedas limpiar las notificaciones desde Postman o curl:

### Paso 1: Obtén tu token de admin
1. Inicia sesión en tu aplicación como admin
2. Abre las DevTools del navegador (F12)
3. Ve a la pestaña **Application** > **Local Storage**
4. Copia el valor de `token`

### Paso 2: Ejecuta esta petición

**Opción A - Desde PowerShell:**
```powershell
$token = "TU_TOKEN_AQUI"
$headers = @{
    "Authorization" = "Bearer $token"
}
Invoke-RestMethod -Uri "http://localhost:5000/api/notifications/clear-all" -Method DELETE -Headers $headers
```

**Opción B - Desde Postman:**
```
DELETE http://localhost:5000/api/notifications/clear-all
Headers:
  Authorization: Bearer TU_TOKEN_AQUI
```

**Opción C - Desde curl:**
```bash
curl -X DELETE http://localhost:5000/api/notifications/clear-all \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### Resultado esperado:
```json
{
  "success": true,
  "message": "3 notificaciones eliminadas exitosamente"
}
```

### Paso 3: Refresca el Dashboard
1. Vuelve a tu dashboard de admin
2. Presiona F5 o Ctrl+R
3. ✅ Las notificaciones deberían haber desaparecido

---

## Opción 2: Ejecutar SQL en Supabase Dashboard

### Paso 1: Ve a Supabase Dashboard
1. Abre https://supabase.com/dashboard
2. Selecciona tu proyecto PQ Trader
3. Ve a **SQL Editor** (icono </> en el menú lateral)

### Paso 2: Ejecuta el Script SQL
1. Haz clic en **"+ New query"**
2. Copia y pega el siguiente código:

```sql
-- Migration 021: Limpiar notificaciones de prueba
DELETE FROM notifications;

-- Verificación
DO $$
DECLARE
    notification_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO notification_count FROM notifications;
    RAISE NOTICE 'Notificaciones restantes: %', notification_count;
    
    IF notification_count = 0 THEN
        RAISE NOTICE '✓ Todas las notificaciones han sido eliminadas exitosamente';
    ELSE
        RAISE WARNING '⚠ Aún existen % notificaciones en la tabla', notification_count;
    END IF;
END $$;
```

3. Haz clic en **"Run"** (▶️ RUN)

### Paso 3: Verifica el Resultado
Deberías ver en los logs:
```
Notificaciones restantes: 0
✓ Todas las notificaciones han sido eliminadas exitosamente
```

### Paso 4: Refresca el Dashboard
1. Ve a tu dashboard de admin en la aplicación
2. Refresca la página (F5 o Ctrl+R)
3. Las notificaciones deberían haber desaparecido
4. La campanita de notificaciones debería mostrar 0

## ¿Por qué aparecían esas notificaciones?

Esas notificaciones fueron creadas anteriormente por:
- Usuarios registrados en el pasado
- Pagos de prueba con Stripe
- Cursos publicados anteriormente

Son notificaciones legítimas pero antiguas que querías eliminar.

## A partir de ahora

Después de ejecutar esta migración:
- ✅ Solo se crearán notificaciones de eventos reales nuevos
- ✅ Registros de usuarios nuevos → Notificación
- ✅ Pagos con Stripe exitosos → Notificación
- ✅ Nuevas inscripciones → Notificación
- ✅ Mensajes de contacto → Notificación

## Si no funciona

Si después de ejecutar el SQL siguen apareciendo notificaciones, puede ser que:
1. El navegador haya cacheado las notificaciones → **Presiona Ctrl+Shift+R (hard refresh)**
2. El backend esté cacheando la respuesta → **Reinicia el backend**

## Comando alternativo rápido (Si tienes acceso a la terminal de Supabase)

```bash
psql -h your-supabase-host -U postgres -d postgres -c "DELETE FROM notifications;"
```

---

**RECUERDA**: Esta migración es **segura** - solo elimina datos de la tabla notifications, no afecta a usuarios, cursos, pagos o cualquier otro dato importante.
