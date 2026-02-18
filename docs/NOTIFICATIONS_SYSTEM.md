# Sistema de Notificaciones - PQ Trader

## Características Implementadas

### 1. ✅ Auto-marcado como Leídas
Las notificaciones se marcan automáticamente como leídas después de 2 segundos de tener el dropdown abierto.

**Cómo funciona:**
- Usuario hace click en el icono de notificaciones (🔔)
- El dropdown se abre mostrando las notificaciones
- Después de 2 segundos, se marcan todas como leídas
- El contador se actualiza a 0

### 2. 🧹 Botón "Marcar Todas como Leídas"
Botón visible en la parte inferior del dropdown de notificaciones.

**Ubicación:** 
- `/admin` → Header → Icono de notificaciones → Botón azul al final

**Función:**
- Marca todas las notificaciones como leídas instantáneamente
- Limpia el contador
- Cierra el dropdown

### 3. 🗑️ Limpieza Automática de Notificaciones Antiguas
Elimina notificaciones de más de 30 días automáticamente.

**Métodos de ejecución:**

#### a) Manual (desde terminal):
```bash
cd backend
npm run cleanup:notifications
```

#### b) Programado (automático - Windows):
```powershell
# Ejecutar EN LA RAÍZ del proyecto:
.\setup-auto-cleanup.ps1
```

Esto configura una tarea en Windows Task Scheduler que ejecuta la limpieza diariamente a medianoche.

#### c) API Endpoint (desde código/Postman):
```http
DELETE http://localhost:4000/api/notifications/old?days=30
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Parámetros:**
- `days` (opcional): Número de días de antigüedad. Default: 30

### 4. 📊 Endpoints de Notificaciones

```typescript
// Obtener todas las notificaciones
GET /api/notifications

// Obtener no leídas
GET /api/notifications/unread

// Obtener conteo de no leídas
GET /api/notifications/unread/count

// Marcar una como leída
PUT /api/notifications/:id/read

// Marcar todas como leídas
PUT /api/notifications/read-all

// Eliminar notificaciones antiguas (30+ días default)
DELETE /api/notifications/old?days=30

// Eliminar una notificación específica
DELETE /api/notifications/:id

// ⚠️ Eliminar TODAS (usar con precaución)
DELETE /api/notifications/clear-all
```

Todos los endpoints requieren:
- ✅ Autenticación (JWT token)
- ✅ Rol de administrador

## Tipos de Notificaciones

```typescript
type NotificationType = 
  | 'new_user'                  // Nuevo usuario registrado
  | 'payment_processed'         // Pago procesado con Stripe
  | 'new_course'                // Nuevo curso publicado
  | 'new_enrollment'            // Nueva inscripción a curso
  | 'contact_message'           // Mensaje de contacto
  | 'new_mentorship_booking'    // Nueva reserva de mentoría
  | 'course_updated';           // Curso actualizado
```

## Flujo de Notificaciones

### Creación
```typescript
// En cualquier controlador:
import { NotificationService } from '../services/notification.service';

await NotificationService.create({
  type: 'new_user',
  title: 'Nuevo usuario registrado',
  message: 'Juan Pérez se registró en la plataforma',
  user_id: user.id.toString(),
  metadata: {
    email: 'juan@example.com',
    registration_date: new Date().toISOString(),
  },
});
```

### Visualización (Frontend)
```typescript
// En AdminHeader.tsx
const { data } = await notificationService.getUnread();
// Muestra automáticamente en dropdown con contador
```

### Limpieza Automática
```
User Registration → Notification Created → Stored in DB
                                                     ↓
                                          [After 30 Days]
                                                     ↓
                                    Cron Job (Daily 00:00)
                                                     ↓
                                          Automatically Deleted
