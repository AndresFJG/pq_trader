# 🚀 Configuración de Supabase para PQ Trader

## 📋 Paso 1: Crear Proyecto en Supabase

1. **Ir a:** https://supabase.com
2. **Sign up / Log in** con GitHub
3. **New Project:**
   - Name: `pq-trader`
   - Database Password: (guardar en lugar seguro)
   - Region: Closest to your users (ej: South America)
   - Pricing Plan: Free (o Pro según necesidades)
4. **Create New Project** (tarda ~2 minutos)

## 🔐 Paso 2: Obtener Credenciales

Una vez creado el proyecto, ve a **Settings → Database**:

```
Host: db.[PROJECT-REF].supabase.co
Database name: postgres
Port: 5432
User: postgres
Password: [tu-password]
```

Copia la **Connection string** (URI mode):
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

También ve a **Settings → API** y copia:
- **Project URL:** `https://[PROJECT-REF].supabase.co`
- **anon public key:** (para frontend)
- **service_role key:** (para backend - mantener secreto)

## ⚙️ Paso 3: Configurar Variables de Entorno

Actualiza `backend/.env`:

```env
# Database - Supabase (PostgreSQL)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
DB_DIALECT=postgres
DB_SSL=true

# Supabase Configuration
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 Paso 4: Importar Schema

### Opción A: SQL Editor (Recomendado)

1. En Supabase, ve a **SQL Editor**
2. **New Query**
3. Copia todo el contenido de `backend/database/schema-supabase.sql`
4. **Run** (abajo derecha)
5. Verifica en **Table Editor** que se crearon las 8 tablas

### Opción B: Terminal

```bash
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" < backend/database/schema-supabase.sql
```

## ✅ Paso 5: Verificar Conexión

```bash
cd backend
npm run dev
```

Deberías ver:
```
✅ Database Ready
🚀 Server running on port 4000
🔗 Database: PostgreSQL (Supabase)
```

## 🧪 Paso 6: Test de Autenticación

### Login con usuario admin:

```bash
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "admin@pqtrader.com",
  "password": "Admin123"
}
```

Deberías recibir:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "Admin PQ Trader",
    "email": "admin@pqtrader.com",
    "role": "admin"
  }
}
```

## 🔍 Explorar Base de Datos

### Supabase Table Editor
- Ve a **Table Editor** en el panel de Supabase
- Verás todas tus tablas: users, courses, lessons, etc.
- Puedes editar datos directamente

### Supabase SQL Editor
```sql
-- Ver todos los usuarios
SELECT * FROM users;

-- Ver cursos publicados
SELECT * FROM courses WHERE is_published = true;

-- Ver inscripciones activas
SELECT u.name, c.title, e.progress 
FROM enrollments e
JOIN users u ON e.user_id = u.id
JOIN courses c ON e.course_id = c.id
WHERE e.status = 'active';
```

## 🎨 Ventajas de Supabase

✅ **Dashboard visual** - Explora tablas, ejecuta queries
✅ **Authentication integrada** - Opcional (o usar JWT propio)
✅ **Storage** - Para archivos, videos, imágenes
✅ **Realtime** - WebSocket automático
✅ **Edge Functions** - Serverless functions
✅ **Backups automáticos** - En plan Pro
✅ **PostgreSQL completo** - Sin limitaciones
✅ **API REST/GraphQL** - Generada automáticamente

## 📦 Estructura de Tablas

```
users (8 tablas en total)
├── courses
│   └── lessons
├── enrollments
├── mentorships
├── transactions
├── security_logs
└── token_blacklist
```

## 🔐 Row Level Security (RLS)

Supabase recomienda activar RLS. Para desarrollo, puedes dejarlo desactivado.

Para producción, crea políticas:

```sql
-- Ejemplo: Los usuarios solo pueden ver sus propios enrollments
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enrollments"
ON enrollments FOR SELECT
USING (auth.uid() = user_id);
```

## 🚀 Migración desde MySQL

Si ya tienes datos en MySQL:

```bash
# Exportar desde MySQL
mysqldump -u qaph447 -p qaph447 > mysql_backup.sql

# Convertir a PostgreSQL (manual o con herramientas)
# Importar a Supabase via SQL Editor
```

## 📊 Limits del Plan Free

- **Database:** 500 MB
- **Storage:** 1 GB
- **Bandwidth:** 2 GB
- **Monthly Active Users:** Unlimited
- **API Requests:** Unlimited

Suficiente para desarrollo y primeros usuarios.

## 🔧 Troubleshooting

### Error: "Connection refused"

Verifica:
- DATABASE_URL correcto
- DB_SSL=true en .env
- Firewall no bloquea puerto 5432

### Error: "Password authentication failed"

- Revisa la contraseña en DATABASE_URL
- Resetea password desde Supabase Dashboard → Database Settings

### Error: "relation does not exist"

- Ejecuta el schema SQL primero
- Verifica en Table Editor que las tablas existan

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Sequelize + PostgreSQL](https://sequelize.org/docs/v6/getting-started/#connecting-to-a-database)

---

**Siguiente paso:** Convertir modelos de Mongoose a Sequelize con dialecto PostgreSQL
