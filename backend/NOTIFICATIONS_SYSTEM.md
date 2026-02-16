# Sistema de Notificaciones - PQ Trader

## 📋 Descripción

Sistema completo de notificaciones en tiempo real que registra eventos importantes del sistema:
- ✅ Nuevos usuarios registrados
- ✅ Pagos procesados exitosamente
- ✅ Nuevos cursos publicados
- ✅ Nuevas inscripciones a cursos
- ✅ Mensajes de contacto recibidos
- ✅ Reservas de mentorías

## 🚀 Instalación

### 1. Ejecutar migración SQL en Supabase

```bash
# Opción A: Desde Supabase Dashboard
# 1. Ve a: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
# 2. Copia y pega el contenido de: backend/supabase_migrations/017_create_notifications.sql
# 3. Click en "Run"

# Opción B: Desde psql (si tienes acceso directo)
psql -h your-project.supabase.co -U postgres -d postgres -f backend/supabase_migrations/017_create_notifications.sql
```

### 2. Verificar tabla creada

```sql
-- En Supabase SQL Editor ejecuta:
SELECT * FROM public.notifications LIMIT 5;

-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'notifications';
```

### 3. Instalar dependencias (si no están)

Backend ya tiene todo instalado. En frontend:
```bash
cd frontend
npm install axios
```

## 📁 Estructura de archivos creados

### Backend
```
backend/
├── supabase_migrations/
│   └── 017_create_notifications.sql        # Migración SQL
├── src/
│   ├── services/
│   │   └── notification.service.ts         # Servicio de notificaciones
│   ├── controllers/
│   │   └── notification.controller.ts      # Controlador de API
│   └── routes/
│       └── notification.routes.ts          # Rutas de API
```

### Frontend
```
frontend/
└── src/
    ├── services/
    │   └── notification.service.ts         # Servicio cliente
    └── components/
        └── admin/
            └── AdminHeader.tsx             # Actualizado con notificaciones reales
```

## 🔗 Endpoints API

### Obtener todas las notificaciones
```http
GET /api/notifications?limit=50&offset=0
Authorization: Cookie (accessToken)
```

### Obtener notificaciones no leídas
```http
GET /api/notifications/unread
Authorization: Cookie (accessToken)
```

### Obtener conteo de no leídas
```http
GET /api/notifications/unread/count
Authorization: Cookie (accessToken)
```

### Marcar como leída
```http
PUT /api/notifications/:id/read
Authorization: Cookie (accessToken)
```

### Marcar todas como leídas
```http
PUT /api/notifications/read-all
Authorization: Cookie (accessToken)
```

### Eliminar notificación
```http
DELETE /api/notifications/:id
Authorization: Cookie (accessToken)
```

## 🎯 Eventos que generan notificaciones

### 1. Registro de usuario (`new_user`)
- **Trigger:** POST `/api/auth/register`
- **Controlador:** `auth.controller.ts`
- **Datos:** nombre, email, fecha registro

### 2. Pago procesado (`payment_processed`)
- **Trigger:** Webhook Stripe `checkout.session.completed`
- **Controlador:** `stripe.controller.ts`
- **Datos:** monto, moneda, producto comprado

### 3. Nuevo curso (`new_course`)
- **Trigger:** POST `/api/courses`
- **Controlador:** `course.controller.ts`
- **Datos:** título, precio, nivel del curso

### 4. Nueva inscripción (`new_enrollment`)
- **Trigger:** Pago completado + creación de enrollment
- **Controlador:** `stripe.controller.ts`
- **Datos:** nombre del curso, ID de enrollment

### 5. Mensaje de contacto (`contact_message`)
- **Trigger:** POST `/api/contact`
- **Controlador:** `contact.controller.ts`
- **Datos:** nombre, email, asunto, mensaje (primeros 200 chars)

## 💻 Uso en Frontend

```typescript
import { notificationService } from '@/services/notification.service';

// Obtener notificaciones no leídas
const response = await notificationService.getUnread();
console.log(response.data); // Array de notificaciones

// Obtener conteo
const count = await notificationService.getUnreadCount();
console.log(count); // Número

// Marcar como leída
await notificationService.markAsRead(notificationId);

// Formatear tiempo relativo
const timeAgo = notificationService.formatRelativeTime(notification.created_at);
// "Hace 5 minutos"

// Obtener ícono por tipo
const icon = notificationService.getIcon('payment_processed');
// "💰"
```

## 🔒 Seguridad (RLS Policies)

- ✅ Solo admins pueden **leer** notificaciones
- ✅ Solo admins pueden **actualizar** (marcar como leídas)
- ✅ Solo el backend (service role) puede **crear** notificaciones
- ✅ Verificación de rol admin en middleware de autenticación

## 🔄 Actualización automática

El componente `AdminHeader` recarga notificaciones:
- Al montar el componente
- Cada 30 segundos (polling)
- Al hacer click en una notificación

## 🧪 Testing

### Crear notificación de prueba (SQL)
```sql
INSERT INTO public.notifications (type, title, message, metadata)
VALUES (
  'new_user',
  'Usuario de prueba',
  'Este es un mensaje de prueba',
  '{"email": "test@example.com"}'::jsonb
);
```

### Testing desde Postman/Thunder

1. **Login como admin:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@pqtrader.com",
  "password": "tu_password"
}
```

2. **Obtener notificaciones:**
```http
GET /api/notifications/unread
Cookie: accessToken=<token_from_login>
```

## 📊 Tipos de notificación

| Tipo | Ícono | Descripción |
|------|-------|-------------|
| `new_user` | 👤 | Nuevo usuario registrado |
| `payment_processed` | 💰 | Pago procesado correctamente |
| `new_course` | 📚 | Nuevo curso publicado |
| `new_enrollment` | 🎓 | Nueva inscripción a curso |
| `contact_message` | ✉️ | Mensaje de contacto |
| `new_mentorship_booking` | 📅 | Reserva de mentoría |
| `course_updated` | 📝 | Curso actualizado |

## 🛠️ Mantenimiento

### Limpieza de notificaciones antiguas (opcional)

Puedes agregar un cron job para limpiar notificaciones antiguas:

```typescript
// En backend/src/index.ts
import { NotificationService } from './services/notification.service';

// Limpiar notificaciones viejas cada semana
setInterval(async () => {
  const deleted = await NotificationService.deleteOld(30); // 30 días
  logger.info(`Deleted ${deleted} old notifications`);
}, 7 * 24 * 60 * 60 * 1000); // 7 días
```

## 🐛 Troubleshooting

### "Table 'notifications' does not exist"
→ Ejecutar migración SQL `017_create_notifications.sql`

### "403 Forbidden al acceder a /api/notifications"
→ Verificar que el usuario tenga rol 'admin' en su metadata

### "Las notificaciones no se actualizan"
→ Verificar que el backend esté creando notificaciones en los eventos
→ Revisar logs del backend con `console.log`

### "RLS Policy error"
→ Verificar que el usuario autenticado sea admin:
```sql
SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = 'user_id';
```

## 📚 Recursos adicionales

- [Supabase RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/sql-createtrigger.html)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**Creado:** Febrero 2026  
**Versión:** 1.0.0  
**Autor:** PQ Trader Development Team
