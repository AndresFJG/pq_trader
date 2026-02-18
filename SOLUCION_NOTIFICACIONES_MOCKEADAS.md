# Solución: Notificaciones Mockeadas/Irreales

## 🔍 Problema Identificado

El botón de notificaciones mostraba datos mockeados debido a **URLs duplicadas**.

### Causa Raíz

En `frontend/src/services/notification.service.ts`:

```typescript
const API_URL = 'http://localhost:4000/api';

// ❌ INCORRECTO (duplicaba /api)
axios.get(`${API_URL}/api/notifications/unread`)
// Resultado: http://localhost:4000/api/api/notifications/unread
```

Esto causaba que las peticiones fueran a endpoints incorrectos, posiblemente sirviendo datos antiguos o cache.

---

## ✅ Solución Aplicada

### 1. URLs Corregidas en `notification.service.ts`

Se eliminó el `/api` duplicado en todas las URLs:

```typescript
// ✅ CORRECTO
axios.get(`${API_URL}/notifications/unread`)
// Resultado: http://localhost:4000/api/notifications/unread
```

**Cambios realizados en:**
- `getAll()` → `/notifications`
- `getUnread()` → `/notifications/unread`
- `getUnreadCount()` → `/notifications/unread/count`
- `markAsRead()` → `/notifications/${id}/read`
- `markAllAsRead()` → `/notifications/read-all`
- `delete()` → `/notifications/${id}`

### 2. Accesibilidad Mejorada

**AdminHeader.tsx:**
- ✅ Botón de buscar con `aria-label="Buscar en el panel de administración"`
- ✅ Botón de notificaciones con `aria-label` dinámico:
  - Sin notificaciones: `"Notificaciones"`
  - Con notificaciones: `"Notificaciones: X sin leer"`

### 3. Estructura HTML Corregida

**admin/page.tsx:**
- ✅ Agregado `<h2>Métricas Generales</h2>` antes de las tarjetas de estadísticas
- ✅ Agregado `<h2>Actividad Reciente</h2>` antes de la sección de usuarios/transacciones
- ✅ Jerarquía correcta: `h1` (Dashboard) → `h2` (Secciones) → `h3` (Tarjetas)

---

## 🚀 Pasos para Aplicar los Cambios

### Opción A: Script Automatizado

```powershell
.\reiniciar-frontend.ps1
```

Este script:
1. Limpia cache de Next.js (`.next/`)
2. Reinicia el servidor de desarrollo
3. Te guía para limpiar cache del navegador

### Opción B: Manual

```powershell
# 1. Detener el frontend (Ctrl+C si está corriendo)

# 2. Limpiar cache de Next.js
cd frontend
Remove-Item -Recurse -Force .next

# 3. Iniciar de nuevo
npm run dev
```

### Limpiar Cache del Navegador

**Opción 1 - Hard Refresh:**
1. Abre DevTools (F12)
2. Click derecho en el botón Recargar
3. Selecciona **"Vaciar caché y recargar de forma forzada"**

**Opción 2 - Eliminar cache manualmente:**
1. Presiona `Ctrl + Shift + Delete`
2. Selecciona:
   - ✅ Imágenes y archivos en caché
   - ✅ Intervalo de tiempo: "Última hora"
3. Click en **"Borrar datos"**
4. Recarga la página (F5)

---

## 🧪 Verificar que Funcione

### 1. Verificar Backend

```powershell
.\verificar-notificaciones.ps1
```

Debería mostrar:
```
[OK] Backend corriendo en puerto 4000
[OK] Token válido
[OK] Total de notificaciones sin leer: 0
```

### 2. Verificar en el Navegador

1. Abre el dashboard de admin: `http://localhost:3000/admin`
2. Abre DevTools Console (F12 → Console)
3. Busca el botón de notificaciones (campana 🔔)
4. Deberías ver logs así:

```
[AdminHeader] Loading notifications...
[NotificationService] getUnread response: { success: true, data: [], count: 0 }
[AdminHeader] Setting notifications: []
```

5. **El botón NO debe tener punto rojo** (sin notificaciones sin leer)
6. Al hacer click, debe decir: **"No hay notificaciones nuevas"**

---

## 🔄 Testing: Crear Notificación Real

Para verificar que el sistema funcione con datos reales:

### 1. Crear un usuario de prueba

```powershell
# En el frontend
# Ir a: http://localhost:3000/auth/register
# Registrar un usuario de prueba
```

Esto debería crear una notificación real de tipo `new_user`.

### 2. Verificar la notificación

1. Recarga el dashboard de admin
2. El botón de notificaciones DEBE mostrar punto rojo
3. Al hacer click, debe mostrar:
   ```
   👤 Nuevo Usuario Registrado
   usuario@test.com se registró en la plataforma
   Hace unos segundos
   ```

---

## 📊 Logs Esperados (Consola)

### Sin notificaciones (correcto ✅):

```
[AdminHeader] Loading notifications...
[NotificationService] getUnread response: {
  success: true,
  data: [],
  count: 0
}
[NotificationService] Notifications count: 0
[AdminHeader] Setting notifications: []
```

### Con notificaciones (correcto ✅):

```
[AdminHeader] Loading notifications...
[NotificationService] getUnread response: {
  success: true,
  data: [
    {
      id: "uuid-123",
      type: "new_user",
      title: "Nuevo Usuario Registrado",
      message: "usuario@test.com se registró...",
      is_read: false,
      created_at: "2026-02-18T..."
    }
  ],
  count: 1
}
[NotificationService] Notifications count: 1
[AdminHeader] Setting notifications: [...]
```

---

## 🛠️ Solución de Problemas

### Problema: Siguen apareciendo notificaciones mockeadas

**Solución:**
1. Verificar que el frontend se haya reiniciado después de los cambios
2. Limpiar cache del navegador (Ctrl + Shift + Delete)
3. Verificar la URL en DevTools Network:
   - Debe ser: `http://localhost:4000/api/notifications/unread`
   - NO debe ser: `http://localhost:4000/api/api/notifications/unread`

### Problema: Error 404 en /api/notifications

**Solución:**
1. Verificar que el backend esté corriendo en puerto 4000:
   ```powershell
   cd backend
   npm run dev
   ```

2. Verificar `.env.local` en frontend:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```

### Problema: Error de autenticación

**Solución:**
1. Verificar que estés logueado como admin
2. El token debe estar en localStorage
3. Revisar DevTools → Application → Local Storage → token

---

## 📝 Resumen de Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `frontend/src/services/notification.service.ts` | URLs corregidas (eliminado `/api` duplicado) |
| `frontend/src/components/admin/AdminHeader.tsx` | Agregado `aria-label` a botones |
| `frontend/src/app/admin/page.tsx` | Agregados headings `<h2>` para jerarquía correcta |
| `reiniciar-frontend.ps1` | Script nuevo para reiniciar frontend |
| `SOLUCION_NOTIFICACIONES_MOCKEADAS.md` | Esta documentación |

---

## ✅ Checklist Final

- [ ] Frontend reiniciado
- [ ] Cache del navegador limpiado
- [ ] Backend corriendo en puerto 4000
- [ ] DevTools Console muestra logs correctos
- [ ] Botón de notificaciones SIN punto rojo
- [ ] Al hacer click muestra "No hay notificaciones nuevas"
- [ ] URLs en Network son correctas (sin `/api/api/`)

---

**Fecha:** 18 de febrero de 2026  
**Estado:** ✅ Solucionado
