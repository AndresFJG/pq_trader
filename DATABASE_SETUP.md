# 🗄️ Configuración de Base de Datos en Supabase

## ✅ Archivos SQL Actualizados y Verificados

Los siguientes archivos SQL están **listos para ejecutar** en Supabase. Han sido revisados y contienen todas las columnas necesarias para el funcionamiento completo de la aplicación.

---

## 📋 Orden de Ejecución

### **1. MASTER_MIGRATIONS.sql** (Primero - Estructura completa)

**Ubicación:** `backend/supabase_migrations/MASTER_MIGRATIONS.sql`

**Qué hace:**
- ✅ Crea todos los ENUMs (tipos)
- ✅ Crea todas las tablas (users, courses, enrollments, lessons, mentorships, transactions, etc.)
- ✅ Crea todos los índices para performance
- ✅ Incluye todas las columnas necesarias:
  - `transactions`: payment_intent_id, paid_at, paypal_order_id, paypal_capture_id, subscription_id
  - `courses`: long_description, duration_hours, thumbnail, video_url, discount_price, rating
  - `enrollments`: completed_lessons, total_lessons, last_accessed_at
  - `lessons`: duration_minutes (además de duration)

**Ejecutar:**
1. Ve a Supabase Dashboard → SQL Editor
2. New query
3. Copia TODO el contenido de `MASTER_MIGRATIONS.sql`
4. Click "Run" (▶️)
5. Espera ~15 segundos

---

### **2. 010_enable_rls_policies_fixed.sql** (Segundo - Seguridad)

**Ubicación:** `backend/supabase_migrations/010_enable_rls_policies_fixed.sql`

**Qué hace:**
- ✅ Habilita Row Level Security (RLS) en todas las tablas
- ✅ Crea políticas de acceso seguras:
  - Usuarios pueden ver/editar solo sus datos
  - Admins tienen acceso completo
  - Cursos publicados son públicos
  - Transactions solo visibles para el owner

**Ejecutar:**
1. Nueva query en SQL Editor
2. Copia TODO el contenido de `010_enable_rls_policies_fixed.sql`
3. Click "Run" (▶️)
4. Espera ~10 segundos

---

## ✅ Verificación Post-Instalación

### **1. Verificar tablas creadas:**

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Deberías ver:**
- ✓ courses
- ✓ enrollments
- ✓ lessons
- ✓ mentorship_bookings
- ✓ mentorship_sessions
- ✓ mentorships
- ✓ portfolios
- ✓ transactions
- ✓ users

---

### **2. Verificar columnas críticas en transactions:**

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'transactions' 
AND table_schema = 'public'
ORDER BY ordinal_position;
```

**Debe incluir:**
- ✓ payment_intent_id (character varying)
- ✓ paid_at (timestamp)
- ✓ paypal_order_id (character varying)
- ✓ product_id (integer)
- ✓ product_name (character varying)
- ✓ product_type (character varying)
- ✓ metadata (jsonb)

---

### **3. Verificar columnas en courses:**

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'courses' 
AND table_schema = 'public'
ORDER BY ordinal_position;
```

**Debe incluir:**
- ✓ long_description (text)
- ✓ duration_hours (integer)
- ✓ thumbnail (character varying)
- ✓ video_url (text)
- ✓ discount_price (numeric)
- ✓ rating (numeric)

---

### **4. Verificar RLS habilitado:**

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Todas las tablas deben tener `rowsecurity = true`**

---

## 🔐 Obtener Credenciales para Railway

Después de ejecutar los SQL, necesitas copiar estas credenciales:

### **1. API Keys**
```
Supabase Dashboard → Settings → API

Copia:
- Project URL: https://[project-id].supabase.co
- anon/public key: eyJhbGc...
- service_role key: eyJhbGc... (⚠️ SECRET!)
```

### **2. Database URL**
```
Supabase Dashboard → Settings → Database → Connection string

Formato:
postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres?sslmode=require
```

---

## 📝 Notas Importantes

### ✅ Columnas Agregadas vs Schema Original

Las siguientes columnas fueron agregadas porque el código las usa:

**Transactions:**
- `payment_intent_id` - Usado por Stripe webhooks
- `paid_at` - Timestamp de pago confirmado
- `paypal_order_id`, `paypal_capture_id` - PayPal integration
- `subscription_id` - Para suscripciones recurrentes

**Courses:**
- `long_description` - Descripción detallada
- `duration_hours` - Duración total del curso
- `thumbnail`, `video_url` - Media
- `discount_price` - Precio con descuento
- `rating` - Calificación promedio

**Enrollments:**
- `completed_lessons`, `total_lessons` - Progress tracking
- `last_accessed_at` - Última actividad

**Lessons:**
- `duration_minutes` - Duración de la lección

---

## ⚠️ Si algo falla

### Error: "table already exists"
**Solución:** Está bien, significa que ya tienes la tabla. Continúa con el siguiente script.

### Error: "column already exists"
**Solución:** Está bien, la columna ya estaba. Continúa.

### Error: "relation does not exist"
**Solución:** Ejecuta MASTER_MIGRATIONS.sql primero.

### Necesitas empezar de cero:
1. Descomenta las líneas 18-37 de `MASTER_MIGRATIONS.sql` (las que dicen `DROP TABLE...`)
2. Ejecuta completo
3. Luego ejecuta `010_enable_rls_policies_fixed.sql`

---

## 🚀 Siguiente Paso

Una vez ejecutados ambos archivos SQL:

1. ✅ Copia las credenciales de Supabase
2. ✅ Ve a Railway → Variables
3. ✅ Agrega las variables de entorno (ver PRODUCTION_READY.md)
4. ✅ Deploy backend en Railway
5. ✅ Deploy frontend en Vercel

---

**Preparado:** 2026-02-01  
**Estado:** ✅ SQL Scripts verificados y listos
