# 🎯 Guía Rápida: Limpiar Notificaciones de Prueba

## Problema
Las notificaciones que ves en el dashboard de admin son datos reales almacenados en Supabase. Necesitas eliminarlas.

## ✅ Solución Más Rápida (3 pasos)

### 1. Inicia el Backend
```bash
cd backend
npm run dev
```

### 2. Obtén tu Token de Admin
1. Abre tu aplicación en el navegador
2. Inicia sesión como admin
3. Presiona **F12** (DevTools)
4. Ve a **Application** > **Local Storage** > selecciona tu dominio
5. **Copia el valor de `token`**

### 3. Ejecuta el Script

**En Windows (PowerShell):**
```powershell
.\limpiar-notificaciones.ps1
```

**O ejecuta directamente:**
```powershell
# Reemplaza TU_TOKEN_AQUI con tu token real
$token = "TU_TOKEN_AQUI"
Invoke-RestMethod -Uri "http://localhost:5000/api/notifications/clear-all" -Method DELETE -Headers @{"Authorization"="Bearer $token"}
```

**En Windows (CMD):**
```cmd
limpiar-notificaciones.bat
```

### 4. Refresca el Dashboard
Presiona **F5** en tu dashboard de admin y las notificaciones habrán desaparecido ✨

---

## 📝 Archivos Incluidos

1. **limpiar-notificaciones.ps1** - Script PowerShell interactivo
2. **limpiar-notificaciones.bat** - Script CMD para Windows
3. **EJECUTAR_MIGRACION_021.md** - Instrucciones detalladas con todas las opciones

---

## 🔧 Cambios Implementados en el Backend

He añadido un nuevo endpoint en tu API:

**Endpoint:**
```
DELETE /api/notifications/clear-all
```

**Headers:**
```
Authorization: Bearer {tu_token_admin}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "3 notificaciones eliminadas exitosamente"
}
```

**Código añadido:**
- `backend/src/controllers/notification.controller.ts` → Función `clearAllNotifications()`
- `backend/src/services/notification.service.ts` → Método `clearAll()`
- `backend/src/routes/notification.routes.ts` → Ruta `DELETE /clear-all`

---

## ⚠️ Importante

Este endpoint:
- ✅ Solo accesible para administradores
- ✅ Elimina TODAS las notificaciones existentes
- ✅ No afecta otros datos (usuarios, cursos, pagos, etc.)
- ✅ A partir de ahora, solo se crearán notificaciones de eventos reales

---

## 🐛 Solución de Problemas

### El script dice "Error: Backend no responde"
→ Asegúrate de que el backend esté corriendo:
```bash
cd backend
npm run dev
```

### El script dice "Error 401: No autorizado"
→ Tu token expiró. Obtén uno nuevo:
1. Vuelve a iniciar sesión
2. Abre DevTools (F12)
3. Copia el nuevo token

### El script dice "Error 403: Forbidden"
→ Tu usuario no es admin. Asegúrate de estar logueado como administrador.

### Las notificaciones siguen apareciendo después de ejecutar el script
→ Haz un hard refresh:
- Windows: **Ctrl + Shift + R** o **Ctrl + F5**
- Mac: **Cmd + Shift + R**

---

## 📞 Si nada funciona

Ejecuta el SQL directamente en Supabase:

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Ejecuta:
```sql
DELETE FROM notifications;
```

---

**Fecha**: 18 de febrero de 2026  
**Estado**: ✅ Listo para usar
