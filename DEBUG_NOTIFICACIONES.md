# 🔍 Script de Depuración - Notificaciones

## Problema
La tabla `notifications` está vacía en Supabase pero el dashboard muestra notificaciones.

## Pasos para Depurar

### 1. Reinicia el Backend
```bash
cd backend
# Ctrl+C para detenerlo si está corriendo
npm run dev
```

### 2. Limpia el Caché del Navegador

**Opción A - Hard Refresh:**
- Chrome/Edge: `Ctrl + Shift + R` o `Ctrl + F5`
- Firefox: `Ctrl + Shift + R`

**Opción B - Limpiar todo (Recomendado):**
1. Abre DevTools (`F12`)
2. Haz clic derecho en el botón de refrescar
3. Selecciona **"Vaciar caché y recargar de manera forzada"**

**Opción C - Limpiar caché completo:**
1. `Ctrl + Shift + Delete`
2. Selecciona "Caché" y "Cookies"
3. Borrar datos
4. Reinicia el navegador

### 3. Verifica en la Consola del Navegador

1. Abre el dashboard de admin
2. Abre DevTools (`F12`)
3. Ve a la pestaña **Console**
4. Busca estos mensajes:

```
[AdminHeader] Loading notifications...
[NotificationService] getUnread response: {success: true, data: [], count: 0}
[AdminHeader] Notifications response: {success: true, data: [], count: 0}
[AdminHeader] Setting notifications: []
```

Si ves `data: []` y `count: 0`, significa que el backend está devolviendo correctamente (sin notificaciones).

Si aún ves notificaciones en la lista, entonces hay un problema con el estado de React.

### 4. Verifica el Backend

En una terminal, ejecuta:

```powershell
# Verificar que la tabla esté vacía
$token = "TU_TOKEN_AQUI"
Invoke-RestMethod -Uri "http://localhost:5000/api/notifications/unread" -Headers @{"Authorization"="Bearer $token"}
```

Debería devolver:
```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

### 5. Si Todo Falla: Logout y Login

A veces el estado de autenticación guarda datos antiguos:

1. Cierra sesión en la aplicación
2. Limpia Local Storage:
   - DevTools (`F12`) > Application > Local Storage
   - Borra todo
3. Cierra el navegador completamente
4. Abre de nuevo e inicia sesión

---

## Cambios Implementados

He añadido debugging y cambios para forzar la actualización:

### Frontend:
1. ✅ Headers `no-cache` en las peticiones HTTP
2. ✅ Console.log para rastrear el flujo de datos
3. ✅ Reseteo explícito del estado a `[]` cuando no hay notificaciones

### Backend:
1. ✅ Headers `Cache-Control: no-store` en las respuestas
2. ✅ Console.log para rastrear peticiones
3. ✅ Respuesta explícita con `data: []` cuando está vacío

---

## Verificación Final

Después de los pasos anteriores, si abres el dashboard deberías ver:

- ✅ Campana de notificaciones **sin el punto rojo**
- ✅ Al hacer clic: "No hay notificaciones nuevas"
- ✅ En la consola: `count: 0` y `data: []`

---

## Si Persiste el Problema

Puede ser un problema con el Service Worker de Next.js:

```bash
cd frontend
# Borra .next y reinstala
rm -rf .next
npm run dev
```

O verifica que no haya datos hardcoded en otro componente:

```bash
# Busca notificaciones hardcoded en todo el proyecto
cd ..
grep -r "Nuevo usuario registrado" frontend/src/
grep -r "Pago procesado" frontend/src/
```

---

**Próximos Pasos:**
1. Reinicia backend
2. Hard refresh del navegador (Ctrl+Shift+R)
3. Verifica la consola del navegador
4. Si ves notificaciones, compárteme los logs de la consola
