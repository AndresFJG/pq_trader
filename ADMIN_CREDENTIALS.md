# 🔐 Credenciales de Admin - PQ Trader

## ⚠️ INFORMACIÓN CONFIDENCIAL - NO COMPARTIR ⚠️

### Credenciales de Acceso

```
Email:    admin@pqtrader.com
Password: PqT#2026!Secure$Admin
```

### Características de la Contraseña

- ✅ 23 caracteres
- ✅ Mayúsculas y minúsculas
- ✅ Números
- ✅ Símbolos especiales (#, !, $)
- ✅ Hash bcrypt con 10 rounds

---

## 📋 Instrucciones de Uso

### 1. Primera Vez

Ejecuta el archivo SQL en Supabase:

```sql
-- En Supabase SQL Editor
-- Copia y pega: backend/supabase_migrations/012_create_secure_admin.sql
```

### 2. Login

1. Ve a tu aplicación: https://pqtraders.com/login
2. Email: `admin@pqtrader.com`
3. Password: `PqT#2026!Secure$Admin`

### 3. Después del Primer Login

**⚠️ IMPORTANTE:** Cambia la contraseña inmediatamente:

1. Ve a Perfil → Configuración
2. Cambiar Contraseña
3. Usa una contraseña única y guárdala en un gestor de contraseñas

---

## 🔄 Resetear Contraseña (Si es necesario)

Si olvidas la contraseña, ejecuta en Supabase SQL Editor:

```sql
-- Generar nueva contraseña
UPDATE users 
SET password = '$2b$10$NuevoHashAqui'
WHERE email = 'admin@pqtrader.com';
```

Para generar un nuevo hash, usa:

```bash
cd backend
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('TuNuevaPassword', 10, (err, hash) => console.log(hash));"
```

---

## 📱 Acceso de Emergencia

Si pierdes acceso, puedes crear un nuevo admin desde Supabase SQL Editor:

```sql
INSERT INTO users (name, email, password, role) VALUES (
  'Emergency Admin',
  'emergency@pqtrader.com',
  '$2b$10$NewHashHere',
  'admin'
);
```

---

**Creado:** 2026-02-01  
**Última Actualización:** 2026-02-01  
**Estado:** ✅ Activo

⚠️ **ELIMINA ESTE ARCHIVO DESPUÉS DE GUARDAR LAS CREDENCIALES EN UN LUGAR SEGURO**