```

## Configuración de Limpieza Automática

### Opción 1: Task Scheduler (Windows) - Recomendado
```powershell
# En la raíz del proyecto:
.\setup-auto-cleanup.ps1
```

**Ventajas:**
- ✅ Se ejecuta automáticamente todos los días
- ✅ No requiere que el servidor esté corriendo
- ✅ Funciona en background

**Verificar configuración:**
1. Abrir Task Scheduler
2. Buscar: "PQ Trader - Cleanup Notifications"
3. Ver historial de ejecuciones

### Opción 2: Cron Job (Linux/macOS)
```bash
# Editar crontab
crontab -e

# Agregar línea (ejecutar diariamente a medianoche):
0 0 * * * cd /path/to/pq_trader/backend && npm run cleanup:notifications
```

### Opción 3: Heroku/Railway Scheduler
Si usas Railway o Heroku, configura un job scheduled:

**Railway:**
```json
// railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start",
    "cronJobs": [
      {
        "schedule": "0 0 * * *",
        "command": "npm run cleanup:notifications"
      }
    ]
  }
}
```

**Heroku:**
```bash
heroku addons:create scheduler:standard
heroku addons:open scheduler
# En la UI: agregar "npm run cleanup:notifications" con frecuencia diaria
```

## Testing

### Test Manual:
```bash
# 1. Crear notificaciones de prueba (más de 30 días)
# En Supabase Dashboard → SQL Editor:
UPDATE notifications 
SET created_at = NOW() - INTERVAL '35 days'
WHERE type = 'new_user';

# 2. Ejecutar limpieza
cd backend
npm run cleanup:notifications

# 3. Verificar resultado
# Debería mostrar: "✅ Se eliminaron X notificaciones antiguas"
```

### Test con días personalizados:
```bash
# Eliminar notificaciones de más de 7 días:
curl -X DELETE http://localhost:4000/api/notifications/old?days=7 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Monitoreo

### Ver logs de limpieza:
```bash
# Windows (Task Scheduler)
Get-ScheduledTaskInfo -TaskName "PQ Trader - Cleanup Notifications"

# Linux/macOS (cron logs)
grep "cleanup-notifications" /var/log/syslog
```

### Dashboard de administración:
- Total de notificaciones: `GET /api/notifications`
- No leídas: `GET /api/notifications/unread/count`

## Mejores Prácticas

1. **Mantener solo notificaciones recientes (30 días)**
   - Las notificaciones antiguas no aportan valor
   - Reducen el rendimiento de las queries
   - Ocupan espacio en la base de datos

2. **Configurar limpieza automática**
   - Ejecutar `setup-auto-cleanup.ps1` en producción
   - Verificar que la tarea esté activa mensualmente

3. **Monitoreo periódico**
   - Revisar cantidad de notificaciones semanalmente
   - Si hay más de 1000, considerar reducir días (15-20)

4. **Backup antes de limpiar manualmente**
   ```sql
   -- Supabase Dashboard → SQL Editor
   CREATE TABLE notifications_backup AS 
   SELECT * FROM notifications 
   WHERE created_at < NOW() - INTERVAL '30 days';
   ```

## Solución de Problemas

### ❌ "Error al limpiar notificaciones"
**Causa:** Permisos insuficientes en Supabase

**Solución:**
```sql
-- Verificar RLS policies en Supabase
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
```

### ❌ Tarea programada no ejecuta
**Causa:** PowerShell execution policy

**Solución:**
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ❌ Notificaciones no se marcan como leídas
**Causa:** Cache del navegador

**Solución:**
1. Ctrl + Shift + Delete (limpiar cache)
2. Recargar página (Ctrl + F5)

## Roadmap Futuro

- [ ] Enviar notificaciones por email
- [ ] Push notifications en navegador
- [ ] Filtros por tipo de notificación
- [ ] Búsqueda en notificaciones
- [ ] Exportar notificaciones a CSV
- [ ] Configuración personalizada de retención por tipo

---

**Última actualización:** 18 de febrero de 2026
**Mantenido por:** PQ Trader Team
