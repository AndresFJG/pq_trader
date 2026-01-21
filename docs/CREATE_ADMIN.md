# 🔐 Crear Usuario Administrador

## Método 1: Usar el Script Automático (RECOMENDADO)

```bash
cd backend
npm run create:admin
```

Este script creará automáticamente:
- **Email**: `admin@pqtrader.com`
- **Password**: `Admin123!`
- **Rol**: admin
- **Tier**: VIP
- **Estado**: active

⚠️ **IMPORTANTE**: Cambia esta contraseña después del primer login.

---

## Método 2: Ejecutar SQL Directamente en Supabase

Si prefieres crear el admin manualmente desde Supabase:

### Paso 1: Generar Hash de Contraseña

Primero necesitas hashear la contraseña. Ejecuta esto en tu terminal:

```bash
cd backend
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('TuPasswordSeguro', 10, (err, hash) => console.log(hash));"
```

Copia el hash que te devuelve (empieza con `$2a$10$...`)

### Paso 2: Insertar en Supabase

Ve a Supabase → SQL Editor y ejecuta:

```sql
INSERT INTO users (name, email, password, role, subscription_tier, subscription_status)
VALUES (
  'Administrador',
  'admin@pqtrader.com',
  '$2a$10$...TuHashAqui',  -- Pegar el hash del paso 1
  'admin',
  'vip',
  'active'
);
```

---

## Método 3: Usar el Endpoint de Registro

Puedes registrar un usuario normal y luego cambiar su rol a admin:

### Paso 1: Registrar usuario normal

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@pqtrader.com",
    "password": "Admin123!"
  }'
```

### Paso 2: Actualizar rol a admin en Supabase

Ve a Supabase → Table Editor → users → Busca el usuario y edita:
- `role` = `admin`
- `subscription_tier` = `vip`
- `subscription_status` = `active`

---

## Verificar Usuario Admin

Después de crear el admin, verifica que existe:

```sql
SELECT id, name, email, role, subscription_tier, subscription_status 
FROM users 
WHERE email = 'admin@pqtrader.com';
```

Deberías ver:
- ✅ role: `admin`
- ✅ subscription_tier: `vip`
- ✅ subscription_status: `active`

---

## Probar Login

### En Postman/Thunder Client:

```http
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "admin@pqtrader.com",
  "password": "Admin123!"
}
```

Deberías recibir:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "...",
  "user": {
    "id": "...",
    "name": "Administrador",
    "email": "admin@pqtrader.com",
    "role": "admin"
  }
}
```

### En el Dashboard:

1. Ir a `http://localhost:3001/login` (cuando lo crees)
2. Email: `admin@pqtrader.com`
3. Password: `Admin123!`

---

## Troubleshooting

### Error: "El usuario ya existe"
Ya creaste el admin. Usa el método 2 para resetear la contraseña.

### Error: "relation users does not exist"
La tabla users no existe. Ejecuta primero las migraciones de la base de datos.

### Error: "Invalid credentials"
Verifica que el password esté correcto y que el hash se generó bien.

---

## Cambiar Contraseña del Admin

Si olvidaste la contraseña o quieres cambiarla:

1. Generar nuevo hash:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('NuevoPassword123!', 10, (err, hash) => console.log(hash));"
```

2. Actualizar en Supabase:
```sql
UPDATE users 
SET password = '$2a$10$...NuevoHashAqui'
WHERE email = 'admin@pqtrader.com';
```

---

## Credenciales por Defecto

**Después de ejecutar `npm run create:admin`:**

```
📧 Email:    admin@pqtrader.com
🔑 Password: Admin123!
```

⚠️ **Cambia esta contraseña en producción!**
