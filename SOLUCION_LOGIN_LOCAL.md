# Guía: Solucionar Problemas de Login en Local

## 🔍 Problema Reportado

No puedes ingresar con usuarios que están en la base de datos en el entorno local.

---

## 🛠️ Diagnóstico Rápido

### Ejecuta el Script de Diagnóstico

```powershell
.\diagnosticar-login.ps1
```

Este script te dirá:
- ✅ Si el backend está corriendo
- ✅ Si el login funciona directamente a la API
- ✅ Si hay problemas de configuración
- ✅ Qué error específico estás recibiendo

---

## 🚨 Causas Comunes

### 1. **Backend NO está corriendo**

**Síntoma:** Error de conexión, no se puede conectar a localhost:4000

**Solución:**
```powershell
cd backend
npm run dev
```

Verifica que veas:
```
✅ Database Ready
🚀 Server running on port 4000
```

---

### 2. **Configuración de CORS incorrecta**

**Síntoma:** Error CORS en DevTools Console: "Origin http://localhost:3000 has been blocked by CORS policy"

**Solución:**

Verifica `backend/.env` tenga:
```env
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

Si no existen, agrégalas y reinicia el backend:
```powershell
# Detener backend (Ctrl+C)
# Iniciar de nuevo
cd backend
npm run dev
```

---

### 3. **Configuración de API URL incorrecta en frontend**

**Síntoma:** 404 Not Found o peticiones a URL incorrecta

**Solución:**

Verifica `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**IMPORTANTE:** Debe incluir `/api` al final.

Si lo modificaste, reinicia el frontend:
```powershell
cd frontend
npm run dev
```

---

### 4. **Usuario no existe en Supabase**

**Síntoma:** Error 401 "Credenciales inválidas"

**Solución:**

1. Abre Supabase Dashboard: https://supabase.com/dashboard
2. Ve a tu proyecto
3. Table Editor → `users`
4. Busca tu email
5. Si no existe, créalo:

```sql
-- En Supabase SQL Editor
INSERT INTO users (name, email, password, role, subscription_tier, subscription_status)
VALUES (
  'Test User',
  'test@example.com',
  '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', -- Hash bcrypt
  'user',
  'free',
  'none'
);
```

**Para generar hash de contraseña:**

Ejecuta en backend:
```bash
cd backend
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('tu_password', 10))"
```

O usa el usuario admin por defecto:
- Email: `admin@pqtrader.com`
- Password: `Admin123!`

---

### 5. **Contraseña incorrecta**

**Síntoma:** Error 401 "Credenciales inválidas" pero el usuario existe

**Solución:**

1. Verifica que estés usando la contraseña correcta
2. Si no recuerdas la contraseña, resetéala en Supabase:

```sql
-- En Supabase SQL Editor
UPDATE users
SET password = '$2a$10$NUEVO_HASH_AQUI'
WHERE email = 'tu@email.com';
```

---

### 6. **Error de cookies HttpOnly**

**Síntoma:** Login exitoso pero no se guarda la sesión, se desloguea automáticamente

**Verificación:**

Abre DevTools (F12) → Application → Cookies → http://localhost:3000

Deberías ver:
- `accessToken`
- `refreshToken`

**Solución si no aparecen:**

Verifica en `backend/src/controllers/auth.controller.ts` que use:
```typescript
res.cookie('accessToken', token, {
  httpOnly: true,
  secure: false, // false en desarrollo
  sameSite: 'lax', // lax en desarrollo
  maxAge: 15 * 60 * 1000,
});
```

---

### 7. **Cache del navegador**

**Síntoma:** Errores inconsistentes, a veces funciona y a veces no

**Solución:**

Limpia cache del navegador:
1. `Ctrl + Shift + Delete`
2. Marca "Cookies y datos de sitios" y "Archivos en caché"
3. Click "Borrar datos"
4. Cierra todas las pestañas de localhost:3000
5. Abre de nuevo

---

## 🔬 Diagnóstico Manual (DevTools)

### Paso 1: Verifica la petición de login

1. Abre http://localhost:3000/login
2. Abre DevTools (F12)
3. Ve a la pestaña **Network**
4. Intenta hacer login
5. Busca la petición `POST /api/auth/login`

### Paso 2: Analiza la respuesta

**Si Status 200 (exitoso):**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "...",
    "refreshToken": "..."
  }
}
```
✅ Login funciona, el problema es en el frontend

**Si Status 401 (no autorizado):**
```json
{
  "success": false,
  "error": "Credenciales inválidas"
}
```
❌ Usuario o contraseña incorrectos

**Si Status 500 (error del servidor):**
```json
{
  "success": false,
  "error": "..." 
}
```
❌ Error en el backend, revisa logs

**Si CORS Error:**
```
Access to fetch at 'http://localhost:4000/api/auth/login'
from origin 'http://localhost:3000' has been blocked by CORS policy
```
❌ Problema de configuración CORS

---

## 📝 Checklist de Verificación

- [ ] Backend corriendo en puerto 4000
- [ ] Frontend corriendo en puerto 3000
- [ ] `backend/.env` tiene `CORS_ORIGIN=http://localhost:3000`
- [ ] `frontend/.env.local` tiene `NEXT_PUBLIC_API_URL=http://localhost:4000/api`
- [ ] Usuario existe en tabla `users` de Supabase
- [ ] Contraseña está hasheada con bcrypt
- [ ] No hay errores CORS en DevTools Console
- [ ] Cookies se están estableciendo correctamente
- [ ] Cache del navegador limpiado

---

## 🔑 Crear Usuario de Prueba

### Opción 1: Desde el frontend

1. Ve a http://localhost:3000/register
2. Completa el formulario
3. Automáticamente se crea en Supabase

### Opción 2: Script SQL en Supabase

```sql
-- Generar hash de "Password123!" con bcrypt
-- Hash: $2a$10$8Z1JX8YrKqQ3nH4v.fI4iu5r8e0c8YK5xL6p5R5a5W5u5V5g5h5i5

INSERT INTO users (name, email, password, role, subscription_tier, subscription_status, is_email_verified)
VALUES 
('Usuario Prueba', 'prueba@test.com', '$2a$10$8Z1JX8YrKqQ3nH4v.fI4iu5r8e0c8YK5xL6p5R5a5W5u5V5g5h5i5', 'user', 'free', 'none', false)
RETURNING *;
```

Credenciales:
- Email: `prueba@test.com`
- Password: `Password123!`

---

## 🆘 Si Nada Funciona

1. **Ejecuta el script de diagnóstico:**
   ```powershell
   .\diagnosticar-login.ps1
   ```

2. **Captura logs del backend:**
   - Abre la terminal donde corre el backend
   - Copia el error completo

3. **Captura error del frontend:**
   - Abre DevTools (F12) → Console
   - Copia el error completo

4. **Verifica Supabase:**
   - Abre Supabase Dashboard
   - Ve a Authentication → Users
   - Verifica que el usuario exista

---

**Fecha:** 18 de febrero de 2026  
**Estado:** Guía de troubleshooting completa
